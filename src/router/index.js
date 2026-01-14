import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import ReadingView from '../pages/menu/ReadingView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/reading/:table',
    name: 'ReadingView',
    component: ReadingView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router