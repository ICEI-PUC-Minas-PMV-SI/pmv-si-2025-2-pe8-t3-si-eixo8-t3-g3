<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type MusicClassForm from '@/interfaces/music-class/musicClassForm';
import type MusicClassDto from '@/interfaces/music-class/musicClassDto';
import type TeacherDto from '@/interfaces/teacher/teacherDto';
import type StudentDto from '@/interfaces/student/studentDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import axios from '@/services/axiosInstace';
import { useMusicClassStore } from '@/stores/musicClass';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const teachers = ref<TeacherDto[]>([]);
const students = ref<StudentDto[]>([]);
const availableInstruments = ref<InstrumentDto[]>([]);

const musicClass = ref<MusicClassForm>({
  name: null,
  teacherId: null,
  studentIds: [],
  instrumentIds: [],
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    musicClass.value = {
      name: null,
      teacherId: null,
      studentIds: [],
      instrumentIds: [],
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedMusicClass = useMusicClassStore().musicClass;
    if (selectedMusicClass) {
      musicClass.value = {
        id: selectedMusicClass.id,
        name: selectedMusicClass.name,
        teacherId: selectedMusicClass.teacher?.id || null,
        studentIds: selectedMusicClass.students?.map(s => s.id) || [],
        instrumentIds: selectedMusicClass.instruments?.map(i => i.id) || [],
      };
    }
  }
});

watch(() => musicClass.value.teacherId, (newTeacherId) => {
  if (newTeacherId) {
    const selectedTeacher = teachers.value.find(t => t.id === newTeacherId);
    if (selectedTeacher) {
      availableInstruments.value = selectedTeacher.instruments || [];
    } else {
      availableInstruments.value = [];
    }
  } else {
    availableInstruments.value = [];
  }
  musicClass.value.instrumentIds = [];
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
      ? await axios.post('/music-classes', musicClass.value)
      : await axios.put(`/music-classes/${id}`, musicClass.value);

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

async function fetchDependencies() {
  try {
    loading.value = true;
    const { data: teachersData }: { data: TeacherDto[] } = await axios.get('/teachers');
    teachers.value = teachersData;

    const { data: studentsData }: { data: StudentDto[] } = await axios.get('/students');
    students.value = studentsData;
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
              <div class="text-subtitle-1 text-medium-emphasis">Professor</div>
              <v-select
                v-model="musicClass.teacherId"
                :items="teachers"
                item-title="user.name"
                item-value="id"
                density="compact"
                placeholder="Selecione o professor"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>

            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Alunos</div>
              <v-select
                v-model="musicClass.studentIds"
                :items="students"
                item-title="user.name"
                item-value="id"
                density="compact"
                placeholder="Selecione os alunos"
                variant="outlined"
                multiple
                chips
                :disabled="props.mode === 'view'"
              ></v-select>
            </v-col>

            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Instrumentos</div>
              <v-select
                v-model="musicClass.instrumentIds"
                :items="availableInstruments"
                item-title="name"
                item-value="id"
                density="compact"
                placeholder="Selecione os instrumentos"
                variant="outlined"
                multiple
                chips
                :disabled="props.mode === 'view' || !musicClass.teacherId"
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
