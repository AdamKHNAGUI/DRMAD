<template>
  <div>
    <h1>Solde Bancaire</h1>
    <span>number</span><input v-model="number" type="text" pattern="^[A-Za-z0-9]{22}-\d{7}$" required>
    <button v-if="validNumber" @click="bankStore.getAccountAmount(number)">Solde</button>
        <p v-if="bankStore.accountAmount && bankStore.accountNumberState === 1">{{bankStore.accountAmount.amount}}</p>
    <button v-if="!validNumber" class="locked">Solde</button>
    <button v-if="validNumber" @click="bankStore.getTransactions(number)">Transactions</button>
    <button v-if="!validNumber" class="locked">Transactions</button>
    <button @click="reset" >Reset</button>
    <div v-if="bankStore.accountNumberState === -1">
      numéro de compte érroné
    </div>
    <ul v-if="bankStore.accountNumberState === 1">
    <li v-for="(transaction,index) in bankStore.accountTransactions" :key="index">{{transaction.amount}} {{formatDate(transaction.date.$date)}}</li>
    </ul>
  </div>

</template>

<script setup>
import {computed, ref} from "vue";
import {useBankStore} from "@/stores/bank.js";

const number = ref('')
const bankStore = useBankStore()


const validNumber = computed(()=>{
  return !!number.value.match(/^[A-Za-z0-9]{22}-\d{7}$/);

})


const formatDate = (dateString) => {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois 01-12
  const day = String(date.getDate()).padStart(2, '0');        // Jour 01-31
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} à ${hours}:${minutes}:${seconds}`;
}


const reset = () => {
  number.value = ''
}

</script>

<style scoped>
.locked {
  background: #e40000;

}
</style>