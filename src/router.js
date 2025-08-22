import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'home' ,component: ()=> import('./components/Attendance Report/teams-attendance-extract.vue')},
  { path: '/lmsform', name: 'lmsform' ,component: ()=> import('./components/LMS Form/lms-form.vue')},
  //  { path: '/dashboard', name: 'dashboard' ,component: ()=> import('./components/LMS Form/dashboard.vue')},
  // { path: '/report', name: 'report' ,component: ()=> import('./components/VILT Report/Report.vue')},
  //   { path: '/:catchAll(.*)', component: ()=> import('./components/ErrorBoundary/ErrorBoundary.vue') }
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 
export default router