<!-- src/App.vue -->
<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>