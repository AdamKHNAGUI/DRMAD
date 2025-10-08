<template>
  <div>
    <h1>Les virus</h1>

    <span>Filtres :</span>
    <label><input type="checkbox" v-model="filterPriceActive"> par prix</label>
    <input v-if="filterPriceActive" v-model="priceFilter" type="number">

    <label><input type="checkbox" v-model="filterNameActive"> par nom</label>
    <input v-if="filterNameActive" v-model="nameFilter" type="text">

    <label><input type="checkbox" v-model="filterStockActive"> par stock</label>
    <input v-if="filterStockActive" v-model="stockFilter" type="checkbox">

    <hr/>

    <CheckedList
        :data="filteredViruses"
        :fields="nomChamps"
        :itemCheck="showCheckBox"
        :checked="checked"
        :itemButton="{ show: true, text: 'Ajouter au Panier' }"
        :listButton="{ show: true, text: 'Tout Ajouter au Panier' }"
        @checked-changed="changeSelection"
        @item-button-clicked="alertMsg"
        @list-button-clicked="alertSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useShopStore } from "@/stores/shop.js";
import CheckedList from "@/components/CheckedList.vue";

const shopStore = useShopStore();

const priceFilter = ref(0);
const nameFilter = ref("");
const stockFilter = ref(false);
const filterPriceActive = ref(false);
const filterNameActive = ref(false);
const filterStockActive = ref(false);

const nomChamps = ["name","description","stock","wait","sold","price"];
const showCheckBox = ref(true);

const selected = ref([]);

const filteredViruses = computed(() => {
  let result = shopStore.viruses;

  if (filterPriceActive.value && priceFilter.value > 0) {
    result = result.filter(v => v.price < priceFilter.value);
  }
  if (filterNameActive.value && nameFilter.value !== "") {
    result = result.filter(v => v.name.includes(nameFilter.value));
  }
  if (filterStockActive.value && stockFilter.value) {
    result = result.filter(v => v.stock > 0);
  }

  return result;
});

const checked = computed(() =>
    filteredViruses.value.map(v => selected.value.includes(shopStore.viruses.indexOf(v)))
);

function changeSelection(idxInFiltered) {
  const virus = filteredViruses.value[idxInFiltered];
  const idxInAll = shopStore.viruses.indexOf(virus);
  if (selected.value.includes(idxInAll)) {
    selected.value = selected.value.filter(i => i !== idxInAll);
  } else {
    selected.value.push(idxInAll);
  }
}

watch(filteredViruses, (newList) => {
  selected.value = selected.value.filter(i => newList.includes(shopStore.viruses[i]));
});

function alertMsg(item) {

  const virus = filteredViruses.value[item.index];
  alert(`Nom: ${virus.name}\nStock: ${virus.stock}\nEn solde: ${virus.sold ? 'Oui' : 'Non'}`);
}

function alertSelected(item) {


  const names = selected.value.map(i => shopStore.viruses[i].name);
  alert("Virus sélectionnés: " + names.join(", "));
  selected.value = []
}
</script>

