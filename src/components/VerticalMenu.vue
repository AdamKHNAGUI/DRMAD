<template>
  <div class="vertical-menu">
    <div
        v-for="(item, index) in items"
        :key="index"
        class="menu-item"
    >


      <div v-if="item.type === 'title'" class="menu-title">
        <slot name="menu-title" :label="item.label" >
          {{ item.label }}
        </slot>
      </div>


      <span
          v-else-if="item.type === 'link'"
          class="menu-link"
          @click="goTo(item.to)"
      >
        <slot name="menu-link" :label="item.label">
          <button         :disabled="!bankStore.currentAccount"
          >{{ item.label }}</button>
        </slot>
      </span>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import {useBankStore} from "@/stores/bank.js";

const bankStore= useBankStore();

const router = useRouter()

defineProps({
  items: Array
})

function goTo(dest) {
  router.push(dest)
}
</script>

<style scoped>
.vertical-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-title {
  font-weight: bold;
}

.menu-link {
  cursor: pointer;
}
</style>
