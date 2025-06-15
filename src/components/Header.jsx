import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import p1Logo from '../assets/p1.png';
import p2Logo from '../assets/p2.png';

const Header = ({ darkMode, toggleDarkMode }) => {
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
    boxShadow: darkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '6rem'
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem'
  };

  const logoStyle = {
    height: '4.5rem',
    width: 'auto',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    marginTop: '-0.5rem',
    border: '2px solid #EA2F14',
    borderRadius: '0.5rem',
    padding: '0.25rem'
  };

  const navLinksStyle = {
    display: 'none',
    gap: '2rem'
  };

  const linkStyle = {
    color: darkMode ? '#d1d5db' : '#4b5563',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.2s',
    position: 'relative'
  };

  const linkHoverStyle = {
    color: darkMode ? '#818cf8' : '#4f46e5'
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };

  const themeButtonStyle = {
    padding: '0.75rem',
    borderRadius: '0.75rem',
    backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: darkMode 
      ? '0 2px 4px rgba(0, 0, 0, 0.2)'
      : '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const getStartedButtonStyle = {
    display: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    background: 'linear-gradient(to right, #6366f1, #a855f7)',
    color: 'white',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <nav style={navStyle}>
          <img 
            src={darkMode ? p2Logo : p1Logo} 
            alt="PortfolioMaker Logo" 
            style={logoStyle}
          />
          <div style={navLinksStyle}>
            {['Home', 'Projects', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                style={linkStyle}
                onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
                onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
        <div style={buttonContainerStyle}>
          <button
            onClick={toggleDarkMode}
            style={themeButtonStyle}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon style={{ width: '1.5rem', height: '1.5rem', color: '#EA2F14' }} />
            ) : (
              <MoonIcon style={{ width: '1.5rem', height: '1.5rem', color: '#EA2F14' }} />
            )}
          </button>
          <button style={getStartedButtonStyle}>
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 