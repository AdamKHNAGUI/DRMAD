<template>
  <div>
    <h1>Les virus</h1>

    <p>sous forme de liste avec certains champs</p>

    <span>Filtres :</span>
    <label for="filterpriceactive">par prix</label><input type="checkbox" v-model="filterPriceActive"
                                                          id="filterpriceactive">
    <label for="filternameactive">par nom</label><input type="checkbox" v-model="filterNameActive"
                                                        id="filternameactive">
    <label for="filterstockactive">par stock</label><input type="checkbox" v-model="filterStockActive"
                                                           id="filterstockactive">

    <hr/>
    <div v-if="filterPriceActive">
      <label for="filterprice">prix inférieur à : </label>
      <input v-model="priceFilter" id="filterprice" type="number">
    </div>

<!--    <ul>-->
<!--      <li v-for="(virus, index) in filterVirusesByPrice" :key="index">-->
<!--        {{ virus.name }} : {{ virus.price }}-->
<!--      </li>-->
<!--    </ul>-->




    <div v-if="filterNameActive">
      <label for="filtername"> nom :</label>
      <input v-model="nameFilter" id="filtername" type="text">
    </div>
<!--    <ul>-->
<!--      <li v-for="(virus, index) in filterVirusesByName" :key="index">-->
<!--        {{ virus.name }} : {{ virus.price }}-->
<!--      </li>-->
<!--    </ul>-->




    <div v-if="filterStockActive">
      <label for="filterstock"> en stock :</label>
      <input v-model="stockFilter" id="filterstock" type="checkbox">
    </div>
    <!-- Table pour afficher les résultats -->
    <table border="1">
      <tr>
        <th>Nom</th>
        <th>Prix</th>
      </tr>
      <tr v-for="(virus, index) in filterVirusesByStock" :key="index">
        <td>{{ virus.name }}</td>
        <td>{{ virus.price }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import {useShopStore} from "@/stores/shop.js";
import {computed, ref} from "vue";

const shopStore = useShopStore();

const priceFilter = ref(0);
const nameFilter = ref("");
const stockFilter = ref(false);
const filterPriceActive = ref(false);
const filterNameActive = ref(false);
const filterStockActive = ref(false);

const filterVirusesByPrice = computed(() => {
  if (priceFilter.value > 0 && filterPriceActive.value) {
    return shopStore.viruses.filter(v => v.price < priceFilter.value);
  }
  return shopStore.viruses;
});

const filterVirusesByName = computed(() => {
  if (nameFilter.value !== "" && filterNameActive.value) {
    return filterVirusesByPrice.value.filter(v => v.name === nameFilter.value);
  }
  return filterVirusesByPrice.value;
});

const filterVirusesByStock = computed(() => {
  if (stockFilter.value === true && filterStockActive.value) {
    return filterVirusesByName.value.filter(v => v.stock > 0);
  }
  return filterVirusesByName.value;
});
</script>
