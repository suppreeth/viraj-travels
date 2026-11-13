import React from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';

const BrandLogo = ({ height = 64, solid = false, className = '' }) => {
  const { theme } = useTheme();

  // Dynamically select high-resolution theme-matched logo asset
  let logoSrc = '/logo-classic-navy.png';
  if (theme === THEMES.GRAPHITE_YELLOW) {
    logoSrc = '/logo-graphite-yellow.png';
  } else if (theme === THEMES.CREAM_ORANGE) {
    logoSrc = solid ? '/logo-cream-orange-dark.png' : '/logo-cream-orange-light.png';
  } else {
    logoSrc = solid ? '/logo-classic-navy.png' : '/logo-classic-white.png';
  }

  const dropShadow =
    theme === THEMES.GRAPHITE_YELLOW
      ? 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.35))'
      : theme === THEMES.CREAM_ORANGE
      ? solid
        ? 'none'
        : 'drop-shadow(0 2px 12px rgba(42, 24, 16, 0.55))'
      : solid
      ? 'none'
      : 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5))';

  return (
    <div
      className={`brand-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
      }}
    >
      <img
        src={logoSrc}
        alt="V Raj Holidays - Travel & Tours"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: dropShadow,
          transition: 'filter 0.3s ease, opacity 0.3s ease, height 0.3s ease',
        }}
      />
    </div>
  );
};

export default BrandLogo;

