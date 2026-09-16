// src/components/Logo/Logo.jsx

const Logo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#5dcaa5" strokeWidth="2">
    <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
  </svg>
);

export default Logo;
