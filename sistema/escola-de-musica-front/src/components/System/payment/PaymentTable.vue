<script setup lang="ts">
import { ref } from 'vue';
import type PaymentDto from '@/interfaces/payment/paymentDto';
import PaymentModal from './PaymentModal.vue';
import axios from '@/services/axiosInstace';
import { usePaymentStore } from '@/stores/payment';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';
import type { PaymentStatus } from '@/interfaces/payment/paymentStatus';

const { payments } = storeToRefs(usePaymentStore());

const headers = ref([
  { title: 'Aluno', key: 'student.user.name', align: 'start' as const },
  { title: 'Matrícula', key: 'registration.id', align: 'start' as const },
  { title: 'Valor', key: 'amount', align: 'start' as const },
  { title: 'Data de Pagamento', key: 'paymentDate', align: 'start' as const },
  { title: 'Status', key: 'status', align: 'start' as const },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]);

const loading = ref(false);
const showModal = ref(false);
const modalMode = ref<'view' | 'update' | 'create' | null>(null);
const search = ref<string | null>();

function getColor(status: PaymentStatus) {
  if (status === 'PAGO') return 'green';
  if (status === 'CANCELADO') return 'red';
  return 'orange';
}

function create() {
  modalMode.value = 'create';
  showModal.value = true;
}

function view(payment: PaymentDto) {
  usePaymentStore().setPayment(payment);
  modalMode.value = 'view';
  showModal.value = true;
}

function update(payment: PaymentDto) {
  usePaymentStore().setPayment(payment);
  modalMode.value = 'update';
  showModal.value = true;
}

async function remove(payment: PaymentDto) {
  try {
    loading.value = true;
    await axios.delete(`/payments/${payment.id}`);
    usePaymentStore().deletePayment(payment);
    useToastStore().showToast({ message: 'Pagamento deletado com sucesso.', type: 'success', color: 'green' });
  } catch (err) {
    console.error(err);
    useToastStore().showToast({ message: 'Erro ao deletar pagamento.', type: 'error', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
}

async function getPayments() {
  try {
    loading.value = true;
    const { data }: { data: PaymentDto[] } = await axios.get('/payments');
    usePaymentStore().setPayments(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

getPayments();
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="payments"
    :loading="loading"
    :search="search ?? ''"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        rounded
      >
        <v-toolbar-title>
          <v-text-field
            v-model="search"
            placeholder="Pesquisar"
            prepend-icon="mdi-magnify"
            clearable
            density="compact"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-toolbar-title>

        <v-divider class="mx-4" inset vertical />
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          dark
          @click="create"
        >
          <v-icon icon="mdi-plus" />
          Novo Pagamento
        </v-btn>
        <PaymentModal
          :mode="modalMode"
          :showModal="showModal"
          @close="closeModal"
        />
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.student.user.name="{ item }">
      {{ item.student.user.name }}
    </template>
    <template v-slot:item.registration.id="{ item }">
      {{ item.registration.id }}
    </template>
    <template v-slot:item.amount="{ value }">
      R$ {{ parseFloat(value).toFixed(2).replace('.', ',') }}
    </template>
    <template v-slot:item.paymentDate="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)">
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        color="blue-darken-1"
        icon="mdi-eye"
        @click="view(item)"
      />
      <v-icon
        class="me-2"
        size="small"
        color="yellow-darken-3"
        icon="mdi-pencil"
        @click="update(item)"
      />
      <v-icon
        size="small"
        color="red-darken-2"
        icon="mdi-delete"
        @click="remove(item)"
      />
    </template>
  </v-data-table>
</template>