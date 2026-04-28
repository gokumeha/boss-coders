import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xb8860b, 1.5);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x1a2744, 1);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const goldMaterial = new THREE.MeshPhongMaterial({
      color: 0xb8860b,
      shininess: 120,
      specular: 0xd4a520,
    });
    const navyMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a2744,
      shininess: 80,
    });
    const ivoryMaterial = new THREE.MeshPhongMaterial({
      color: 0xfaf8f3,
      shininess: 40,
    });

    const scalesGroup = new THREE.Group();
    const floatingOrbs = [];

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.1, 2.2, 12),
      navyMaterial,
    );
    scalesGroup.add(pillar);

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.08, 0.08),
      goldMaterial,
    );
    beam.position.y = 1.1;
    scalesGroup.add(beam);

    const leftChain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6),
      goldMaterial,
    );
    leftChain.position.set(-1.1, 0.7, 0);
    scalesGroup.add(leftChain);

    const rightChain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6),
      goldMaterial,
    );
    rightChain.position.set(1.1, 0.7, 0);
    scalesGroup.add(rightChain);

    const leftPan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.45, 0.06, 20),
      goldMaterial,
    );
    leftPan.position.set(-1.1, 0.28, 0);
    scalesGroup.add(leftPan);

    const rightPan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.45, 0.06, 20),
      goldMaterial,
    );
    rightPan.position.set(1.1, 0.28, 0);
    scalesGroup.add(rightPan);

    for (let index = 0; index < 3; index += 1) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 12, 12),
        ivoryMaterial,
      );
      orb.position.set(-1.1 + (index - 1) * 0.22, 0.38, 0);
      scalesGroup.add(orb);
    }

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 0.1, 16),
      navyMaterial,
    );
    base.position.y = -1.1;
    scalesGroup.add(base);

    const topSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      goldMaterial,
    );
    topSphere.position.y = 1.18;
    scalesGroup.add(topSphere);

    for (let index = 0; index < 14; index += 1) {
      const radius = 0.04 + Math.random() * 0.08;
      const material = index % 2 === 0 ? goldMaterial : navyMaterial;
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 10, 10),
        material,
      );
      const angle = (index / 14) * Math.PI * 2;
      const ringRadius = 2 + Math.random() * 0.8;

      orb.position.set(
        Math.cos(angle) * ringRadius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * 0.5,
      );
      orb.userData = {
        speed: 0.3 + Math.random() * 0.5,
        baseY: orb.position.y,
        phase: Math.random() * Math.PI * 2,
      };

      scene.add(orb);
      floatingOrbs.push(orb);
    }

    scene.add(scalesGroup);

    function resize() {
      const width = canvas.parentElement?.clientWidth || 600;
      const height = canvas.parentElement?.clientHeight || 600;
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

      scalesGroup.rotation.y = Math.sin(tick * 0.5) * 0.3;
      scalesGroup.rotation.x = Math.sin(tick * 0.3) * 0.08;

      leftPan.position.y = 0.28 + Math.sin(tick) * 0.15;
      leftChain.position.y = 0.7 + Math.sin(tick) * 0.075;
      leftChain.scale.y = 1 + Math.sin(tick) * 0.12;

      rightPan.position.y = 0.28 - Math.sin(tick) * 0.15;
      rightChain.position.y = 0.7 - Math.sin(tick) * 0.075;
      rightChain.scale.y = 1 - Math.sin(tick) * 0.12;

      floatingOrbs.forEach((orb) => {
        orb.position.y =
          orb.userData.baseY +
          Math.sin(tick * orb.userData.speed + orb.userData.phase) * 0.25;
        orb.rotation.x += 0.01;
        orb.rotation.z += 0.008;
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

  return <canvas className="scene-canvas" ref={canvasRef} aria-hidden="true" />;
}

