'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
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

          {session?.user ? (
            <>
              <Link href="/my-events" className="navbar-link">
                I miei eventi
              </Link>
              <span className="navbar-link" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {session.user.name}
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
