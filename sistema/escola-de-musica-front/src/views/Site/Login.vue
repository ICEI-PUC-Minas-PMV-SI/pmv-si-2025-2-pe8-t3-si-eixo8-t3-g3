<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import axios from '@/services/axiosInstace'
import {
  type SigninResponse,
  type SigninForm
} from '@/interfaces/auth/signin';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const visible = ref(false);
const isLoading = ref(false);

const email = ref('');
const password = ref('');

function handleSubmit(e: Event) {
  e.preventDefault();
  login({ email: email.value, password: password.value });
}

async function login(values: SigninForm) {
  isLoading.value = true;
  try {
    const { data }: { data: SigninResponse } = await axios.post('/auth/signin', values);

    localStorage.setItem('escola-de-musica_accessToken', data.accessToken);
    localStorage.setItem('escola-de-musica_user', JSON.stringify(data.user));

    userStore.setIsAutenticated(true);
    userStore.setUser(data.user);

    toastStore.showToast({ message: 'Login realizado com sucesso!', type: 'success', color: 'green' });
    router.push('/dashboard');
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      toastStore.showToast({ message: err.response.data.message, type: 'error', color: 'red' });
    } else {
      toastStore.showToast({ message: 'Erro ao fazer login. Tente novamente.', type: 'error', color: 'red' });
    }
    console.error('Erro ao fazer login:', err);
  } finally {
    isLoading.value = false;
  }
};
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
      <v-form @submit.prevent="handleSubmit">
        <div class="text-h5 text-center mb-5">
          Bem-vindo de volta!
        </div>
        <div class="text-subtitle-1 text-medium-emphasis">E-mail</div>
  
        <v-text-field
          v-model="email"
          density="compact"
          placeholder="Endereço de E-mail"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Senha
        </div>
  
        <v-text-field
          v-model="password"
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
          type="submit"
        >
          Entrar
        </v-btn>
  
        <v-card-text class="text-center">
          <p>Ainda não tem uma conta?</p>
          <div class="mt-3">
            <v-btn
              class="text-blue text-decoration-none"
              variant="text"
              to="/signup"
            >
              Cadastre-se agora <v-icon icon="mdi-chevron-right"></v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>
