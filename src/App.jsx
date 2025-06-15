import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import MultiStepForm from './components/MultiStepForm.new';
import Portfolio from './components/Portfolio.jsx';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.backgroundColor = '#000000';
      document.documentElement.style.color = '#f3f4f6';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.color = '#1f2937';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={<Hero darkMode={darkMode} />} />
          <Route path="/form" element={<MultiStepForm />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
