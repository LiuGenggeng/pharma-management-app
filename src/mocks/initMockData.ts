import {storage} from "@/common/utils/storage.ts";

export const MOCK_LOCALSTORAGE_KEY = 'PHARMA_MOCK_DATA';
export const DEFAULT_DATA = {
  drugs: [
    {"id": "D001", "name": "Ibuprofen", "manufacturer": "ACME Pharma", "batch": "B202403", "expiry": "2026-01-01", "stock": 150, "limit": 200},
    {"id": "D002", "name": "Paracetamol", "manufacturer": "ACME Pharma", "batch": "B202406", "expiry": "2026-05-01", "stock": 170, "limit": 350},
    {"id": "D003", "name": "Amoxilin", "manufacturer": "ACME Pharma", "batch": "B202409", "expiry": "2025-05-01", "stock": 270, "limit": 350},
  ],
  pharmacies: [
    {"id": "PH001", "name": "Chengdu Main Branch", "allocatedDrugs": [{ "drugId": "D001", "drugName": "Ibuprofen", "limit": 200 }, { "drugId": "D002", "drugName": "Paracetamol", "limit": 100 }]},
    {"id": "PH002", "name": "Chengdu Main Branch2", "allocatedDrugs": [{ "drugId": "D001", "drugName": "Ibuprofen", "limit": 90 }, { "drugId": "D002", "drugName": "Paracetamol", "limit": 10 }]},
    {"id": "PH003", "name": "Chengdu Main Branch3", "allocatedDrugs": [{ "drugId": "D002", "drugName": "Ibuprofen", "limit": 50 }, { "drugId": "D003", "drugName": "Paracetamol", "limit": 100 }]},
  ],
  prescriptions: [
    {
      "id": "RX123",
      "patientId": "P001",
      "pharmacyId": "PH001",
      "drugs": [
        { "drugId": "D001", "dosage": 100 },
        { "drugId": "D002", "dosage": 90 }
      ],
      "status": "PENDING"
    },
    {
      "id": "RX125",
      "patientId": "P003",
      "pharmacyId": "PH001",
      "drugs": [
        { "drugId": "D001", "dosage": 100 },
        { "drugId": "D002", "dosage": 900 }
      ],
      "status": "PENDING"
    },
    {
      "id": "RX126",
      "patientId": "P004",
      "pharmacyId": "PH001",
      "drugs": [
        { "drugId": "D001", "dosage": 300 },
        { "drugId": "D002", "dosage": 600 }
      ],
      "status": "PENDING"
    },
    {
      "id": "RX127",
      "patientId": "P005",
      "pharmacyId": "PH003",
      "drugs": [
        { "drugId": "D002", "dosage": 300 },
        { "drugId": "D003", "dosage": 100 }
      ],
      "status": "PENDING"
    },
    {
      "id": "RX124",
      "patientId": "PH002",
      "pharmacyId": "ACME Pharma ABC",
      "drugs": [
        { "drugId": "D001", "dosage": 400 },
        { "drugId": "D002", "dosage": 600 }
      ],
      "status": "SUCCESS"
    }
  ],
  auditLogs: []
};
export const initMockData = () => {
  storage.del(MOCK_LOCALSTORAGE_KEY);
  if (!localStorage.getItem(MOCK_LOCALSTORAGE_KEY)) {
    localStorage.setItem(MOCK_LOCALSTORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  }
}