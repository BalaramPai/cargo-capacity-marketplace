import { useState, type FormEvent } from "react";

export default function LandingPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [volume, setVolume] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!origin || !destination || !volume) {
      setMessage("Enter your origin, destination and cargo volume.");
      return;
    }

    setMessage(
      `Searching for ${volume} CBM from ${origin} to ${destination}...`
    );
  };

  return (
    <main className="landing-page">

      {/* =====================================================
          PAGE 1
          HERO + STATS
         ===================================================== */}

      <section className="page-one">

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">

            <div className="hero-content">

              <div className="hero-badge">
                <span className="status-dot" />
                Smarter cargo. Better utilization.
              </div>

              <h1>
                Turn unused <span>cargo</span>
                <br />
                <span>capacity</span> into
                <br />
                opportunity.
              </h1>

              <p className="hero-description">
                Connect with available container capacity and move your cargo
                efficiently — without paying for space you don't need.
              </p>

              <form className="search-card" onSubmit={handleSearch}>

                <div className="search-field">
                  <label htmlFor="origin">From</label>

                  <input
                    id="origin"
                    type="text"
                    value={origin}
                    onChange={(event) => setOrigin(event.target.value)}
                    placeholder="Origin city"
                  />
                </div>

                <div className="route-arrow">
                  →
                </div>

                <div className="search-field">
                  <label htmlFor="destination">To</label>

                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(event) =>
                      setDestination(event.target.value)
                    }
                    placeholder="Destination city"
                  />
                </div>

                <div className="search-field">
                  <label htmlFor="volume">Cargo volume</label>

                  <input
                    id="volume"
                    type="number"
                    min="0"
                    step="0.1"
                    value={volume}
                    onChange={(event) => setVolume(event.target.value)}
                    placeholder="CBM"
                  />
                </div>

                <button className="search-button" type="submit">
                  Find capacity
                </button>

              </form>

              {message && (
                <p className="search-message">
                  {message}
                </p>
              )}

              {!message && (
                <p className="hero-note">
                  No commitment required · Compare available capacity first
                </p>
              )}

            </div>

            {/* CAPACITY CARD */}
            <div className="hero-visual">

              <div className="glow" />

              <div className="container-card">

                <div className="container-top">
                  <span>AVAILABLE CAPACITY</span>

                  <span className="available">
                    • LIVE
                  </span>
                </div>

                <div className="container-route">

                  <div className="location">
                    <strong>Mumbai</strong>
                    <small>IN</small>
                  </div>

                  <div className="route-line">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="location">
                    <strong>Rotterdam</strong>
                    <small>NL</small>
                  </div>

                </div>

                <div className="capacity-info">

                  <div>
                    <span>Available</span>
                    <strong>18.5 CBM</strong>
                  </div>

                  <div>
                    <span>Weight</span>
                    <strong>4,200 KG</strong>
                  </div>

                </div>

                <div className="capacity-bar">
                  <span />
                </div>

                <div className="container-footer">
                  <span>40 FT Container</span>
                  <span>Departs Sep 18</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* STATS */}
        <section className="stats-section">
          <div className="stats-inner">

            <div className="stat">
              <strong>2,400+</strong>
              <span>Shipments matched</span>
            </div>

            <div className="stat">
              <strong>850+</strong>
              <span>Verified providers</span>
            </div>

            <div className="stat">
              <strong>42K+</strong>
              <span>CBM capacity listed</span>
            </div>

            <div className="stat">
              <strong>28</strong>
              <span>Trade routes</span>
            </div>

          </div>
        </section>

      </section>


      {/* =====================================================
          PAGE 2
          HOW IT WORKS + CTA
         ===================================================== */}

      <section className="page-two">

        {/* HOW IT WORKS */}
        <section className="how-section" id="how-it-works">

          <div className="section-inner">

            <div className="section-heading">

              <div className="eyebrow">
                HOW IT WORKS
              </div>

              <h2>
                From empty space to delivered cargo.
              </h2>

              <p>
                A simpler way for exporters and logistics providers to make
                every shipment count.
              </p>

            </div>


            <div className="steps">

              <article className="step">

                <span className="step-number">
                  01
                </span>

                <h3>
                  Tell us what you need
                </h3>

                <p>
                  Enter your origin, destination, cargo details and preferred
                  schedule.
                </p>

              </article>


              <article className="step">

                <span className="step-number">
                  02
                </span>

                <h3>
                  Find your match
                </h3>

                <p>
                  Our marketplace compares routes, capacity, schedule and
                  cargo compatibility.
                </p>

              </article>


              <article className="step">

                <span className="step-number">
                  03
                </span>

                <h3>
                  Reserve capacity
                </h3>

                <p>
                  Request available space and secure it through a controlled
                  booking process.
                </p>

              </article>


              <article className="step">

                <span className="step-number">
                  04
                </span>

                <h3>
                  Track the journey
                </h3>

                <p>
                  Follow your shipment from pickup through delivery in one
                  place.
                </p>

              </article>

            </div>

          </div>

        </section>


        {/* BLUE CTA */}
        <section className="cta-section">

          <div className="cta-inner">

            <div className="cta-content">

              <div className="eyebrow">
                BUILT FOR BOTH SIDES
              </div>

              <h2>
                Have cargo to move?
              </h2>

              <p>
                Or have unused capacity waiting to be filled? There's a place
                for you on the marketplace.
              </p>

            </div>


            <div className="cta-actions">

              <button
                type="button"
                className="primary-button"
              >
                I'm an exporter
              </button>

              <button
                type="button"
                className="secondary-button"
              >
                I'm a provider
              </button>

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}