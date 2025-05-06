import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Walk from '../views/Walk.vue'
import EmployeeDetail from '../views/EmployeeDetail.vue'

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
      path: "/walk",
      name: 'Walk',
      component: Walk,
    },
    {
      path: '/employee/:id',
      name: 'EmployeeDetail',
      component: EmployeeDetail
    },
  ],
})

export default router
