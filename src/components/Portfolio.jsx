import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Portfolio.css';

const Portfolio = () => {
  const location = useLocation();
  const { githubData, dsaReport, techStack, projects } = location.state || {};

 
  console.log('Github Data:', githubData);
  console.log('projects', projects);

  const [isVisible, setIsVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const cardTimer = setTimeout(() => {
      setAnimateCards(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(cardTimer);
    };
  }, []);

  if (!location.state) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-container">
          <div className="error-message animate-fade-in">
            <div className="error-icon">⚠️</div>
            <h2>No Portfolio Data Found</h2>
            <p>Please complete the form to generate your portfolio.</p>
            <button 
              className="return-button" 
              onClick={() => window.location.href = '/form'}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#EA2F14',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              Go to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="background-gradient"></div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className={`portfolio-container ${isVisible ? 'animate-slide-up' : ''}`}>
        {/* Header Section */}
        <header className="portfolio-header">
          <div className="profile-section">
            <div className="profile-avatar-container">
              <img 
                src={githubData?.avatar_url} 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ea2f14'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='60' fill='white' text-anchor='middle'%3E👤%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="avatar-ring"></div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {githubData?.name || 'Developer Name'}
                <span className="name-highlight"></span>
              </h1>
              <p className="github-username">@{githubData?.login || 'username'}</p>
              {githubData?.bio && (
                <p className="profile-bio">{githubData.bio}</p>
              )}
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{githubData?.public_repos || 0}</span>
                  <span className="stat-label">Repositories</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{githubData?.followers || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{githubData?.following || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              {githubData?.html_url && (
                <a 
                  href={githubData.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <svg viewBox="0 0 24 24" className="github-icon">
                    <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View GitHub Profile
                </a>
              )}
            </div>
          </div>
        </header>

        {/* DSA Progress Section */}
        {dsaReport && (
          <section className={`portfolio-section dsa-section ${animateCards ? 'animate-fade-in-up' : ''}`}>
            <h2>
              <span className="section-icon">🧮</span>
              DSA Progress
            </h2>
            <div className="dsa-stats-grid">
              <div className="stat-card" style={{animationDelay: '0.1s'}}>
                <div className="stat-card-icon">📊</div>
                <span className="stat-value">{dsaReport.totalSolved || 0}</span>
                <span className="stat-label">Total Questions</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="stat-card" style={{animationDelay: '0.2s'}}>
                <div className="stat-card-icon">⚡</div>
                <span className="stat-value">{dsaReport.weightedScore || 0}</span>
                <span className="stat-label">Weighted Score</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="stat-card" style={{animationDelay: '0.3s'}}>
                <div className="stat-card-icon">🎯</div>
                <span className="stat-value">{dsaReport.coveragePercentage || 0}%</span>
                <span className="stat-label">Topic Coverage</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: `${dsaReport.coveragePercentage || 0}%`}}></div>
                </div>
              </div>
              <div className="stat-card" style={{animationDelay: '0.4s'}}>
                <div className="stat-card-icon">⭐</div>
                <span className="stat-value rating">
                  {'★'.repeat(dsaReport.starRating || 0)}
                  {'☆'.repeat(5 - (dsaReport.starRating || 0))}
                </span>
                <span className="stat-label">DSA Rating</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: `${(dsaReport.starRating || 0) * 20}%`}}></div>
                </div>
              </div>
            </div>
            {dsaReport.recommendation && (
              <div className="recommendation-box">
                <div className="recommendation-header">
                  <span className="recommendation-icon">💡</span>
                  <h3>AI Recommendation</h3>
                </div>
                <p>{dsaReport.recommendation}</p>
              </div>
            )}
          </section>
        )}

        {/* Tech Stack Section */}
        {techStack && Object.values(techStack).some(Boolean) && (
          <section className={`portfolio-section tech-section ${animateCards ? 'animate-fade-in-up' : ''}`}>
            <h2>
              <span className="section-icon">💻</span>
              Tech Stack
            </h2>
            <div className="tech-categories">
              {Object.entries(techStack).map(([tech, isSelected], index) => (
                isSelected && (
                  <div 
                    key={tech} 
                    className="tech-item"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <span className="tech-name">{tech}</span>
                    <div className="tech-glow"></div>
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className={`portfolio-section projects-section ${animateCards ? 'animate-fade-in-up' : ''}`}>
            <h2>
              <span className="section-icon">🚀</span>
              Featured Projects
            </h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="project-card"
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className="project-dates">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <span>View Project</span>
                      <svg
                        className="link-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                  <div className="project-overlay"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="footer-content">
            <p>Built with ❤️ using React</p>
            <div className="social-links">
              {githubData?.html_url && (
                <a href={githubData.html_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;