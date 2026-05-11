<script setup>
import { onMounted } from "vue";
import { useAppTheme } from "@/composables/useTheme";

// composable
const { loadTheme } = useAppTheme();

// load saat app start
onMounted(() => {
    loadTheme();
});
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>