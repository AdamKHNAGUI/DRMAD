<template>
  <div class="shop-buy-container">
    <div class="items-list">
      <ItemsList />
    </div>

    <div class="basket-list">
      <BasketList />
    </div>
  </div>
</template>

<script setup>
import ItemsList from '@/components/ItemsList.vue'
import BasketList from '@/components/BasketList.vue'
</script>

