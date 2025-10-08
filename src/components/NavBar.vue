<template>
  <div>
    <button
        v-for="(item,index) in titles"
        :key="index"
        :style="{ backgroundColor: item.color }"
        @click="$emit('menu-clicked', index)"
    >
      {{item.text}}
    </button>
  </div>
</template>

<script setup>
defineProps({
  titles: Array
})
defineEmits(["menu-clicked"])

</script>

<style scoped>
</style>