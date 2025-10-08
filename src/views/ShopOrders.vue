<template>
  <div class="shop-orders">
    <h2>Commandes passées</h2>

    <table v-if="orders.length">
      <thead>
      <tr>
        <th>Montant</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="order in orders" :key="order.uuid">
        <td>{{ order.total.toFixed(2) }} €</td>
        <td>{{ order.status }}</td>
        <td>
          <button
              v-if="order.status === 'waiting_payment'"
              @click="pay(order.uuid)"
          >
            Payer
          </button>
          <button
              v-if="order.status === 'waiting_payment'"
              @click="cancel(order.uuid)"
          >
            Annuler
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else>Aucune commande trouvée.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop.js'
import ShopService from '@/services/shop.service.js'

const store = useShopStore()
const router = useRouter()

const orders = ref([])

onMounted(async () => {
  const response = await ShopService.getOrdersByUser(store.shopUser._id)
  orders.value = response?.data || response || []
})

function pay(orderUuid) {
  router.push(`/shop/pay/${orderUuid}`)
}

async function cancel(orderUuid) {
  await ShopService.cancelOrder(orderUuid)

}
</script>
