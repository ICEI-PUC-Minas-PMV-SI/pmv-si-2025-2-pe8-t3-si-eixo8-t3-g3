<script setup lang="ts">
import { ref } from 'vue';
import type TeacherDto from '@/interfaces/teacher/teacherDto';
import TeacherModal from './TeacherModal.vue';
import axios from '@/services/axiosInstace';
import { useTeacherStore } from '@/stores/teacher';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

const { teachers } = storeToRefs(useTeacherStore());

const headers = ref([
  { title: 'Nome', key: 'user.name', align: 'start' as const },
  { title: 'E-mail', key: 'user.email', align: 'start' as const },
  { title: 'CPF', key: 'user.cpf', align: 'start' as const },
  { title: 'Telefone', key: 'user.cellphone', align: 'start' as const },
  { title: 'Data de Contratação', key: 'hireDate', align: 'start' as const },
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

function view(teacher: TeacherDto) {
  useTeacherStore().setTeacher(teacher);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(teacher: TeacherDto) {
  useTeacherStore().setTeacher(teacher);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(teacher: TeacherDto) {
  try {
    loading.value = true;
    await axios.delete(`/teacher/${teacher.id}`);
    useTeacherStore().deleteTeacher(teacher);
    useToastStore().showToast({ message: 'Professor deletado com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar professor.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getTeachers() {
  try {
    loading.value = true;
    const { data }: { data: TeacherDto[] } = await axios.get('/teachers');
    useTeacherStore().setTeachers(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getTeachers();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="teachers"
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
          Novo Professor
        </v-btn>
        <TeacherModal
          :mode="modalMode"
          :showModal="showModal"
          @close="closeModal"
        />
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.user.name="{ item }">
      {{ item.user.name }}
    </template>
    <template v-slot:item.user.email="{ item }">
      {{ item.user.email }}
    </template>
    <template v-slot:item.cpf="{ value }">
      {{ value }}
    </template>
    <template v-slot:item.cellphone="{ value }">
      {{ value }}
    </template>
    <template v-slot:item.hireDate="{ value }">
      {{ value }}
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