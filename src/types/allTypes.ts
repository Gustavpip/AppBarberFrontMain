export interface UserDTO {
  id: number;
  email: string;
  nome_barbearia: string;
  barbeiro: boolean;
  autorizado: boolean;
  endereco: string;
  phone: string;
  absent: boolean;
  email_verificado: boolean;
  senha: string;
  logo?: string;
}

export interface WorkSchedule {
  dia: string;
  horario_inicio: string;
  horario_fim: string;
  inicio_almoco: string;
  fim_almoco: string;
  barbeiro: BarberDTO;
}

export interface BarberDTO {
  id: string;
  nome_completo: string;
  telefone: string;
  foto: string;
  barbearia: UserDTO;
  dias_trabalho: WorkSchedule[];
}

export interface ProfileDTO {
  id: string;
  nome_barbearia: string;
  phone: string;
  logo: string;
  email: string;
  endereco: string;
}

export interface ServiceDTO {
  id: string;
  nome: string;
  descricao: string;
  preco: number | string;
  barber_foto: string;
  foto: string;
  tempo?: string;
}

export interface ClientDTO {
  id: string;
  nome: string;
  descricao: string;
  telefone: string;
}

export interface Scheduling {
  id?: string;
  barbearia_id?: string;
  servico_id: string;
  data: string;
  hora: string;
  status?: string;
  nome: string;
  telefone: string;
  barbeiro_id: string;
}
