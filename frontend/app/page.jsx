'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { ClockIcon } from 'lucide-react';
import { events as apiEvents } from '@/lib/api';

export default function HomePage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Genera i giorni della settimana corrente
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await apiEvents.list();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const selectedEvents = events.filter((event) =>
    isSameDay(new Date(event.startDate), selectedDate),
  );

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      {!session?.user && (
        <div className="home-hero" style={{ padding: '60px 0', marginBottom: '40px' }}>
          <span className="home-hero-emoji">🏆</span>
          <h1 className="home-hero-title">
            Il tuo calendario sportivo
          </h1>
          <p className="home-hero-text">
            Non perderti nessun gran premio, partita o game.
          </p>
          <div className="home-hero-cta">
            <Link href="/register" className="btn btn-primary">
              Registrati gratis →
            </Link>
          </div>
        </div>
      )}

      <div className="calendar-week-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '24px', textAlign: 'left' }}>
          Eventi della Settimana
        </h2>

        {/* Week Selector */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                style={{
                  minWidth: '80px',
                  padding: '12px',
                  borderRadius: '16px',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-primary-glow)' : 'var(--bg-card)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {format(day, 'EEE', { locale: it })}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isSelected || isToday ? 'var(--text-primary)' : 'inherit' }}>
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Events List for Selected Day */}
        <div className="events-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : selectedEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">😴</div>
              <p>Nessun evento in programma per questa data.</p>
            </div>
          ) : (
            selectedEvents.map(event => (
              <div key={event.id} className="card event-list-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', textAlign: 'center', minWidth: '90px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{format(new Date(event.startDate), 'HH:mm')}</div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span className={`sport-badge ${event.sport}`}>{event.sport}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{event.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ClockIcon size={14} /> {format(new Date(event.startDate), 'dd MMM yyyy', { locale: it })}</span>
                  </div>
                </div>
                
                {session?.user && (
                  <div>
                    <button className="btn btn-outline btn-sm">Dettagli</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
