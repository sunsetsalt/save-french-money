import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }

  void main() {
    vec2 st = vUv;
    vec2 pos = st * 8.0;
    
    float time = uTime * 0.5;
    
    // Create flowing liquid effect
    float noise1 = fbm(pos + time * 0.3);
    float noise2 = fbm(pos + vec2(100.0) + time * 0.2);
    
    // Distortion
    vec2 distortion = vec2(noise1, noise2) * 0.1;
    
    // Create flowing patterns
    float flow1 = sin(pos.x * 0.5 + time + noise1 * 2.0) * 0.5 + 0.5;
    float flow2 = sin(pos.y * 0.3 + time * 0.7 + noise2 * 1.5) * 0.5 + 0.5;
    
    // Combine flows
    float combined = flow1 * flow2;
    
    // Create color gradient
    vec3 color1 = vec3(0.8, 0.6, 0.1); // Deep gold
    vec3 color2 = vec3(0.9, 0.7, 0.2); // Bright gold
    vec3 color3 = vec3(1.0, 0.8, 0.3); // Light gold
    
    vec3 finalColor = mix(color1, color2, combined);
    finalColor = mix(finalColor, color3, smoothstep(0.3, 0.7, noise1));
    
    // Add some brightness variation
    finalColor *= (0.8 + 0.4 * combined);
    
    // Glass-like transparency
    float alpha = 0.7 + 0.3 * combined;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const LiquidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 mix-blend-overlay"
    />
  );
};