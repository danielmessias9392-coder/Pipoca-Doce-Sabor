import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

type BookingPeriod = 'manha' | 'tarde' | 'noite';

interface StoredBooking {
  code: string;
  createdAt: string;
  status: 'solicitada' | 'confirmada';
  packageName: string;
  eventDate: string;
  period: BookingPeriod;
  eventType: string;
  guests: string;
  duration: string;
  cityNeighborhood: string;
  address: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

interface ReservedSlot {
  eventDate: string;
  period: BookingPeriod;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '.data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BLOCKED_SLOTS_FILE = path.join(DATA_DIR, 'blocked_slots.json');

const VALID_PERIODS: BookingPeriod[] = ['manha', 'tarde', 'noite'];

function ensureDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(BLOCKED_SLOTS_FILE)) {
    // Initial schedule commitments on weekdays only (Saturdays remain open)
    const now = new Date();
    const formatNonSaturdayDate = (daysAhead: number): string => {
      const target = new Date(now);
      target.setDate(now.getDate() + daysAhead);
      if (target.getDay() === 6) {
        target.setDate(target.getDate() + 2);
      }
      const y = target.getFullYear();
      const m = String(target.getMonth() + 1).padStart(2, '0');
      const d = String(target.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const initialReserved: ReservedSlot[] = [
      { eventDate: formatNonSaturdayDate(5), period: 'tarde' },
      { eventDate: formatNonSaturdayDate(7), period: 'noite' },
      { eventDate: formatNonSaturdayDate(14), period: 'tarde' },
      { eventDate: formatNonSaturdayDate(18), period: 'noite' },
    ];
    fs.writeFileSync(BLOCKED_SLOTS_FILE, JSON.stringify(initialReserved, null, 2), 'utf-8');
  }
}

function readBookings(): StoredBooking[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: StoredBooking[]): void {
  ensureDataFiles();
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

function readBlockedSlots(): ReservedSlot[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(BLOCKED_SLOTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getBookedPeriodsByDate(): Record<string, BookingPeriod[]> {
  const map: Record<string, BookingPeriod[]> = {};
  const blocked = readBlockedSlots();
  const bookings = readBookings();

  for (const slot of blocked) {
    if (!map[slot.eventDate]) {
      map[slot.eventDate] = [];
    }
    if (!map[slot.eventDate].includes(slot.period)) {
      map[slot.eventDate].push(slot.period);
    }
  }

  for (const booking of bookings) {
    if (!map[booking.eventDate]) {
      map[booking.eventDate] = [];
    }
    if (!map[booking.eventDate].includes(booking.period)) {
      map[booking.eventDate].push(booking.period);
    }
  }

  return map;
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isPastDate(isoDate: string): boolean {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
  return isoDate < todayIso;
}

function generateBookingCode(existingCount: number): string {
  const year = new Date().getFullYear();
  const sequence = String(existingCount + 101).padStart(4, '0');
  return `PDS-${year}-${sequence}`;
}

async function startServer(): Promise<void> {
  ensureDataFiles();
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/availability', (_req, res) => {
    const bookedPeriodsByDate = getBookedPeriodsByDate();
    res.json({ bookedPeriodsByDate });
  });

  app.post('/api/bookings', (req, res) => {
    const body = req.body ?? {};
    const fullName = String(body.fullName ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const email = String(body.email ?? '').trim();
    const eventDate = String(body.eventDate ?? '').trim();
    const period = String(body.period ?? '').trim() as BookingPeriod;
    const eventType = String(body.eventType ?? '').trim();
    const guests = String(body.guests ?? '').trim();
    const duration = String(body.duration ?? '').trim();
    const cityNeighborhood = String(body.cityNeighborhood ?? '').trim();
    const address = String(body.address ?? '').trim();
    const notes = String(body.notes ?? '').trim();

    if (fullName.length < 3 || fullName.length > 120) {
      res.status(400).json({ error: 'Informe seu nome completo (mínimo 3 caracteres).' });
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 11) {
      res.status(400).json({ error: 'Informe um número de WhatsApp válido com DDD.' });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'O e-mail informado não parece válido.' });
      return;
    }

    if (!isValidIsoDate(eventDate) || isPastDate(eventDate)) {
      res.status(400).json({ error: 'Selecione uma data futura válida no calendário.' });
      return;
    }

    if (!VALID_PERIODS.includes(period)) {
      res.status(400).json({ error: 'Selecione um período válido (Manhã, Tarde ou Noite).' });
      return;
    }

    if (!eventType || !guests || !duration || cityNeighborhood.length < 2 || address.length < 5) {
      res.status(400).json({
        error: 'Preencha tipo de evento, convidados, duração, bairro/cidade e endereço.',
      });
      return;
    }

    const bookedMap = getBookedPeriodsByDate();
    const takenForDate = bookedMap[eventDate] ?? [];
    if (takenForDate.includes(period)) {
      res.status(409).json({
        error: 'Este período já foi reservado nesta data. Escolha outro período ou outro dia.',
      });
      return;
    }

    const bookings = readBookings();
    const code = generateBookingCode(bookings.length);

    const newBooking: StoredBooking = {
      code,
      createdAt: new Date().toISOString(),
      status: 'solicitada',
      packageName: 'Barraquinha Completa (Pipoca, Churros e Batatas)',
      eventDate,
      period,
      eventType,
      guests,
      duration,
      cityNeighborhood,
      address,
      fullName,
      phone,
      email,
      notes,
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    res.status(201).json({
      code: newBooking.code,
      createdAt: newBooking.createdAt,
      status: newBooking.status,
      packageName: newBooking.packageName,
      eventDate: newBooking.eventDate,
      period: newBooking.period,
      eventType: newBooking.eventType,
      guests: newBooking.guests,
      duration: newBooking.duration,
      cityNeighborhood: newBooking.cityNeighborhood,
      address: newBooking.address,
      fullName: newBooking.fullName,
      phone: newBooking.phone,
    });
  });

  app.get('/api/bookings/:code', (req, res) => {
    const code = String(req.params.code ?? '').trim().toUpperCase();
    const phoneDigits = String(req.query.last4 ?? '').replace(/\D/g, '');
    if (!code) {
      res.status(400).json({ error: 'Código de reserva obrigatório.' });
      return;
    }

    const bookings = readBookings();
    const match = bookings.find((b) => b.code === code);
    if (!match) {
      res.status(404).json({ error: 'Reserva não encontrada para este código.' });
      return;
    }

    const storedDigits = match.phone.replace(/\D/g, '');
    if (!phoneDigits || !storedDigits.endsWith(phoneDigits) || phoneDigits.length !== 4) {
      res.status(403).json({
        error: 'Informe os 4 últimos dígitos do WhatsApp cadastrado para visualizar esta reserva.',
      });
      return;
    }

    res.json({
      code: match.code,
      createdAt: match.createdAt,
      status: match.status,
      packageName: match.packageName,
      eventDate: match.eventDate,
      period: match.period,
      eventType: match.eventType,
      guests: match.guests,
      duration: match.duration,
      cityNeighborhood: match.cityNeighborhood,
      address: match.address,
      fullName: match.fullName,
      phone: match.phone,
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Pipoca Doce Sabor server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
