<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const appLogoColor = computed(() => {
  return useThemeStore().theme === 'light' ? 'logo-horizontal' : 'logo-dark'
})
</script>

<template>
  <v-app-bar-nav-icon></v-app-bar-nav-icon>
  <v-img
    :width="150"
    aspect-ratio="16/9"
    cover
    :src="'/src/assets/'+appLogoColor+'.png'"
  ></v-img>
</template>