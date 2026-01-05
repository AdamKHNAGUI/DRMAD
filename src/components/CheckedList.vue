<template>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
      <tr>
        <th v-if="itemCheck">✓</th>
        <th v-for="(field, fIndex) in fields" :key="'head-' + fIndex">{{ field }}</th>
        <th v-if="itemButton?.show">{{ itemButton.text }}</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(item, index) in data" :key="index" >
        <td v-if="itemCheck" class="check-cell">
          <input
              type="checkbox"
              :checked="checked[index]"
              @change="$emit('checked-changed', index)"
          />
        </td>

        <td v-for="(field, fIndex) in fields" :key="index + '-' + fIndex">
          <div v-if="field === 'wait'">
            <b>{{ formatDate(item[field].$date) }}</b>
          </div>
          <div v-else-if="field === 'promotion'">
            <ul class="promo-list">
              <li v-for="(promo, i) in item['promotion']" :key="i">
                <strong>{{ promo.discount }}€</strong> pour {{ promo.amount }} unités
              </li>
            </ul>
          </div>
          <div v-else>
            {{ item[field] }}
          </div>
        </td>

        <td v-if="itemButton?.show" class="action-cell">
          <div class="action-wrapper">
            <input
                v-if="itemAmount"
                type="number"
                min="1"
                v-model.number="amounts[index]"
            />
            <button @click="$emit('item-button-clicked', { index, amount: amounts[index] })">
              {{ itemButton.text }}
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="listButton?.show" class="list-button-container">
      <button @click="emitListButtonClicked">{{ listButton.text }}</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: Array,
  fields: Array,
  itemCheck: Boolean,
  checked: Array,
  itemButton: Object,
  listButton: Object,
  itemAmount: Boolean
})

const emit = defineEmits([
  "checked-changed",
  "item-button-clicked",
  "list-button-clicked"
])

const amounts = reactive([])

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

const emitListButtonClicked = () => {
  const selectedItems = props.data
      .map((_, i) => ({ index: i, amount: amounts[i] }))
      .filter((_, i) => props.checked[i])
  emit('list-button-clicked', selectedItems)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR')
}


</script>

<style scoped>
.table-wrapper {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background-color: #0078d7;
  color: white;
  padding: 10px;
  text-align: left;
  font-weight: 600;
}

.data-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.data-table tr:hover {
  background-color: #f5faff;
}

.check-cell {
  text-align: center;
}

.action-cell {
  text-align: center;
}

.action-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

input[type="number"] {
  width: 60px;
  padding: 6px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 13px;
}
button:hover {
  background-color: #005fa3;
}

.list-button-container {
  margin-top: 1rem;
  text-align: center;
}

.promo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.promo-list li {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 13px;
}
</style>
