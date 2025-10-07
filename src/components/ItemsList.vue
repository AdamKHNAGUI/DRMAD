<template>
  <div>
    <h2>Liste des Virus à acheter 🧬</h2>
<!--      {{viruses.value}}-->
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
import {useShopStore} from '@/stores/shop' // ou import depuis Vuex selon ton projet

const ShopStore = useShopStore() // ou mapActions/mapState si Vuex

// --- Données locales ---
const viruses = reactive([])
const checked = ref([])


// --- Récupération des données ---
onMounted(async () => {
  console.log('Récupération des virus...')
  await ShopStore.getAllViruses()
  viruses.value = ShopStore.viruses;

})

// --- Sélection simple ---
function toggleCheck(index) {
  checked.value[index] = !checked.value[index]
}

// --- Ajout d’un seul item ---
function addToCart({index, amount}) {
  console.log("ajout au panier", {index, amount})
  const item = viruses.value[index]
  if (!item) {
    console.log(item)
    return
  }


  const data = {
    _idUser:ShopStore.shopUser._id,
    _idItem:item._id,
    amount:amount
  }
  console.log(data)

  ShopStore.addBasket(data)

  console.log("id user",ShopStore.shopUser._id)
  // alert(`${amount}x ${item.name} ajouté au panier !`)
  ShopStore.getBasket(ShopStore.shopUser._id);
}

// --- Ajout de tous les items sélectionnés ---
function addSelectedToCart(data) {
  data.forEach(({ index, amount }) => {
    addToCart({ index, amount })
    checked.value[index] = false
  })
}
</script>


