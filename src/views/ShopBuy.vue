<template>
  <div class="shop-buy-container">
    <!-- Liste des items à gauche -->
    <div class="items-list">
      <ItemsList />
    </div>

    <!-- Panier à droite -->
    <div class="basket-list">
      <BasketList />
    </div>
  </div>
</template>

<script setup>
import ItemsList from '@/components/ItemsList.vue'
import BasketList from '@/components/BasketList.vue'
</script>

