
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface Petal {
  angle: number;
  length: number;
  targetLength: number;
  width: number;
  color: string;
}
