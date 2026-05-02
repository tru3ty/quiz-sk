export default function OrbitalNoise() {
  return (
    <svg width="0" height="0" className="absolute">
      <filter id="orbNoise">
        <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
      </filter>
    </svg>
  );
}
