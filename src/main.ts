import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router';
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import { initMockData } from "@/mocks/initMockData";

async function prepareApp() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    initMockData();
    const { startMockService }= await import('./mocks/browser');
    return startMockService();
  }
  return Promise.resolve()
}

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
prepareApp().then(() => {
  app.mount('#app')
});

