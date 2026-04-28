import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ScalesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 200);
    camera.position.set(0, 0, 12);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const directionalLight = new THREE.DirectionalLight(0xf0c040, 2);
    directionalLight.position.set(5, 8, 5);
    scene.add(directionalLight);

    const goldMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4a520,
      shininess: 200,
      specular: 0xf0c040,
    });
    const blueMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a7abf,
      shininess: 120,
      transparent: true,
      opacity: 0.8,
    });
    const whiteMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 80,
      transparent: true,
      opacity: 0.3,
    });

    const objects = [];
    const shapes = [
      () => new THREE.TorusGeometry(0.4, 0.1, 12, 40),
      () => new THREE.OctahedronGeometry(0.4),
      () => new THREE.TetrahedronGeometry(0.5),
      () => new THREE.BoxGeometry(0.5, 0.5, 0.5),
      () => new THREE.SphereGeometry(0.3, 16, 16),
    ];

    for (let index = 0; index < 28; index += 1) {
      const geometry = shapes[index % shapes.length]();
      const material =
        index % 3 === 0
          ? goldMaterial
          : index % 3 === 1
            ? blueMaterial
            : whiteMaterial;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      );
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.02,
        ry: (Math.random() - 0.5) * 0.02,
        baseY: mesh.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      };
      scene.add(mesh);
      objects.push(mesh);
    }

    function resize() {
      const width = canvas.parentElement?.clientWidth || 1200;
      const height = 420;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize);

    let animationFrameId = 0;
    let tick = 0;

    function animate() {
      animationFrameId = window.requestAnimationFrame(animate);
      tick += 0.008;

      objects.forEach((object) => {
        object.rotation.x += object.userData.rx;
        object.rotation.y += object.userData.ry;
        object.position.y =
          object.userData.baseY +
          Math.sin(tick * object.userData.speed + object.userData.phase) * 0.5;
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();

          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);

  return <canvas className="scales-canvas" ref={canvasRef} aria-hidden="true" />;
}

