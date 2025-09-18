import { createRouter, createWebHistory } from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";

const routes = [
    // route pour afficher la liste des virus
  {
    path: '/shop/items',
    name: 'shopitems',
    component: VirusesView
  },
    // route pour se loguer
  {
    path: '/shop/login',
    name: 'shoplogin',
    // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
    component: () => import('@/views/ShopLoginView.vue')
  },
    {
        path:'/bank/account',
        name:'bankaccount',
        component: () => import('@/views/BankAccountView.vue')
    }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
