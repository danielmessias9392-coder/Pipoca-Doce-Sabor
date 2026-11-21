export type BookingPeriod = 'manha' | 'tarde' | 'noite';

export type EventType =
  | 'Aniversário / Festa Infantil'
  | 'Casamento / 15 Anos'
  | 'Evento Escolar'
  | 'Confraternização Corporativa'
  | 'Evento Comunitário / Feira'
  | 'Outro Evento';

export type GuestTier =
  | 'Até 50 convidados'
  | '50 a 100 convidados'
  | '100 a 200 convidados'
  | 'Acima de 200 convidados';

export type DurationOption = '3 horas' | '4 horas' | '5 horas';

export interface BookingPayload {
  fullName: string;
  phone: string;
  email: string;
  eventDate: string; // YYYY-MM-DD
  period: BookingPeriod;
  eventType: EventType;
  guests: GuestTier;
  duration: DurationOption;
  cityNeighborhood: string;
  address: string;
  notes: string;
}

export interface BookingConfirmation {
  code: string;
  createdAt: string;
  status: 'solicitada' | 'confirmada';
  packageName: 'Barraquinha Completa (Pipoca, Churros e Batatas)';
  eventDate: string;
  period: BookingPeriod;
  eventType: EventType;
  guests: GuestTier;
  duration: DurationOption;
  cityNeighborhood: string;
  address: string;
  fullName: string;
  phone: string;
}

export interface AvailabilityResponse {
  bookedPeriodsByDate: Record<string, BookingPeriod[]>;
}

export const PERIOD_LABELS: Record<BookingPeriod, { label: string; time: string }> = {
  manha: { label: 'Manhã', time: '09h às 13h' },
  tarde: { label: 'Tarde', time: '14h às 18h' },
  noite: { label: 'Noite', time: '19h às 23h' },
};

export const WHATSAPP_NUMBER = '5563992312758';
export const WHATSAPP_DISPLAY = '(63) 99231-2758';
export const CONTACT_EMAIL = 'contato@pipocadocesabor.com.br';
export const INSTAGRAM_HANDLE = '@pipocadocesabor';
export const INSTAGRAM_URL = 'https://www.instagram.com/pipocadocesabor/';
