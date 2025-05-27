import { createRouter, createWebHistory } from 'vue-router'
import Walk from '../views/WalkView.vue'
import EmployeeDetail from '../views/EmployeeDetailView.vue'
import Home from '../views/HomeView.vue'
import News from '../views/NewsView.vue'
import NewsDtail from '../views/NewsDetailView.vue'
import QA from '../views/QAView.vue'
import About from '../views/AboutView.vue'
import Contact from '../views/ContactView.vue'
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
import AddPetView from '@/views/member/AddPetView.vue'
import EditPetView from '@/views/member/EditPetView.vue'
import RegisterView from '@/views/account/RegisterView.vue'
import ResetPasswordView from '@/views/account/ResetPasswordView.vue'
import OrdersView from '@/views/member/OrdersView.vue'
import GoogleSignupSupplementView from '@/views/member/GoogleSignupSupplementView.vue'
import QAView from '../views/QAView.vue'


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
      component: QAView,
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
      path: "/HotelDetail/:id",
      component: HotelDetail,
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
      path: "/addpet",
      component: AddPetView,
      meta: { requiresAuth: true },
    },
    {
      path: "/editpet",
      component: EditPetView,
      meta: { requiresAuth: true },
    },
    {
      path: "/resetpassword",
      component: ResetPasswordView,
    },
    {
      path: "/member/orders",
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/googlesignupsupplement",
      component: GoogleSignupSupplementView,
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
