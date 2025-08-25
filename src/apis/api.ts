import { post, get, type HttpRequest} from '@/common/request';

// 药品
export interface Drug {
  id?: string;
  name: string;
  // 制造商
  manufacturer: string;
  // 药品批次
  batch: string;
  // 限量（每个药房）
  limit: number;
  // 库存
  stock: number;
  // 有效期
  expiry: string;
  // 是否过期
  isExpired?: boolean;
}
// 药房
export interface Pharmacy {
  id: string;
  name: string;
  allocatedDrugs: AllocatedDrug[];
}
// 药房药物
export interface AllocatedDrug {
  drugId: string;
  drugName: string;
  limit: number;
}
// 处方
export interface Prescription {
  id: string;
  // 患者ID
  patientId: string;
  // 药房ID
  pharmacyId: string;
  // 配药信息
  drugs: PrescribedDrug[];
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}
// 处方配药
export interface PrescribedDrug {
  drugId: string;
  dosage: number;
}
// 审计日志
export interface AuditLog {
  // 处方id
  prescriptionId: string;
  // 患者ID
  patientId: string;
  // 药房ID
  pharmacyId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  // 申请的药品
  drugsRequested: PrescribedDrug[];
  // 已配发的药品
  drugsDispensed: PrescribedDrug[];
  // 失败原因
  failureReasons?: string[];
}

export interface AuditLogFilter {
  // 患者ID
  patientId?: string;
  // 药房ID
  pharmacyId?: string;
  // 状态
  status?: string;
}

// 药物相关API
export const drugApi = {
  // 获取所有药物列表
  getDrugs: (): Promise<Drug[]> => {
    const config: HttpRequest = {
      url: '/drugs',
    };
    return get(config);
  },
  
  // 添加新药物
  addDrug: (drugData: Drug): Promise<any> => {
    const config: HttpRequest = {
      url: '/drugs',
      data: drugData,
    };
    return post(config);
  }
};

// 药房相关API
export const pharmacyApi = {
  // 获取所有药房列表
  getPharmacies: (): Promise<Pharmacy[]> => {
    const config: HttpRequest = {
      url: '/pharmacies',
    };
    return get(config);
  },
  
  // 获取特定药房详情及分配的药品
  getPharmacy: (id: string): Promise<Pharmacy> => {
    const config: HttpRequest = {
      url: `/pharmacies/${id}`,
    };
    return get(config);
  }
};

// 处方相关API
export const prescriptionApi = {
  // 获取所有处方列表
  getPrescriptions: (): Promise<Prescription[]> => {
    const config: HttpRequest = {
      url: '/prescriptions',
    };
    return get(config);
  },
  
  // 获取特定处方详情
  getPrescription: (id: string): Promise<Prescription> => {
    const config: HttpRequest = {
      url: `/prescriptions/${id}`,
    };
    return get(config);
  },
  
  // 完成处方配药
  fulfillPrescription: (id: string): Promise<{ success: boolean; message: string, errors: any }> => {
    const config: HttpRequest = {
      url: `/prescriptions/${id}/fulfill`,
    };
    return post(config);
  }
};

// 审计日志相关API
export const auditLogApi = {
  // 获取审计日志列表（带过滤）
  getAuditLogs: (filters?: AuditLogFilter): Promise<AuditLog[]> => {
    const config: HttpRequest = {
      url: '/audit-logs',
      params: filters,
    };
    return get(config);
  }
};

// 默认导出所有API
export default {
  drugApi,
  pharmacyApi,
  prescriptionApi,
  auditLogApi
};