'use client';

import { useState, useEffect } from 'react';
import { events as eventsApi, SportEvent } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myEvents, setMyEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsApi.myEvents();
      setMyEvents(data.map((ue) => ({ ...ue.event, isSubscribed: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="container calendar-page">
      <div className="page-hero">
        <h1 className="page-title">I miei eventi 🔔</h1>
        <p className="page-subtitle">
          Gli eventi a cui sei iscritto. Riceverai una notifica 30 minuti prima e all&apos;inizio.
        </p>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
          Caricamento...
        </div>
      )}

      {!loading && myEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-emoji">📭</div>
          <h3>Nessun evento salvato</h3>
          <p>Vai al calendario e aggiungi gli eventi che vuoi seguire!</p>
          <br />
          <a href="/calendar" className="btn btn-primary">
            Vai al calendario →
          </a>
        </div>
      )}

      {!loading && myEvents.length > 0 && (
        <div className="events-grid">
          {myEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSubscriptionChange={fetchMyEvents}
            />
          ))}
        </div>
      )}
    </div>
  );
}
