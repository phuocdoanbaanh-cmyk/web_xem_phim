import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import gsap from 'gsap';
import './CineVerse3D.css';

interface MovieData {
  title: string;
  desc: string;
  modelPath: string;
  targetSize: number;
  radius: number;
  speed: number;
  orbitColor: number;
}

const MOVIES: MovieData[] = [
    { title: "CHIẾU RẠP", desc: "Thành phố của những giấc mơ.", modelPath: '/model/theLoai/chieurap.glb', targetSize: 30, radius: 450, speed: 0.30, orbitColor: 0x00d4ff },
    { title: "KINH DỊ", desc: "Hành trình vào nỗi sợ hãi.", modelPath: '/model/theLoai/kinhdi.glb', targetSize: 30, radius: 560, speed: 0.25, orbitColor: 0xff1a1a },
    { title: "TÌNH CẢM", desc: "Những cung bậc cảm xúc lãng mạn.", modelPath: '/model/theLoai/tinhcam.glb', targetSize: 30, radius: 680, speed: 0.22, orbitColor: 0xff66b2 },
    { title: "ÂM NHẠC", desc: "Giai điệu vượt không gian và thời gian.", modelPath: '/model/theLoai/amNhac.glb', targetSize: 30, radius: 810, speed: 0.20, orbitColor: 0xcc99ff },
    { title: "BÍ ẨN", desc: "Những câu đố chưa có lời giải đáp.", modelPath: '/model/theLoai/biAn-v2.glb', targetSize: 30, radius: 950, speed: 0.18, orbitColor: 0x4b0082 },
    { title: "CHIẾN TRANH", desc: "Ký ức lịch sử và những bản anh hùng ca.", modelPath: '/model/theLoai/chientranh.glb', targetSize: 30, radius: 1100, speed: 0.16, orbitColor: 0x8b4513 },
    { title: "CHÍNH KỊCH", desc: "Những góc khuất chân thực của cuộc sống.", modelPath: '/model/theLoai/chinhKich.glb', targetSize: 30, radius: 1260, speed: 0.15, orbitColor: 0x3366ff },
    { title: "CỔ TRANG", desc: "Hào quang của các triều đại lịch sử.", modelPath: '/model/theLoai/cotrang.glb', targetSize: 30, radius: 1430, speed: 0.14, orbitColor: 0xd4af37 },
    { title: "GIA ĐÌNH", desc: "Tình thân là sức mạnh lớn lao nhất.", modelPath: '/model/theLoai/giadinh-v2.glb', targetSize: 30, radius: 1610, speed: 0.13, orbitColor: 0x66ff66 },
    { title: "HÀI HƯỚC", desc: "Tiếng cười giải trí bất tận.", modelPath: '/model/theLoai/haihuoc.glb', targetSize: 30, radius: 1800, speed: 0.12, orbitColor: 0xffff00 },
    { title: "HÌNH SỰ", desc: "Trí tuệ trong cuộc chiến thiện ác.", modelPath: '/model/theLoai/hinhSu-v2.glb', targetSize: 30, radius: 2000, speed: 0.11, orbitColor: 0x000080 },
    { title: "HOẠT HÌNH", desc: "Thế giới muôn màu của trí tưởng tượng.", modelPath: '/model/theLoai/hoatHinh-v1.glb', targetSize: 30, radius: 2210, speed: 0.10, orbitColor: 0xff9933 },
    { title: "PHIÊU LƯU", desc: "Những cuộc hành trình đầy kỳ thú.", modelPath: '/model/theLoai/phieuLuu-v1-v2.glb', targetSize: 40, radius: 2430, speed: 0.08, orbitColor: 0x32cd32 },
    { title: "TÂM LÝ", desc: "Chiều sâu phức tạp trong tâm hồn.", modelPath: '/model/theLoai/tamLy-v4.glb', targetSize: 30, radius: 2660, speed: 0.07, orbitColor: 0x9932cc },
    { title: "HỌC ĐƯỜNG", desc: "Kỷ niệm thanh xuân rực rỡ dưới mái trường.", modelPath: '/model/theLoai/truongHoc.glb', targetSize: 30, radius: 2900, speed: 0.06, orbitColor: 0xffffff },
    { title: "VIỄN TƯỞNG", desc: "Tương lai của công nghệ máy móc.", modelPath: '/model/theLoai/vientuong-v3.glb', targetSize: 30, radius: 3150, speed: 0.05, orbitColor: 0x00ff00 },
    { title: "KHOA HỌC", desc: "Khám phá giới hạn của tri thức nhân loại.", modelPath: '/model/theLoai/khoahoc1-v5.glb', targetSize: 1000.0, radius: 3410, speed: 0.09, orbitColor: 0x00ffcc },
    { title: "VÕ THUẬT", desc: "Tinh hoa võ học đỉnh cao.", modelPath: '/model/theLoai/voThuat.glb', targetSize: 30, radius: 3680, speed: 0.04, orbitColor: 0xff4500 }
];

