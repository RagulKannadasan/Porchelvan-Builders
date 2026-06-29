import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import './HeroThree.css';

export default function HeroThree() {
  const mountRef = useRef(null);
  const exitFnRef = useRef(null);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 18, 35);

    // Camera
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 50);
    if (container.clientWidth > 1024) {
        camera.setViewOffset(container.clientWidth, container.clientHeight, -container.clientWidth * 0.2, 0, container.clientWidth, container.clientHeight);
    }
    camera.position.set(9, 7, 12);
    camera.lookAt(0, 1.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // CSS2 Renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '5';
    container.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 1.8, 0);
    controls.maxPolarAngle = Math.PI / 2.3;
    controls.minDistance = 5;
    controls.maxDistance = 25;
    controls.enablePan = false;
    controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x334466, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    mainLight.position.set(8, 12, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -12;
    mainLight.shadow.camera.right = 12;
    mainLight.shadow.camera.top = 12;
    mainLight.shadow.camera.bottom = -12;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.6);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xaabbff, 0.4);
    rimLight.position.set(-2, 1, 8);
    scene.add(rimLight);

    const groundLight = new THREE.PointLight(0x5b9aff, 0.3, 15);
    groundLight.position.set(0, 0.5, 0);
    scene.add(groundLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x11151e,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.9,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(20, 24, 0x1a2a44, 0x0f1a2e);
    gridHelper.position.y = 0;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // House Group
    const houseGroup = new THREE.Group();
    houseGroup.scale.set(0.675, 0.675, 0.675);

    // Materials
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8ecf0, roughness: 0.5, metalness: 0.05 });
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x7abfff, metalness: 0.0, roughness: 0.05,
        transparent: true, opacity: 0.35, envMapIntensity: 1.2, clearcoat: 0.3,
    });
    const glassGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x5b9aff, emissive: 0x5b9aff, emissiveIntensity: 0.15,
        transparent: true, opacity: 0.25, roughness: 0.1, metalness: 0.0,
    });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e222b, roughness: 0.7, metalness: 0.2 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x2c1810, roughness: 0.7, metalness: 0.1 });
    const doorHandleMat = new THREE.MeshStandardMaterial({ color: 0xccd0d6, metalness: 0.8, roughness: 0.2 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4a, metalness: 0.3, roughness: 0.5 });
    const parapetMat = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.6, metalness: 0.1 });

    // ─── Custom House Design (Matching References) ───
    const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf2f5f7, roughness: 0.8, metalness: 0.05, side: THREE.DoubleSide });
    const darkGreyMat = new THREE.MeshStandardMaterial({ color: 0x44484d, roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e7376, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide });
    const glassMatNew = new THREE.MeshPhysicalMaterial({ color: 0x2233aa, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.6, envMapIntensity: 1.0, clearcoat: 0.5, side: THREE.DoubleSide });
    const woodDoorMat = new THREE.MeshStandardMaterial({ color: 0x4a2e15, roughness: 0.8, metalness: 0.05, side: THREE.DoubleSide });
    const metalRailingMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x2d4c1e, roughness: 0.9 });

    // Right side: Vertical Stone Column
    const rightColumnGeo = new THREE.BoxGeometry(1.6, 7.2, 1.8);
    const rightColumn = new THREE.Mesh(rightColumnGeo, stoneMat);
    rightColumn.position.set(2.4, 3.6, 2.0);
    rightColumn.castShadow = true;
    rightColumn.receiveShadow = true;
    houseGroup.add(rightColumn);

    // Right side: White body extending back
    const rightBodyGeo = new THREE.BoxGeometry(1.6, 6.0, 5.0);
    const rightBody = new THREE.Mesh(rightBodyGeo, whiteWallMat);
    rightBody.position.set(2.4, 3.0, -1.4);
    rightBody.castShadow = true;
    rightBody.receiveShadow = true;
    houseGroup.add(rightBody);

    // Center section: White wall with diagonal lines
    const centerWallGeo = new THREE.BoxGeometry(2.2, 7.2, 5.6);
    const centerWall = new THREE.Mesh(centerWallGeo, whiteWallMat);
    centerWall.position.set(0.5, 3.6, 0.1);
    centerWall.castShadow = true;
    centerWall.receiveShadow = true;
    houseGroup.add(centerWall);
    
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
    const addLine = (x, y, len, angle) => {
        const line = new THREE.Mesh(new THREE.BoxGeometry(len, 0.04, 0.04), lineMat);
        line.position.set(x, y, 2.91);
        line.rotation.z = angle;
        houseGroup.add(line);
    };
    addLine(0.5, 5.4, 3.1, Math.PI / 4);
    addLine(0.5, 5.4, 3.1, -Math.PI / 4);
    addLine(0.5, 2.8, 3.1, Math.PI / 4);
    addLine(0.5, 2.8, 3.1, -Math.PI / 4);
    addLine(0.5, 0.2, 1.5, Math.PI / 4);
    addLine(0.5, 0.2, 1.5, -Math.PI / 4);

    // Left side: Ground floor enclosed room
    const leftRoomGeo = new THREE.BoxGeometry(2.8, 3.0, 3.8);
    const leftRoom = new THREE.Mesh(leftRoomGeo, whiteWallMat);
    leftRoom.position.set(-2.0, 1.5, -1.0);
    leftRoom.castShadow = true;
    leftRoom.receiveShadow = true;
    houseGroup.add(leftRoom);

    // Left side: Ground floor open carport
    const leftPillarGeo = new THREE.BoxGeometry(0.3, 3.0, 0.3);
    const leftPillar = new THREE.Mesh(leftPillarGeo, whiteWallMat);
    leftPillar.position.set(-3.25, 1.5, 2.75);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    houseGroup.add(leftPillar);

    const carportCeilGeo = new THREE.BoxGeometry(2.8, 0.2, 2.0);
    const carportCeil = new THREE.Mesh(carportCeilGeo, whiteWallMat);
    carportCeil.position.set(-2.0, 2.9, 1.9);
    houseGroup.add(carportCeil);

    // Left side: Second floor room & balcony
    const leftTopRoomGeo = new THREE.BoxGeometry(2.8, 3.0, 3.8);
    const leftTopRoom = new THREE.Mesh(leftTopRoomGeo, whiteWallMat);
    leftTopRoom.position.set(-2.0, 4.5, -1.0);
    leftTopRoom.castShadow = true;
    leftTopRoom.receiveShadow = true;
    houseGroup.add(leftTopRoom);

    // Balcony protruding frame (Dark Grey C-shape)
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 2.2), darkGreyMat);
    frameTop.position.set(-2.0, 5.85, 2.0);
    frameTop.castShadow = true;
    houseGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 2.2), darkGreyMat);
    frameBottom.position.set(-2.0, 3.15, 2.0);
    frameBottom.castShadow = true;
    houseGroup.add(frameBottom);

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 2.2), darkGreyMat);
    frameLeft.position.set(-3.35, 4.5, 2.0);
    frameLeft.castShadow = true;
    houseGroup.add(frameLeft);
    
    // Vertical dark grey fins on the balcony
    for (let i = 0; i < 3; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 0.6), darkGreyMat);
        fin.position.set(-3.0 + i * 0.4, 4.5, 2.8);
        fin.castShadow = true;
        houseGroup.add(fin);
    }

    // Balcony planter and plants
    const planter = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.4), darkGreyMat);
    planter.position.set(-1.6, 3.45, 2.9);
    houseGroup.add(planter);
    for (let i = 0; i < 6; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 4, 4), plantMat);
        p.position.set(-2.3 + i * 0.3, 3.65, 2.9);
        houseGroup.add(p);
    }

    // Balcony Glass Railing
    const railingGlass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.05), glassMatNew);
    railingGlass.position.set(-1.6, 3.7, 2.9);
    houseGroup.add(railingGlass);
    const railingTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.1), metalRailingMat);
    railingTop.position.set(-1.6, 4.1, 2.9);
    houseGroup.add(railingTop);

    // Roof Top Room
    const topRoomGeo = new THREE.BoxGeometry(2.2, 1.2, 3.0);
    const topRoom = new THREE.Mesh(topRoomGeo, whiteWallMat);
    topRoom.position.set(0.5, 7.8, -1.2);
    topRoom.castShadow = true;
    houseGroup.add(topRoom);
    
    const topRoofTrim = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 3.2), darkGreyMat);
    topRoofTrim.position.set(0.5, 8.5, -1.2);
    houseGroup.add(topRoofTrim);

    const topStone = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.2), stoneMat);
    topStone.position.set(0.0, 7.8, 0.4);
    houseGroup.add(topStone);
    const topDark = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.2), darkGreyMat);
    topDark.position.set(1.1, 7.8, 0.4);
    houseGroup.add(topDark);

    // Roof Deck Railing
    const roofRailingGlass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.05), glassMatNew);
    roofRailingGlass.position.set(-1.0, 6.3, 0.8);
    houseGroup.add(roofRailingGlass);
    const roofRailingTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.1), metalRailingMat);
    roofRailingTop.position.set(-1.0, 6.6, 0.8);
    houseGroup.add(roofRailingTop);

    // Windows & Doors
    function createCustomWindow(w, h, x, y, z, rotY = 0) {
        const group = new THREE.Group();
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMatNew);
        glass.position.z = 0.02;
        group.add(glass);
        const fMat = woodDoorMat;
        const frameW = new THREE.Mesh(new THREE.BoxGeometry(w+0.1, 0.05, 0.05), fMat);
        frameW.position.set(0, h/2, 0); group.add(frameW);
        const frameW2 = new THREE.Mesh(new THREE.BoxGeometry(w+0.1, 0.05, 0.05), fMat);
        frameW2.position.set(0, -h/2, 0); group.add(frameW2);
        const frameH = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.05), fMat);
        frameH.position.set(-w/2, 0, 0); group.add(frameH);
        const frameH2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.05), fMat);
        frameH2.position.set(w/2, 0, 0); group.add(frameH2);
        group.position.set(x, y, z);
        group.rotation.y = rotY;
        return group;
    }

    // Two narrow vertical windows on the right stone column
    houseGroup.add(createCustomWindow(0.4, 2.0, 2.4, 5.0, 2.91));
    houseGroup.add(createCustomWindow(0.4, 2.0, 2.4, 2.0, 2.91));

    // Side window on right
    houseGroup.add(createCustomWindow(0.6, 1.2, 3.21, 5.0, 1.0, Math.PI/2));

    // Wooden main door
    const mainDoor = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.1, 0.1), woodDoorMat);
    mainDoor.position.set(-1.0, 1.05, 0.9);
    mainDoor.userData = { isDoor: true };
    houseGroup.add(mainDoor);
    
    // Front paving/steps
    const stepsMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 1.0 });
    const steps = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 2.0), stepsMat);
    steps.position.set(-1.5, 0.15, 3.0);
    houseGroup.add(steps);

    // --- Interior Decoration ---
    const interiorGroup = new THREE.Group();

    // Interior Walls (Fixes clipping and normals)
    const interiorWallMat = new THREE.MeshStandardMaterial({ color: 0xe0e5e9, roughness: 0.9, side: THREE.BackSide });
    const interiorWalls = new THREE.Mesh(new THREE.BoxGeometry(2.78, 2.98, 3.78), interiorWallMat);
    interiorWalls.position.set(-2.0, 1.5, -1.0);
    interiorGroup.add(interiorWalls);
    
    const woodFloorMat = new THREE.MeshStandardMaterial({ color: 0x8a5a44, roughness: 0.6, metalness: 0.1 });
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.9 });
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 });
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.6 });
    const screenMat = new THREE.MeshPhysicalMaterial({ color: 0x0a101a, roughness: 0.2, metalness: 0.8, emissive: 0x2244aa, emissiveIntensity: 0.8 });
    const pictureMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.9 });
    const potMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });

    // Wood Floor
    const woodFloor = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.02, 3.75), woodFloorMat);
    woodFloor.position.set(-2.0, 0.02, -1.0);
    interiorGroup.add(woodFloor);

    // Rug
    const rug = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.02, 2.0), rugMat);
    rug.position.set(-2.0, 0.04, -1.2);
    interiorGroup.add(rug);

    // Sofa
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.7), sofaMat);
    sofaBase.position.set(-2.0, 0.17, -1.8);
    interiorGroup.add(sofaBase);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.2), sofaMat);
    sofaBack.position.set(-2.0, 0.55, -2.05);
    interiorGroup.add(sofaBack);
    const sofaArmL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.7), sofaMat);
    sofaArmL.position.set(-2.7, 0.4, -1.8);
    interiorGroup.add(sofaArmL);
    const sofaArmR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.7), sofaMat);
    sofaArmR.position.set(-1.3, 0.4, -1.8);
    interiorGroup.add(sofaArmR);

    // Coffee Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.6), tableMat);
    table.position.set(-2.0, 0.15, -1.0);
    interiorGroup.add(table);

    // TV Screen on left wall
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 1.4), screenMat);
    tvScreen.position.set(-3.35, 1.3, -1.2);
    interiorGroup.add(tvScreen);

    // Painting on back wall
    const painting = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), pictureMat);
    painting.position.set(-2.0, 1.6, -2.85);
    interiorGroup.add(painting);

    // Plant in corner
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.3), potMat);
    pot.position.set(-0.9, 0.15, -2.6);
    interiorGroup.add(pot);
    const interiorPlant = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), plantMat);
    interiorPlant.position.set(-0.9, 0.4, -2.6);
    interiorGroup.add(interiorPlant);

    // Interior Light
    const interiorLight = new THREE.PointLight(0xffeedd, 0.8, 5);
    interiorLight.position.set(-2.0, 2.5, -1.0);
    interiorGroup.add(interiorLight);

    houseGroup.add(interiorGroup);


    // Trees
    function createTree(x, z, scale = 1) {
        const group = new THREE.Group();
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2e24, roughness: 0.9 });
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1a3a2a, roughness: 0.8, metalness: 0.0 });
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.6 * scale, 6), trunkMat);
        trunk.position.y = 0.3 * scale;
        trunk.castShadow = true;
        group.add(trunk);
        const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * scale, 6, 6), foliageMat);
        foliage1.position.y = 0.7 * scale + 0.3 * scale;
        foliage1.castShadow = true;
        group.add(foliage1);
        const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 6, 6), foliageMat);
        foliage2.position.set(0.25 * scale, 0.9 * scale + 0.3 * scale, 0.2 * scale);
        foliage2.castShadow = true;
        group.add(foliage2);
        const foliage3 = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 6, 6), foliageMat);
        foliage3.position.set(-0.2 * scale, 1.0 * scale + 0.3 * scale, -0.15 * scale);
        foliage3.castShadow = true;
        group.add(foliage3);
        group.position.set(x, 0, z);
        return group;
    }
    houseGroup.add(createTree(-3.8, -3.0, 1.0));
    houseGroup.add(createTree(3.8, -3.2, 1.1));
    houseGroup.add(createTree(-4.0, 3.2, 0.9));
    houseGroup.add(createTree(4.0, 3.0, 1.0));

    // Shrubs
    function createShrub(x, z, s = 0.5) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x1e3a2a, roughness: 0.8 });
        const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.3 * s, 6, 6), mat);
        shrub.position.set(x, 0.15 * s, z);
        shrub.castShadow = true;
        houseGroup.add(shrub);
        const shrub2 = new THREE.Mesh(new THREE.SphereGeometry(0.25 * s, 6, 6), mat);
        shrub2.position.set(x + 0.3 * s, 0.1 * s, z + 0.2 * s);
        shrub2.castShadow = true;
        houseGroup.add(shrub2);
    }
    createShrub(-2.8, -2.6, 0.8);
    createShrub(2.8, -2.6, 0.8);
    createShrub(-2.8, 2.6, 0.8);
    createShrub(2.8, 2.6, 0.8);

    // Pathway
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.9, metalness: 0.0, transparent: true, opacity: 0.4 });
    const path = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.0), pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.001, 2.8);
    houseGroup.add(path);

    scene.add(houseGroup);

    // Particles
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
        if (i % 3 === 1) positions[i] = Math.random() * 12;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x5b9aff, size: 0.035, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Labels
    function createLabel(text, x, y, z, color = '#5b9aff', size = '0.7rem') {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.color = '#fff';
        div.style.fontFamily = "'Inter', sans-serif";
        div.style.fontSize = size;
        div.style.fontWeight = '500';
        div.style.background = 'rgba(0,0,0,0.6)';
        div.style.backdropFilter = 'blur(8px)';
        div.style.padding = '0.2rem 0.7rem';
        div.style.borderRadius = '20px';
        div.style.border = '1px solid rgba(255,255,255,0.06)';
        div.style.letterSpacing = '0.3px';
        div.style.color = color;
        div.style.pointerEvents = 'none';
        div.style.userSelect = 'none';
        const label = new CSS2DObject(div);
        label.position.set(x, y, z);
        return label;
    }
    scene.add(createLabel('⏺ 2-46 · Furnishing', -3.6, 4.2, 2.2, '#a78bfa', '0.65rem'));
    scene.add(createLabel('⏺ Level 2 · 02', 3.6, 4.2, 2.2, '#5b9aff', '0.65rem'));
    scene.add(createLabel('⏺ 67% Complete', 0, 4.6, -2.8, '#7abfff', '0.65rem'));

    // Dimension Lines
    const dimMat = new THREE.LineBasicMaterial({ color: 0x5b9aff, transparent: true, opacity: 0.15 });
    function addDimensionLine(x1, y1, z1, x2, y2, z2) {
        const points = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, dimMat);
        scene.add(line);
    }
    addDimensionLine(-3.2, 0.05, 2.8, -3.2, 0.05, -2.8);
    addDimensionLine(3.2, 0.05, 2.8, 3.2, 0.05, -2.8);
    addDimensionLine(-3.2, 0.05, 2.8, 3.2, 0.05, 2.8);
    addDimensionLine(-3.2, 0.05, -2.8, 3.2, 0.05, -2.8);

    // --- Interaction & Raycaster ---
    let isInside = false;
    let isTransitioning = false;
    let targetCamPos = new THREE.Vector3();
    let targetCamLook = new THREE.Vector3();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
        if (isInside || isTransitioning) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(houseGroup.children, true);
        
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.isDoor) {
                isInside = true;
                isTransitioning = true;
                setShowExit(true);
                
                targetCamPos.set(-0.675, 0.9, 0.3);
                targetCamLook.set(-1.5, 0.6, -1.0);
                
                controls.autoRotate = false;
                controls.enableZoom = true;
                controls.minDistance = 0.1;
                controls.maxDistance = 5;
                break;
            }
        }
    };

    exitFnRef.current = () => {
        isInside = false;
        isTransitioning = true;
        setShowExit(false);
        targetCamPos.set(9, 7, 12);
        targetCamLook.set(0, 1.8, 0);
        controls.minDistance = 5;
        controls.maxDistance = 25;
    };

    let animationFrameId;
    const resizeObserver = new ResizeObserver(() => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        
        // Shift camera frustum left so the model appears on the right side of the screen
        if (w > 1024) {
            camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
        } else {
            camera.clearViewOffset();
        }
        
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        labelRenderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        if (isTransitioning) {
            camera.position.lerp(targetCamPos, 0.05);
            controls.target.lerp(targetCamLook, 0.05);
            if (camera.position.distanceTo(targetCamPos) < 0.1) {
                isTransitioning = false;
                if (!isInside) controls.autoRotate = false;
            }
        } else if (!isInside) {
            targetCamPos.copy(camera.position);
        }

        controls.update();
        particles.rotation.y += 0.00015;
        
        if (!isInside) {
            houseGroup.position.y = Math.sin(Date.now() * 0.0004) * 0.03;
        } else {
            houseGroup.position.y = 0; // lock height when inside
        }
        
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    animate();

    renderer.domElement.addEventListener('click', handleClick);

    // Change cursor on hover
    const handlePointerMoveCursor = (event) => {
        if (isInside || isTransitioning) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(houseGroup.children, true);
        let hoveringDoor = false;
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.isDoor) hoveringDoor = true;
        }
        renderer.domElement.style.cursor = hoveringDoor ? 'pointer' : 'default';
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMoveCursor);

    return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('pointermove', handlePointerMoveCursor);
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        if (container.contains(labelRenderer.domElement)) container.removeChild(labelRenderer.domElement);
        renderer.dispose();
    };
  }, []);

  return (
    <section className="hero-three-wrapper">
      <div id="three-canvas" ref={mountRef}></div>
      
      <div className="hero-overlay">
          {showExit && (
              <button 
                  className="exit-house-btn" 
                  onClick={() => exitFnRef.current && exitFnRef.current()}
              >
                  Exit House
              </button>
          )}

          <div className="lp-container" style={{ height: '100%', pointerEvents: 'none' }}>
            <div className="hero-grid" style={{ opacity: showExit ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: showExit ? 'none' : 'auto' }}>
                
                {/* Left Column (Text & Content) */}
                <div className="hero-left-column">
                    <div className="hero-sub">✦ NEXT-GEN ARCHITECTURE</div>
                    <h1 className="hero-title">
                        Redefining<br />
                        <span className="highlight">Modern</span> Construction
                    </h1>
                    <p className="hero-desc">
                        Blending Cutting-Edge Technology with Timeless
                        Craftsmanship to Deliver Exceptional Construction Solutions.
                    </p>
                    <button className="hero-cta">
                        Discuss Project
                        <span className="arrow">→</span>
                    </button>

                    <div className="tech-bar-grid">
                        <div className="tech-item">
                            <span className="label">FURNISHING</span>
                            <span className="value">2 <span className="accent">·</span> 1-27 Oct, 2020</span>
                        </div>
                        <div className="tech-item">
                            <span className="label">LEVEL</span>
                            <span className="value">2 <span className="accent">·</span> 02</span>
                        </div>
                        <div className="tech-item">
                            <span className="label">TYPE</span>
                            <span className="value">2-46 <span className="accent">·</span> Furnishing</span>
                        </div>
                        <div className="tech-item progress-col">
                            <span className="label" style={{color: '#fff', fontSize: '1.1rem'}}>67%</span>
                            <div className="progress-track" style={{width: '100%', marginTop: '0.3rem'}}>
                                <div className="progress-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Visual / 3D Element Overlays) */}
                <div className="hero-right-column">
                    <div className="floating-tags-container">
                        <div className="house-label" style={{ top: '15%', right: '25%' }}>
                            <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div>
                            67% Complete
                        </div>
                        <div className="house-label" style={{ top: '45%', right: '5%' }}>
                            <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div>
                            Level 2 - 02
                        </div>
                        <div className="house-label" style={{ bottom: '10%', left: '20%' }}>
                            <div className="dot" style={{ backgroundColor: '#f59e0b' }}></div>
                            Furnishing
                        </div>
                    </div>
                </div>

            </div>
          </div>
      </div>
    </section>
  );
}
