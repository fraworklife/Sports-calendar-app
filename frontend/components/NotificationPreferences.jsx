'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function NotificationPreferences() {
  const { data: session } = useSession();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In un caso reale, invieremmo un payload al backend User settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!session?.user) return null;

  return (
    <div className="card" style={{ padding: '24px', marginTop: '32px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
        Preferenze di Notifica 🔔
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Ricevi promemoria prima dei tuoi eventi sportivi (30 min prima e all&apos;inizio).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Notifiche Email</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Invia alert a {session.user.email}</div>
          </div>
          <button 
            onClick={() => setEmailEnabled(!emailEnabled)}
            className={`btn btn-sm ${emailEnabled ? 'btn-primary' : 'btn-outline'}`}
          >
            {emailEnabled ? 'Attivo' : 'Disattivo'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Notifiche Push</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notifiche nel browser</div>
          </div>
          <button 
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`btn btn-sm ${pushEnabled ? 'btn-primary' : 'btn-outline'}`}
          >
            {pushEnabled ? 'Attivo' : 'Disattivo'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-primary" onClick={handleSave}>
          Salva Preferenze
        </button>
        {saved && <span style={{ color: 'var(--accent-football)', fontSize: '0.85rem', fontWeight: 600 }}>✔ Salvato</span>}
      </div>
    </div>
  );
}
