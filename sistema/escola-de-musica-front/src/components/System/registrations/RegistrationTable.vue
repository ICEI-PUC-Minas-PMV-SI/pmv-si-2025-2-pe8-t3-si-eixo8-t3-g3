<script setup lang="ts">
import { ref } from 'vue';
import type RegistrationDto from '@/interfaces/registration/registrationDto';
import RegistrationModal from './RegistrationModal.vue';
import axios from '@/services/axiosInstace';
import { useRegistrationStore } from '@/stores/registration'
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

const { registrations } = storeToRefs(useRegistrationStore());

const headers = ref([
  { title: 'Aluno', key: 'student.user.name', align: 'start' as const },
  { title: 'Turma', key: 'musicClass.name', align: 'start' as const },
  { title: 'Status', key: 'status', align: 'start' as const },
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

function view(registration: RegistrationDto) {
  useRegistrationStore().setRegistration(registration);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(registration: RegistrationDto) {
  useRegistrationStore().setRegistration(registration);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(registration: RegistrationDto) {
  try {
    loading.value = true;
    await axios.delete(`/registration/${registration.id}`);
    useRegistrationStore().deleteRegistration(registration);
    useToastStore().showToast({ message: 'Matrícula deletada com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar matrícula.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getRegistrations() {
  try {
    loading.value = true;
    const { data }: { data: RegistrationDto[] } = await axios.get('/registration');
    useRegistrationStore().setRegistrations(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getRegistrations();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="registrations"
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
          Nova Matrícula
        </v-btn>
        <RegistrationModal
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
    <template v-slot:item.status="{ item }">
      <v-chip :color="item.status === 'ACTIVE' ? 'green' : 'red'">
        {{ item.status === 'ACTIVE' ? 'Ativo' : 'Inativo' }}
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