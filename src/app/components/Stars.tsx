export default function Stars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  const cartoonStars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 15,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={`dot-${star.id}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            opacity: 0.7,
          }}
        />
      ))}
      {cartoonStars.map((star) => (
        <div
          key={`cartoon-${star.id}`}
          className="absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite, spin ${star.duration * 2}s linear infinite`,
            transform: `rotate(${star.rotation}deg)`,
          }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="white"
            opacity="0.8"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
