<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type PerformanceReportForm from '@/interfaces/performance-report/performanceReportForm';
import type PerformanceReportDto from '@/interfaces/performance-report/performanceReportDto';
import type StudentDto from '@/interfaces/student/studentDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import axios from '@/services/axiosInstace';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const students = ref<StudentDto[]>([]);
const instruments = ref<InstrumentDto[]>([]);

const performanceReport = ref<PerformanceReportForm>({
  numberOfSongsLearned: null,
  notes: null,
  studentId: null,
  instrumentId: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    performanceReport.value = {
      numberOfSongsLearned: null,
      notes: null,
      studentId: null,
      instrumentId: null,
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedReport = usePerformanceReportStore().performanceReport;
    if (selectedReport) {
      performanceReport.value = {
        id: selectedReport.id,
        numberOfSongsLearned: selectedReport.numberOfSongsLearned,
        notes: selectedReport.notes,
        studentId: selectedReport.student.id,
        instrumentId: selectedReport.instrument.id,
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
    const payload = { ...performanceReport.value, numberOfSongsLearned: (typeof performanceReport.value.numberOfSongsLearned === 'string') ? parseInt(performanceReport.value.numberOfSongsLearned) : performanceReport.value.numberOfSongsLearned}
    const message = !id ? 'Relatório criado com sucesso.' : 'Relatório atualizado com sucesso.';
    const { data }: { data: PerformanceReportDto } = !id
      ? await axios.post('/performance-reports', payload)
      : await axios.put(`/performance-reports/${id}`, payload);

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
    const { data: studentsData }: { data: StudentDto[] } = await axios.get('/students');
    students.value = studentsData;

    const { data: instrumentsData }: { data: InstrumentDto[] } = await axios.get('/instruments');
    instruments.value = instrumentsData;
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
              <div class="text-subtitle-1 text-medium-emphasis">Instrumento</div>
              <v-select
                v-model="performanceReport.instrumentId"
                :items="instruments"
                placeholder="Selecione o instrumento"
                variant="outlined"
                item-title="name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Músicas Aprendidas</div>
              <v-text-field
                v-model="performanceReport.numberOfSongsLearned"
                type="number"
                density="compact"
                placeholder="Número de músicas aprendidas"
                prepend-inner-icon="mdi-music"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data do Relatório</div>
              <v-text-field
                :value="new Date().toLocaleDateString()"
                type="text"
                density="compact"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                disabled
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