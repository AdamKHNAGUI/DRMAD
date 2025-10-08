<template>
  <div>
    <h2>🧺 Votre panier</h2>

    <CheckedList
        :data="store.basket"
        :fields="['name', 'price', 'amount']"
        :itemCheck="false"
        :checked="checked"
        :itemButton="{ show: true, text: 'Retirer' }"
        :listButton="{ show: true, text: 'Commander' }"
        @item-button-clicked="removeItem"
        @list-button-clicked="buyBasket"
    />
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
const checked = ref([])


onMounted(async () => {
  await ShopService.getBasket(store.shopUser._id)
})

async function removeItem(item) {
  console.log(item.index)
  const virus = store.basket[item.index]
  await store.deleteBasket(
      { _idUser: store.shopUser._id,
        _idItem:virus._id
      })
}


async function buyBasket() {
  if (store.basket.length === 0) return alert('Panier vide !')
  const response = await ShopService.orderBasket({
    _id: store.shopUser._id,
    basket: store.basket
  })
  if (response.error === 0 && response.data.uuid) {
    await ShopService.clearBasket({ _id: store.shopUser._id })
    store.basket = []
    await router.push(`/shop/pay/${response.data.uuid}`)
  } else {
    alert('Erreur lors de la commande.')
    console.error(response)
  }
}
</script>



