<script setup lang="ts">
import { ref } from 'vue';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';
import StudentModal from './StudentModal.vue';

const { students } = storeToRefs(useStudentStore());

const headers = ref([
  { title: 'Nome', key: 'user.name', align: 'start' as const },
  { title: 'E-mail', key: 'user.email', align: 'start' as const },
  { title: 'CPF', key: 'user.name.cpf', align: 'start' as const },
  { title: 'Telefone', key: 'user.name.cellphone', align: 'start' as const },
  { title: 'Matrícula', key: 'isEnrolled', align: 'start' as const },
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

function view(student: StudentDto) {
  useStudentStore().setStudent(student);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(student: StudentDto) {
  useStudentStore().setStudent(student);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(student: StudentDto) {
  try {
    loading.value = true;
    await axios.delete(`/students/${student.id}`);
    useStudentStore().deleteStudent(student);
    useToastStore().showToast({ message: 'Aluno deletado com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar aluno.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getStudents() {
  try {
    loading.value = true;
    const { data }: { data: StudentDto[] } = await axios.get('/students');
    useStudentStore().setStudents(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getStudents();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="students"
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
          Novo Aluno
        </v-btn>
        <StudentModal
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
    <template v-slot:item.user.cpf="{ item }">
      {{ item.user }}
    </template>
    <template v-slot:item.user.cellphone="{ item }">
      {{ item.user.cellphone }}
    </template>
    <template v-slot:item.registration.status="{ item }">
      <v-chip :color="item.registration?.status === 'ACTIVE' ? 'green' : 'red'">
        {{ item.registration?.status === 'ACTIVE' ? 'Ativo' : 'Inativo' }}
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