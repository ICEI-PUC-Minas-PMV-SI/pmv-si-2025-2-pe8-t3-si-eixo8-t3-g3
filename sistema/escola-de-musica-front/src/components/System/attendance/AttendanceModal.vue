<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type AttendanceForm from '@/interfaces/attendance/attendanceForm';
import type AttendanceDto from '@/interfaces/attendance/attendanceDto';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { useAttendanceStore } from '@/stores/attendance';
import { useToastStore } from '@/stores/toast';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

// Dados da store para os seletores
const students = ref<StudentDto[]>([]);
const musicClasses = ref<MusicClassDto[]>([]);

const attendance = ref<AttendanceForm>({
  date: null,
  status: 'PRESENT',
  studentId: null,
  musicClassId: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    attendance.value = {
      date: null,
      status: 'PRESENT',
      studentId: null,
      musicClassId: null,
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedAttendance = useAttendanceStore().attendance;
    if (selectedAttendance) {
      attendance.value = {
        id: selectedAttendance.id,
        date: selectedAttendance.date,
        status: selectedAttendance.status,
        studentId: selectedAttendance.student.id,
        musicClassId: selectedAttendance.musicClass.id,
      };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Nova Frequência';
    case 'update': return 'Atualizar Frequência';
    case 'view': return 'Visualizar Frequência';
    default: return '';
  }
});

const statusOptions = ref([
  { title: 'Presente', value: 'PRESENT' },
  { title: 'Ausente', value: 'ABSENT' },
  { title: 'Falta Justificada', value: 'JUSTIFIED_ABSENCE' },
]);

function close() {
  emit('close');
}

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  try {
    loading.value = true;
    const id = attendance.value.id;
    const message = !id ? 'Frequência registrada com sucesso.' : 'Frequência atualizada com sucesso.';
    const { data }: { data: AttendanceDto } = !id
      ? await axios.post('/attendance', attendance.value)
      : await axios.put(`/attendance/${id}`, attendance.value);

    const attendanceStore = useAttendanceStore();
    if (!id) attendanceStore.addAttendance(data);
    else attendanceStore.updateAttendance(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar frequência.', type: 'error', color: 'red' });
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
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Aluno</div>
              <v-select
                v-model="attendance.studentId"
                :items="students"
                placeholder="Selecione o aluno"
                variant="outlined"
                item-title="user.name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Turma</div>
              <v-select
                v-model="attendance.musicClassId"
                :items="musicClasses"
                placeholder="Selecione a turma"
                variant="outlined"
                item-title="name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data</div>
              <v-text-field
                v-model="attendance.date"
                type="date"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Status</div>
              <v-select
                v-model="attendance.status"
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