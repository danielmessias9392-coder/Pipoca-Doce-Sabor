import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MessageCircle,
  Search,
} from 'lucide-react';
import {
  PERIOD_LABELS,
  WHATSAPP_NUMBER,
  type AvailabilityResponse,
  type BookingConfirmation,
  type BookingPeriod,
  type DurationOption,
  type EventType,
  type GuestTier,
} from '../types/booking';

interface BookingSectionProps {
  selectedEventType: EventType;
  onEventTypeChange: (eventType: EventType) => void;
}

const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const EVENT_TYPE_OPTIONS: EventType[] = [
  'Aniversário / Festa Infantil',
  'Casamento / 15 Anos',
  'Evento Escolar',
  'Confraternização Corporativa',
  'Evento Comunitário / Feira',
  'Outro Evento',
];

const GUEST_TIERS: GuestTier[] = [
  'Até 50 convidados',
  '50 a 100 convidados',
  '100 a 200 convidados',
  'Acima de 200 convidados',
];

const DURATIONS: DurationOption[] = ['3 horas', '4 horas', '5 horas'];

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatBrDate(isoDate: string): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function formatPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function BookingSection({ selectedEventType, onEventTypeChange }: BookingSectionProps) {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => formatIsoDate(today), [today]);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [bookedPeriodsByDate, setBookedPeriodsByDate] = useState<Record<string, BookingPeriod[]>>(
    {}
  );
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<BookingPeriod | ''>('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState<GuestTier>('50 a 100 convidados');
  const [duration, setDuration] = useState<DurationOption>('4 horas');
  const [cityNeighborhood, setCityNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  // Lookup state
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupLast4, setLookupLast4] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<BookingConfirmation | null>(null);

  const loadAvailability = async () => {
    setLoadingAvailability(true);
    setAvailabilityError(null);
    try {
      const res = await fetch('/api/availability');
      if (!res.ok) {
        throw new Error('Não foi possível carregar o calendário.');
      }
      const data = (await res.json()) as AvailabilityResponse;
      setBookedPeriodsByDate(data.bookedPeriodsByDate ?? {});
    } catch {
      setAvailabilityError('Não foi possível atualizar a agenda agora. Tente novamente.');
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    void loadAvailability();
  }, []);

  // Pick first available upcoming date automatically once availability loads
  useEffect(() => {
    if (selectedDate || loadingAvailability) return;
    const candidate = new Date(today);
    for (let offset = 1; offset <= 45; offset += 1) {
      candidate.setDate(today.getDate() + offset);
      const iso = formatIsoDate(candidate);
      const taken = bookedPeriodsByDate[iso] ?? [];
      if (taken.length < 3) {
        setSelectedDate(iso);
        const firstFree = (['manha', 'tarde', 'noite'] as BookingPeriod[]).find(
          (p) => !taken.includes(p)
        );
        if (firstFree) setSelectedPeriod(firstFree);
        break;
      }
    }
  }, [bookedPeriodsByDate, loadingAvailability, selectedDate, today]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ day: null, iso: null });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const mStr = String(viewMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({ day: d, iso: `${viewYear}-${mStr}-${dStr}` });
    }
    return cells;
  }, [viewMonth, viewYear]);

  const canGoPrevMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (iso: string) => {
    const taken = bookedPeriodsByDate[iso] ?? [];
    if (iso < todayIso || taken.length >= 3) return;
    setSelectedDate(iso);
    setFormError(null);
    const freePeriod = (['manha', 'tarde', 'noite'] as BookingPeriod[]).find(
      (p) => !taken.includes(p)
    );
    setSelectedPeriod(freePeriod ?? '');
  };

  const takenForSelectedDate = selectedDate ? bookedPeriodsByDate[selectedDate] ?? [] : [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedDate) {
      setFormError('Escolha uma data disponível no calendário.');
      return;
    }
    if (!selectedPeriod) {
      setFormError('Escolha um período disponível (Manhã, Tarde ou Noite).');
      return;
    }
    if (fullName.trim().length < 3) {
      setFormError('Informe o nome completo do cliente.');
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setFormError('Informe um telefone/WhatsApp válido com DDD.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('O e-mail informado não parece válido.');
      return;
    }
    if (cityNeighborhood.trim().length < 2 || address.trim().length < 5) {
      setFormError('Informe cidade/bairro e o endereço completo do evento.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          eventDate: selectedDate,
          period: selectedPeriod,
          eventType: selectedEventType,
          guests,
          duration,
          cityNeighborhood: cityNeighborhood.trim(),
          address: address.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? 'Não foi possível concluir a solicitação. Tente novamente.');
        await loadAvailability();
        return;
      }

      setConfirmation(data as BookingConfirmation);
      await loadAvailability();
    } catch {
      setFormError('Erro de conexão ao enviar reserva. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const cleanedCode = lookupCode.trim().toUpperCase();
    const cleanedLast4 = lookupLast4.replace(/\D/g, '');
    if (!cleanedCode || cleanedLast4.length !== 4) {
      setLookupError('Digite o código (ex: PDS-2026-0101) e os 4 últimos dígitos do WhatsApp.');
      return;
    }

    setLookupLoading(true);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(cleanedCode)}?last4=${encodeURIComponent(cleanedLast4)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error ?? 'Reserva não encontrada.');
        return;
      }
      setLookupResult(data as BookingConfirmation);
    } catch {
      setLookupError('Não foi possível consultar agora. Tente novamente.');
    } finally {
      setLookupLoading(false);
    }
  };

  const buildWhatsAppConfirmationLink = (record: BookingConfirmation): string => {
    const periodInfo = PERIOD_LABELS[record.period];
    const message = [
      `Olá, Pipoca Doce Sabor! Acabei de solicitar uma reserva pelo site:`,
      `• Código: ${record.code}`,
      `• Pacote: ${record.packageName}`,
      `• Data: ${formatBrDate(record.eventDate)} (${periodInfo.label} - ${periodInfo.time})`,
      `• Evento: ${record.eventType}`,
      `• Convidados: ${record.guests} (${record.duration})`,
      `• Local: ${record.address} — ${record.cityNeighborhood}`,
      `• Cliente: ${record.fullName} (${record.phone})`,
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const resetForNewBooking = () => {
    setConfirmation(null);
    setFormError(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setCityNeighborhood('');
    setAddress('');
    setNotes('');
  };

  return (
    <section id="agendamento" className="py-16 lg:py-24 bg-[#FAF5EE] border-t border-[#E8DCD0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-[#C8232C] tracking-wide mb-2">
              Agendamento Online · Barraquinha Completa
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D160B] tracking-tight text-balance">
              Reserve a data do seu evento no calendário
            </h2>
            <p className="mt-3 text-base text-[#5C3A28] leading-relaxed">
              Escolha o dia e o período desejados para contratar a barraquinha completa com pipoca,
              churros e batatas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setLookupOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#2D160B] bg-[#FFFDF9] hover:bg-[#FFF8E7] border border-[#E8DCD0] rounded-xl transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <Search className="w-4 h-4 text-[#C8232C]" aria-hidden="true" />
            {lookupOpen ? 'Fechar consulta' : 'Consultar minha reserva'}
          </button>
        </div>

        {lookupOpen && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD0]">
            <h3 className="font-display text-lg font-bold text-[#2D160B] mb-1">
              Consultar solicitação de reserva
            </h3>
            <p className="text-sm text-[#5C3A28] mb-4">
              Informe seu código de reserva e os 4 últimos dígitos do WhatsApp cadastrado.
            </p>
            <form
              onSubmit={handleLookup}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label
                  htmlFor="lookup-code"
                  className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                >
                  Código da reserva
                </label>
                <input
                  id="lookup-code"
                  type="text"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                  placeholder="Ex: PDS-2026-0101"
                  className="w-full px-3.5 py-2.5 text-sm font-mono uppercase rounded-lg border border-[#D4BFA8] bg-white text-[#2D160B] focus:outline-none focus:ring-2 focus:ring-[#C8232C]"
                />
              </div>
              <div>
                <label
                  htmlFor="lookup-last4"
                  className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                >
                  4 últimos dígitos do WhatsApp
                </label>
                <input
                  id="lookup-last4"
                  type="text"
                  maxLength={4}
                  value={lookupLast4}
                  onChange={(e) => setLookupLast4(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 8888"
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-[#D4BFA8] bg-white text-[#2D160B] focus:outline-none focus:ring-2 focus:ring-[#C8232C]"
                />
              </div>
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2D160B] hover:bg-[#4A2511] rounded-lg transition-colors min-h-[44px] cursor-pointer disabled:opacity-60"
              >
                {lookupLoading ? 'Buscando...' : 'Buscar reserva'}
              </button>
            </form>

            {lookupError && (
              <p className="mt-3 text-sm text-[#C8232C] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{lookupError}</span>
              </p>
            )}

            {lookupResult && (
              <div className="mt-4 p-4 rounded-xl bg-[#FFF8E7] border border-[#F59E0B]/40 text-sm text-[#2D160B] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <span className="block text-xs text-[#7A4B31]">Código</span>
                  <strong className="font-mono">{lookupResult.code}</strong>
                </div>
                <div>
                  <span className="block text-xs text-[#7A4B31]">Data e Período</span>
                  <strong className="tabular-nums">
                    {formatBrDate(lookupResult.eventDate)} · {PERIOD_LABELS[lookupResult.period].label}
                  </strong>
                </div>
                <div>
                  <span className="block text-xs text-[#7A4B31]">Pacote</span>
                  <strong>Barraquinha Completa</strong>
                </div>
                <div>
                  <span className="block text-xs text-[#7A4B31]">Status</span>
                  <strong className="capitalize">{lookupResult.status}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Column */}
          <div className="lg:col-span-5 bg-[#FFFDF9] rounded-2xl border border-[#E8DCD0] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#C8232C]" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-[#2D160B]">
                  {MONTH_NAMES_PT[viewMonth]} {viewYear}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrevMonth}
                  aria-label="Mês anterior"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#E8DCD0] text-[#2D160B] hover:bg-[#FAF5EE] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Próximo mês"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#E8DCD0] text-[#2D160B] hover:bg-[#FAF5EE] cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {availabilityError && (
              <div className="mb-4 p-3 rounded-lg bg-[#C8232C]/10 border border-[#C8232C]/30 text-xs text-[#C8232C] flex items-center justify-between gap-2">
                <span>{availabilityError}</span>
                <button
                  type="button"
                  onClick={() => void loadAvailability()}
                  className="font-bold underline cursor-pointer shrink-0"
                >
                  Recarregar
                </button>
              </div>
            )}

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS_PT.map((dayName) => (
                <div
                  key={dayName}
                  className="text-xs font-semibold text-[#7A4B31] py-1.5"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {loadingAvailability ? (
              <div className="h-[270px] flex items-center justify-center text-sm text-[#5C3A28] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#C8232C]" aria-hidden="true" />
                <span>Verificando datas disponíveis...</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((cell, idx) => {
                  if (!cell.day || !cell.iso) {
                    return <div key={`empty-${idx}`} className="min-h-[44px]" />;
                  }

                  const isPast = cell.iso < todayIso;
                  const takenPeriods = bookedPeriodsByDate[cell.iso] ?? [];
                  const isFull = takenPeriods.length >= 3;
                  const isPartial = !isPast && !isFull && takenPeriods.length > 0;
                  const isSelected = selectedDate === cell.iso;
                  const isDisabled = isPast || isFull;

                  let buttonStyle =
                    'bg-white text-[#2D160B] border-[#E8DCD0] hover:border-[#C8232C] hover:bg-[#FFF8E7]';
                  let statusHint = 'Disponível';

                  if (isPast) {
                    buttonStyle = 'bg-[#FAF5EE] text-[#B39E8C] border-transparent cursor-not-allowed';
                    statusHint = 'Passado';
                  } else if (isFull) {
                    buttonStyle =
                      'bg-[#F3E9DC] text-[#8E7360] border-transparent line-through cursor-not-allowed';
                    statusHint = 'Lotado';
                  } else if (isSelected) {
                    buttonStyle =
                      'bg-[#C8232C] text-white border-[#C8232C] font-bold shadow-sm';
                    statusHint = 'Selecionado';
                  } else if (isPartial) {
                    buttonStyle =
                      'bg-[#FFF8E7] text-[#2D160B] border-[#F59E0B]/60 hover:border-[#C8232C]';
                    statusHint = 'Parcial';
                  }

                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectDate(cell.iso!)}
                      aria-label={`${cell.day} de ${MONTH_NAMES_PT[viewMonth]} — ${statusHint}`}
                      aria-pressed={isSelected}
                      className={`min-h-[44px] rounded-lg border flex flex-col items-center justify-center text-sm font-mono tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] ${
                        !isDisabled ? 'cursor-pointer' : ''
                      } ${buttonStyle}`}
                    >
                      <span>{cell.day}</span>
                      {isPartial && !isSelected && (
                        <span className="text-[9px] font-sans font-semibold leading-none text-[#92400E] mt-0.5">
                          Parcial
                        </span>
                      )}
                      {isFull && (
                        <span className="text-[9px] font-sans font-medium leading-none text-[#8E7360] mt-0.5 no-underline">
                          Lotado
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[#E8DCD0] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5C3A28]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-[#E8DCD0] bg-white" />
                Disponível
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-[#F59E0B] bg-[#FFF8E7]" />
                Parcial (horários livres)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#F3E9DC]" />
                Lotado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#C8232C]" />
                Selecionado
              </span>
            </div>

            {selectedDate && !confirmation && (
              <div className="mt-6 pt-5 border-t border-[#E8DCD0]">
                <p className="text-xs font-semibold text-[#2D160B] mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C8232C]" aria-hidden="true" />
                  <span>Período desejado para {formatBrDate(selectedDate)}:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['manha', 'tarde', 'noite'] as BookingPeriod[]).map((periodKey) => {
                    const isTaken = takenForSelectedDate.includes(periodKey);
                    const isChosen = selectedPeriod === periodKey;
                    const info = PERIOD_LABELS[periodKey];
                    return (
                      <button
                        key={periodKey}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setSelectedPeriod(periodKey)}
                        className={`p-2.5 rounded-xl border text-left transition-colors min-h-[48px] ${
                          isTaken
                            ? 'bg-[#FAF5EE] border-transparent text-[#8E7360] cursor-not-allowed'
                            : isChosen
                              ? 'bg-[#2D160B] border-[#2D160B] text-white cursor-pointer'
                              : 'bg-white border-[#E8DCD0] text-[#2D160B] hover:border-[#C8232C] cursor-pointer'
                        }`}
                      >
                        <span className="block text-xs font-bold">{info.label}</span>
                        <span
                          className={`block text-[11px] font-mono tabular-nums ${
                            isChosen ? 'text-[#FBBF24]' : 'text-[#7A4B31]'
                          }`}
                        >
                          {isTaken ? 'Reservado' : info.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form / Confirmation Column */}
          <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl border border-[#E8DCD0] p-6 sm:p-8">
            {confirmation ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2
                    className="w-8 h-8 text-[#15803D] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#15803D] tracking-wide">
                      Solicitação registrada com sucesso
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2D160B] mt-1">
                      Sua data foi pré-reservada!
                    </h3>
                    <p className="text-sm text-[#5C3A28] mt-1.5 leading-relaxed">
                      Guarde seu código de reserva abaixo e envie o resumo pelo WhatsApp para
                      finalizarmos os detalhes do atendimento.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF5EE] border border-[#E8DCD0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-[#7A4B31]">Código da reserva</span>
                    <strong className="font-mono text-base text-[#C8232C]">
                      {confirmation.code}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#7A4B31]">Contratação</span>
                    <strong className="text-[#2D160B]">{confirmation.packageName}</strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#7A4B31]">Data e Período</span>
                    <strong className="text-[#2D160B] tabular-nums">
                      {formatBrDate(confirmation.eventDate)} ·{' '}
                      {PERIOD_LABELS[confirmation.period].label} (
                      {PERIOD_LABELS[confirmation.period].time})
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#7A4B31]">Evento e Público</span>
                    <strong className="text-[#2D160B]">
                      {confirmation.eventType} · {confirmation.guests}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-[#7A4B31]">Local</span>
                    <strong className="text-[#2D160B]">
                      {confirmation.address} — {confirmation.cityNeighborhood}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={buildWhatsAppConfirmationLink(confirmation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-[#2D160B] bg-[#FBBF24] hover:bg-[#F59E0B] rounded-xl transition-colors min-h-[48px]"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    Enviar Resumo pelo WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={resetForNewBooking}
                    className="px-5 py-3.5 text-sm font-semibold text-[#2D160B] bg-white hover:bg-[#FAF5EE] border border-[#E8DCD0] rounded-xl transition-colors min-h-[48px] cursor-pointer"
                  >
                    Fazer nova solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="pb-4 border-b border-[#E8DCD0] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#2D160B]">
                      Dados para reservar a Barraquinha Completa
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C3A28] mt-0.5">
                      Inclui pipoca fresquinha, churros deliciosos e batatas saborosas.
                    </p>
                  </div>
                  {selectedDate && selectedPeriod && (
                    <span className="text-xs font-mono font-semibold text-[#C8232C] tabular-nums">
                      {formatBrDate(selectedDate)} · {PERIOD_LABELS[selectedPeriod].label}
                    </span>
                  )}
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#C8232C]/10 border border-[#C8232C]/30 text-sm text-[#C8232C] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="full-name"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Nome completo do cliente *
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Maria Clara Oliveira"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      WhatsApp / Telefone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                      placeholder="(63) 99999-0000"
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      E-mail (opcional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@exemplo.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event-type"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Tipo de evento *
                    </label>
                    <select
                      id="event-type"
                      value={selectedEventType}
                      onChange={(e) => onEventTypeChange(e.target.value as EventType)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    >
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="guests"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Estimativa de convidados *
                    </label>
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value as GuestTier)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    >
                      {GUEST_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Duração da barraquinha *
                    </label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as DurationOption)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    >
                      {DURATIONS.map((dur) => (
                        <option key={dur} value={dur}>
                          {dur}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="city-neighborhood"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Cidade e Bairro *
                    </label>
                    <input
                      id="city-neighborhood"
                      type="text"
                      required
                      value={cityNeighborhood}
                      onChange={(e) => setCityNeighborhood(e.target.value)}
                      placeholder="Ex: São Paulo · Moema"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Endereço ou local do evento *
                    </label>
                    <input
                      id="address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número e complemento (ou nome do salão/escola)"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C] min-h-[44px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="notes"
                      className="block text-xs font-semibold text-[#2D160B] mb-1.5"
                    >
                      Observações sobre a festa (opcional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Horário exato de início, tema da festa ou orientações de acesso para nossa equipe."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4BFA8] bg-white text-[#2D160B] placeholder:text-[#9E8572] focus:outline-none focus:ring-2 focus:ring-[#C8232C]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-[#7A4B31] leading-relaxed">
                    Ao enviar, sua data fica pré-reservada para nossa equipe confirmar o orçamento
                    completo via WhatsApp.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-xl transition-colors duration-150 min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] focus-visible:ring-offset-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Registrando...
                      </>
                    ) : (
                      'Confirmar Solicitação de Reserva'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
