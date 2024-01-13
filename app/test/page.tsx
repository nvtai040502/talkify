"use client"
import {useState} from 'react';

export default function App() {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = event => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return (
    <div>
      <h2>Scroll Top: {scrollTop}</h2>

      <div
        style={{
          border: '3px solid black',
          width: '400px',
          height: '100px',
          overflow: 'scroll',
        }}
        onScroll={handleScroll}
      >
        {[...Array(20)].map((_, index) => (
          <p key={index}>Content {index}</p>
        ))}
      </div>
    </div>
  );
}
