import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="home-hero">
        <span className="home-hero-emoji">🏆</span>
        <h1 className="home-hero-title">
          Il tuo calendario<br />sportivo personale
        </h1>
        <p className="home-hero-text">
          Formula 1, Juventus, Palermo e Lakers: tutti i tuoi eventi
          in un unico posto. Non perderti nessun gran premio, partita o game.
        </p>
        <div className="home-hero-cta">
          <Link href="/register" className="btn btn-primary">
            Inizia gratis →
          </Link>
          <Link href="/calendar" className="btn btn-outline">
            Esplora il calendario
          </Link>
        </div>

        <div className="sports-chips">
          <div className="sport-chip">
            🏎️ <span>Formula 1</span>
          </div>
          <div className="sport-chip">
            ⚽ <span>Juventus F.C.</span>
          </div>
          <div className="sport-chip">
            ⚽ <span>Palermo F.C.</span>
          </div>
          <div className="sport-chip">
            🏀 <span>LA Lakers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
