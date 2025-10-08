<template>
  <div class="shop-pay">
    <h1>Paiement de la commande</h1>

    <div class="form">
      <label for="uuid">UUID de la commande :</label>
      <input
          id="uuid"
          v-model="uuid"
          size="40"
          placeholder="Entrez l'UUID de la commande"
      />

      <button @click="pay">Payer</button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShopService from '@/services/shop.service'
import { useShopStore } from "@/stores/shop.js";

const route = useRoute();
const router = useRouter();
const store = useShopStore();

const uuid = ref("");
const message = ref("");

onMounted(() => {
  if (route.params.orderId) {
    uuid.value = route.params.orderId;
  }
});

async function pay() {
  if (!uuid.value) {
    message.value = "Veuillez saisir un UUID de commande.";
    return;
  }

  let response = await ShopService.getOrder({
    userId: store.shopUser._id,
    uuid: uuid.value,
  });

  if (response.error !== 0) {
    message.value = "Commande introuvable.";
    return;
  }

  let payResponse = await ShopService.payOrder({
    userId: store.shopUser._id,
    uuid: uuid.value,
  });

  if (payResponse.error === 0) {
    message.value = "Commande payée avec succès !";
    await router.push("/shop/orders");
  } else {
    message.value = payResponse.data;
  }
}
</script>
