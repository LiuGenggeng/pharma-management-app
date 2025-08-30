import type {AuditLogDetail, Drug, Pharmacy, PrescriptionDetail} from '@/types'

export const mockDrugs: Drug[] = [
  {
    id: 'D001',
    name: 'Ibuprofen',
    manufacturer: 'ACME Pharma',
    batch: 'B202403',
    expiry: '2026-01-01',
    stock: 150,
    limit: 200
  },
  {
    id: 'D002',
    name: 'Paracetamol',
    manufacturer: 'Beta Pharma',
    batch: 'B202404',
    expiry: '2024-12-01', // 即将过期
    stock: 80,
    limit: 100
  },
  {
    id: 'D003',
    name: 'Aspirin',
    manufacturer: 'Gamma Pharma',
    batch: 'B202405',
    expiry: '2027-06-15',
    stock: 300,
    limit: 250
  }
]

// 模拟药房数据
export const mockPharmacies: Pharmacy[] = [
  {
    id: 'PH001',
    name: '成都主分店',
    allocatedDrugs: [
      { drugId: 'D001', drugName: 'Ibuprofen', limit: 200 },
      { drugId: 'D002', drugName: 'Paracetamol', limit: 100 },
      { drugId: 'D003', drugName: 'Aspirin', limit: 150 }
    ]
  },
  {
    id: 'PH002',
    name: '上海分店',
    allocatedDrugs: [
      { drugId: 'D001', drugName: 'Ibuprofen', limit: 150 },
      { drugId: 'D003', drugName: 'Aspirin', limit: 200 }
    ]
  },
  {
    id: 'PH003',
    name: '北京分店',
    allocatedDrugs: [
      { drugId: 'D001', drugName: 'Ibuprofen', limit: 180 },
      { drugId: 'D002', drugName: 'Paracetamol', limit: 120 },
      { drugId: 'D003', drugName: 'Aspirin', limit: 100 }
    ]
  },
  {
    id: 'PH004',
    name: '广州分店',
    allocatedDrugs: [
      { drugId: 'D002', drugName: 'Paracetamol', limit: 80 },
      { drugId: 'D003', drugName: 'Aspirin', limit: 250 }
    ]
  }
]

// 模拟处方数据
export const mockPrescriptions: PrescriptionDetail[] = [
  {
    id: 'RX001',
    patientId: 'P001',
    patientName: '张三',
    pharmacyId: 'PH001',
    pharmacyName: '成都主分店',
    drugs: [
      { drugId: 'D001', dosage: 50 },
      { drugId: 'D002', dosage: 30 }
    ],
    status: 'PENDING',
    createdAt: '2024-11-15T10:30:00Z'
  },
  {
    id: 'RX002',
    patientId: 'P002',
    patientName: '李四',
    pharmacyId: 'PH002',
    pharmacyName: '上海分店',
    drugs: [
      { drugId: 'D001', dosage: 80 },
      { drugId: 'D003', dosage: 25 }
    ],
    status: 'PENDING',
    createdAt: '2024-11-14T14:20:00Z'
  },
  {
    id: 'RX003',
    patientId: 'P003',
    patientName: '王五',
    pharmacyId: 'PH001',
    pharmacyName: '成都主分店',
    drugs: [
      { drugId: 'D002', dosage: 120 }, // 超出限额
      { drugId: 'D001', dosage: 40 }
    ],
    status: 'PENDING',
    createdAt: '2024-11-13T09:15:00Z'
  },
  {
    id: 'RX004',
    patientId: 'P004',
    patientName: '赵六',
    pharmacyId: 'PH003',
    pharmacyName: '北京分店',
    drugs: [
      { drugId: 'D002', dosage: 60 } // D002 已过期
    ],
    status: 'FAILED',
    createdAt: '2024-11-12T16:45:00Z',
    updatedAt: '2024-11-12T16:50:00Z'
  },
  {
    id: 'RX005',
    patientId: 'P005',
    patientName: '孙七',
    pharmacyId: 'PH002',
    pharmacyName: '上海分店',
    drugs: [
      { drugId: 'D001', dosage: 30 },
      { drugId: 'D003', dosage: 50 }
    ],
    status: 'FULFILLED',
    createdAt: '2024-11-11T11:30:00Z',
    updatedAt: '2024-11-11T11:35:00Z'
  }
]

// 模拟审核日志数据
export const mockAuditLogs: AuditLogDetail[] = [
  {
    id: 'AL001',
    prescriptionId: 'RX005',
    patientId: 'P005',
    patientName: '孙七',
    pharmacyId: 'PH002',
    pharmacyName: '上海分店',
    status: 'SUCCESS',
    drugsRequested: [
      { drugId: 'D001', dosage: 30 },
      { drugId: 'D003', dosage: 50 }
    ],
    drugsDispensed: [
      { drugId: 'D001', dosage: 30 },
      { drugId: 'D003', dosage: 50 }
    ],
    failureReasons: [],
    timestamp: '2024-11-11T11:35:00Z'
  },
  {
    id: 'AL002',
    prescriptionId: 'RX004',
    patientId: 'P004',
    patientName: '赵六',
    pharmacyId: 'PH003',
    pharmacyName: '北京分店',
    status: 'FAILED',
    drugsRequested: [
      { drugId: 'D002', dosage: 60 }
    ],
    drugsDispensed: [],
    failureReasons: [
      'Drug D002 is expired (2024-12-01)',
      'Insufficient stock (requested 60, available 80)'
    ],
    timestamp: '2024-11-12T16:50:00Z'
  },
  {
    id: 'AL003',
    prescriptionId: 'RX003',
    patientId: 'P003',
    patientName: '王五',
    pharmacyId: 'PH001',
    pharmacyName: '成都主分店',
    status: 'FAILED',
    drugsRequested: [
      { drugId: 'D002', dosage: 120 },
      { drugId: 'D001', dosage: 40 }
    ],
    drugsDispensed: [],
    failureReasons: [
      'Drug D002 exceeds pharmacy allocation (requested 120, limit 100)'
    ],
    timestamp: '2024-11-13T09:20:00Z'
  },
  {
    id: 'AL004',
    prescriptionId: 'RX006',
    patientId: 'P006',
    patientName: '周八',
    pharmacyId: 'PH001',
    pharmacyName: '成都主分店',
    status: 'SUCCESS',
    drugsRequested: [
      { drugId: 'D001', dosage: 25 }
    ],
    drugsDispensed: [
      { drugId: 'D001', dosage: 25 }
    ],
    failureReasons: [],
    timestamp: '2024-11-14T08:15:00Z'
  }
]