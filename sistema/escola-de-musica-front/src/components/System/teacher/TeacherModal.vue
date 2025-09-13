<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type TeacherForm from '@/interfaces/teacher/teacherForm';
import type TeacherDto from '@/interfaces/teacher/teacherDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import axios from '@/services/axiosInstace';
import { useTeacherStore } from '@/stores/teacher';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const teacher = ref<TeacherForm>({
  name: null,
  email: null,
  password: null,
  cellphone: null,
  cpf: null,
  hireDate: null,
  instrumentIds: [],
});

const availableInstruments = ref<InstrumentDto[]>([]);

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    teacher.value = {
      name: null,
      email: null,
      password: null,
      cellphone: null,
      cpf: null,
      hireDate: null,
      instrumentIds: [],
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedTeacher = useTeacherStore().teacher;
    if (selectedTeacher) {
      teacher.value = { 
        password: null,
        cellphone: selectedTeacher.user.cellphone,
        cpf: selectedTeacher.user.cpf,
        hireDate: selectedTeacher.hireDate,
        name: selectedTeacher.user.name, 
        email: selectedTeacher.user.email,
        instrumentIds: selectedTeacher.instruments?.map(instrument => instrument.id) || []
      };
    }
  }
});

const visible = ref(false);
const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Novo Professor';
    case 'update': return 'Atualizar Professor';
    case 'view': return 'Visualizar Professor';
    default: return '';
  }
});

function close() {
  emit('close');
}

async function loadInstruments() {
  try {
    const { data }: { data: InstrumentDto[] } = await axios.get('/instruments');
    availableInstruments.value = data;
  } catch (err) {
    console.error('Erro ao carregar instrumentos:', err);
  }
}

onMounted(() => {
  loadInstruments();
});

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  try {
    loading.value = true;
    const id = teacher.value.id;
    const message = !id ? 'Professor cadastrado com sucesso.' : 'Professor atualizado com sucesso.';
    
    const teacherData = {
      name: teacher.value.name,
      email: teacher.value.email,
      password: teacher.value.password,
      cellphone: teacher.value.cellphone,
      cpf: teacher.value.cpf,
      hireDate: teacher.value.hireDate,
      instrumentIds: teacher.value.instrumentIds || []
    };

    const { data }: { data: TeacherDto } = !id
      ? await axios.post('/teachers', teacherData)
      : await axios.patch(`/teachers/${id}`, teacherData);

    const teacherStore = useTeacherStore();
    if (!id) teacherStore.addTeacher(data);
    else teacherStore.updateTeacher(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar professor.', type: 'error', color: 'red' });
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
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">Nome</div>
              <v-text-field
                v-model="teacher.name"
                density="compact"
                placeholder="Nome do Professor"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">E-mail</div>
              <v-text-field
                v-model="teacher.email"
                density="compact"
                placeholder="Endereço de E-mail"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">Telefone</div>
              <v-text-field
                v-model="teacher.cellphone"
                density="compact"
                placeholder="Seu telefone"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">CPF</div>
              <v-text-field
                v-model="teacher.cpf"
                density="compact"
                placeholder="Seu CPF"
                prepend-inner-icon="mdi-card-account-details-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">Data de Contratação</div>
              <v-text-field
                v-model="teacher.hireDate"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar-range"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Senha
              </div>
              <v-text-field
                v-model="teacher.password"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Insira a senha"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
                @click:append-inner="visible = !visible"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Instrumentos</div>
              <v-select
                v-model="teacher.instrumentIds"
                :items="availableInstruments"
                item-title="name"
                item-value="id"
                label="Selecione os instrumentos"
                multiple
                density="compact"
                prepend-inner-icon="mdi-piano"
                variant="outlined"
                :disabled="props.mode === 'view'"
                hint="Selecione os instrumentos que o professor ensina"
                persistent-hint
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