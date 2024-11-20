// components/CountryOrRegionButton.js
import React, { useState } from 'react';
import styles from './style.module.css';

const CountryOrRegionButton = ({ name, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`${styles.button} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default CountryOrRegionButton;