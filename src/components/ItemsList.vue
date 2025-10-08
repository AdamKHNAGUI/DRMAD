<template>
  <div>
    <h2>Liste des Virus à acheter 🧬</h2>
    <CheckedList
        :data="viruses.value"
        :fields="['name', 'price', 'promotion']"
        :itemCheck="true"
        :checked="checked"
        :itemButton="{ show: true, text: 'Ajouter' }"
        :listButton="{ show: true, text: 'Tout ajouter au panier' }"
        :itemAmount="true"
        @checked-changed="toggleCheck"
        @item-button-clicked="addToCart"
        @list-button-clicked="addSelectedToCart"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue'
import CheckedList from './CheckedList.vue'
import {useShopStore} from '@/stores/shop'

const ShopStore = useShopStore()

const viruses = reactive([])
const checked = ref([])

onMounted(async () => {
  await ShopStore.getAllViruses()
  viruses.value = ShopStore.viruses;

})

function toggleCheck(index) {
  checked.value[index] = !checked.value[index]
}

async function addToCart({index, amount}) {
  const item = viruses.value[index]
  if (!item) {
    return
  }


  const data = {
    _idUser: ShopStore.shopUser._id,
    _idItem: item._id,
    amount: amount
  }

  ShopStore.addBasket(data)
  ShopStore.getBasket(ShopStore.shopUser._id);
}

function addSelectedToCart(data) {
  data.forEach(({ index, amount }) => {
    addToCart({ index, amount })
    checked.value[index] = false
  })
}
</script>


