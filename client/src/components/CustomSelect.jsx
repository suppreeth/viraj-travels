import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const supportsBaseSelect = () => {
  try {
    return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('appearance', 'base-select');
  } catch {
    return false;
  }
};

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
  variant = 'inline', // 'inline' | 'pill' | 'field'
  ariaLabel,
  id,
  name,
}) => {
  const { theme } = useTheme();
  const generatedId = useId();
  const selectId = id || `cs-${generatedId}`;
  const [useNativeBaseSelect] = useState(supportsBaseSelect);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const minWidth = Math.max(rect.width, 210);
    const maxLeft = Math.max(12, window.innerWidth - minWidth - 12);
    setCoords({
      top: rect.bottom + 8,
      left: Math.min(rect.left, maxLeft),
      width: minWidth,
    });
  };

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const handleScrollOrResize = () => updateCoords();
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (useNativeBaseSelect) {
    return (
      <select
        id={selectId}
        name={name}
        aria-label={ariaLabel}
        className={`cs-native cs-variant-${variant} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`cs-trigger cs-variant-${variant} ${open ? 'is-open' : ''} ${className}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="cs-trigger-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`cs-trigger-chevron ${open ? 'is-rotated' : ''}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-labelledby={selectId}
            data-theme={theme}
            className="cs-portal-menu"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              minWidth: `${coords.width}px`,
              zIndex: 9999,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`cs-portal-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check size={15} aria-hidden="true" className="cs-portal-check" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

export default CustomSelect;

