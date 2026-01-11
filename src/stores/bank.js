import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service.js'

export const useBankStore = defineStore('bank', () => {
    // state
    const currentAccount = ref(null)
    const accountAmount = ref(0)
    const accountTransactions = ref([])
    const accountNumberState = ref(0)





    //mutation
    const updateaccountNumberState = (data) =>{
        accountNumberState.value = data;
    }
    const setAccount=(data)=> {
        currentAccount.value = data
    }

    function setTransactions(data) {
        accountTransactions.value = data
    }

    function setStatus(s) {
        accountNumberState.value = s
    }

    //action
    async function getAccount(number){
        let response = await BankService.getAccount(number);
        if (response.error === 0) {
            setAccount(response.data)
            updateaccountNumberState(1);
        }
        else {
            console.error(response.data)
            updateaccountNumberState(-1)
        }

    }

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
        console.log(number)
        if (response.error === 0) {
            accountTransactions.value = response.data
            updateaccountNumberState(1)
        }
        else {
            console.error(response.data)
            updateaccountNumberState(-1)
        }
    }


    async function createWithdraw(data) {
        const response = await BankService.createWithdrawService(data)
        console.log(response)
        if (response.error === 0) {
            currentAccount.value.amount = response.data.amount
            await getTransactions(data.number)
            setStatus(1)
            return response.data;
        } else {
            console.error(response.data)
            setStatus(-1)
        }
    }

    async function createPayment(data) {
        const response = await BankService.createPayment(data)
        console.log(response)
        if (response.error === 0) {
            currentAccount.value.amount = response.data.amount
            await getTransactions(data.destNumber)
            setStatus(1)
            return response.data;
        } else {
            console.error(response.data)
            setStatus(-1)
        }
    }

    return { currentAccount,
        accountAmount,
        accountTransactions,
        accountNumberState,setAccount,
        getAccount,
        getAccountAmount,
        getTransactions,
        createPayment,
        createWithdraw}
})
