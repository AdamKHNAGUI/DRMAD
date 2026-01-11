import {createRouter, createWebHistory} from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";
import ShopLoginView from "@/views/ShopLoginView.vue";
import ShopView from "@/views/ShopView.vue";
import ShopHome from "@/views/ShopHome.vue";
import ShopBuy from "@/views/ShopBuy.vue";
import ShopPay from "@/views/ShopPay.vue";
import ShopOrders from "@/views/ShopOrders.vue";
import BankView from "@/views/BankView.vue";
import BankHome from "@/views/BankHome.vue";
import BankAccount from "@/views/BankAccount.vue";
import BankAmount from "@/views/BankAmount.vue";
import BankOperation from "@/views/BankOperation.vue";
import BankHistory from "@/views/BankHistory.vue";
import BankLogout from "@/views/BankLogout.vue";

const routes = [
    {
        path: '/shop/items',
        name: 'shopitems',
        component: VirusesView
    },
    {
        path: "/bank",
        component: BankView,
        redirect: '/bank/home',
        children: [
            {
                path: "home",
                components: { bankmain: BankHome },
                alias: ["/bank"]
            },
            {
                path: "account",
                components: { bankmain: BankAccount }
            },
            {
                path: "amount",
                components: { bankmain: BankAmount }
            },
            {
                path: "operation",
                components: { bankmain: BankOperation }
            },
            {
                path: "history",
                components: { bankmain: BankHistory }
            },
            {
                path: "logout",
                components: { bankmain: BankLogout }
            },
        ]
    },
    {
        path: '/shop',
        name:'shop',
        component: ShopView,
        redirect: '/shop/home',
        children:[
            {
                path:'home',
                components:{shopmain:ShopHome},
                alias: ["/shop"]

            },
            {
                path:'login',
                name:'shoplogin',
                components:{shopmain:ShopLoginView}
            },
            {
                path:'buy',
                name:'shopbuy',
                components:{shopmain:ShopBuy}
            },
            {
                path:'pay/:orderId',
                name:'shoppay',
                components:{shopmain:ShopPay}
            },
            {
                path:'orders',
                name:'shoporders',
                components: {shopmain:ShopOrders}
            },
        ]
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router