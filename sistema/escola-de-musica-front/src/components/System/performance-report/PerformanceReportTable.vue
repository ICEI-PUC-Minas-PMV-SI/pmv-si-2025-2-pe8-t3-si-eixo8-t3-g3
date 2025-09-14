<script setup lang="ts">
import { ref } from 'vue';
import type PerformanceReportDto from '@/interfaces/performance-report/performanceReportDto';
import PerformanceReportModal from './PerformanceReportModal.vue';
import axios from '@/services/axiosInstace';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

const { performanceReports } = storeToRefs(usePerformanceReportStore());

const headers = ref([
  { title: 'Aluno', key: 'student.user.name', align: 'start' as const },
  { title: 'Instrumento', key: 'instrument.name', align: 'start' as const },
  { title: 'Músicas Aprendidas', key: 'numberOfSongsLearned', align: 'start' as const },
  { title: 'Data de Criação', key: 'createdAt', align: 'start' as const },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]);

const loading = ref(false);
const showModal = ref(false);
const modalMode = ref<'view' | 'update' | 'create' | null>(null);
const search = ref<string | null>();

function create() {
  modalMode.value = 'create';
  showModal.value = true;
}

function view(report: PerformanceReportDto) {
  usePerformanceReportStore().setPerformanceReport(report);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(report: PerformanceReportDto) {
  usePerformanceReportStore().setPerformanceReport(report);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(report: PerformanceReportDto) {
  try {
    loading.value = true;
    await axios.delete(`/performance-reports/${report.id}`);
    usePerformanceReportStore().deletePerformanceReport(report);
    useToastStore().showToast({ message: 'Relatório deletado com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar relatório.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getPerformanceReports() {
  try {
    loading.value = true;
    const { data }: { data: PerformanceReportDto[] } = await axios.get('/performance-reports');
    usePerformanceReportStore().setPerformanceReports(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getPerformanceReports();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="performanceReports"
    :loading="loading"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        rounded
      >
        <v-toolbar-title>
          <v-text-field
            v-model="search"
            placeholder="Pesquisar"
            prepend-icon="mdi-magnify"
            clearable
            density="compact"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-toolbar-title>

        <v-divider class="mx-4" inset vertical />
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          dark
          @click="create"
        >
          <v-icon icon="mdi-plus" />
          Novo Relatório
        </v-btn>
        <PerformanceReportModal
          :mode="modalMode"
          :showModal="showModal"
          @close="closeModal"
        />
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.student.user.name="{ item }">
      {{ item.student.user.name }}
    </template>
    <template v-slot:item.instrument.name="{ item }">
      {{ item.instrument.name }}
    </template>
    <template v-slot:item.numberOfSongsLearned="{ value }">
      {{ value }}
    </template>
    <template v-slot:item.createdAt="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        color="blue-darken-1"
        icon="mdi-eye"
        @click="view(item)"
      />
      <v-icon
        class="me-2"
        size="small"
        color="yellow-darken-3"
        icon="mdi-pencil"
        @click="update(item)"
      />
      <v-icon
        size="small"
        color="red-darken-2"
        icon="mdi-delete"
        @click="remove(item)"
      />
    </template>
  </v-data-table>
</template>