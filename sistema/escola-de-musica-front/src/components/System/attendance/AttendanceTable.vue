<script setup lang="ts">
import { ref } from 'vue';
import type AttendanceDto from '@/interfaces/attendance/attendanceDto';
import AttendanceModal from './AttendanceModal.vue';
import axios from '@/services/axiosInstace';
import { useAttendanceStore } from '@/stores/attendance';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

const { attendances } = storeToRefs(useAttendanceStore());

const headers = ref([
  { title: 'Aluno', key: 'student.user.name', align: 'start' as const },
  { title: 'Turma', key: 'musicClass.name', align: 'start' as const },
  { title: 'Data', key: 'date', align: 'start' as const },
  { title: 'Status', key: 'status', align: 'start' as const },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]);

const loading = ref(false);
const showModal = ref(false);
const modalMode = ref<'view' | 'update' | 'create' | null>(null);
const search = ref<string | null>();

function getColor(status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED_ABSENCE') {
  if (status === 'PRESENT') return 'green';
  if (status === 'ABSENT') return 'red';
  return 'orange';
}

function create() {
  modalMode.value = 'create';
  showModal.value = true;
}

function view(attendance: AttendanceDto) {
  useAttendanceStore().setAttendance(attendance);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(attendance: AttendanceDto) {
  useAttendanceStore().setAttendance(attendance);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(attendance: AttendanceDto) {
  try {
    loading.value = true;
    await axios.delete(`/attendance/${attendance.id}`);
    useAttendanceStore().deleteAttendance(attendance);
    useToastStore().showToast({ type: 'success', message: 'Frequência deletada com sucesso.', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ type: 'error', message: 'Erro ao deletar frequência.', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getAttendances() {
  try {
    loading.value = true;
    const { data }: { data: AttendanceDto[] } = await axios.get('/attendance');
    useAttendanceStore().setAttendances(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getAttendances();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="attendances"
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
          Nova Frequência
        </v-btn>
        <AttendanceModal
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
    <template v-slot:item.musicClass.name="{ item }">
      {{ item.musicClass.name }}
    </template>
    <template v-slot:item.date="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)">
        {{ item.status }}
      </v-chip>
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