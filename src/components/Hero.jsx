import { Link } from 'react-router-dom';

const Hero = ({ darkMode }) => {
  const heroStyle = {
    minHeight: 'calc(100vh - 6rem)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0',
    transition: 'background-color 0.2s',
    margin: 0
  };

  const contentStyle = {
    width: '100%',
    textAlign: 'center',
    margin: 0
  };

  const headlineStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#EA2F14',
    lineHeight: '1.2'
  };

  const subheadlineStyle = {
    fontSize: '1.5rem',
    fontWeight: '400',
    marginBottom: '1.5rem',
    color: darkMode ? '#FFFFFF' : '#1f2937',
    lineHeight: '1.5',
    margin: '0 auto 1.5rem'
  };

  const descriptionStyle = {
    fontSize: '1.125rem',
    color: '#EA2F14',
    marginBottom: '2.5rem',
    lineHeight: '1.6',
    margin: '0 auto 2.5rem'
  };

  const ctaButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#EA2F14',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  const arrowStyle = {
    transition: 'transform 0.3s ease'
  };

  const handleMouseOver = (e) => {
    e.currentTarget.querySelector('span').style.transform = 'translateX(4px)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.querySelector('span').style.transform = 'translateX(0)';
  };

  return (
    <section style={heroStyle}>
      <div style={contentStyle}>
        <h1 style={headlineStyle}>
          Craft Your Developer Portfolio in Minutes
        </h1>
        <p style={subheadlineStyle}>
          Build a stunning, professional portfolio — no design skills needed. Just fill out a form, and we handle the rest.
        </p>
        <p style={descriptionStyle}>
          Whether you're a junior dev or seasoned engineer, showcase your work, skills, and GitHub in a sleek portfolio that speaks for you.
        </p>
        <Link 
          to="/form" 
          style={ctaButtonStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Create My Portfolio 
          <span style={arrowStyle}>→</span>
        </Link>
      </div>
    </section>
  );
};

export default Hero; 