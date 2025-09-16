import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Site/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/Site/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Site/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Site/CreateAccount.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/System/Dashboard.vue')
    },
    {
      path: '/students',
      name: 'Estudantes',
      component: () => import('@/views/System/Student.vue')
    },
    {
      path: '/teachers',
      name: 'Professores',
      component: () => import('@/views/System/Teachers.vue')
    },
    {
      path: '/music-classes',
      name: 'Turmas',
      component: () => import('@/views/System/MusicClasses.vue')
    },
    {
      path: '/instruments',
      name: 'Instrumentos',
      component: () => import('@/views/System/Instruments.vue')
    },
    {
      path: '/registrations',
      name: 'Matrículas',
      component: () => import('@/views/System/Registrations.vue')
    },
    {
      path: '/payments',
      name: 'Pagamentos',
      component: () => import('@/views/System/Payment.vue')
    },
    {
      path: '/attendances',
      name: 'Presenças',
      component: () => import('@/views/System/Attendances.vue')
    },
    {
      path: '/performance-reports',
      name: 'Relatório de Performance',
      component: () => import('@/views/System/PerformanceReports.vue')
    }
  ]
})

export default router
