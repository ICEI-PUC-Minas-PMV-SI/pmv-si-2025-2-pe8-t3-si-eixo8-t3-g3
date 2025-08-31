export default interface UserProfileForm {
  role: 'ADMIN' | 'ASSISTENTE' | 'PROFESSOR' | 'ALUNO',
  name: string | null,
  email: string | null,
  cellphone: string | null,
  cpf: string | null,
  password: string | null
}