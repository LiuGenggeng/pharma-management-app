import { http, graphql, HttpResponse } from 'msw'
import { MOCK_LOCALSTORAGE_KEY } from "@/mocks/initMockData.ts";
import { storage } from "@/common/utils/storage.ts";
import type {AllocatedDrug, AuditLog, AuditLogFilter, Drug, Pharmacy, Prescription} from "@/apis/api.ts";
import {getQueryParams} from "@/common/utils/queryParams.ts";

export const handlers = [
  http.get('/drugs', () => {
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const today = new Date().toISOString().slice(0, 10);
    storageData.drugs.forEach(drug => {
      drug.isExpired = drug.expiry.localeCompare(today) === -1;
    })
    return HttpResponse.json(storageData.drugs || []);
  }),
  http.post('/drugs', async ({ request }) => {
    try {
      const body = await request.json();
      const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
      const drugs = storageData.drugs || [];
      // 3. 处理新药物数据（示例）
      const newDrug: Drug = {
        id: 'D' + Date.now().toString(),
        ...body
      };
      
      // 4. 添加到列表
      drugs.push(newDrug);
      storage.set(MOCK_LOCALSTORAGE_KEY, {
        ...storageData,
        drugs
      });
      return HttpResponse.json({
        success: true,
        data: newDrug
      });
    } catch (error) {
      console.error('解析请求体失败:', error);
      return HttpResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      );
    }
  }),
  http.get('/pharmacies', async({params}) => {
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const pharmacies = storageData.pharmacies || [];
    return HttpResponse.json(pharmacies);
  }),
  http.get('/pharmacies/:id', async({params}) => {
    const {id} = params;
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const pharmacies = storageData.pharmacies || [];
    const filterItem = pharmacies.filter((item: Pharmacy) => item.id === id);
    return HttpResponse.json(filterItem.length ? filterItem[0] : {});
  }),
  http.get('/prescriptions', async() => {
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const prescriptions = storageData.prescriptions || [];
    return HttpResponse.json(prescriptions);
  }),
  http.get('/prescriptions/:id', async({params}) => {
    const {id} = params;
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const prescriptions = storageData.prescriptions || [];
    const filterItem = prescriptions.filter((item: Prescription) => item.id === id);
    return HttpResponse.json(filterItem.length ? filterItem[0] : {});
  }),
  http.post('/prescriptions/:id/fulfill', async({params}) => {
    const {id} = params;
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    const prescriptions = storageData.prescriptions || [];
    const pharmacies = storageData.pharmacies || [];
    const drugList = storageData.drugs || [];
    const auditLogs = storageData.auditLogs || [];
    
    // 药方
    const filterPrescription: Prescription = prescriptions.filter((item: Prescription) => item.id === id)[0];
    const { drugs, pharmacyId, patientId } = filterPrescription;
    // 药房
    const filterPharmacy = pharmacies.filter((item: Pharmacy) => item.id === pharmacyId)[0];
    const today = new Date().toISOString().slice(0, 10);
    // 一次查找药房里的每个需要的药品，是否过期或者超出限额
    const errRes = [];
    let result = true;
    for (const drug of drugs) {
      const { drugId, dosage } = drug;
      // 获取药品过期时间
      const expireDay = drugList.filter((drug : Drug) => drug.id === drugId)[0].expiry;
      // 找到药房里对应的药品
      const pharmaciesDrugInfo: AllocatedDrug = filterPharmacy.allocatedDrugs.filter((drug: AllocatedDrug) => drug.drugId === drugId)[0];
      // 如果药品过期
      if (expireDay && expireDay.localeCompare(today) === -1) {
        result = false;
        errRes.push(`Drug ${pharmaciesDrugInfo.drugId} is expired`);
      }
      // 如果配药超出额度
      console.log(dosage, pharmaciesDrugInfo.limit);
      if (dosage > pharmaciesDrugInfo.limit) {
        result = false;
        errRes.push(`Drug ${pharmaciesDrugInfo.drugId} exceeds pharmacy allocation`);
      }
    }
    // 如果履行成功
    if (result) {
      // 写入成功日志
      auditLogs.unshift({
        "prescriptionId": id,
        "patientId": patientId,
        "pharmacyId": pharmacyId,
        "status": "SUCCESS",
        "drugsRequested": [...drugs],
        "drugsDispensed": [...drugs],
        "failureReasons": []
      })
      // 更新storage中的处方状态
      filterPrescription.status = 'SUCCESS';
      storage.set(MOCK_LOCALSTORAGE_KEY, {
        ...storageData,
        prescriptions: prescriptions,
        auditLogs: auditLogs
      })
      return HttpResponse.json({
        success: true
      });
    } else {
      // 写入失败日志
      auditLogs.unshift({
        "prescriptionId": id,
        "patientId": patientId,
        "pharmacyId": pharmacyId,
        "status": "FAILED",
        "drugsRequested": [...drugs],
        "drugsDispensed": [],
        "failureReasons": errRes
      })
      // 更新storage中的处方状态
      filterPrescription.status = 'FAILED';
      storage.set(MOCK_LOCALSTORAGE_KEY, {
        ...storageData,
        prescriptions: prescriptions,
        auditLogs: auditLogs
      })
      return HttpResponse.json({
        success: false,
        errors: errRes
      });
    }
  }),
  http.get('/audit-logs', async ({ request }) => {
    const params = getQueryParams(request.url);
    const storageData: any = storage.get(MOCK_LOCALSTORAGE_KEY, {});
    let { auditLogs } = storageData;
    const { patientId, pharmacyId, status } = params;
    console.log('params', patientId, pharmacyId, status);
    if (patientId) {
      auditLogs = auditLogs.filter((log: AuditLog) => log.patientId === patientId);
    }
    if (pharmacyId) {
      auditLogs = auditLogs.filter((log: AuditLog) => log.pharmacyId === pharmacyId);
    }
    if (status) {
      auditLogs = auditLogs.filter((log: AuditLog) => log.status === status);
    }
    return HttpResponse.json(auditLogs || []);
    
  }),
]
