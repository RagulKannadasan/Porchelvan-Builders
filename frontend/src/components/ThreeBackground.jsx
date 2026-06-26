import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ dark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // WebGL fallback check
    function supportsWebGL() {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
          (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch (e) { return false; }
    }

    if (!supportsWebGL()) {
      console.warn("WebGL not supported");
      return;
    }

    const isMobileDevice = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobileDevice,
      alpha: true
    });
    renderer.setPixelRatio(isMobileDevice ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Lighting
    const ambientLight = new THREE.AmbientLight(dark ? 0xF59E0B : 0xFFFFFF, dark ? 0.15 : 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xF59E0B, dark ? 2.5 : 1.5, 20);
    pointLight1.position.set(3, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x60A5FA, dark ? 1.2 : 0.5, 20);
    pointLight2.position.set(-4, -2, 3);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, dark ? 0.5 : 1.2);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Generate Window and Emissive Textures
    function createWindowTextures() {
      const canvasMap = document.createElement('canvas');
      canvasMap.width = 128; canvasMap.height = 128;
      const ctxMap = canvasMap.getContext('2d');

      const canvasEmissive = document.createElement('canvas');
      canvasEmissive.width = 128; canvasEmissive.height = 128;
      const ctxEmissive = canvasEmissive.getContext('2d');
      
      // Base color for map
      ctxMap.fillStyle = dark ? '#0F172A' : '#FFFFFF';
      ctxMap.fillRect(0, 0, 128, 128);

      // Black walls for emissive (walls don't glow)
      ctxEmissive.fillStyle = '#000000';
      ctxEmissive.fillRect(0, 0, 128, 128);
      
      // Draw grid of windows
      for(let y = 8; y < 128; y += 24) {
        for(let x = 8; x < 128; x += 24) {
          if (Math.random() > 0.4) {
            // Lit window
            const color = dark ? (Math.random() > 0.8 ? '#FCD34D' : '#F59E0B') : (Math.random() > 0.8 ? '#F59E0B' : '#D97706');
            ctxMap.fillStyle = color;
            ctxEmissive.fillStyle = color;
          } else {
            // Dark window
            ctxMap.fillStyle = dark ? '#1E293B' : '#CBD5E1';
            ctxEmissive.fillStyle = '#000000';
          }
          ctxMap.fillRect(x, y, 12, 16);
          ctxEmissive.fillRect(x, y, 12, 16);
        }
      }
      
      const mapTex = new THREE.CanvasTexture(canvasMap);
      const emissiveTex = new THREE.CanvasTexture(canvasEmissive);
      mapTex.wrapS = THREE.RepeatWrapping; mapTex.wrapT = THREE.RepeatWrapping;
      emissiveTex.wrapS = THREE.RepeatWrapping; emissiveTex.wrapT = THREE.RepeatWrapping;
      
      return { mapTex, emissiveTex };
    }
    
    const { mapTex: windowTexMap, emissiveTex: windowTexEmissive } = createWindowTextures();

    // Materials
    const goldSolid = new THREE.MeshPhongMaterial({
      color: dark ? 0x1E293B : 0xFFFFFF, emissive: 0xFFFFFF,
      specular: 0xF59E0B, shininess: 90,
      transparent: true, opacity: dark ? 0.95 : 0.90
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: dark ? 0xF59E0B : 0x0F172A, transparent: true, opacity: dark ? 0.85 : 0.7 });
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, wireframe: true, transparent: true, opacity: 0.12 });

    const buildingGroup = new THREE.Group();

    function addEdges(mesh, mat) {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const lines = new THREE.LineSegments(edges, mat);
      mesh.add(lines);
    }

    // Generate a cityscape cluster
    const clusterSize = isMobileDevice ? 3 : 5; // 3x3 grid on mobile to save perf
    const spacing = 0.6;
    for (let x = -clusterSize; x <= clusterSize; x++) {
      for (let z = -clusterSize; z <= clusterSize; z++) {
        // Skip some to create variation and streets
        if (Math.random() > 0.7) continue;

        // Taller buildings towards the center
        const distanceToCenter = Math.sqrt(x*x + z*z);
        const maxH = Math.max(0.5, 3.5 - distanceToCenter * 0.5);
        const height = Math.random() * maxH + 0.2;

        const width = 0.3 + Math.random() * 0.25;
        const depth = 0.3 + Math.random() * 0.25;

        // Custom material with properly scaled window texture
        const bMat = goldSolid.clone();
        bMat.map = windowTexMap.clone();
        bMat.emissiveMap = windowTexEmissive.clone();
        bMat.map.needsUpdate = true;
        bMat.emissiveMap.needsUpdate = true;
        bMat.emissiveIntensity = dark ? 1.0 : 0.85;
        bMat.map.repeat.set(Math.max(1, Math.round(width * 4)), Math.max(1, Math.round(height * 4)));
        bMat.emissiveMap.repeat.copy(bMat.map.repeat);

        const bGeo = new THREE.BoxGeometry(width, height, depth);
        const building = new THREE.Mesh(bGeo, bMat);
        building.position.set(x * spacing, height / 2 - 1.5, z * spacing);
        
        // Add edges to some buildings for tech aesthetic
        if (Math.random() > 0.5) {
           addEdges(building, edgeMat);
        }

        buildingGroup.add(building);

        // Add setback (roof structure) to taller buildings (skip on mobile to save geometry)
        let currentHeight = height;
        if (!isMobileDevice && height > 1.2 && Math.random() > 0.3) {
           const roofWidth = width * (0.6 + Math.random() * 0.2);
           const roofDepth = depth * (0.6 + Math.random() * 0.2);
           const roofHeight = 0.2 + Math.random() * 0.5;
           
           const rMat = goldSolid.clone();
           rMat.map = windowTexMap.clone();
           rMat.emissiveMap = windowTexEmissive.clone();
           rMat.map.needsUpdate = true;
           rMat.emissiveMap.needsUpdate = true;
           rMat.emissiveIntensity = dark ? 1.0 : 0.85;
           rMat.map.repeat.set(Math.max(1, Math.round(roofWidth * 4)), Math.max(1, Math.round(roofHeight * 4)));
           rMat.emissiveMap.repeat.copy(rMat.map.repeat);

           const rGeo = new THREE.BoxGeometry(roofWidth, roofHeight, roofDepth);
           const roof = new THREE.Mesh(rGeo, rMat);
           roof.position.set(x * spacing, currentHeight - 1.5 + roofHeight / 2, z * spacing);
           
           if (Math.random() > 0.5) addEdges(roof, edgeMat);
           buildingGroup.add(roof);
           currentHeight += roofHeight;
        }
        
        // Add small glowing antenna to some tall buildings (skip on mobile)
        if (!isMobileDevice && currentHeight > 2.5 && Math.random() > 0.5) {
           const antennaGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.4, 4);
           const antenna = new THREE.Mesh(antennaGeo, new THREE.MeshBasicMaterial({ color: 0xF59E0B }));
           antenna.position.set(x * spacing, currentHeight - 1.5 + 0.2, z * spacing);
           buildingGroup.add(antenna);
           
           const tipGeo = new THREE.SphereGeometry(0.03, 8, 8);
           const tipMat = new THREE.MeshBasicMaterial({ color: 0xFCD34D });
           const tip = new THREE.Mesh(tipGeo, tipMat);
           tip.position.set(x * spacing, currentHeight - 1.5 + 0.4, z * spacing);
           buildingGroup.add(tip);
        }
      }
    }

    buildingGroup.position.set(2.2, -0.2, 0);
    scene.add(buildingGroup);

    // Particle field
    const particleCount = isMobileDevice ? 80 : 180;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 14;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: dark ? 0xF59E0B : 0x94A3B8, size: 0.03,
      transparent: true, opacity: dark ? 0.45 : 0.8
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Scroll state & Mouse
    const scrollState = {
      current: 0,
      target: window.scrollY,
      ease: 0.08
    };

    let mouseX = 0, mouseY = 0;

    const onScroll = () => {
      scrollState.target = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const clock = new THREE.Clock();
    function lerp(a, b, t) { return a + (b - a) * t; }

    function getSectionProgress() {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(Math.max(scrollState.current / total, 0), 1);
    }

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      scrollState.current = lerp(scrollState.current, scrollState.target, scrollState.ease);

      const p = getSectionProgress();
      const isMobile = window.innerWidth < 1024; // Use 1024 as breakpoint to match new UI

      let targetX, targetY, targetScaleVal, targetRotX, targetRotY;
      const baseSpin = elapsed * 0.05;

      if (isMobile) {
        targetX = 0;
        targetY = 0.3;
        targetScaleVal = 0.55;
        targetRotX = p * Math.PI * 0.2;
        targetRotY = baseSpin * 2;
      } else if (p < 0.25) {
        const t = p / 0.25;
        targetX = lerp(2.2, 2.2, t);
        targetY = lerp(-0.2, -0.2, t);
        targetScaleVal = lerp(1.0, 0.95, t);
        targetRotX = lerp(0, 0.2, t);
        targetRotY = lerp(0, 0.4, t) + baseSpin;
      } else if (p < 0.55) {
        const t = (p - 0.25) / 0.30;
        targetX = lerp(2.2, -2.4, t);
        targetY = lerp(-0.2, 0.0, t);
        targetScaleVal = lerp(0.95, 0.88, t);
        targetRotX = lerp(0.2, -0.3, t);
        targetRotY = lerp(0.4, -0.5, t) + baseSpin;
      } else {
        const t = Math.min((p - 0.55) / 0.30, 1);
        targetX = lerp(-2.4, 0.0, t);
        targetY = lerp(0.0, -0.1, t);
        targetScaleVal = lerp(0.88, 1.15, t);
        targetRotX = lerp(-0.3, 0.1, t);
        targetRotY = lerp(-0.5, 0.2, t) + baseSpin;
      }

      buildingGroup.position.x = lerp(buildingGroup.position.x, targetX, 0.04);
      buildingGroup.position.y = lerp(buildingGroup.position.y, targetY, 0.04);
      buildingGroup.scale.setScalar(lerp(buildingGroup.scale.x, targetScaleVal, 0.04));

      buildingGroup.rotation.y = lerp(buildingGroup.rotation.y, targetRotY + mouseX * 0.12, 0.035);
      buildingGroup.rotation.x = lerp(buildingGroup.rotation.x, targetRotX + mouseY * 0.06, 0.035);

      particles.rotation.y = elapsed * 0.05;
      particles.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup Three.js resources
      renderer.dispose();
      scene.clear();
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}
