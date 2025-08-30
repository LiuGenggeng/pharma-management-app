// 药品
export interface Drug {
  // 药品ID
  id: string
  // 药品名称
  name: string
  // 制造商
  manufacturer: string
  // 批次号
  batch: string
  // 有效期
  expiry: string
  // 库存数量
  stock: number
  // 最大限额
  limit: number
}
// 药店
export interface Pharmacy {
  // 药店ID
  id: string
  // 药店名称
  name: string
  // 分配的药品及限额
  allocatedDrugs: AllocatedDrug[]
}
// 药店分配的药品及限额
export interface AllocatedDrug {
  // 药品ID
  drugId: string
  // 药品名称
  drugName: string
  // 分配限额
  limit: number
}
// 处方
export interface Prescription {
  // 处方ID
  id: string
  // 患者ID
  patientId: string
  // 药房ID
  pharmacyId: string
  // 处方药品列表
  drugs: PrescriptionDrug[]
  // 处方状态
  status: 'PENDING' | 'FULFILLED' | 'FAILED'
}
// 处方中的药品及剂量
export interface PrescriptionDrug {
  // 药品ID
  drugId: string
  // 药品剂量
  dosage: number
}
// 审计日志
export interface AuditLog {
  // 审计日志ID
  prescriptionId: string
  // 患者ID
  patientId: string
  // 药房ID
  pharmacyId: string
  // 审计状态
  status: 'SUCCESS' | 'FAILED'
  // 请求的药品列表
  drugsRequested: PrescriptionDrug[]
  // 实际分发的药品列表
  drugsDispensed: PrescriptionDrug[]
  // 失败原因（如果有）
  failureReasons: string[]
  // 时间戳
  timestamp: string
}
// 履行处方的响应
export interface FulfillmentResponse {
  // 是否成功
  success: boolean
  // 失败原因（如果有）
  errors?: string[]
}
// 详细信息接口，包含关联名称等
export interface PrescriptionDetail extends Prescription {
  // 患者姓名
  patientName?: string
  // 药房名称
  pharmacyName?: string
  // 处方的创建和更新时间
  createdAt: string
  updatedAt?: string
}
// 处方药品的详细信息，包含可用性和原因
export interface PrescriptionDrugDetail extends PrescriptionDrug {
  // 药品名称
  drugName: string
  // 是否可用
  available: boolean
  // 不可用的原因
  reason?: string // 不可用的原因
}
// 验证错误信息
export interface ValidationError {
  // 药品ID
  drugId: string
  // 药品名称
  drugName: string
  // 错误列表
  errors: string[]
}
// 审计日志的详细信息，包含关联名称等
export interface AuditLogDetail extends AuditLog {
  // 患者姓名
  patientName?: string
  // 药房名称
  pharmacyName?: string
  // 审计日志自己的ID
  id: string
}
// 审计日志过滤器
export interface AuditLogFilters {
  // 患者ID
  patientId?: string
  // 药房ID
  pharmacyId?: string
  // 审计状态
  status?: 'SUCCESS' | 'FAILED' | 'ALL'
  // 开始日期
  startDate?: string
  // 结束日期
  endDate?: string
}