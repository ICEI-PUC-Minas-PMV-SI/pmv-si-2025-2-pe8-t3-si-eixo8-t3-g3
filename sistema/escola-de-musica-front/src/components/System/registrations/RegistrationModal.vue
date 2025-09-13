<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type RegistrationForm from '@/interfaces/registration/registrationForm';
import type RegistrationDto from '@/interfaces/registration/registrationDto';
import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import axios from '@/services/axiosInstace';
import { useRegistrationStore } from '@/stores/registration';
import { useToastStore } from '@/stores/toast';
import { RegistrationStatus } from '@/interfaces/registration/registrationStatus';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const students = ref<StudentDto[]>([]);
const musicClasses = ref<MusicClassDto[]>([]);
const availableInstruments = ref<InstrumentDto[]>([]);

const registration = ref<RegistrationForm>({
  startDate: null,
  endDate: null,
  status: RegistrationStatus.PENDENTE,
  studentId: null,
  musicClassIds: [],
  instrumentIds: [],
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    registration.value = {
      startDate: null,
      endDate: null,
      status: RegistrationStatus.PENDENTE,
      studentId: null,
      musicClassIds: [],
      instrumentIds: [],
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedRegistration = useRegistrationStore().registration;
    if (selectedRegistration) {
      registration.value = {
        id: selectedRegistration.id,
        startDate: selectedRegistration.startDate,
        endDate: selectedRegistration.endDate,
        status: selectedRegistration.status,
        studentId: selectedRegistration.student.id,
        musicClassIds: selectedRegistration.musicClasses?.map(mc => mc.id) || [],
        instrumentIds: selectedRegistration.instruments?.map(i => i.id) || [],
      };
    }
  }
});

watch(() => registration.value.musicClassIds, (newIds, oldIds) => {
  const allInstruments: InstrumentDto[] = [];
  const selectedClasses = musicClasses.value.filter(mc => newIds.includes(mc.id));

  selectedClasses.forEach(mc => {
    if (mc.instruments) {
      allInstruments.push(...mc.instruments);
    }
  });

  const uniqueInstruments = Array.from(new Set(allInstruments.map(i => i.id)))
    .map(id => allInstruments.find(i => i.id === id)!);
  
  availableInstruments.value = uniqueInstruments;

  registration.value.instrumentIds = registration.value.instrumentIds.filter(id =>
    availableInstruments.value.some(inst => inst.id === id)
  );

}, { deep: true });

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
  { title: 'Vigente', value: 'VIGENTE' },
  { title: 'Inativa', value: 'INATIVA' },
  { title: 'Pendente', value: 'PENDENTE' },
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
      ? await axios.post('/registrations', registration.value)
      : await axios.put(`/registrations/${id}`, registration.value);

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
    const { data: studentsData }: { data: StudentDto[] } = await axios.get('/students');
    students.value = studentsData;

    const { data: classesData }: { data: MusicClassDto[] } = await axios.get('/music-classes');
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
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data de Início</div>
              <v-text-field
                v-model="registration.startDate"
                type="date"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data de Término</div>
              <v-text-field
                v-model="registration.endDate"
                type="date"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
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
              <div class="text-subtitle-1 text-medium-emphasis">Turmas</div>
              <v-select
                v-model="registration.musicClassIds"
                :items="musicClasses"
                placeholder="Selecione as turmas"
                variant="outlined"
                item-title="name"
                item-value="id"
                density="compact"
                multiple
                chips
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Instrumentos</div>
              <v-select
                v-model="registration.instrumentIds"
                :items="availableInstruments"
                placeholder="Selecione os instrumentos"
                variant="outlined"
                item-title="name"
                item-value="id"
                density="compact"
                multiple
                chips
                :disabled="props.mode === 'view' || registration.musicClassIds.length === 0"
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
