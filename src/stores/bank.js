import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service.js'

export const useBankStore = defineStore('bank', () => {

    const accountAmount = ref(0)
    const accountTransactions = ref([])


    async function getAccountAmount(number) {
        console.log( `récupération du solde bancaire | ${number}`);
        let response = await BankService.getAccountAmount(number);
        if (response.error === 0) {
            accountAmount.value = response.data
        }
        else {
            console.log(response.data)
        }
    }

    async function getTransactions(number) {
        console.log( `récupération des transactions | ${number}`);
        let response = await BankService.getAllTransactions(number);
        if (response.error === 0) {
            accountTransactions.value = response.data
        }
        else {
            console.log(response.data)
        }
    }

    return { accountAmount,accountTransactions, getAccountAmount,getTransactions}
})
