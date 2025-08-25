import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/drugManage'
  },
  {
    path: '/drugManage',
    name: 'drugManage',
    component: () => import('@/pages/drugManage/DrugManage.vue')
  },
  {
    path: '/pharmaciesManage',
    name: 'pharmaciesManage',
    component: () => import('@/pages/pharmaciesManage/PharmaciesManage.vue')
  },
  {
    path: '/prescriptionsAndFulfillmentManage',
    name: 'prescriptionsAndFulfillmentManage',
    component: () => import('@/pages/prescriptionsAndFulfillmentManage/PrescriptionsAndFulfillmentManage.vue')
  },
  {
    path: '/viewAuditLogs',
    name: 'viewAuditLogs',
    component: () => import('@/pages/viewAuditLogs/ViewAuditLogs.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/pages/setting/Setting.vue')
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
export default router;