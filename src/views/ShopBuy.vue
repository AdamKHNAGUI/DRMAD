<template>
  <div class="shop-buy-container">
    <div class="items-list">
      <h2>Produits disponibles</h2>
      <ItemsList />
    </div>

    <div class="basket-list">
      <h2>Votre panier</h2>
      <BasketList />
    </div>
  </div>
</template>

<script setup>
import ItemsList from '@/components/ItemsList.vue'
import BasketList from '@/components/BasketList.vue'
</script>

<style scoped>
.shop-buy-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 20px;
  background-color: #f9fafb;
  min-height: 80vh;
}

.items-list,
.basket-list {
  background: white;
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
  border-bottom: 2px solid #0078d7;
  padding-bottom: 6px;
}

@media (max-width: 900px) {
  .shop-buy-container {
    grid-template-columns: 1fr;
  }

  .basket-list {
    order: -1;
  }
}
</style>
