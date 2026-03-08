'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">
          🏆 SportsCal
        </Link>

        <div className="navbar-links">
          <Link href="/calendar" className="navbar-link">
            Calendario
          </Link>

          {user ? (
            <>
              <Link href="/my-events" className="navbar-link">
                I miei eventi
              </Link>
              <span className="navbar-link" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {user.name}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                id="logout-btn"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="navbar-link">
                Accedi
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
