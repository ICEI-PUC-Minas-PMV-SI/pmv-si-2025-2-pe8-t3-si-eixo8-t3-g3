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
    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/System/Dashboard.vue')
    // },
    // {
    //   path: '/students',
    //   name: 'Students',
    //   component: () => import('@/views/System/Students.vue')
    // },
    // {
    //   path: '/teachers',
    //   name: 'Teachers',
    //   component: () => import('@/views/System/Teachers.vue')
    // },
    // {
    //   path: '/music-classes',
    //   name: 'Music Classes',
    //   component: () => import('@/views/System/MusicClasses.vue')
    // },
    // {
    //   path: '/instruments',
    //   name: 'Instruments',
    //   component: () => import('@/views/System/Instruments.vue')
    // },
    // {
    //   path: '/registrations',
    //   name: 'Registrations',
    //   component: () => import('@/views/System/Registrations.vue')
    // },
    // {
    //   path: '/payments',
    //   name: 'Payments',
    //   component: () => import('@/views/System/Payments.vue')
    // },
    // {
    //   path: '/attendances',
    //   name: 'Attendances',
    //   component: () => import('@/views/System/Attendances.vue')
    // },
    // {
    //   path: '/performance-reports',
    //   name: 'Performance Reports',
    //   component: () => import('@/views/System/PerformanceReports.vue')
    // }
  ]
})

export default router
