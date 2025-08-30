import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/drugs'
    },
    {
      path: '/drugs',
      name: 'DrugManagement',
      component: () => import('@/views/DrugManagement.vue')
    },
    {
      path: '/pharmacies',
      name: 'PharmacyManagement',
      component: () => import('@/views/PharmacyManagement.vue')
    },
    {
      path: '/prescriptions',
      name: 'PrescriptionManagement',
      component: () => import('@/views/PrescriptionManagement.vue')
    },
    {
      path: '/audit',
      name: 'AuditLogs',
      component: () => import('@/views/AuditLogs.vue')
    }
  ]
})

export default router