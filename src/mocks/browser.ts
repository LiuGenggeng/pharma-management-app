import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
// 启动时配置忽略规则
export async function startMockService() {
  return worker.start({
    onUnhandledRequest: (request) => {
      // 忽略对 Vue 文件、静态资源的请求
      if (
        request.url.includes('.vue') ||
        request.url.includes('.js') ||
        request.url.includes('.css') ||
        request.url.includes('.png') ||
        request.url.includes('.jpg') ||
        request.url.includes('.ico')
      ) {
        return
      }
      
      // 对于其他未处理的 API 请求显示警告
      console.warn('未处理的请求:', request.method, request.url)
    }
  })
}