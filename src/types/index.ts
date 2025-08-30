export interface Drug {
  id: string
  name: string
  manufacturer: string
  batch: string
  expiry: string
  stock: number
  limit: number
}

export interface Pharmacy {
  id: string
  name: string
  allocatedDrugs: AllocatedDrug[]
}

export interface AllocatedDrug {
  drugId: string
  drugName: string
  limit: number
}

export interface Prescription {
  id: string
  patientId: string
  pharmacyId: string
  drugs: PrescriptionDrug[]
  status: 'PENDING' | 'FULFILLED' | 'FAILED'
}

export interface PrescriptionDrug {
  drugId: string
  dosage: number
}

export interface AuditLog {
  prescriptionId: string
  patientId: string
  pharmacyId: string
  status: 'SUCCESS' | 'FAILED'
  drugsRequested: PrescriptionDrug[]
  drugsDispensed: PrescriptionDrug[]
  failureReasons: string[]
  timestamp: string
}

export interface FulfillmentResponse {
  success: boolean
  errors?: string[]
}

export interface PrescriptionDetail extends Prescription {
  patientName?: string
  pharmacyName?: string
  createdAt: string
  updatedAt?: string
}

export interface PrescriptionDrugDetail extends PrescriptionDrug {
  drugName: string
  available: boolean
  reason?: string // 不可用的原因
}

export interface ValidationError {
  drugId: string
  drugName: string
  errors: string[]
}

export interface AuditLogDetail extends AuditLog {
  patientName?: string
  pharmacyName?: string
  id: string // 审计日志自己的ID
}

export interface AuditLogFilters {
  patientId?: string
  pharmacyId?: string
  status?: 'SUCCESS' | 'FAILED' | 'ALL'
  startDate?: string
  endDate?: string
}