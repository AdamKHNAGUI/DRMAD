<template>
  <div>

    <h2>
      <slot name="title">Débit / Virement</slot>
    </h2>

    <div>
      <label>Montant :</label>
      <input type="number" v-model.number="amount" />
    </div>

    <div>
      <label>
        <input type="checkbox" v-model="hasReceiver" />
        Destinataire
      </label>
    </div>

    <div v-if="hasReceiver">
      <label>Numéro de compte du destinataire :</label>
      <input type="text" v-model="receiver" />
    </div>

    <button @click="validateOperation">Valider</button>

    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>



  </div>
</template>

<script setup>
import { ref } from "vue"
import { useBankStore } from "@/stores/bank.js"
import {createWithdraw} from "@/services/localsource.service.js";


const amount = ref(0)
const hasReceiver = ref(false)
const receiver = ref("")

const successMessage = ref("")
const errorMessage = ref("")

const bankStore = useBankStore();

async function validateOperation() {
  if (amount.value <= 0) {
    errorMessage.value="Montant invalide"
    return
  }

  if (hasReceiver.value && receiver.value.trim() === "") {
    errorMessage.value="Destinataire manquant"
    return
  }


  const data1 = {
    idaccount:bankStore.currentAccount._id,
    amount:amount.value,
    number:bankStore.currentAccount.number
  }

  const data2 = {
    idaccount:bankStore.currentAccount._id,
    amount:amount.value,
    destNumber:receiver.value
  }

  let response;
  console.log(hasReceiver.value)
  if (hasReceiver.value){
    console.log("payement")
    response = await bankStore.createPayment(data2)
  } else {
    response = await bankStore.createWithdraw(data1)
  }

  console.log(response)

  successMessage.value = `L'opération est validée avec le n° : ${response.uuid}. Vous pouvez la retrouver dans l'historique`

  setTimeout(() => {
    successMessage.value = ""
  }, 5000)
}




</script>
