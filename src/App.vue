<template>
  <div id="app">
    <NavBar />
    <router-view />
    <Footer />
    <Toast
      :show="toastState.show"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @update:show="toastState.show = $event"
    />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'

const { toastState, showToast } = useToast()

// 提供 toast 方法给所有子组件
provide('toast', showToast)
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

