import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service.js'

export const useBankStore = defineStore('bank', () => {
    // state
    const accountAmount = ref(0)
    const accountTransactions = ref([])
    const accountNumberState = ref(0)

    //mutation
    const updateaccountNumberState = (data) =>{
        accountNumberState.value = data;
    }

    //action
    async function getAccountAmount(number) {
        let response = await BankService.getAccountAmount(number);
        if (response.error === 0) {
            accountAmount.value = response.data
            updateaccountNumberState(1);
        }
        else {
            console.error(response.data)
            updateaccountNumberState(-1)
        }
    }

    async function getTransactions(number) {
        let response = await BankService.getAllTransactions(number);

        if (response.error === 0) {
            accountTransactions.value = response.data
            updateaccountNumberState(1)



        }
        else {
            console.error(response.data)
            updateaccountNumberState(-1)
        }
    }

    return { accountAmount,accountTransactions,accountNumberState, getAccountAmount,getTransactions}
})
