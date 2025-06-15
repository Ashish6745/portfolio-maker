import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import './MultiStepForm.css';
import { useNavigate } from 'react-router-dom';
import techStackData from '../data/techStack.json';
import dsaTopicsData from '../data/dsaTopics.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [githubData, setGithubData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoLanguages, setRepoLanguages] = useState(null);
  const [projectRepos, setProjectRepos] = useState([]);
  const [dsaStats, setDsaStats] = useState(dsaTopicsData);
  const [dsaReport, setDsaReport] = useState(null);
  const [techStack, setTechStack] = useState({});
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    link: ''
  });
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const githubUsername = watch('githubUsername');
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'GitHub Info' },
    { id: 2, title: 'DSA Stats' },
    { id: 3, title: 'Tech Stack' },
    { id: 4, title: 'Projects' },
    { id: 5, title: 'Experience & Education' }
  ];

  const fetchRepoLanguages = async (username) => {
    try {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
      const repos = await reposResponse.json();

      if (!Array.isArray(repos)) {
        throw new Error("Failed to fetch repositories");
      }

      const languageCounts = {};
      const projectReposData = [];
      
      const languagePromises = repos.map(async (repo) => {
        const langResponse = await fetch(repo.languages_url);
        const languages = await langResponse.json();
        
        // Store project repo data with languages
        if (Object.keys(languages).length > 0) {
          projectReposData.push({
            name: repo.name,
            languages: Object.keys(languages),
            primaryLanguage: Object.keys(languages)[0], // Most used language
            languageBytes: languages,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count
          });
        }
        
        return languages;
      });

      const languagesResults = await Promise.all(languagePromises);

      // Count repositories per language
      languagesResults.forEach((languages) => {
        Object.keys(languages).forEach((language) => {
          if (languageCounts[language]) {
            languageCounts[language]++;
          } else {
            languageCounts[language] = 1;
          }
        });
      });

      // Sort languages by repository count
      const sortedLanguages = Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      // Sort project repos by stars/activity
      const sortedProjectRepos = projectReposData
        .sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks))
        .slice(0, 10); // Top 10 most popular repos

      setRepoLanguages(sortedLanguages);
      setProjectRepos(sortedProjectRepos);
    } catch (error) {
      console.error("Error fetching repository languages:", error);
      setError("Failed to fetch repository languages");
    }
  };

  const fetchGithubData = async () => {
    if (!githubUsername) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}`);
      const data = await response.json();
      if (response.ok) {
        setGithubData(data);
        // Fetch repository languages after getting user data
        await fetchRepoLanguages(githubUsername);
      } else {
        setGithubData(null);
        setRepoLanguages(null);
        setProjectRepos([]);
        setError(data.message || 'Failed to fetch GitHub data');
      }
    } catch (error) {
      setGithubData(null);
      setRepoLanguages(null);
      setProjectRepos([]);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch when username changes and is valid
  useEffect(() => {
    const timer = setTimeout(() => {
      if (githubUsername && githubUsername.length >= 3) {
        fetchGithubData();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [githubUsername]);

  const handleProjectChange = (field, value) => {
    setCurrentProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addProject = () => {
    if (currentProject.title && currentProject.description) {
      setProjects(prev => [...prev, currentProject]);
      setCurrentProject({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        link: ''
      });
    }
  };

  const removeProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    // Navigate to portfolio page with form data
    navigate('/portfolio', { 
      state: {
        githubData,
        dsaReport,
        techStack,
        projects,
        projectRepos,
        ...data
      }
    });
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  const languageChartData = {
    labels: Object.keys(repoLanguages || {}).slice(0, 6),
    datasets: [
      {
        label: "Number of Repositories",
        data: Object.values(repoLanguages || {}).slice(0, 6),
        backgroundColor: "rgba(234, 47, 20, 0.6)",
        borderColor: "rgba(234, 47, 20, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Languages by Repository Count",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  // Generate colors for different languages
  const generateColors = (count) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];
    return colors.slice(0, count);
  };

  // Project repositories chart data
  const projectReposChartData = {
    labels: projectRepos.map(repo => repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name),
    datasets: [
      {
        label: 'Stars',
        data: projectRepos.map(repo => repo.stars),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Forks',
        data: projectRepos.map(repo => repo.forks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  const projectReposChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Repositories by Popularity',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const repoIndex = context.dataIndex;
            const repo = projectRepos[repoIndex];
            return `Languages: ${repo.languages.join(', ')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  // Language distribution in top repos
  const getLanguageDistribution = () => {
    const langCount = {};
    projectRepos.forEach(repo => {
      repo.languages.forEach(lang => {
        langCount[lang] = (langCount[lang] || 0) + 1;
      });
    });
    return langCount;
  };

  const languageDistribution = getLanguageDistribution();
  const languageDistributionData = {
    labels: Object.keys(languageDistribution),
    datasets: [
      {
        data: Object.values(languageDistribution),
        backgroundColor: generateColors(Object.keys(languageDistribution).length),
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  const languageDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Language Distribution in Top Repositories',
      },
    },
  };

  const calculateDSAReport = () => {
    const totalSolved = Object.values(dsaStats).reduce((sum, topic) => sum + topic.solved, 0);
    const weightedScore = Object.entries(dsaStats).reduce((score, [topic, data]) => {
      return score + (data.solved * data.weight);
    }, 0);
    
    const topicsWithQuestions = Object.values(dsaStats).filter(topic => topic.solved > 0).length;
    const coveragePercentage = (topicsWithQuestions / Object.keys(dsaStats).length) * 100;

    let starRating = 1;
    if (totalSolved < 100) {
      starRating = Math.min(2, Math.ceil(totalSolved / 50));
    } else if (totalSolved >= 100 && totalSolved < 300) {
      starRating = Math.min(4, Math.ceil(weightedScore / 150));
    } else if (totalSolved >= 300 && weightedScore >= 400 && coveragePercentage >= 70) {
      starRating = 5;
    }

    let recommendation = '';
    if (starRating <= 2) {
      recommendation = 'Focus on solving more problems across different topics. Start with basic array and string problems.';
    } else if (starRating === 3) {
      recommendation = 'Good progress! Try to solve more medium and hard problems in your strong topics.';
    } else if (starRating === 4) {
      recommendation = 'Excellent work! Focus on advanced topics and complex problem-solving patterns.';
    } else {
      recommendation = 'Outstanding! Consider contributing to competitive programming or mentoring others.';
    }

    setDsaReport({
      totalSolved,
      weightedScore: Math.round(weightedScore),
      coveragePercentage: Math.round(coveragePercentage),
      starRating,
      recommendation
    });
  };

  const handleDSAInputChange = (topic, value) => {
    // Remove leading zeros and convert to number
    const cleanValue = value.replace(/^0+/, '') || '0';
    const numValue = parseInt(cleanValue, 10);
    
    // Update if it's a valid number
    if (!isNaN(numValue)) {
      setDsaStats(prev => ({
        ...prev,
        [topic]: {
          ...prev[topic],
          solved: numValue
        }
      }));
    }
  };

  const handleTechStackChange = (techId) => {
    setTechStack(prev => ({
      ...prev,
      [techId]: !prev[techId]
    }));
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`step ${s.id <= step ? "active" : ""}`}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="step-content">
                <h2 className="step-title">GitHub Information</h2>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter GitHub username"
                    className="input-field"
                    {...register("githubUsername", { required: true })}
                  />
                  <button
                    type="button"
                    className="fetch-button"
                    onClick={fetchGithubData}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Fetch Data"
                    )}
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {githubData && (
                  <div className="github-profile">
                    <div className="profile-header">
                      <img
                        src={githubData.avatar_url}
                        alt="GitHub Avatar"
                        className="avatar"
                      />
                      <div className="profile-info">
                        <h3 className="profile-name">{githubData.name}</h3>
                        <p className="profile-username">@{githubData.login}</p>
                      </div>
                    </div>
                    <div className="profile-stats">
                      <div className="stat">
                        <span className="stat-value">{githubData.public_repos}</span>
                        <span className="stat-label">Repositories</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{githubData.followers}</span>
                        <span className="stat-label">Followers</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{githubData.following}</span>
                        <span className="stat-label">Following</span>
                      </div>
                    </div>
                    
                    {repoLanguages && Object.keys(repoLanguages).length > 0 && (
                      <div className="languages-section">
                        <h3 className="languages-title">Top Languages</h3>
                        <div className="chart-container">
                          <Bar data={languageChartData} options={chartOptions} />
                        </div>
                      </div>
                    )}

                    {projectRepos.length > 0 && (
                      <div className="project-repos-section">
                        <h3 className="section-title">Repository Analysis</h3>
                        
                        {/* Repository Popularity Chart */}
                        <div className="chart-container">
                          <Bar data={projectReposChartData} options={projectReposChartOptions} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="step-content">
                <h2 className="step-title">DSA Stats</h2>
                <div className="dsa-inputs">
                  {Object.entries(dsaStats).map(([topic, data]) => (
                    <div key={topic} className="input-group">
                      <label className="topic-label">{topic}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter count"
                        className="dsa-input-field"
                        value={data.solved}
                        onChange={(e) => handleDSAInputChange(topic, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="analyze-button"
                  onClick={calculateDSAReport}
                >
                  Analyze DSA Progress
                </button>

                {dsaReport && (
                  <div className="dsa-report">
                    <h3>DSA Progress Report</h3>
                    <div className="report-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total Questions Solved:</span>
                        <span className="stat-value">{dsaReport.totalSolved}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Weighted Score:</span>
                        <span className="stat-value">{dsaReport.weightedScore}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Topic Coverage:</span>
                        <span className="stat-value">{dsaReport.coveragePercentage}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">DSA Rating:</span>
                        <span className="stat-value">
                          {'★'.repeat(dsaReport.starRating)}
                          {'☆'.repeat(5 - dsaReport.starRating)}
                        </span>
                      </div>
                    </div>
                    <div className="recommendation">
                      <h4>Recommendation:</h4>
                      <p>{dsaReport.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="step-content">
                <h2 className="step-title">Tech Stack</h2>
                <div className="tech-stack-container">
                  {Object.entries(techStackData).map(([category, technologies]) => (
                    <div key={category} className="tech-category">
                      <h3 className="category-title">
                        {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <div className="tech-grid">
                        {technologies.map(tech => (
                          <label key={tech} className="tech-checkbox">
                            <input
                              type="checkbox"
                              checked={techStack[tech.toLowerCase()] || false}
                              onChange={() => handleTechStackChange(tech.toLowerCase())}
                            />
                            <span className="checkbox-label">{tech}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-content">
                <h2 className="step-title">Projects</h2>
                <div className="projects-container">
                  <div className="project-form">
                    <div className="input-group">
                      <label className="input-label">Project Title</label>
                      <input
                        type="text"
                        className="input-field"
                        value={currentProject.title}
                        onChange={(e) => handleProjectChange('title', e.target.value)}
                        placeholder="Enter project title"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Project Description</label>
                      <textarea
                        className="input-field"
                        value={currentProject.description}
                        onChange={(e) => handleProjectChange('description', e.target.value)}
                        placeholder="Describe your project"
                        rows="4"
                      />
                    </div>
                    <div className="date-inputs">
                      <div className="input-group">
                        <label className="input-label">Start Date</label>
                        <input
                          type="date"
                          className="input-field"
                          value={currentProject.startDate}
                          onChange={(e) => handleProjectChange('startDate', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">End Date</label>
                        <input
                          type="date"
                          className="input-field"
                          value={currentProject.endDate}
                          onChange={(e) => handleProjectChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Project Link</label>
                      <input
                        type="url"
                        className="input-field"
                        value={currentProject.link}
                        onChange={(e) => handleProjectChange('link', e.target.value)}
                        placeholder="Enter project URL"
                      />
                    </div>
                    <button
                      type="button"
                      className="add-project-button"
                      onClick={addProject}
                    >
                      Add Project
                    </button>
                  </div>

                  {projects.length > 0 && (
                    <div className="projects-list">
                      <h3>Added Projects</h3>
                      {projects.map((project, index) => (
                        <div key={index} className="project-card">
                          <div className="project-header">
                            <h4>{project.title}</h4>
                            <button
                              type="button"
                              className="remove-project"
                              onClick={() => removeProject(index)}
                            >
                              ×
                            </button>
                          </div>
                          <p className="project-description">{project.description}</p>
                          <div className="project-dates">
                            <span>{project.startDate}</span>
                            <span>to</span>
                            <span>{project.endDate}</span>
                          </div>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              View Project
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="step-content">
                <h2 className="step-title">Contact Information</h2>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Location"
                    className="input-field"
                    {...register("location", { required: true })}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input-field"
                    {...register("phone", { required: true })}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    className="input-field"
                    {...register("linkedin", { required: true })}
                  />
                </div>
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button
                  type="button"
                  className="nav-button prev-button"
                  onClick={prevStep}
                >
                  Previous
                </button>
              )}
              {step < steps.length ? (
                <button
                  type="button"
                  className="nav-button next-button"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button type="submit" className="nav-button submit-button">
                  Generate Portfolio
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;