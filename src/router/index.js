import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import DzikirAfterShalat from '../pages/menu/DzikirAfterShalat.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/dzikir-after-shalat',
    name: 'DzikirAfterShalat',
    component: DzikirAfterShalat
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router