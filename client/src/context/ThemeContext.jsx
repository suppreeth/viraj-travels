import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  MIDNIGHT_LIME: 'midnight-lime',
  GRAPHITE_YELLOW: 'graphite-yellow',
  CLASSIC: 'classic',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('vt_theme');
      if (saved && (saved === THEMES.MIDNIGHT_LIME || saved === THEMES.GRAPHITE_YELLOW || saved === THEMES.CLASSIC)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    // Default to classic, or can be toggled by user
    return THEMES.CLASSIC;
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('vt_theme', newTheme);
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

