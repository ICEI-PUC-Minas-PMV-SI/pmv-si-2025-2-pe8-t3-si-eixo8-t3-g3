import type UserDto from '@/interfaces/user/userDto'
import type UserState from '@/interfaces/user/userState'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: (JSON.parse(localStorage.getItem('escola-de-musica_user') || 'null') as UserDto | null),
    isAuthenticated: !!localStorage.getItem('escola-de-musica_accessToken')
  }),
  actions: {
    setIsAutenticated(value: boolean) {
      this.isAuthenticated = value
      if (!value) {
        localStorage.removeItem('escola-de-musica_accessToken');
        localStorage.removeItem('escola-de-musica_user');
      }
    },
    setUser(value: UserDto) {
      this.user = value
      localStorage.setItem('escola-de-musica_user', JSON.stringify(value))
    }
  }
})
