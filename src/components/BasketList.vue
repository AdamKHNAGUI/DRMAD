<template>
  <div>
    <h2>🧺 Votre panier</h2>

    <CheckedList
        :data="store.basket"
        :fields="['name', 'price', 'amount']"
        :itemCheck="false"
        :itemButton="{ show: true, text: 'Retirer' }"
        :listButton="{ show: true, text: 'Commander' }"

        @item-button-clicked="removeItem"
        @list-button-clicked="clearAll"
    />

    <div class="actions">
      <v-btn color="primary" @click="buyBasket">Acheter</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useShopStore } from '@/stores/shop'
import CheckedList from './CheckedList.vue'
import  ShopService  from '@/services/shop.service.js'
import { useRouter } from 'vue-router'

const store = useShopStore()
const router = useRouter()
const basket = ref([])

onMounted(async () => {
  await ShopService.getBasket(store.shopUser._id)
})

async function removeItem(item) {
  console.log(item.index)
  const virus = store.basket[item.index]
  // console.log(virus)
  await store.deleteBasket(
      { _idUser: store.shopUser._id,
        _idItem:virus._id
      })

}

async function clearAll() {
  const response = await ShopService.clearBasket({ _id: store.shopUser._id })
  if (response.error === 0) basket.value = response.data
}

async function buyBasket() {
  if (basket.value.length === 0) return alert('Panier vide !')

  const response = await ShopService.orderBasket({
    _id: store.shopUser._id,
    basket: basket.value
  })

  if (response.error === 0 && response.data.uuid) {
    await ShopService.clearBasket({ _id: store.shopUser._id })
    basket.value = []
    await router.push(`/shop/pay/${response.data.uuid}`)
  } else {
    alert('Erreur lors de la commande.')
  }
}
</script>



