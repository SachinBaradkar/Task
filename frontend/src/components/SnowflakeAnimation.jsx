import React from 'react';
import './SnowflakeAnimation.css';

const SnowflakeAnimation = () => {
  const snowflakes = Array.from({ length: 50 }, (_, index) => index);

  return (
    <div className="snowflake-container">
      {snowflakes.map((flake) => (
        <div key={flake} className="snowflake">
          ❄
        </div>
      ))}
    </div>
  );
};

export default SnowflakeAnimation;
