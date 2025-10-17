import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Typewriter Effect Component
const TypewriterText = () => {
  const titles = [
    "Full Stack Developer",
    "AI Engineer",
    "Cybersecurity Enthusiast"
  ];
  
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentTitle.length) {
        setDisplayText(currentTitle.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentTitle.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentTitleIndex((currentTitleIndex + 1) % titles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentTitleIndex]);

  return (
    <div className="text-4xl md:text-5xl font-bold mb-6">
      <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
        {displayText}
      </span>
      <span className="animate-pulse text-purple-400">|</span>
    </div>
  );
};

// 3D Network Node Component
const NetworkNode = ({ position, size, color, label, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 
        hovered ? size * 1.3 : size;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[0.1, 16, 16]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1 : 0.5}
        toneMapped={false}
      />
    </Sphere>
  );
};

// Connection Lines Component
const ConnectionLine = ({ start, end, color }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      opacity={0.3}
      transparent
    />
  );
};

// Main 3D Sphere Network
const SphereNetwork = () => {
  const groupRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Primary nodes (larger, main technologies)
  const primaryNodes = [
    { pos: [1.5, 0, 0], label: 'React', color: '#61DAFB' },
    { pos: [-1.5, 0, 0], label: 'Python', color: '#3776AB' },
    { pos: [0, 1.5, 0], label: 'Node.js', color: '#339933' },
    { pos: [0, -1.5, 0], label: 'TensorFlow', color: '#FF6F00' },
    { pos: [1, 1, 0], label: 'Docker', color: '#2496ED' },
    { pos: [-1, -1, 0], label: 'PostgreSQL', color: '#336791' },
    { pos: [1, -1, 0], label: 'AWS', color: '#FF9900' },
    { pos: [-1, 1, 0], label: 'Cybersecurity', color: '#00D9FF' },
  ];

  // Secondary particles (smaller, orbiting technologies)
  const secondaryParticles = [
    { pos: [2, 0.5, 0.5], label: 'TypeScript', color: '#3178C6' },
    { pos: [-2, -0.5, -0.5], label: 'FastAPI', color: '#009688' },
    { pos: [0.5, 2, 0.5], label: 'Tailwind', color: '#06B6D4' },
    { pos: [-0.5, -2, -0.5], label: 'MongoDB', color: '#47A248' },
    { pos: [1.5, 0.5, 1], label: 'GraphQL', color: '#E10098' },
    { pos: [-1.5, -0.5, -1], label: 'Redis', color: '#DC382D' },
    { pos: [0.5, 1.5, 1], label: 'Kubernetes', color: '#326CE5' },
    { pos: [-0.5, -1.5, -1], label: 'Git', color: '#F05032' },
    { pos: [1.8, 1.2, 0], label: 'PyTorch', color: '#EE4C2C' },
    { pos: [-1.8, -1.2, 0], label: 'Nginx', color: '#009639' },
    { pos: [1.2, -1.8, 0.5], label: 'Linux', color: '#FCC624' },
    { pos: [-1.2, 1.8, -0.5], label: 'OpenAI', color: '#10A37F' },
  ];

  // Auto-rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Generate connections between primary nodes
  const connections = [];
  for (let i = 0; i < primaryNodes.length; i++) {
    for (let j = i + 1; j < primaryNodes.length; j++) {
      if (Math.random() > 0.5) {
        connections.push({
          start: primaryNodes[i].pos,
          end: primaryNodes[j].pos,
          color: '#B794F6'
        });
      }
    }
  }

  return (
    <group ref={groupRef}>
      {/* Center glowing core */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#B794F6"
          emissive="#B794F6"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* Connection lines */}
      {connections.map((conn, idx) => (
        <ConnectionLine
          key={idx}
          start={conn.start}
          end={conn.end}
          color={conn.color}
        />
      ))}

      {/* Primary nodes */}
      {primaryNodes.map((node, idx) => (
        <NetworkNode
          key={idx}
          position={node.pos}
          size={1.2}
          color={node.color}
          label={node.label}
          onClick={() => setHoveredNode(node.label)}
        />
      ))}

      {/* Secondary particles */}
      {secondaryParticles.map((particle, idx) => (
        <NetworkNode
          key={`particle-${idx}`}
          position={particle.pos}
          size={0.6}
          color={particle.color}
          label={particle.label}
          onClick={() => setHoveredNode(particle.label)}
        />
      ))}

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B794F6" />
    </group>
  );
};

// Main Hero Section Component
const HeroSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          SimeonDev
        </h1>
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="hover:text-purple-400 transition-colors border border-purple-500 px-4 py-2 rounded-lg">Home</a>
          <a href="#projects" className="hover:text-purple-400 transition-colors">Projects</a>
          <a href="#blog" className="hover:text-purple-400 transition-colors">Blog</a>
          <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
          <a href="#services" className="hover:text-purple-400 transition-colors">Services</a>
          <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 md:px-16 py-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-6">
          <div>
            <p className="text-lg md:text-xl text-gray-300 mb-2">Welcome, I'm</p>
            <h2 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Simeon
              </span>
            </h2>
          </div>

          {/* Typewriter Effect */}
          <TypewriterText />

          {/* Bio */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
            Building intelligent systems that merge AI innovation with bulletproof security. 
            I turn complex challenges into elegant, scalable solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50">
              View My Work
            </button>
            <button className="px-8 py-3 border-2 border-purple-500 rounded-full font-semibold hover:bg-purple-500/10 transition-all">
              Contact
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 pt-6">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full text-sm">
              Full Stack Developer
            </span>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full text-sm">
              AI Specialist
            </span>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full text-sm">
              Open Source
            </span>
          </div>
        </div>

        {/* Right Side - 3D Sphere */}
        <div className="h-[500px] lg:h-[600px] w-full">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <SphereNetwork />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
