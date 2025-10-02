<template>
  <div>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th v-if="itemCheck">✓</th>
        <th v-for="(field, fIndex) in fields" :key="'head-'+fIndex">{{ field }}</th>
        <th v-if="itemButton?.show">{{ itemButton.text }}</th>
      </tr>

      <!-- Corps de la table -->
      <tr v-for="(item, index) in data" :key="index">
        <!-- Case à cocher -->
        <td style="text-align: center;">
          <input
              type="checkbox"
              :checked="checked[index]"
              @change="$emit('checked-changed', index)"
          />



        </td>

        <!-- Affichage des champs dans l'ordre défini par fields -->
        <td v-for="(field, fIndex) in fields" :key="index + '-' + fIndex">
          <div v-if="field === 'wait'">
            <b>{{ formatDate(item[field].$date) }}</b>

          </div>

          <div v-else>
            {{ item[field] }}
          </div>




        </td>

        <!-- Bouton d'item -->
        <td v-if="itemButton?.show" style="text-align: center;">
          <button @click="$emit('item-button-clicked', index)">
            {{ itemButton.text }}
          </button>
        </td>
      </tr>
    </table>

    <!-- Bouton après la liste -->
    <div v-if="listButton?.show" style="margin-top: 1rem;">
      <button @click="$emit('list-button-clicked')">{{ listButton.text }}</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Array,        // Les données sources
  fields: Array,      // Champs à afficher dans l'ordre
  itemCheck: Boolean, // Afficher les cases à cocher ?
  checked: Array,     // Tableau des cases cochées
  itemButton: Object, // { show: true, text: "..." } pour bouton par ligne
  listButton: Object, // { show: true, text: "..." } pour bouton global
})

defineEmits([
  "checked-changed",
  "item-button-clicked",
  "list-button-clicked"
])

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois 01-12
  const day = String(date.getDate()).padStart(2, '0');        // Jour 01-31
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} à ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped>

</style>
