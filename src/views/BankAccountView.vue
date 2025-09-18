<template>
  <div>
    <h1>Solde Bancaire</h1>

    <span>number</span><input v-model="number">
    <button @click="bankStore.getAccountAmount(number)">Solde</button>
        <p v-if="bankStore.accountAmount">{{bankStore.accountAmount.amount}}</p>

    <button @click="bankStore.getTransactions(number)">Transactions</button>
    <ul>


    <li v-for="(transaction,index) in bankStore.accountTransactions" :key="index">{{transaction}}</li>
    </ul>
  </div>

</template>

<script setup>
import {ref} from "vue";
import {useBankStore} from "@/stores/bank.js";

const number = ref('')
const bankStore = useBankStore()

</script>
