<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type InstrumentForm from '@/interfaces/instrument/instrumentForm';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import axios from '@/services/axiosInstace';
import { useInstrumentStore } from '@/stores/instrument';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const instrument = ref<InstrumentForm>({
  name: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    instrument.value = { name: null };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedInstrument = useInstrumentStore().instrument;
    if (selectedInstrument) {
      instrument.value = { ...selectedInstrument };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Novo Instrumento';
    case 'update': return 'Atualizar Instrumento';
    case 'view': return 'Visualizar Instrumento';
    default: return '';
  }
});

function close() {
  emit('close');
}

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  try {
    loading.value = true;
    const id = instrument.value.id;
    const message = !id ? 'Instrumento criado com sucesso.' : 'Instrumento atualizado com sucesso.';
    const { data }: { data: InstrumentDto } = !id
      ? await axios.post('/instruments', instrument.value)
      : await axios.put(`/instruments/${id}`, instrument.value);

    const instrumentStore = useInstrumentStore();
    if (!id) instrumentStore.addInstrument(data);
    else instrumentStore.updateInstrument(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar instrumento.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="props.showModal" max-width="550px">
    <v-card :loading="loading">
      <v-card-title>
        <span class="text-h5">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Nome</div>
              <v-text-field
                v-model="instrument.name"
                density="compact"
                placeholder="Nome do Instrumento"
                prepend-inner-icon="mdi-piano"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="save"
          v-if="props.mode !== 'view'"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>