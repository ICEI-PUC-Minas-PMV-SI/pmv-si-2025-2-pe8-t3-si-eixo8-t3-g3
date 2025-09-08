<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type MusicClassForm from '@/interfaces/music-class/musicClassForm';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import axios from '@/services/axiosInstace';
import { useMusicClassStore } from '@/stores/musicClass';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const musicClass = ref<MusicClassForm>({
  name: null,
  description: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    musicClass.value = {
      name: null,
      description: null,
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedMusicClass = useMusicClassStore().musicClass;
    if (selectedMusicClass) {
      musicClass.value = { ...selectedMusicClass };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Nova Turma';
    case 'update': return 'Atualizar Turma';
    case 'view': return 'Visualizar Turma';
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
    const id = musicClass.value.id;
    const message = !id ? 'Turma criada com sucesso.' : 'Turma atualizada com sucesso.';
    const { data }: { data: MusicClassDto } = !id
      ? await axios.post('/music-class', musicClass.value)
      : await axios.put(`/music-class/${id}`, musicClass.value);

    const musicClassStore = useMusicClassStore();
    if (!id) musicClassStore.addMusicClass(data);
    else musicClassStore.updateMusicClass(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar turma.', type: 'error', color: 'red' });
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
                v-model="musicClass.name"
                density="compact"
                placeholder="Nome da Turma"
                prepend-inner-icon="mdi-music-circle-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Descrição</div>
              <v-textarea
                v-model="musicClass.description"
                density="compact"
                placeholder="Descrição da Turma"
                prepend-inner-icon="mdi-note-text-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
                rows="3"
              ></v-textarea>
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