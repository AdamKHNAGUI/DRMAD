import {createRouter, createWebHistory} from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";
import ShopLoginView from "@/views/ShopLoginView.vue";
import BankAccountView from "@/views/BankAccountView.vue";
import ShopView from "@/views/ShopView.vue";
import ShopHome from "@/views/ShopHome.vue";

const routes = [
    {
        path: '/shop/items',
        name: 'shopitems',
        component: VirusesView
    },
    {
        path: '/shop/login',
        name: 'shoplogin',
        component: ShopLoginView
    },
    {
        path: '/bank/account',
        name: 'bankaccount',
        component: BankAccountView
    },
    {
        path: '/shop',
        name:'shop',
        component: ShopView,
        children:[
            {
                path:'/home',
                name:'shophome',
                component:ShopHome
            },
            // {
            //     path:'/login',
            //     name:'shoplogin',
            //     // component:ShopLogin
            // },
            {
                path:'/buy',
                name:'shopbuy',
                // component:ShopBuy
            },
            {
                path:'/pay/:orderId',
                name:'shoppay',
                // component:ShopPay
            },
            {
                path:'/orders',
                name:'shoporders',
                // component:ShopOrders
            },
        ]
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router
