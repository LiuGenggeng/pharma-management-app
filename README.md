# Pharma Management App
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```
### Compiles and minifies for production
```
npm run build
```

### 目录结构如下

```aiignore
src/
├── components/ # 通用组件
│ ├── DrugForm.vue # 药品表单组件
│ └── DrugTable.vue # 药品表格组件
├── views/ # 页面组件
│ ├── DrugManagement.vue
│ ├── PharmacyManagement.vue
│ ├── PrescriptionManagement.vue
│ └── AuditLogs.vue
├── stores/ # Pinia状态管理
│ ├── drug.ts
│ ├── pharmacy.ts
│ ├── prescription.ts
│ └── audit.ts
├── services/ # API服务层
│ ├── api.ts # 基础API配置
│ ├── drugService.ts # 药品相关API
│ ├── pharmacyService.ts
│ ├── prescriptionService.ts
│ └── mockData.ts # 模拟数据
├── types/ # TypeScript类型定义
│ └── index.ts
├── utils/ # 工具函数
│ └── validation.ts # 验证函数
├── router/ # 路由配置
│ └── index.ts
├── App.vue
└── main.ts
```