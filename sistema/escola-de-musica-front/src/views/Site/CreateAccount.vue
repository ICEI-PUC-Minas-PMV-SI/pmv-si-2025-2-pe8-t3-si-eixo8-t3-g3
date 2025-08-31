<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import type User from '@/interfaces/user/user';
import axios from '@/services/axiosInstace';
import type SignupResponse from '@/interfaces/auth/signup';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const visible = ref(false);
const isLoading = ref(false);

const options = ref([
  { title: 'ALUNO', value: 'ALUNO' },
  { title: 'PROFESSOR', value: 'PROFESSOR' },
  { title: 'ASSISTENTE', value: 'ASSISTENTE' },
  { title: 'ADMINISTRADOR', value: 'ADMIN' },
]);

const user = ref<User>({
  role: 'ALUNO',
  email: null,
  password: null,
});

async function signup() {
  isLoading.value = true;
  try {
    const { data }: { data: SignupResponse } = await axios.post('/auth/signup', user.value);
    
    localStorage.setItem('escola-de-musica_accessToken', data.accessToken);
    localStorage.setItem('escola-de-musica_user', JSON.stringify(data.user));

    userStore.setIsAutenticated(true);
    userStore.setUser(data.user);

    toastStore.showToast({message: 'Conta criada com sucesso!', type: 'success', color: 'green'});
    router.push('/dashboard');
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      toastStore.showToast({message: err.response.data.message, type: 'error', color: 'red'});
    } else {
      toastStore.showToast({message: 'Erro ao criar conta. Tente novamente.', type: 'error', color: 'red'});
    }
    console.error('Erro ao fazer cadastro:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      min-width="376"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Tipo de conta</div>

      <v-select
        v-model="user.role"
        :items="options"
        variant="outlined"
        density="compact"
      ></v-select>

      <div class="text-subtitle-1 text-medium-emphasis">E-mail</div>

      <v-text-field
        v-model="user.email"
        density="compact"
        placeholder="Endereço de E-mail"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha
      </div>

      <v-text-field
        v-model="user.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Insira sua senha"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        class="mb-3"
        color="blue"
        size="large"
        variant="tonal"
        block
        :loading="isLoading"
        @click="signup"
      >
        Cadastrar
      </v-btn>

      <v-card-text class="text-center">
        <p>Já tem uma conta?</p>
        <div class="mt-3">
          <v-btn
            class="text-blue text-decoration-none"
            variant="text"
            to="/login"
          >
            <v-icon icon="mdi-chevron-left"></v-icon> Entrar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>