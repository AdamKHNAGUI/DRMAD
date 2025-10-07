<template>
  <div class="shop-orders">
    <h2>Commandes passées</h2>

    <table>
      <thead>
      <tr>
        <th>Montant</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="order in orders" :key="order.uuid">
        <td>{{ order.amount.toFixed(2) }} €</td>
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

    <p v-if="!orders.length">Aucune commande trouvée.</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop.js'

const store = useShopStore()
const router = useRouter()

const orders = computed(() => store.currentUser.orders)

onMounted(() => {
  store.fetchUserOrders()
})

function pay(orderUuid) {
  router.push(`/shop/pay/${orderUuid}`)
}

function cancel(orderUuid) {
  store.cancelOrder(orderUuid)
}
</script>

