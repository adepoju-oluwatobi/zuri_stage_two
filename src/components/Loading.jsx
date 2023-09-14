import React, { useState, useEffect } from "react";

const Loading = () => {
  // Initial color
  const [color, setColor] = useState("#BE123C");

  // Function to change the color randomly
  const changeColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  };

  // Change color every 1 second
  useEffect(() => {
    const interval = setInterval(changeColor, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-2 justify-center items-center">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4"
          style={{ borderTopColor: color }}
        ></div>
        <div>Loading Banner, please wait a moment</div>
      </div>
    </div>
  );
};

export default Loading;
