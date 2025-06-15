import { useState, useEffect } from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Update the document class and localStorage when darkMode changes
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

  const layoutStyle = {
    minHeight: '100vh',
    backgroundColor: darkMode ? '#000000' : '#ffffff',
    transition: 'background-color 0.2s',
    margin: 0,
    padding: 0
  };

  const mainStyle = {
    paddingTop: '6rem',
    margin: 0,
    padding: 0
  };

  const containerStyle = {
    width: '100vw',
    margin: 0,
    padding: 0
  };

  return (
    <div style={layoutStyle}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main style={mainStyle}>
        <div style={containerStyle}>
          {Array.isArray(children)
            ? children.map(child => child && typeof child.type === 'function' ? 
                { ...child, props: { ...child.props, darkMode } } : child)
            : children && typeof children.type === 'function'
              ? { ...children, props: { ...children.props, darkMode } }
              : children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 