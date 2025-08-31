export default interface UserDto {
  id: number,
  email: string,
  role: 'ADMIN' | 'ASSISTENTE' | 'PROFESSOR' | 'ALUNO',
  name: string,
  cellphone: string | null,
  cpf: string | null,
  createdAt: Date,
  updatedAt: Date
}