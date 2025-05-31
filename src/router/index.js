import { createRouter, createWebHistory } from 'vue-router'
import Walk from '../views/WalkView.vue'
import EmployeeDetail from '../views/EmployeeDetailView.vue'
import Home from '../views/HomeView.vue'
import News from '../views/NewsView.vue'
import NewsDtail from '../views/NewsDetailView.vue'
import QA from '../views/QAView.vue'
import Hotel from '../views/HotelView.vue'
import HotelDetail from '../views/HotelDetailView.vue'
import LoginView from '@/views/account/LoginView.vue'
import RegisterStartView from '@/views/account/RegisterStartView.vue'
import DashboardView from '@/views/member/MemberDashboardView.vue'
import MemberDashboardView from '@/views/member/MemberDashboardView.vue'
import ForgotPasswordView from '@/views/account/ForgotPasswordView.vue'
import { useAuthStore } from '../stores/authStore.js'
import ProfileView from '@/views/member/ProfileView.vue'
import PetView from '@/views/member/PetView.vue'

import RegisterView from '@/views/account/RegisterView.vue'
import ResetPasswordView from '@/views/account/ResetPasswordView.vue'
import OrdersView from '@/views/member/OrdersView.vue'
import GoogleSignupSupplementView from '@/views/member/GoogleSignupSupplementView.vue'
import QAView from '../views/QAView.vue'
import CartView from '@/views/CartView.vue'
import Payment from '@/views/Payment.vue'
import OrderSuccess from '@/views/OrderSuccess.vue'
import MemberSourceChart from '@/views/MemberSourceChart.vue'
import PaymentGateway from '@/views/PaymentGateway.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/news",
      name: 'News',
      component: News,
    },
    {
      path: "/newsdetail/:id",
      name: 'NewsDetail',
      component: NewsDtail,
    },
    {
      path: "/qa",
      name: 'QA',
      component: QA,
    },
    {
      path: "/hotel",
      component: Hotel,
      meta: { requiresAuth: true },
    },
    {
      path: "/HotelDetail/:id",
      component: HotelDetail,
      meta: { requiresAuth: true },
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
      path: "/register",
      component: RegisterView,
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
    {
      path: "/profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/pet",
      component: PetView,
      meta: { requiresAuth: true },
    },
    {
      path: "/resetpassword",
      component: ResetPasswordView,
    },
    {
      path: "/orders",
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/googlesignupsupplement",
      component: GoogleSignupSupplementView,
    },
    {
      path: "/cart",
      component: CartView,
      meta: { requiresAuth: true },
    },
    {
      path: "/payment",
      component: Payment,
      meta: { requiresAuth: true },
    },
    {
      path: "/orders/success/:id",
      component: OrderSuccess,
      props: route => ({
        orderId: route.params.id,
        orderType: route.query.type
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/orders/:id",
      name: 'OrderDetail',
      component: () => import('@/views/OrderDetailView.vue'),
      props: route => ({
        orderId: route.params.id,
        orderType: route.query.type
      })
    },
    {
      path: "/membersourcechart",
      component: MemberSourceChart,
      meta: { requiresAuth: true },
    },
    {
      path: "/payment-gateway",
      name: "PaymentGateway",
      component: PaymentGateway,
      meta: { requiresAuth: true }
    }
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
