import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GOLD = 0xd4af37;

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera — pull back slightly so the globe frames the text instead of covering it
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer (transparent — the CSS background shows through)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // A single subdivided icosahedron shared by the fill, wireframe, and vertex points
    // so one morph pass animates all three layers together.
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    const globe = new THREE.Group();

    // Subtle dark body — gives the wireframe depth and softly backs the text
    const fillMaterial = new THREE.MeshBasicMaterial({
      color: 0x0d0d0d,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const fillMesh = new THREE.Mesh(geometry, fillMaterial);
    globe.add(fillMesh);

    // Gold wireframe — the star of the show
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: GOLD,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    globe.add(wireMesh);

    // Glowing vertices
    const pointsMaterial = new THREE.PointsMaterial({
      color: GOLD,
      size: 0.035,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const vertexPoints = new THREE.Points(geometry, pointsMaterial);
    globe.add(vertexPoints);

    scene.add(globe);

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

    // Morphing logic — displace each vertex along its normal by an averaged noise
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
          avgNoise += Math.sin(time + faceIndex) * 0.08;
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

      globe.rotation.y += 0.0015 + mouseX * 0.05;
      globe.rotation.x = mouseY * 0.5;

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
      fillMaterial.dispose();
      wireMaterial.dispose();
      pointsMaterial.dispose();
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
