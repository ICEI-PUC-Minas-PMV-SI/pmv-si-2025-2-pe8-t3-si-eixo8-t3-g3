<script setup lang="ts">
import { ref } from 'vue';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import InstrumentModal from './InstrumentModal.vue';
import axios from '@/services/axiosInstace';
import { useInstrumentStore } from '@/stores/instrument';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

const { instruments } = storeToRefs(useInstrumentStore());

const headers = ref([
  { title: 'Nome', key: 'name', align: 'start' as const },
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

function view(instrument: InstrumentDto) {
  useInstrumentStore().setInstrument(instrument);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(instrument: InstrumentDto) {
  useInstrumentStore().setInstrument(instrument);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(instrument: InstrumentDto) {
  try {
    loading.value = true;
    await axios.delete(`/instrument/${instrument.id}`);
    useInstrumentStore().deleteInstrument(instrument);
    useToastStore().showToast({ message: 'Instrumento deletado com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar instrumento.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getInstruments() {
  try {
    loading.value = true;
    const { data }: { data: InstrumentDto[] } = await axios.get('/instruments');
    useInstrumentStore().setInstruments(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getInstruments();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="instruments"
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
          Novo Instrumento
        </v-btn>
        <InstrumentModal
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