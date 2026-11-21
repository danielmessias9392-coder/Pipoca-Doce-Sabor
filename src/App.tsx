import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CompleteCartSection } from './components/CompleteCartSection';
import { EventsSection } from './components/EventsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { InstagramSection } from './components/InstagramSection';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import type { EventType } from './types/booking';

export default function App() {
  const [selectedEventType, setSelectedEventType] = useState<EventType>(
    'Aniversário / Festa Infantil'
  );

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectEventType = (eventType: EventType) => {
    setSelectedEventType(eventType);
    scrollToBooking();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D160B]">
        <Navbar onReserveClick={scrollToBooking} />
        <main className="flex-1">
          <HeroSection onReserveClick={scrollToBooking} />
          <CompleteCartSection onReserveClick={scrollToBooking} />
          <EventsSection onSelectEventType={handleSelectEventType} />
          <TestimonialsSection onReserveClick={scrollToBooking} />
          <BookingSection
            selectedEventType={selectedEventType}
            onEventTypeChange={setSelectedEventType}
          />
          <InstagramSection />
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </MotionConfig>
  );
}
