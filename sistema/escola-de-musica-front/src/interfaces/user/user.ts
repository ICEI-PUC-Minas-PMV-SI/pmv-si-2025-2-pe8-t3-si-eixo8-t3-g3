export default interface User {
  role: 'ADMIN' | 'ASSISTENTE' | 'PROFESSOR' | 'ALUNO';
  email: string | null;
  password: string | null;
}