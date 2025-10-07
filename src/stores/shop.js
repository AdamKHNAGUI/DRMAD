import {ref} from 'vue'
import {defineStore} from 'pinia'

import ShopService from '@/services/shop.service'
import router from "@/router/index.js";
import {bankaccounts} from "@/datasource/data.js";

export const useShopStore = defineStore('shop', () => {

    const viruses = ref([])
    const shopUser = ref(null)
    const basket = ref([])

    async function shopLogin(data) {
        console.log('login');
        let response = await ShopService.shopLogin(data)
        if (response.error === 0) {
            shopUser.value = response.data
            await router.push("/shop/buy")
        } else {
            console.error(response.data)
            alert(response.data)
        }
    }

    async function getAllViruses() {
        console.log('récupération des viruses');
        let response = await ShopService.getAllViruses()
        if (response.error === 0) {
            viruses.value = response.data
        } else {
            console.error(response.data)
        }
    }

    async function deleteBasket(data) {
        let response = await ShopService.deleteBasket(data);
        console.log("réponse ???",response)
        if (response.error === 0){
            console.log("cacacacac",response.data)
            basket.value = response.data;

        } else {
            console.error(response.data);
        }
    }

    async function clearBasket() {
        let response = await ShopService.clearBasket();
        if (response.error === 0){
            basket.value = response.data;
        } else {
            console.error(response.data);
        }
    }


    async function addBasket(bskt) {
        let response = await ShopService.addBasket(bskt);
        if (response.error === 0) {
            basket.value.push(response.data);
            console.log("panier de merde",response.data)
        } else {
            console.error(response.data);
            alert(response.data)
        }
    }

    async function getBasket(bskt){
        // console.warn(bskt)
        let response = await ShopService.getBasket(bskt);
        if (response.error === 0){
            basket.value = response.data;
            console.log(basket.value)
        } else {
            console.error(response.data)
        }
    }

    return {viruses, shopUser,basket, shopLogin, getAllViruses, getBasket,addBasket,deleteBasket,clearBasket}
})
