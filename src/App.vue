<template>
  <div>
    <NavBar :links="navbtn"/>
    <router-view/>
  </div>

</template>

<script setup>
import {onMounted} from "vue";
import {useShopStore} from "@/stores/shop.js";
import NavBar from "@/components/NavBar.vue";

const shopStore = useShopStore()

const navbtn = [
  {label: "Shop", to:"/shop"},
  {label: "Compte bancaire",to:"/bank"}
]



onMounted(() => {
  shopStore.getAllViruses()
})
</script>

<style>

</style>
