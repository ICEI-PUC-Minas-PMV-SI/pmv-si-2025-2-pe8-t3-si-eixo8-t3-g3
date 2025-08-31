<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { VCard, VList, VListItem, VListItemTitle, VIcon, VBtn, VContainer, VRow, VCol, VImg, VDivider } from 'vuetify/components';

// Computed properties for colors based on theme
const appLoginColor = computed(() => {
  return useThemeStore().theme === 'light' ? 'bg-orange-darken-1' : 'bg-orange-darken-2';
});
const hoverBtnColor = computed(() => {
  return useThemeStore().theme === 'light' ? 'custom-hover-btn-light' : 'custom-hover-btn-dark';
});

// Updated list of services for the music school system
const services = ref([
  { text: 'Gerenciamento de alunos e professores', icon: 'mdi-account-group' },
  { text: 'Controle de aulas e calendário', icon: 'mdi-calendar-month' },
  { text: 'Registro de presença', icon: 'mdi-clipboard-list' },
  { text: 'Gestão financeira de mensalidades', icon: 'mdi-cash-multiple' },
  { text: 'Relatórios de desempenho do aluno', icon: 'mdi-chart-line' },
  { text: 'Catálogo de instrumentos', icon: 'mdi-guitar-acoustic' },
  { text: 'Matrícula online simplificada', icon: 'mdi-certificate' },
]);
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <v-row>
      <v-col sm="12" md="7">
        <h1 class="text-h3 mb-4">Bem-vindo ao Sistema de Gestão da Escola de Música</h1>
        <p class="text-h6 mb-6">Administre sua escola com facilidade, focando no que realmente importa: a música!</p>
        <v-img
          width="600"
          class="rounded-lg"
          aspect-ratio="16/9"
          cover
          src="https://images.unsplash.com/photo-1510915364843-c0d15e444439?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </v-col>
      <v-col sm="12" md="5">
        <v-card class="h-100 pa-4 d-flex flex-column justify-space-between">
          <div>
            <h2>O que você vai gerenciar?</h2>
            <v-list density="compact" disabled>
              <v-list-item
                v-for="(item, i) in services"
                :key="i"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon" color="primary" style="opacity: 1;"></v-icon>
                </template>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
          <v-divider class="my-4"></v-divider>
          <div>
            <h2 class="mb-5">Tudo em um só lugar. Comece agora!</h2>
            <div class="d-flex justify-center">
              <v-btn to="/signup" :style="{ textTransform: 'none' }" :class="[appLoginColor, hoverBtnColor]" class="flex-grow-1">
                Criar conta
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
