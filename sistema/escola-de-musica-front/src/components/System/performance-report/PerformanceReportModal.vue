<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type PerformanceReportForm from '@/interfaces/performance-report/performanceReportForm';
import type PerformanceReportDto from '@/interfaces/performance-report/performanceReportDto';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { usePerformanceReportStore } from '@/stores/performanceReport';
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

const performanceReport = ref<PerformanceReportForm>({
  grade: null,
  notes: null,
  reportDate: null,
  studentId: null,
  musicClassId: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    performanceReport.value = {
      grade: null,
      notes: null,
      reportDate: null,
      studentId: null,
      musicClassId: null,
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedReport = usePerformanceReportStore().performanceReport;
    if (selectedReport) {
      performanceReport.value = {
        id: selectedReport.id,
        grade: selectedReport.grade,
        notes: selectedReport.notes,
        reportDate: selectedReport.reportDate,
        studentId: selectedReport.student.id,
        musicClassId: selectedReport.musicClass.id,
      };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Novo Relatório de Desempenho';
    case 'update': return 'Atualizar Relatório de Desempenho';
    case 'view': return 'Visualizar Relatório de Desempenho';
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
    const id = performanceReport.value.id;
    const message = !id ? 'Relatório criado com sucesso.' : 'Relatório atualizado com sucesso.';
    const { data }: { data: PerformanceReportDto } = !id
      ? await axios.post('/performance-report', performanceReport.value)
      : await axios.put(`/performance-report/${id}`, performanceReport.value);

    const performanceReportStore = usePerformanceReportStore();
    if (!id) performanceReportStore.addPerformanceReport(data);
    else performanceReportStore.updatePerformanceReport(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar relatório.', type: 'error', color: 'red' });
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
                v-model="performanceReport.studentId"
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
                v-model="performanceReport.musicClassId"
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
              <div class="text-subtitle-1 text-medium-emphasis">Nota</div>
              <v-text-field
                v-model="performanceReport.grade"
                type="number"
                density="compact"
                placeholder="Nota (0.0 a 10.0)"
                prepend-inner-icon="mdi-star"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data do Relatório</div>
              <v-text-field
                v-model="performanceReport.reportDate"
                type="date"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Observações</div>
              <v-textarea
                v-model="performanceReport.notes"
                density="compact"
                placeholder="Observações sobre o desempenho"
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