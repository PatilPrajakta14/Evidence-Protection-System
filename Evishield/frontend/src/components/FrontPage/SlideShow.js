import React, { useState, useEffect } from 'react';
import './Slideshow.css'; 

const Slideshow = ({ images, interval }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [images.length, interval]);

  return (
    <div className="slideshow">
      <img src={images[index]} alt={`Slide ${index + 1}`} />
    </div>
  );
};

export default Slideshow;



