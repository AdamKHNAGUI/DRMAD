<template>
  <div>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th v-if="itemCheck">✓</th>
        <th v-for="(field, fIndex) in fields" :key="'head-' + fIndex">{{ field }}</th>
        <th v-if="itemButton?.show">{{ itemButton.text }}</th>
      </tr>

      <!-- Corps du tableau -->
      <tr v-for="(item, index) in data" :key="index">
        <!-- Case à cocher -->
        <td v-if="itemCheck" style="text-align: center;">
          <input
              type="checkbox"
              :checked="checked[index]"
              @change="$emit('checked-changed', index)"
          />
        </td>

        <!-- Colonnes des données -->
        <td v-for="(field, fIndex) in fields" :key="index + '-' + fIndex">
          <div v-if="field === 'wait'">
            <b>{{ formatDate(item[field].$date) }}</b>
          </div>
          <div v-else>
            {{ item[field] }}
          </div>
        </td>

        <!-- Bouton et champ quantité -->
        <td v-if="itemButton?.show" style="text-align: center;">
          <input
              v-if="itemAmount"
              type="number"
              min="1"
              v-model.number="amounts[index]"
              style="width: 60px; margin-right: 5px;"
          />
          <button @click="$emit('item-button-clicked', { index, amount: amounts[index] })">
            {{ itemButton.text }}
          </button>
        </td>
      </tr>
    </table>

    <!-- Bouton après la liste -->
    <div v-if="listButton?.show" style="margin-top: 1rem; text-align: center;">
      <button @click="emitListButtonClicked">{{ listButton.text }}</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: Array,        // Les données sources
  fields: Array,      // Champs à afficher dans l'ordre
  itemCheck: Boolean, // Afficher les cases à cocher ?
  checked: Array,     // Tableau des cases cochées
  itemButton: Object, // { show: true, text: "..." } pour bouton par ligne
  listButton: Object, // { show: true, text: "..." } pour bouton global
  itemAmount: Boolean // Afficher les champs numériques ?
})

const emit = defineEmits([
  "checked-changed",
  "item-button-clicked",
  "list-button-clicked"
])

// Tableau réactif pour stocker les quantités par item
const amounts = reactive([])

// Initialise les quantités quand la data change
watch(
    () => props.data,
    (newData) => {
      if (!newData) return
      newData.forEach((_, i) => {
        if (amounts[i] === undefined) amounts[i] = 1
      })
    },
    { immediate: true }
)

// Événement du bouton global
const emitListButtonClicked = () => {
  const selectedItems = props.data
      .map((_, i) => ({ index: i, amount: amounts[i] }))
      .filter((_, i) => props.checked[i]) // on garde seulement les items cochés
  emit('list-button-clicked', selectedItems)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${month}/${day}/${year} à ${hours}:${minutes}:${seconds}`
}
</script>

<style scoped>
input[type="number"] {
  text-align: center;
}
</style>
