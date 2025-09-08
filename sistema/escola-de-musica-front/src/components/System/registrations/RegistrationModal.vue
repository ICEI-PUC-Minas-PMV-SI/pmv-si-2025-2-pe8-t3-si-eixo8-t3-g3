<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type RegistrationForm from '@/interfaces/registration/registrationForm';
import type RegistrationDto from '@/interfaces/registration/registrationDto';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { useRegistrationStore } from '@/stores/registration';
import { useToastStore } from '@/stores/toast';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

// Dados da store
const students = ref<StudentDto[]>([]);
const musicClasses = ref<MusicClassDto[]>([]);

const registration = ref<RegistrationForm>({
  studentId: null,
  musicClassId: null,
  status: 'ACTIVE',
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    registration.value.studentId = null;
    registration.value.musicClassId = null;
    registration.value.status = 'ACTIVE';
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedRegistration = useRegistrationStore().registration;
    if (selectedRegistration) {
      registration.value = {
        id: selectedRegistration.id,
        studentId: selectedRegistration.student.id,
        musicClassId: selectedRegistration.musicClass.id,
        status: selectedRegistration.status,
      };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Nova Matrícula';
    case 'update': return 'Atualizar Matrícula';
    case 'view': return 'Visualizar Matrícula';
    default: return '';
  }
});

const statusOptions = ref([
  { title: 'Ativo', value: 'ACTIVE' },
  { title: 'Inativo', value: 'INACTIVE' },
]);

function close() {
  emit('close');
}

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  try {
    loading.value = true;
    const id = registration.value.id;
    const message = !id ? 'Matrícula criada com sucesso.' : 'Matrícula atualizada com sucesso.';
    const { data }: { data: RegistrationDto } = !id
      ? await axios.post('/registration', registration.value)
      : await axios.put(`/registration/${id}`, registration.value);

    const registrationStore = useRegistrationStore();
    if (!id) registrationStore.addRegistration(data);
    else registrationStore.updateRegistration(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar matrícula.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

async function fetchDependencies() {
  try {
    loading.value = true;
    const { data: studentsData }: { data: StudentDto[] } = await axios.get('/student');
    students.value = studentsData;

    const { data: classesData }: { data: MusicClassDto[] } = await axios.get('/music-class');
    musicClasses.value = classesData;
  } catch (err) {
    console.error('Erro ao buscar dependências:', err);
  } finally {
    loading.value = false;
  }
}

fetchDependencies();
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
              <div class="text-subtitle-1 text-medium-emphasis">Aluno</div>
              <v-select
                v-model="registration.studentId"
                :items="students"
                placeholder="Selecione o aluno"
                variant="outlined"
                item-title="user.name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view' || props.mode === 'update'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Turma</div>
              <v-select
                v-model="registration.musicClassId"
                :items="musicClasses"
                placeholder="Selecione a turma"
                variant="outlined"
                item-title="name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view' || props.mode === 'update'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Status</div>
              <v-select
                v-model="registration.status"
                :items="statusOptions"
                placeholder="Selecione o status"
                variant="outlined"
                density="compact"
                :disabled="props.mode === 'view'"
              ></v-select>
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