interface CineVerse3DProps {
  onMovieClick: (category: string) => void;
}

export const CineVerse3D: React.FC<CineVerse3DProps> = ({ onMovieClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<{title: string, desc: string} | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Xóa sạch nội dung cũ để tránh trùng lặp khi React re-render (Strict Mode)
    mountRef.current.innerHTML = '';

    // 1. SETUP SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0003);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 40000);
    camera.position.set(0, 1500, 6000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 6000;
    controls.minDistance = 2;

    // 2. POST-PROCESSING
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.9;
    bloomPass.strength = 1.0;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 3. LIGHTS
    const ambientLight = new THREE.AmbientLight(0x0a0a2a, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 3.5);
    keyLight.position.set(500, 1000, 800);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 5.0);
    rimLight.position.set(-1000, -500, -1000);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x8a2be2, 1.5);
    fillLight.position.set(-800, 200, 200);
    scene.add(fillLight);

    // 4. ENVIRONMENT
    new RGBELoader().load('https://unpkg.com/three@0.160.0/examples/textures/equirectangular/royal_esplanade_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    // 5. STARS & DUST
    const starsCount = 30000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const r = 8700;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starsPositions[i + 2] = r * Math.cos(phi);
      const colors = [0xffffff, 0x70d6ff, 0xffd670];
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      starsColors[i] = color.r;
      starsColors[i + 1] = color.g;
      starsColors[i + 2] = color.b;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starField = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ size: 15.0, vertexColors: true, transparent: true, opacity: 0.9 }));
    scene.add(starField);

    // 6. LOADING MANAGER
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
      if (progress === 100) {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/gltf/');
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);

    // 7. CORE MOON
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    const moonTargetSize = 1200;
    gltfLoader.load('/model/theLoai/matTrang-v3.glb', (gltf) => {
      const moonModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(moonModel);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scaleFactor = moonTargetSize / Math.max(size.x, size.y, size.z);
      moonModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
      const center = new THREE.Box3().setFromObject(moonModel).getCenter(new THREE.Vector3());
      moonModel.position.sub(center);
      
      const moonWrapper = new THREE.Group();
      moonWrapper.name = "moon_wrapper";
      moonWrapper.add(moonModel);
      coreGroup.add(moonWrapper);

      const coreLabelDiv = document.createElement('div');
      coreLabelDiv.className = 'core-label';
      coreLabelDiv.textContent = 'CINE-CORE';
      coreLabelDiv.style.color = '#00d4ff';
      const coreLabel = new CSS2DObject(coreLabelDiv);
      coreLabel.position.set(0, moonTargetSize / 2 + 150, 0);
      coreGroup.add(coreLabel);
    });

    // 8. PLANETS
    const movieObjects: THREE.Group[] = [];
    const hitboxes: THREE.Mesh[] = [];
    const mixers: THREE.AnimationMixer[] = [];

    MOVIES.forEach((movie) => {
      const actualRadius = (moonTargetSize / 2) + movie.radius + 50;
      
      // Orbit Line
      const curve = new THREE.EllipseCurve(0, 0, actualRadius, actualRadius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(Math.max(100, actualRadius * 2));
      const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: movie.orbitColor, transparent: true, opacity: 0.3 }));
      orbitLine.rotation.x = Math.PI / 2;
      scene.add(orbitLine);

      const planetGroup = new THREE.Group();
      planetGroup.position.y = (Math.random() - 0.5) * 500; // Tăng độ lệch dọc để tránh chồng chéo nhãn
      planetGroup.userData = { orbitRadius: actualRadius, orbitSpeed: movie.speed, currentAngle: Math.random() * Math.PI * 2, targetSize: movie.targetSize };
      scene.add(planetGroup);
      movieObjects.push(planetGroup);

      const labelDiv = document.createElement('div');
      labelDiv.className = 'planet-label';
      labelDiv.innerHTML = `<span>${movie.title}</span>`;
      labelDiv.style.pointerEvents = 'auto';
      labelDiv.style.cursor = 'pointer';
      // Khi click vào nhãn thì chuyển sang trang danh sách phim ngay
      labelDiv.onclick = (e) => {
        e.stopPropagation();
        onMovieClick(movie.title);
      };
      
      const label = new CSS2DObject(labelDiv);
      label.position.set((movie.targetSize / 2) + 20, 0, 0);
      planetGroup.add(label);

      gltfLoader.load(movie.modelPath, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scaleFactor = movie.targetSize / Math.max(size.x, size.y, size.z);
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
        model.position.sub(center);

        const modelWrapper = new THREE.Group();
        modelWrapper.name = "3d_model";
        modelWrapper.add(model);
        planetGroup.add(modelWrapper);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.userData = { title: movie.title, desc: movie.desc };
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach(clip => mixer.clipAction(clip).play());
          mixers.push(mixer);
        }

        const hitbox = new THREE.Mesh(new THREE.SphereGeometry(Math.max(movie.targetSize * 1.5, 18), 16, 16), new THREE.MeshBasicMaterial({ visible: false }));
        hitbox.userData = { title: movie.title, desc: movie.desc };
        planetGroup.add(hitbox);
        hitboxes.push(hitbox);
      });
    });

    // 9. INTERACTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject: THREE.Object3D | null = null;
    let focusedGroup: THREE.Group | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      if (hoveredObject) {
        focusedGroup = hoveredObject.parent as THREE.Group;
        const movieTitle = hoveredObject.userData.title;
        const modelSize = focusedGroup.userData.targetSize || 3;
        const targetWorldPos = new THREE.Vector3();
        focusedGroup.getWorldPosition(targetWorldPos);

        const lookAtTarget = targetWorldPos.clone();
        lookAtTarget.y += (movieTitle === "KHOA HỌC" ? modelSize * 0.2 : modelSize * 0.2);

        const direction = new THREE.Vector3().subVectors(camera.position, lookAtTarget).normalize();
        const dist = movieTitle === "KHOA HỌC" ? modelSize * 4.0 : (modelSize * 1.5) + 10.0;
        const newCameraPos = lookAtTarget.clone().add(direction.multiplyScalar(dist));

        gsap.to(camera.position, { x: newCameraPos.x, y: newCameraPos.y, z: newCameraPos.z, duration: 1.5, ease: "power2.inOut" });
        gsap.to(controls.target, { x: lookAtTarget.x, y: lookAtTarget.y, z: lookAtTarget.z, duration: 1.5, ease: "power2.inOut", onUpdate: () => controls.update() });
      } else {
        focusedGroup = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // 10. ANIMATION LOOP
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      mixers.forEach(m => m.update(deltaTime));
      starField.rotation.y = elapsedTime * 0.002;

      const moonWrapper = coreGroup.getObjectByName("moon_wrapper");
      if (moonWrapper) moonWrapper.rotation.y += 0.003;

      movieObjects.forEach(group => {
        // Luôn cập nhật vị trí quỹ đạo cho tất cả hành tinh
        // Trừ khi hành tinh đó đang được focus để xem chi tiết
        if (focusedGroup !== group) {
          group.userData.currentAngle += group.userData.orbitSpeed * 0.005; // Chậm lại một chút cho mượt
          group.position.x = Math.cos(group.userData.currentAngle) * group.userData.orbitRadius;
          group.position.z = Math.sin(group.userData.currentAngle) * group.userData.orbitRadius;
          
          const innerModel = group.getObjectByName("3d_model");
          if (innerModel) innerModel.rotation.y += 0.01;
        }
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hitboxes);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (hoveredObject !== object) {
          hoveredObject = object;
          setHoveredMovie({ title: object.userData.title, desc: object.userData.desc });
        }
      } else {
        hoveredObject = null;
        setHoveredMovie(null);
      }

      controls.update();
      composer.render();
      labelRenderer.render(scene, camera);
    };

    animate();

    // 11. CLEANUP
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeChild(labelRenderer.domElement);
      }
    };
  }, []);

  return (
    <div className="cineverse-3d-container">
      {/* Vùng chứa Three.js - Chỉ dọn dẹp vùng này */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {isLoading && (
        <div id="loading-screen" style={{ opacity: loadingProgress === 100 ? 0 : 1 }}>
          <div className="loader-content">
            <h1 className="glitch">CINEVERSE</h1>
            <p>Đang khởi động hệ thống lõi không gian...</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div id="movie-info" className={`glass-panel ${hoveredMovie ? '' : 'hidden'}`}>
        <h2>{hoveredMovie?.title}</h2>
        <p>{hoveredMovie?.desc}</p>
        <button className="watch-btn" onClick={() => onMovieClick(hoveredMovie?.title || '')}>
          🎬 Xem Phim Thể Loại Này
        </button>
      </div>
    </div>
  );
};
