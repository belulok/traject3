'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MarketVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    blockchainCubes: THREE.Mesh[];
    neuralNetwork: THREE.Group;
    cryptoSymbols: THREE.Sprite[];
    glowingSpheres: THREE.Mesh[];
    frameId: number;
  }>();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    isInitializedRef.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const colorChoice = Math.random();
      if (colorChoice > 0.66) {
        // Lime Yellow (#CFFF04)
        colors[i3] = 0.81;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 0.02;
      } else if (colorChoice > 0.33) {
        // Bright Green (#2CFF05)
        colors[i3] = 0.17;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 0.02;
      } else {
        // Mix/transition color
        colors[i3] = 0.5 + Math.random() * 0.3;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 0.02 + Math.random() * 0.1;
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Blockchain cubes
    const blockchainCubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeEdgesGeometry = new THREE.EdgesGeometry(cubeGeometry);

    for (let i = 0; i < 8; i++) {
      // Alternate between lime yellow and bright green
      const cubeColor = i % 2 === 0 ? 0xcfff04 : 0x2cff05;
      const cubeMaterial = new THREE.MeshBasicMaterial({
        color: cubeColor,
        transparent: true,
        opacity: 0.1,
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      const edgesMaterial = new THREE.LineBasicMaterial({
        color: cubeColor,
        transparent: true,
        opacity: 0.8,
      });
      const edges = new THREE.LineSegments(cubeEdgesGeometry, edgesMaterial);
      cube.add(edges);

      const angle = (i / 8) * Math.PI * 2;
      cube.position.set(
        Math.cos(angle) * 20,
        Math.sin(angle * 2) * 10,
        Math.sin(angle) * 20
      );

      blockchainCubes.push(cube);
      scene.add(cube);
    }

    // Neural network elements
    const neuralNetwork = new THREE.Group();
    const glowingSpheres: THREE.Mesh[] = [];

    for (let i = 0; i < 6; i++) {
      const aiElement = new THREE.Group();

      const nodeGeometry = new THREE.IcosahedronGeometry(1.2, 1);
      // Alternate between lime yellow and bright green
      const color = i % 2 === 0 ? 0xcfff04 : 0x2cff05;
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        wireframe: true,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      aiElement.add(node);

      const innerNodeGeometry = new THREE.OctahedronGeometry(0.6, 0);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
      });
      const innerNode = new THREE.Mesh(innerNodeGeometry, innerMaterial);
      aiElement.add(innerNode);

      const orbitRadius = 1.8;
      for (let j = 0; j < 4; j++) {
        const orbitAngle = (j / 4) * Math.PI * 2;
        const smallNodeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const smallNode = new THREE.Mesh(smallNodeGeometry, new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.8,
        }));
        smallNode.position.set(
          Math.cos(orbitAngle) * orbitRadius,
          Math.sin(orbitAngle) * orbitRadius,
          0
        );
        aiElement.add(smallNode);
      }

      const angle = (i / 6) * Math.PI * 2;
      aiElement.position.set(
        Math.cos(angle) * 30,
        Math.sin(i) * 15,
        Math.sin(angle) * 30
      );

      glowingSpheres.push(node);
      scene.add(aiElement);
    }

    // Crypto symbols
    const cryptoSymbols: THREE.Sprite[] = [];
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const symbols = ['Ξ', '₿', '◊', '◈', '⬡'];

      symbols.forEach((symbol, idx) => {
        ctx.clearRect(0, 0, 128, 128);
        ctx.fillStyle = idx % 2 === 0 ? '#CFFF04' : '#2CFF05';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6,
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        const angle = (idx / symbols.length) * Math.PI * 2;
        sprite.position.set(
          Math.cos(angle) * 35,
          Math.sin(idx * 2) * 12,
          Math.sin(angle) * 35
        );
        sprite.scale.set(4, 4, 1);

        cryptoSymbols.push(sprite);
        scene.add(sprite);
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xcfff04, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2cff05, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!sceneRef.current) return;

      const currentTime = Date.now() * 0.001;

      // Smooth lerp for mouse movement
      const lerpFactor = 0.05;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(currentTime * 0.5 + positions[i] * 0.05) * 0.015;
        positions[i + 1] += Math.cos(currentTime * 0.5 + positions[i + 1] * 0.05) * 0.015;
        positions[i + 2] += Math.sin(currentTime * 0.3 + positions[i + 2] * 0.05) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0005;

      // Animate blockchain cubes
      blockchainCubes.forEach((cube, i) => {
        cube.rotation.x += 0.002 + i * 0.0001;
        cube.rotation.y += 0.003 + i * 0.0001;
        cube.rotation.z += 0.001 + i * 0.0001;

        const angle = currentTime * 0.1 + (i / blockchainCubes.length) * Math.PI * 2;
        cube.position.x = Math.cos(angle) * 20;
        cube.position.z = Math.sin(angle) * 20;
        cube.position.y = Math.sin(currentTime * 0.2 + i) * 10;
      });

      // Animate glowing spheres
      glowingSpheres.forEach((sphere, i) => {
        const scale = 1 + Math.sin(currentTime * 2 + i) * 0.3;
        sphere.scale.setScalar(scale);

        sphere.rotation.x += 0.01 + i * 0.002;
        sphere.rotation.y += 0.015 + i * 0.001;
        sphere.rotation.z += 0.008 + i * 0.0015;

        const parentGroup = sphere.parent;
        if (parentGroup) {
          const angle = currentTime * 0.15 + (i / glowingSpheres.length) * Math.PI * 2;
          parentGroup.position.x = Math.cos(angle) * 30;
          parentGroup.position.z = Math.sin(angle) * 30;
          parentGroup.position.y = Math.sin(currentTime * 0.3 + i * 2) * 15;

          parentGroup.rotation.x += 0.005;
          parentGroup.rotation.y += 0.01;
          parentGroup.rotation.z += 0.003;

          parentGroup.children.forEach((child, childIdx) => {
            if (child !== sphere && child instanceof THREE.Mesh) {
              if (childIdx === 1) {
                child.rotation.x += 0.02;
                child.rotation.y += 0.025;
                child.rotation.z -= 0.015;
              } else {
                const orbitAngle = currentTime * 0.5 + (childIdx / 4) * Math.PI * 2;
                const orbitRadius = 1.8;
                child.position.set(
                  Math.cos(orbitAngle) * orbitRadius,
                  Math.sin(orbitAngle) * orbitRadius,
                  Math.cos(orbitAngle * 0.7) * 0.5
                );
              }
            }
          });
        }
      });

      // Animate crypto symbols
      cryptoSymbols.forEach((symbol, i) => {
        const angle = currentTime * 0.2 + (i / cryptoSymbols.length) * Math.PI * 2;
        symbol.position.x = Math.cos(angle) * 35;
        symbol.position.z = Math.sin(angle) * 35;
        symbol.position.y = Math.sin(currentTime * 0.4 + i * 1.5) * 12;

        if (symbol.material instanceof THREE.SpriteMaterial) {
          symbol.material.opacity = 0.4 + Math.sin(currentTime * 2 + i) * 0.2;
        }
      });

      // Camera movement
      camera.position.x = Math.sin(currentTime * 0.1) * 15 + mouseRef.current.x * 10;
      camera.position.y = Math.cos(currentTime * 0.15) * 10 + mouseRef.current.y * 10;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      sceneRef.current.frameId = requestAnimationFrame(animate);
    };

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      blockchainCubes,
      neuralNetwork,
      cryptoSymbols,
      glowingSpheres,
      frameId: 0,
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const { camera, renderer } = sceneRef.current;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isInitializedRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        if (containerRef.current && sceneRef.current.renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
        sceneRef.current = undefined;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10"
      style={{
        background: 'linear-gradient(to bottom, #050510, #0a1530)',
        overflow: 'hidden'
      }}
    />
  );
}


