<script setup lang="ts">
import { ref } from 'vue';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import axios from '@/services/axiosInstace';
import { useMusicClassStore } from '@/stores/musicClass';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';
import MusicClassModal from './MusicClassModal.vue';

const { musicClasses } = storeToRefs(useMusicClassStore());

const headers = ref([
  { title: 'Nome', key: 'name', align: 'start' as const },
  { title: 'Descrição', key: 'description', align: 'start' as const },
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

function view(musicClass: MusicClassDto) {
  useMusicClassStore().setMusicClass(musicClass);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(musicClass: MusicClassDto) {
  useMusicClassStore().setMusicClass(musicClass);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(musicClass: MusicClassDto) {
  try {
    loading.value = true;
    await axios.delete(`/music-classes/${musicClass.id}`);
    useMusicClassStore().deleteMusicClass(musicClass);
    useToastStore().showToast({ message: 'Turma deletada com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar turma.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getMusicClasses() {
  try {
    loading.value = true;
    const { data }: { data: MusicClassDto[] } = await axios.get('/music-classes');
    useMusicClassStore().setMusicClasses(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getMusicClasses();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="musicClasses"
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
          Nova Turma
        </v-btn>
        <MusicClassModal
          :mode="modalMode"
          :showModal="showModal"
          @close="closeModal"
        />
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
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