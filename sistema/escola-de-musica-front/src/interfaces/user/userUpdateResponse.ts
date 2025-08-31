export default interface UserUpdateResponse {
  id: number,
  name: string,
  email: string,
  cellphone: string | null,
  cpf: string | null,
  role: 'ADMIN' | 'ASSISTENTE' | 'PROFESSOR' | 'ALUNO',
  createdAt: Date,
  updatedAt: Date
}