import { createRouter, createWebHistory } from 'vue-router'
import Walk from '../views/WalkView.vue'
import EmployeeDetail from '../views/EmployeeDetailView.vue'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Contact from '../views/ContactView.vue'
import Hotel from '../views/HotelView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterStartView from '@/views/RegisterStartView.vue'
import DashboardView from '@/views/MemberDashboardView.vue'
import MemberDashboardView from '@/views/MemberDashboardView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import { useAuthStore } from '../stores/authStore.js'

 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
    {
      path: "/contact",
      component: Contact,
    },
    {
      path: "/hotel",
      component: Hotel,
    },
    {
      path: "/walk",
      name: 'Walk',
      component: Walk,
    },
    {
      path: '/employee/:id',
      name: 'EmployeeDetail',
      component: EmployeeDetail
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/registerstart",
      component: RegisterStartView,
    },
    {
      path: "/memberdashboard",
      name: 'MemberDashboard',
      component: MemberDashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/forgotpassword",
      component: ForgotPasswordView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
}) 

export default router
