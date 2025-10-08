<template>
  <div>
    <NavBar :titles="navbtn" @menu-clicked="goTo"/>
    <h1>Welcome to DrMad app</h1>
    <router-view/>
  </div>

</template>

<script setup>
import {onMounted} from "vue";
import {useShopStore} from "@/stores/shop.js";
import NavBar from "@/components/NavBar.vue";
import {useRouter} from "vue-router";

const shopStore = useShopStore()
const router = useRouter()

const navbtn = [
  {text: "Shop Login", color: "red"},
  {text: "Viruses", color: "blue"},
  {text: "Compte bancaire", color: "green"}
]

function goTo(linkIndex) {
  switch (linkIndex) {
    case 0:
      router.push("/shop/login")
      break
    case 1:
      router.push("/shop/items")
      break
    case 2:
      router.push("/bank/account")
      break
  }
}

onMounted(() => {
  shopStore.getAllViruses()
})
</script>

<style scoped></style>
