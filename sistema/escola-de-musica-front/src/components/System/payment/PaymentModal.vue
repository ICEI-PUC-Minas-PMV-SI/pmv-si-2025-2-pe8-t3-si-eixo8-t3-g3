<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type PaymentForm from '@/interfaces/payment/paymentForm';
import type PaymentDto from '@/interfaces/payment/paymentDto';
import type StudentDto from '@/interfaces/student/studentDto';
import axios from '@/services/axiosInstace';
import { usePaymentStore } from '@/stores/payment';
import { useToastStore } from '@/stores/toast';

const props = defineProps<{
  showModal: boolean;
  mode: 'view' | 'update' | 'create' | null;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

// Dados da store para o seletor de alunos
const students = ref<StudentDto[]>([]);

const payment = ref<PaymentForm>({
  amount: null,
  paymentDate: null,
  status: 'PAID',
  studentId: null,
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    payment.value = {
      amount: null,
      paymentDate: null,
      status: 'PAID',
      studentId: null,
    };
  } else if (newMode === 'update' || newMode === 'view') {
    const selectedPayment = usePaymentStore().payment;
    if (selectedPayment) {
      payment.value = {
        id: selectedPayment.id,
        amount: selectedPayment.amount,
        paymentDate: selectedPayment.paymentDate,
        status: selectedPayment.status,
        studentId: selectedPayment.student.id,
      };
    }
  }
});

const loading = ref(false);

const title = computed(() => {
  switch (props.mode) {
    case 'create': return 'Novo Pagamento';
    case 'update': return 'Atualizar Pagamento';
    case 'view': return 'Visualizar Pagamento';
    default: return '';
  }
});

const statusOptions = ref([
  { title: 'Pago', value: 'PAID' },
  { title: 'Pendente', value: 'PENDING' },
  { title: 'Cancelado', value: 'CANCELED' },
]);

function close() {
  emit('close');
}

async function save() {
  if (props.mode === 'view' || !props.mode) return;

  try {
    loading.value = true;
    const id = payment.value.id;
    const message = !id ? 'Pagamento registrado com sucesso.' : 'Pagamento atualizado com sucesso.';
    const { data }: { data: PaymentDto } = !id
      ? await axios.post('/payment', payment.value)
      : await axios.put(`/payment/${id}`, payment.value);

    const paymentStore = usePaymentStore();
    if (!id) paymentStore.addPayment(data);
    else paymentStore.updatePayment(data);

    close();
    useToastStore().showToast({ message, type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao salvar pagamento.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

async function fetchDependencies() {
  try {
    loading.value = true;
    const { data: studentsData }: { data: StudentDto[] } = await axios.get('/student');
    students.value = studentsData;
  } catch (err) {
    console.error('Erro ao buscar alunos:', err);
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
                v-model="payment.studentId"
                :items="students"
                placeholder="Selecione o aluno"
                variant="outlined"
                item-title="user.name"
                item-value="id"
                density="compact"
                :disabled="props.mode === 'view' || props.mode === 'update'"
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Valor</div>
              <v-text-field
                v-model="payment.amount"
                type="number"
                density="compact"
                placeholder="Valor do pagamento"
                prepend-inner-icon="mdi-cash"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">Data de Pagamento</div>
              <v-text-field
                v-model="payment.paymentDate"
                type="date"
                density="compact"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :disabled="props.mode === 'view'"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Status</div>
              <v-select
                v-model="payment.status"
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