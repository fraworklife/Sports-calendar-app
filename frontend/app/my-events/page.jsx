'use client';

import { useState, useEffect } from 'react';
import { events as eventsApi } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { NotificationPreferences } from '@/components/NotificationPreferences';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
    if (session?.user) fetchMyEvents();
  }, [session?.user]);

  if (status === 'loading' || !session?.user) return null;

  return (
    <div className="container calendar-page">
      <div className="page-hero">
        <h1 className="page-title">I miei eventi 🔔</h1>
        <p className="page-subtitle">
          Gli eventi a cui sei iscritto. Riceverai una notifica 30 minuti prima e all&apos;inizio.
        </p>
      </div>

      <NotificationPreferences />

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
