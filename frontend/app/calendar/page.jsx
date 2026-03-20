'use client';

import { useState, useEffect, useCallback } from 'react';
import { events as eventsApi } from '@/lib/api';
import { EventCard } from '@/components/EventCard';

const FILTERS = [
  { label: 'Tutti', value: 'ALL', emoji: '🌐' },
  { label: 'Formula 1', value: 'F1', emoji: '🏎️' },
  { label: 'Calcio', value: 'FOOTBALL', emoji: '⚽' },
  { label: 'NBA', value: 'NBA', emoji: '🏀' },
];

export default function CalendarPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = filter !== 'ALL' ? { sport: filter } : undefined;
      const data = await eventsApi.list(params);
      setAllEvents(data);
    } catch {
      setError('Impossibile caricare gli eventi. Assicurati che il backend sia in esecuzione.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container calendar-page">
      <div className="page-hero">
        <h1 className="page-title">Calendario Sportivo 📅</h1>
        <p className="page-subtitle">
          Tutti gli eventi di Formula 1, Juventus, Palermo e Lakers.
          Aggiungili al tuo calendario personale.
        </p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            id={`filter-${f.value}`}
            className={`filter-btn ${filter === f.value ? `active ${f.value}` : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
          Caricamento eventi...
        </div>
      )}

      {error && (
        <div className="empty-state">
          <div className="empty-state-emoji">⚠️</div>
          <h3>Errore</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && allEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-emoji">🔍</div>
          <h3>Nessun evento trovato</h3>
          <p>Non ci sono eventi per questo filtro. Prova a sincronizzare i dati dal pannello admin.</p>
        </div>
      )}

      {!loading && !error && allEvents.length > 0 && (
        <div className="events-grid">
          {allEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSubscriptionChange={fetchEvents}
            />
          ))}
        </div>
      )}
    </div>
  );
}
