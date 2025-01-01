import React, { useEffect } from 'react';
import './Snowflakes.css'; // Import the corresponding CSS

const Snowflakes = () => {
    useEffect(() => {
        // Create snowflakes on component mount
        const snowflakeContainer = document.querySelector('.snowflakes');
        const snowflakeCount = 10; // Reduced number of snowflakes to 7

        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('span');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄'; // Snowflake character
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            snowflakeContainer.appendChild(snowflake);
        }

        return () => {
            // Cleanup on component unmount
            if (snowflakeContainer) {
                snowflakeContainer.innerHTML = '';
            }
        };
    }, []);

    return <div className="snowflakes"></div>;
};

export default Snowflakes;
