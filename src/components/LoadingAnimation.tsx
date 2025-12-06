'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LoadingAnimationProps {
  isVisible: boolean;
}

export default function LoadingAnimation({ isVisible }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 50);
    camera.rotation.x = -Math.PI / 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    const gridSize = 80;

    // Vertical lines (data towers)
    const verticalLines: THREE.Line[] = [];
    const verticalLineMaterial = new THREE.LineBasicMaterial({
      color: 0xcfff04,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < 15; i++) {
      const height = 15 + Math.random() * 20;
      const geometry = new THREE.BufferGeometry();
      const x = (Math.random() - 0.5) * gridSize * 0.8;
      const z = (Math.random() - 0.5) * gridSize * 0.8;

      const points = [
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x, height, z),
      ];
      geometry.setFromPoints(points);

      const line = new THREE.Line(geometry, verticalLineMaterial.clone());
      scene.add(line);
      verticalLines.push(line);
    }

    // Particle groups (rising data)
    const particleGroups: Array<{
      points: THREE.Points;
      velocities: Float32Array;
      lifetimes: Float32Array;
    }> = [];

    for (let g = 0; g < 8; g++) {
      const particleCount = 200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const lifetimes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * gridSize;
        positions[i3 + 1] = Math.random() * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * gridSize;

        velocities[i3] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 1] = Math.random() * 0.5 + 0.2;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

        lifetimes[i] = Math.random();
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0x2cff05,
        size: 0.3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      particleGroups.push({ points, velocities, lifetimes });
    }

    // Data streams (curved paths)
    const dataStreams: Array<{
      line: THREE.Line;
      particles: THREE.Points;
      progress: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      const startX = (Math.random() - 0.5) * gridSize * 0.9;
      const startZ = (Math.random() - 0.5) * gridSize * 0.9;
      const endX = (Math.random() - 0.5) * gridSize * 0.9;
      const endZ = (Math.random() - 0.5) * gridSize * 0.9;
      const height = Math.random() * 8 + 2;

      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(startX, 0.2, startZ),
        new THREE.Vector3(startX, height, startZ + (endZ - startZ) * 0.3),
        new THREE.Vector3(endX, height, endZ - (endZ - startZ) * 0.3),
        new THREE.Vector3(endX, 0.2, endZ)
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xcfff04,
        transparent: true,
        opacity: 0.15,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);

      const streamParticleCount = 12;
      const streamGeometry = new THREE.BufferGeometry();
      const streamPositions = new Float32Array(streamParticleCount * 3);
      streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));

      const streamMaterial = new THREE.PointsMaterial({
        color: 0x2cff05,
        size: 0.5,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });

      const streamParticles = new THREE.Points(streamGeometry, streamMaterial);
      scene.add(streamParticles);

      dataStreams.push({
        line,
        particles: streamParticles,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
      });
    }

    // Glow particles
    const glowParticles: THREE.Points[] = [];
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.BufferGeometry();
      const position = new Float32Array(3);
      position[0] = (Math.random() - 0.5) * gridSize * 0.8;
      position[1] = 0.5;
      position[2] = (Math.random() - 0.5) * gridSize * 0.8;
      geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

      const material = new THREE.PointsMaterial({
        color: 0xcfff04,
        size: 1.5 + Math.random() * 2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particle = new THREE.Points(geometry, material);
      scene.add(particle);
      glowParticles.push(particle);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x112211, 1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xcfff04, 1, 100);
    pointLight1.position.set(20, 15, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2cff05, 1, 100);
    pointLight2.position.set(-20, 15, -20);
    scene.add(pointLight2);

    let frame = 0;

    const animate = () => {
      frame++;

      // Animate rising particles
      particleGroups.forEach(({ points, velocities, lifetimes }) => {
        const positions = points.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;

          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          lifetimes[i] += 0.01;

          if (positions[i3 + 1] > 35 || lifetimes[i] > 1) {
            positions[i3] = (Math.random() - 0.5) * gridSize;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = (Math.random() - 0.5) * gridSize;
            lifetimes[i] = 0;
          }
        }

        points.geometry.attributes.position.needsUpdate = true;
      });

      // Animate data streams
      dataStreams.forEach((stream) => {
        stream.progress += stream.speed;
        if (stream.progress > 1) stream.progress = 0;

        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3().fromArray(
            (stream.line.geometry.attributes.position.array as Float32Array).slice(0, 3)
          ),
          new THREE.Vector3().fromArray(
            (stream.line.geometry.attributes.position.array as Float32Array).slice(48, 51)
          ),
          new THREE.Vector3().fromArray(
            (stream.line.geometry.attributes.position.array as Float32Array).slice(96, 99)
          ),
          new THREE.Vector3().fromArray(
            (stream.line.geometry.attributes.position.array as Float32Array).slice(150, 153)
          )
        );

        const positions = stream.particles.geometry.attributes.position.array as Float32Array;
        const particleCount = positions.length / 3;

        for (let i = 0; i < particleCount; i++) {
          const t = (stream.progress + i / particleCount) % 1;
          const point = curve.getPoint(t);
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        }

        stream.particles.geometry.attributes.position.needsUpdate = true;
      });

      // Animate vertical lines
      verticalLines.forEach((line, index) => {
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.2 + Math.sin(frame * 0.02 + index * 0.5) * 0.3;
      });

      // Animate glow particles
      glowParticles.forEach((particle, index) => {
        const material = particle.material as THREE.PointsMaterial;
        const pulseSpeed = 0.03 + (index % 3) * 0.01;
        material.opacity = 0.3 + Math.sin(frame * pulseSpeed + index) * 0.4;
        material.size = 1.5 + Math.sin(frame * pulseSpeed + index) * 1;
      });

      // Camera movement
      camera.position.x = Math.sin(frame * 0.001) * 5;
      camera.position.z = 50 + Math.cos(frame * 0.0008) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible]);

  if (!isVisible && opacity === 0) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full z-50 transition-opacity duration-700 ease-in-out"
      style={{
        opacity,
        background: 'linear-gradient(to bottom, #050510, #0a1530)'
      }}
    >
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#CFFF04]/20 to-[#2CFF05]/20 border border-[#CFFF04]/30 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-[#CFFF04] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#CFFF04] tracking-wider">ANALYZING WEB3 ECOSYSTEM</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#CFFF04] via-[#8AFF04] to-[#2CFF05] bg-clip-text text-transparent">
              Discovering Your Path
            </span>
          </h2>

          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#CFFF04] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#8AFF04] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#2CFF05] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          <div className="space-y-2 text-sm text-gray-400 max-w-md mx-auto">
            <p className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#CFFF04] rounded-full animate-pulse"></span>
              Scanning Web3 data sources
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8AFF04] rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
              Analyzing real-time opportunities
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2CFF05] rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
              Generating personalized pathway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

