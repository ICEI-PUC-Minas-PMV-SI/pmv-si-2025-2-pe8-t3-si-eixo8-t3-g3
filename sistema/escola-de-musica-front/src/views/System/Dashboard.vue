<script setup lang="ts">
import BarChart from '@/components/System/dashboard/BarChart.vue';
import { ref, onMounted } from 'vue';
import axios from '@/services/axiosInstace';

const metrics = ref<any[]>([]);
const newStudentsData = ref<number[]>([]);
const months = ref<string[]>([]);
const recentEvents = ref<any[]>([]);
const loading = ref(true);

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    
    const metricsResponse = await axios.get('/dashboard/metrics');
    metrics.value = [
      { title: 'Total de Alunos', value: metricsResponse.data.totalStudents, icon: 'mdi-account-group', color: 'blue-grey' },
      { title: 'Total de Professores', value: metricsResponse.data.totalTeachers, icon: 'mdi-human-male-board', color: 'green' },
      { title: 'Total de Turmas', value: metricsResponse.data.totalMusicClasses, icon: 'mdi-calendar-month', color: 'orange' },
      { title: 'Pagamentos Pendentes', value: metricsResponse.data.pendingPayments, icon: 'mdi-cash-multiple', color: 'red' },
    ];

    const studentsDataResponse = await axios.get('/dashboard/students-by-month');
    newStudentsData.value = studentsDataResponse.data.series;
    months.value = studentsDataResponse.data.categories;

    const eventsResponse = await axios.get('/dashboard/events');
    recentEvents.value = eventsResponse.data;

  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <v-container>
    <v-card class="mr-3 pa-5" max-width="1100" :loading="loading">
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
                v-for="(event, index) in recentEvents"
                :key="index"
                :prepend-icon="event.icon"
                :title="event.title"
                :subtitle="event.subtitle"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
