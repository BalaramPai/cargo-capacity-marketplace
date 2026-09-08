import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="CargoLink home">
          <span className="brand-mark">C</span>
          <span className="brand-name">CargoLink</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#how-it-works">How it works</a>
          <a href="/#for-business">For businesses</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Sign in
          </Link>

          <Link to="/register" className="nav-cta">
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar