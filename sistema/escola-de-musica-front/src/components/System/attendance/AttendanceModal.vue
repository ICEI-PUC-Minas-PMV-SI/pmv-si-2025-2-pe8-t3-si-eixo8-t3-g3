<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type AttendanceForm from '@/interfaces/attendance/attendanceForm';
import type AttendanceDto from '@/interfaces/attendance/attendanceDto';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { useAttendanceStore } from '@/stores/attendance';
import { useToastStore } from '@/stores/toast';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import { AttendanceStatus } from '@/interfaces/attendance/attendanceStatus';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const students = ref<StudentDto[]>([]);
const musicClasses = ref<MusicClassDto[]>([]);

const attendance = ref<AttendanceForm>({
  date: null,
  status: AttendanceStatus.PRESENT,
  notes: null,
  studentId: null,
  musicClassId: null,
});

const formValid = ref(false);
const formRef = ref<any>(null);

const showNotesField = computed(() => {
  return attendance.value.status === 'FALTA_JUSTIFICADA';
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    attendance.value = {
      date: new Date().toISOString().split('T')[0],
      status: AttendanceStatus.PRESENT,
      notes: null,
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
        notes: selectedAttendance.notes || null,
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
  { title: 'Presente', value: AttendanceStatus.PRESENT },
  { title: 'Ausente', value: AttendanceStatus.ABSENT },
  { title: 'Falta Justificada', value: AttendanceStatus.JUSTIFIED_ABSENCE },
]);

function close() {
  emit('close');
}

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  if (!attendance.value.studentId || !attendance.value.musicClassId || !attendance.value.date) {
    useToastStore().showToast({ message: 'Por favor, preencha todos os campos obrigatórios.', type: 'error', color: 'red' });
    return;
  }
  
  if (showNotesField.value && !attendance.value.notes) {
      useToastStore().showToast({ message: 'Por favor, adicione uma observação para a falta justificada.', type: 'error', color: 'red' });
      return;
  }

  try {
    loading.value = true;
    const id = attendance.value.id;
    const message = !id ? 'Frequência registrada com sucesso.' : 'Frequência atualizada com sucesso.';
    
    const payload = { ...attendance.value };

    const { data }: { data: AttendanceDto } = !id
      ? await axios.post('/attendances', payload)
      : await axios.put(`/attendances/${id}`, payload);

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
            <v-col v-if="showNotesField" class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Observações</div>
              <v-textarea
                v-model="attendance.notes"
                placeholder="Descreva o motivo da falta"
                variant="outlined"
                density="compact"
                rows="2"
                :disabled="props.mode === 'view'"
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
