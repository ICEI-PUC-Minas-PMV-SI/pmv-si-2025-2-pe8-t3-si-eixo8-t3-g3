<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type StudentForm from '@/interfaces/student/studentForm';
import axios from '@/services/axiosInstace';
import { useStudentStore } from '@/stores/student'
import type StudentDto from '@/interfaces/student/studentDto';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean,
  mode: 'view' | 'update' | 'create' | null
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const student = ref<StudentForm>({
  name: null,
  email: null,
  password: null,
  cellphone: null,
  cpf: null,
  isEnrolled: false,
  registration: {
    status: 'INACTIVE',
    studentId: null,
    musicClassId: null
  }
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
  } else if (newMode === 'update' || newMode === 'view') {
    const storeStudent = useStudentStore().student;
    if (storeStudent) {
      student.value = {
        id: storeStudent.id,
        name: storeStudent.user?.name ?? null,
        email: storeStudent.user?.email ?? null,
        password: null,
        cellphone: storeStudent.cellphone ?? null,
        cpf: storeStudent.cpf ?? null,
        isEnrolled: storeStudent.isEnrolled,
        registration: {
          status: 'INACTIVE',
          studentId: null,
          musicClassId: null
        }
      };
    }
  }
});

const visible = ref(false);
const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Novo Aluno';
    case 'update': return 'Atualizar Aluno';
    case 'view': return 'Visualizar Aluno';
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
    const id = student.value.id;
    const message = !id ? 'Aluno cadastrado com sucesso.' : 'Aluno atualizado com sucesso.';
    const { data }: { data: StudentDto } = !id
      ? await axios.post('/students', student.value)
      : await axios.put(`/students/${id}`, student.value);

    if (!id) useStudentStore().addStudent(data);
    else useStudentStore().updateStudent(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar aluno.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog
    v-model="props.showModal"
    max-width="550px"
  >
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
                v-model="student.name"
                density="compact"
                placeholder="Nome do Aluno"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis">E-mail</div>
              <v-text-field
                v-model="student.email"
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
                v-model="student.cellphone"
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
                v-model="student.cpf"
                density="compact"
                placeholder="CPF"
                prepend-inner-icon="mdi-card-account-details-outline"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="12" sm="12">
              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Senha
              </div>
              <v-text-field
                v-model="student.password"
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
          Cancel
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>