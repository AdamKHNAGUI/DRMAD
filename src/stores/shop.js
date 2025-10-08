import {ref} from 'vue'
import {defineStore} from 'pinia'

import ShopService from '@/services/shop.service'
import router from "@/router/index.js";

export const useShopStore = defineStore('shop', () => {

    //state
    const viruses = ref([])
    const shopUser = ref(null)
    const basket = ref([])



    async function shopLogin(data) {
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
        let response = await ShopService.getAllViruses()
        if (response.error === 0) {
            viruses.value = response.data
        } else {
            console.error(response.data)
        }
    }

    async function deleteBasket(data) {
        let response = await ShopService.deleteBasket(data);
        if (response.error === 0){
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

        } else {
            console.error(response.data);
            alert(response.data)
        }
    }

    async function getBasket(bskt){
        let response = await ShopService.getBasket(bskt);
        if (response.error === 0){
            basket.value = response.data;
        } else {
            console.error(response.data)
        }
    }

    return {viruses, shopUser,basket, shopLogin, getAllViruses, getBasket,addBasket,deleteBasket,clearBasket}
})
