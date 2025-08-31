<script setup lang="ts">
import BarChart from '@/components/System/dashboard/BarChart.vue';
import { ref } from 'vue';

// Dados mockados para o dashboard. 
const metrics = ref([
  { title: 'Total de Alunos', value: 150, icon: 'mdi-account-group', color: 'blue-grey' },
  { title: 'Total de Professores', value: 12, icon: 'mdi-human-male-board', color: 'green' },
  { title: 'Aulas Agendadas', value: 45, icon: 'mdi-calendar-month', color: 'orange' },
  { title: 'Pagamentos Pendentes', value: 7, icon: 'mdi-cash-multiple', color: 'red' },
]);

// Dados do gráfico: novos alunos nos últimos 6 meses
const newStudentsData = ref([20, 45, 60, 50, 80, 75]);
const months = ref(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']);
</script>

<template>
  <v-container>
    <v-card class="mr-3 pa-5" max-width="1100">
      <v-row class="mb-5">
        <v-col
          v-for="(metric, index) in metrics"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            :color="metric.color"
            theme="dark"
            elevation="4"
            class="pa-4 text-center d-flex align-center h-100"
          >
            <v-icon size="48" class="mr-3">{{ metric.icon }}</v-icon>
            <div>
              <div class="text-h6">{{ metric.title }}</div>
              <div class="text-h4">{{ metric.value }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Novos Alunos por Mês</v-card-title>
            <v-card-text>
              <BarChart :series-data="newStudentsData" :categories="months" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Avisos e Notificações</v-card-title>
            <v-list density="compact">
              <v-list-item
                prepend-icon="mdi-alert-circle-outline"
                title="Novo aluno matriculado: João Silva"
                subtitle="Matrícula para aula de violão."
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-cash-remove"
                title="Pagamento pendente: Maria Clara"
                subtitle="Mensalidade de outubro em atraso."
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-calendar-check"
                title="Aula de piano agendada"
                subtitle="Prof. Ana para 15:00 na sala 3."
              ></v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>