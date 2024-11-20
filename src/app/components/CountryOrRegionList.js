// components/CountryOrRegionList.js
"use client";
import React from 'react';
import CountryOrRegionButton from './CountryOrRegionButton';
import styles from './style.module.css';

const CountryOrRegionList = ({ regions, onRegionClick }) => {
  return (
    <div className={styles.regionList}>
      {regions.map((region) => (
        <CountryOrRegionButton
          key={region.id}
          name={region.name}
          onClick={() => onRegionClick(region)}
        />
      ))}
    </div>
  );
};

export default CountryOrRegionList;