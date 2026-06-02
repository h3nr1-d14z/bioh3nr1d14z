import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1c1c1c);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Icosahedron
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.2,
      flatShading: true,
      roughness: 0.5,
      metalness: 0.8,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // Wireframe overlay
    const wireGeometry = new THREE.IcosahedronGeometry(1, 1);
    // Scale vertices for wireframe
    const wirePositions = wireGeometry.attributes.position;
    for (let i = 0; i < wirePositions.count; i++) {
      const x = wirePositions.getX(i);
      const y = wirePositions.getY(i);
      const z = wirePositions.getZ(i);
      wirePositions.setXYZ(i, x * 1.05, y * 1.05, z * 1.05);
    }
    wireGeometry.computeVertexNormals();
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 400;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 20;
      starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Morphing logic
    const originalPositions = geometry.attributes.position.array.slice();
    const vertexFaces: number[][] = [];
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      vertexFaces.push([]);
    }
    const indexArray = geometry.index;
    if (indexArray) {
      for (let faceIndex = 0; faceIndex * 3 < indexArray.count; faceIndex++) {
        const a = indexArray.getX(faceIndex * 3);
        const b = indexArray.getX(faceIndex * 3 + 1);
        const c = indexArray.getX(faceIndex * 3 + 2);
        vertexFaces[a].push(faceIndex);
        vertexFaces[b].push(faceIndex);
        vertexFaces[c].push(faceIndex);
      }
    }

    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
    };
    document.addEventListener('mousemove', onMouseMove);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      time += 0.01;

      const positions = geometry.attributes.position.array as Float32Array;
      const posCount = positions.length / 3;

      for (let i = 0; i < posCount; i++) {
        const faces = vertexFaces[i];
        if (!faces || faces.length === 0) continue;

        let avgNoise = 0;
        for (const faceIndex of faces) {
          avgNoise += Math.sin(time + faceIndex) * 0.1;
        }
        avgNoise /= faces.length;

        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);

        if (len > 0) {
          positions[i * 3] = ox + (ox / len) * avgNoise;
          positions[i * 3 + 1] = oy + (oy / len) * avgNoise;
          positions[i * 3 + 2] = oz + (oz / len) * avgNoise;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      icosahedron.rotation.y += 0.002 + mouseX * 0.05;
      icosahedron.rotation.x = mouseY * 0.5;

      wireMesh.rotation.y = icosahedron.rotation.y;
      wireMesh.rotation.x = icosahedron.rotation.x;

      starField.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero__canvas" />;
}
