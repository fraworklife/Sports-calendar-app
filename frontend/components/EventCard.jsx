'use client';

import { useSession } from 'next-auth/react';
import { events as eventsApi } from '@/lib/api';
import { useState } from 'react';

const SPORT_EMOJI = {
  F1: '🏎️',
  FOOTBALL: '⚽',
  NBA: '🏀',
};

const SPORT_LABEL = {
  F1: 'Formula 1',
  FOOTBALL: 'Calcio',
  NBA: 'NBA',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function EventCard({ event, onSubscriptionChange }) {
  const { data: session } = useSession();
  const [subscribed, setSubscribed] = useState(event.isSubscribed ?? false);
  const [loading, setLoading] = useState(false);

  const toggleSubscription = async (clickEvent) => {
    clickEvent.stopPropagation();
    if (!session?.user) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      if (subscribed) {
        await eventsApi.unsubscribe(event.id);
        setSubscribed(false);
      } else {
        await eventsApi.subscribe(event.id);
        setSubscribed(true);
      }
      onSubscriptionChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card event-card">
      <div className="event-card-header">
        <span className={`sport-badge ${event.sport}`}>
          {SPORT_EMOJI[event.sport]} {SPORT_LABEL[event.sport]}
        </span>
      </div>

      <h3 className="event-title">{event.title}</h3>

      <div className="event-meta">
        <div className="event-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatDate(event.startDate)}
        </div>
        <div className="event-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {formatTime(event.startDate)}
          {event.endDate && ` – ${formatTime(event.endDate)}`}
        </div>
        {event.venue && (
          <div className="event-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.venue}
          </div>
        )}
      </div>

      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      <div className="event-card-footer">
        <button
          id={`subscribe-${event.id}`}
          className={`btn btn-sm ${subscribed ? 'btn-ghost' : 'btn-primary'}`}
          onClick={toggleSubscription}
          disabled={loading}
        >
          {loading ? '...' : subscribed ? '✓ Iscritto' : '+ Aggiungi al calendario'}
        </button>
      </div>
    </div>
  );
}
