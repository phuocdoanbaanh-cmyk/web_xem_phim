import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import './CineVerse3D.css';

interface MovieData {
  title: string;
  desc: string;
  targetSize: number;
  radius: number;
  speed: number;
  orbitColor: number;
}

const MOVIES: MovieData[] = [
  // Lớp quỹ đạo 1: Gần trung tâm (Giãn cách 250)
  { title: "CHIẾU RẠP", desc: "Thành phố của những giấc mơ.", targetSize: 35, radius: 600, speed: 0.30, orbitColor: 0x00ffff }, // Cyan Neon
  { title: "KINH DỊ", desc: "Hành trình vào nỗi sợ hãi.", targetSize: 32, radius: 850, speed: 0.25, orbitColor: 0xff003c },   // Blood Red Neon
  { title: "TÌNH CẢM", desc: "Những cung bậc cảm xúc lãng mạn.", targetSize: 35, radius: 1100, speed: 0.22, orbitColor: 0xff00ff }, // Magenta
  { title: "ÂM NHẠC", desc: "Giai điệu vượt không gian và thời gian.", targetSize: 30, radius: 1350, speed: 0.20, orbitColor: 0xbd00ff }, // Electric Purple
  
  // Lớp quỹ đạo 2: Tầm trung (Giãn cách 300)
  { title: "BÍ ẨN", desc: "Những câu đố chưa có lời giải đáp.", targetSize: 35, radius: 1650, speed: 0.18, orbitColor: 0x8a2be2 }, // Blue Violet
  { title: "CHIẾN TRANH", desc: "Ký ức lịch sử và những bản anh hùng ca.", targetSize: 38, radius: 1950, speed: 0.16, orbitColor: 0xff4500 }, // Orange Red
  { title: "CHÍNH KỊCH", desc: "Những góc khuất chân thực của cuộc sống.", targetSize: 30, radius: 2250, speed: 0.15, orbitColor: 0x1e90ff }, // Dodger Blue
  { title: "CỔ TRANG", desc: "Hào quang của các triều đại lịch sử.", targetSize: 40, radius: 2550, speed: 0.14, orbitColor: 0xffd700 }, // Gold
  { title: "GIA ĐÌNH", desc: "Tình thân là sức mạnh lớn lao nhất.", targetSize: 32, radius: 2850, speed: 0.13, orbitColor: 0x00fa9a }, // Medium Spring Green
  
  // Lớp quỹ đạo 3: Rìa ngoài (Giãn cách 350)
  { title: "HÀI HƯỚC", desc: "Tiếng cười giải trí bất tận.", targetSize: 35, radius: 3200, speed: 0.12, orbitColor: 0xffae42 }, // Yellow Orange
  { title: "HÌNH SỰ", desc: "Trí tuệ trong cuộc chiến thiện ác.", targetSize: 38, radius: 3550, speed: 0.11, orbitColor: 0x4169e1 }, // Royal Blue
  { title: "HOẠT HÌNH", desc: "Thế giới muôn màu của trí tưởng tượng.", targetSize: 35, radius: 3900, speed: 0.10, orbitColor: 0xff8c00 }, // Dark Orange
  { title: "PHIÊU LƯU", desc: "Những cuộc hành trình đầy kỳ thú.", targetSize: 45, radius: 4250, speed: 0.08, orbitColor: 0x32cd32 }, // Lime Green
  { title: "TÂM LÝ", desc: "Chiều sâu phức tạp trong tâm hồn.", targetSize: 30, radius: 4600, speed: 0.07, orbitColor: 0xff1493 }, // Deep Pink
  
  // Lớp quỹ đạo 4: Vũ trụ sâu thẳm (Giãn cách 400)
  { title: "HỌC ĐƯỜNG", desc: "Kỷ niệm thanh xuân rực rỡ dưới mái trường.", targetSize: 35, radius: 5000, speed: 0.06, orbitColor: 0x00ced1 }, // Dark Turquoise
  { title: "VIỄN TƯỞNG", desc: "Tương lai của công nghệ máy móc.", targetSize: 42, radius: 5400, speed: 0.05, orbitColor: 0x00ff7f }, // Spring Green
  { title: "KHOA HỌC", desc: "Khám phá giới hạn của tri thức nhân loại.", targetSize: 50, radius: 5800, speed: 0.09, orbitColor: 0x08e8de }, // Bright Turquoise
  { title: "VÕ THUẬT", desc: "Tinh hoa võ học đỉnh cao.", targetSize: 38, radius: 6200, speed: 0.04, orbitColor: 0xff2400 }  // Scarlet
];


const TOP_FAVORITE_MOVIES = [
  { 
    id: 1, movieId: '11',
    title: "Tiếng Yêu Này Anh Dịch Được Không", sub: "Can This Love Be Translated", tags: "T16 • Phần 1 • Tập 1", genre: "Hài hước • Chính kịch • Tình cảm",
    poster: "/images/tieng-yeu-nay-anh-dich-duoc-khong-thumb.jpg", 
    cover: "/images/anhbia_tiengyeunayanhdichduockhong.jpg"
  },
  { 
    id: 2, movieId: '9',
    title: "Spider-Man: Brand New Day", sub: "Spider-Man: Brand New Day", tags: "T13 • Phần 1 • Tập 1", genre: "Hành động • Phiêu lưu • Sci-Fi",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=400", 
    cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: 3, movieId: '10',
    title: "Phí Phông: Quỷ Máu Rừng Thiêng", sub: "Phí Phông", tags: "T18 • Phần 1 • Tập 1", genre: "Kinh dị • Thriller • Chính kịch",
    poster: "/images/phiphong.jpg", 
    cover: "/images/phiphong.jpg"
  },
  { 
    id: 4, movieId: '12',
    title: "Huyền Thoại Lính Bếp", sub: "Legend of the Military Cook", tags: "T16 • Phần 1 • Tập 1", genre: "Hài hước",
    poster: "/images/Huyen-Thoai-Linh-Bep-thumb.jpg", 
    cover: "/images/bia_huyenthoailinhbep.jpg"
  },
  { 
    id: 5, movieId: '6',
    title: "The Batman", sub: "The Batman", tags: "T16 • Phần 1 • Tập 1", genre: "Hành động • Hình sự • Chính kịch",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=400", 
    cover: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800"
  },
];

interface CineVerse3DProps {
  onMovieClick: (category: string) => void;
  onMovieSelect?: (movieId: string) => void;
}

export const CineVerse3D: React.FC<CineVerse3DProps> = ({ onMovieClick, onMovieSelect }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<{title: string, desc: string} | null>(null);
const [showMovies, setShowMovies] = useState(false);

// LẮNG NGHE SỰ KIỆN LĂN CHUỘT (SCROLL) MỚI
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isLoading) return; 
      
      // CHỈ KHI ĐANG Ở BẢNG PHIM (showMovies = true) VÀ LĂN CHUỘT LÊN (deltaY < 0) -> Trở về vũ trụ
      if (showMovies && event.deltaY < -50) {
        setShowMovies(false);
      }
      // Khi đang ở Vũ trụ (!showMovies), lăn chuột sẽ mặc định để Zoom mô hình 3D, không chuyển trang.
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isLoading, showMovies]); // Quan trọng: Đã thêm showMovies vào mảng dependency
  useEffect(() => {
    if (!mountRef.current) return;

    mountRef.current.innerHTML = '';

    // 1. SETUP SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00005);
    
    // Đổi FOV thành 60 để góc nhìn điện ảnh hơn (không bị méo viền nhiều như 75)
// Đổi near từ 0.01 thành 100 để chống lỗi vỡ nát mô hình (Z-fighting)
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 50000);    
    // KÉO CAMERA RA XA VÀ CAO HƠN (Nhìn bao quát toàn bộ hành tinh)
    camera.position.set(0, 4500, 15000); 
    
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
    
    // ============= BẬT LẠI ZOOM =============
    controls.enableZoom = true; // Cho phép lăn chuột để thu phóng vũ trụ tự do
    // =============================================

    // TĂNG GIỚI HẠN ZOOM ĐỂ NGƯỜI DÙNG LĂN CHUỘT RA XA HƠN THOẢI MÁI
    controls.maxDistance = 20000; 
    controls.minDistance = 1500; // Không cho zoom xuyên thẳng vào trong lõi mặt trăng
    
    // BẬT TỰ ĐỘNG XOAY CAMERA (Giúp giao diện động và đẹp mắt hơn)
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3; // Tốc độ xoay chậm rải, thư giãn

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
    const ambientLight = new THREE.AmbientLight(0x0a0a2a, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.5);
    keyLight.position.set(5000, 5000, 8000); // Đẩy đèn ra xa để chiếu sáng diện rộng
    keyLight.castShadow = true;
    
    // FIX LỖI NHÁY ĐEN (SHADOW ACNE) VÀ TĂNG ĐỘ NÉT CHO BÓNG ĐỔ
    keyLight.shadow.mapSize.width = 2048; // Nâng độ phân giải bóng đổ lên 2K
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 100;
    keyLight.shadow.camera.far = 25000;
    // Mở rộng vùng phủ sóng của bóng đổ cho vừa với vũ trụ khổng lồ
    keyLight.shadow.camera.left = -5000;
    keyLight.shadow.camera.right = 5000;
    keyLight.shadow.camera.top = 5000;
    keyLight.shadow.camera.bottom = -5000;
    keyLight.shadow.bias = -0.001; // Thông số quan trọng nhất: Xóa các vệt nhiễu đen trên bề mặt

    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 3.0);
    rimLight.position.set(-1000, -500, -1000);
    scene.add(rimLight);

    // 4. STARS & DUST
    const starsCount = 30000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const r = 25000;
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

    // 5. LOADING PROGRESS
    let fakeProgress = 0;
    const loadingInterval = setInterval(() => {
      fakeProgress += 15;
      if (fakeProgress > 100) fakeProgress = 100;
      setLoadingProgress(fakeProgress);
      if (fakeProgress === 100) {
        clearInterval(loadingInterval);
        setTimeout(() => setIsLoading(false), 800);
      }
    }, 100);

    // 6. CORE MOON
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    const moonTargetSize = 5000;
    
    const moonWrapper = new THREE.Group();
    moonWrapper.name = "moon_wrapper";
    coreGroup.add(moonWrapper);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/model/matTrang-v3.glb',
      (gltf) => {
        const moonModel = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(moonModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scaleFactor = moonTargetSize / Math.max(size.x, size.y, size.z);
        moonModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        const center = new THREE.Box3().setFromObject(moonModel).getCenter(new THREE.Vector3());
        moonModel.position.sub(center);
        
        moonWrapper.add(moonModel);
      },
      undefined,
      (error) => {
        console.error("Lỗi khi load mô hình mặt trăng:", error);
      }
    );

    const coreLabelDiv = document.createElement('div');
    coreLabelDiv.className = 'core-label';
    coreLabelDiv.textContent = '';
    coreLabelDiv.style.color = '#00d4ff';
    const coreLabel = new CSS2DObject(coreLabelDiv);
    coreLabel.position.set(0, moonTargetSize / 2 + 150, 0);
    coreGroup.add(coreLabel);
// ==========================================
   // ==========================================
    // 6.5. PHI HÀNH GIA LƠ LỬNG (VIP PRO BACKGROUND)
    // ==========================================
    let astronautModel: THREE.Group | null = null;
    let astronautMixer: THREE.AnimationMixer | null = null;

    gltfLoader.load(
      '/model/phiHanhGia.glb', 
      (gltf) => {
        astronautModel = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(astronautModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        
        // VẬT THỂ KHỔNG LỒ: Phóng to kích thước lên cực đại (8000)
        const targetSize = 8000; 
        const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);
        astronautModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        const center = new THREE.Box3().setFromObject(astronautModel).getCenter(new THREE.Vector3());
        astronautModel.position.sub(center);

       // Đẩy ra xa (Bán kính 12000) - Đảm bảo nằm sau các hành tinh nhưng vẫn trong ngân hà
        astronautModel.position.set(-8000, 0, -8000); 
        
        // CỰC KỲ QUAN TRỌNG: Tắt sương mù che khuất và cho phát sáng nhẹ
        astronautModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            mat.fog = false; // Chống tàng hình trong sương mù đen
            mat.emissive = new THREE.Color(0x112233); // Phát sáng màu xanh vũ trụ nhẹ nhàng
            mat.emissiveIntensity = 0.8;
          }
        });

        scene.add(astronautModel);

        if (gltf.animations && gltf.animations.length > 0) {
          astronautMixer = new THREE.AnimationMixer(astronautModel);
          gltf.animations.forEach((clip) => {
            astronautMixer?.clipAction(clip).play();
          });
        }
      },
      undefined,
      (error) => console.error("Lỗi load phi hành gia:", error)
    );
    // 7. PLANETS
    const movieObjects: THREE.Group[] = [];
    const hitboxes: THREE.Mesh[] = [];
    const orbitRings: THREE.Group[] = []; // Chứa cụm quỹ đạo
    const dashMaterials: THREE.LineDashedMaterial[] = []; // Điều khiển dòng chảy ánh sáng

    MOVIES.forEach((movie, index) => {
      const actualRadius = (moonTargetSize / 2) + (movie.radius * 1.5) + 300;
      
      const curve = new THREE.EllipseCurve(0, 0, actualRadius, actualRadius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(Math.max(150, actualRadius / 10));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Tạo một Group để gộp 2 vòng lại
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = Math.PI / 2;

     // 1. VÒNG NỀN (Hệ thống đường ray Hologram đồng nhất)
      const solidMaterial = new THREE.LineBasicMaterial({
        color: 0x1a3a5a, // ÉP TOÀN BỘ VỀ MÀU XANH BIỂN SÂU (tạo sự đồng nhất, không bị lòe loẹt cầu vồng)
        transparent: true,
        opacity: 0.25, // Tăng nhẹ để nhìn rõ lưới không gian
        blending: THREE.AdditiveBlending,
        depthWrite: false // Quan trọng: Chống lỗi viền đen khi đè lên nhau
      });
      const solidLine = new THREE.Line(geometry, solidMaterial);
      ringGroup.add(solidLine);

      // 2. VÒNG DATA (Sao chổi năng lượng chạy trên đường ray)
      const dashMaterial = new THREE.LineDashedMaterial({ 
        color: movie.orbitColor, // Tỏa sáng theo màu Neon rực rỡ của từng thể loại
        transparent: true, 
        opacity: 1.0, // Sáng Max ping
        dashSize: 100, // Vệt sáng DÀI RA giống như đuôi sao chổi
        gapSize: 400,  // Khoảng cách thưa ra để tạo điểm nhấn tốc độ
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const dashLine = new THREE.Line(geometry, dashMaterial);
      dashLine.computeLineDistances(); 
      ringGroup.add(dashLine);

      scene.add(ringGroup);
      orbitRings.push(ringGroup);
      dashMaterials.push(dashMaterial); // Đưa vào mảng để tạo hiệu ứng chạy

      const planetGroup = new THREE.Group();
      
     // THUẬT TOÁN TỈ LỆ VÀNG (GOLDEN RATIO): Đảm bảo các hành tinh phân tán tối đa 360 độ
      const goldenAngle = 2.39996; // ~137.5 độ (Góc tỉ lệ vàng trong tự nhiên)
      const initialAngle = index * goldenAngle;
      
      // CHIỀU QUAY: Đảo chiều xoay theo quỹ đạo (Chẵn quay tới, Lẻ quay lùi) để không bao giờ đuổi kịp nhau
      const orbitDirection = index % 2 === 0 ? 1 : -1;

      // TRỤC Y: Tăng biên độ lên 600 và dãn bước sóng để các hành tinh nhấp nhô xa nhau hơn theo chiều dọc
      planetGroup.position.y = Math.sin(index * 1.5) * 600; 
      
      planetGroup.userData = { 
        orbitRadius: actualRadius, 
        orbitSpeed: movie.speed,
        orbitDirection: orbitDirection, // Lưu lại chiều quay
        currentAngle: initialAngle,
        targetSize: movie.targetSize 
      };
      scene.add(planetGroup);
      movieObjects.push(planetGroup);

      const labelDiv = document.createElement('div');
      labelDiv.className = 'planet-label';
      labelDiv.innerHTML = `<span>${movie.title}</span>`;
      labelDiv.style.pointerEvents = 'auto';
      labelDiv.style.cursor = 'pointer';
      // Thêm hiệu ứng transition để mượt mà khi ẩn/hiện
      labelDiv.style.transition = 'opacity 0.3s ease-in-out';
      
      labelDiv.onclick = (e) => {
        e.stopPropagation();
        onMovieClick(movie.title);
      };
      
      const label = new CSS2DObject(labelDiv);
      label.name = "planet_label"; // Đặt tên để dễ tìm kiếm trong vòng lặp animation
// Nhấc text nhích lên trên một chút (Trục Y = 25) để chữ không đè ngang vào quả cầu
      label.position.set((movie.targetSize / 2) + 15, 25, 0);
            planetGroup.add(label);

      const planetGeometry = new THREE.SphereGeometry(movie.targetSize / 2, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: movie.orbitColor, 
          roughness: 0.4, 
          metalness: 0.6,
          emissive: movie.orbitColor,
          emissiveIntensity: 0.2
      });
      const model = new THREE.Mesh(planetGeometry, planetMaterial);
      model.userData = { title: movie.title, desc: movie.desc };
      model.castShadow = true;
      model.receiveShadow = true;

      const modelWrapper = new THREE.Group();
      modelWrapper.name = "3d_model";
      modelWrapper.add(model);
      planetGroup.add(modelWrapper);

      const hitbox = new THREE.Mesh(new THREE.SphereGeometry(Math.max(movie.targetSize * 1.5, 18), 16, 16), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.userData = { title: movie.title, desc: movie.desc };
      planetGroup.add(hitbox);
      hitboxes.push(hitbox);
    });

    // 8. INTERACTION
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

    // TOÁN HỌC: Khởi tạo quả cầu ảo để che khuất nhãn HTML
    // Bán kính = moonTargetSize / 2 * 0.95 (Trừ hao 5% để nhãn ở rìa không bị tắt quá sớm)
    const occlusionSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), (moonTargetSize / 2) * 0.95);
    const sightRay = new THREE.Ray();
    const labelWorldPos = new THREE.Vector3();

    // ==========================================
    // 9. ANIMATION LOOP
    const clock = new THREE.Clock();
    let animId: number;

   const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta(); // Thời gian giữa 2 khung hình
      const elapsedTime = clock.getElapsedTime(); // Tổng thời gian trôi qua

      starField.rotation.y = elapsedTime * 0.002;
      
// ==========================================
      // ANIMATION: DÒNG CHẢY ÁNH SÁNG QUỸ ĐẠO (VIP PRO MAX)
      // ==========================================
      // 1. Xoay toàn bộ vòng cực kỳ chậm
      orbitRings.forEach((ring, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        ring.rotation.z += 0.0003 * direction; 
      });

      // 2. Ép các vệt sáng chạy rần rần trên quỹ đạo (như data truyền tải)
      dashMaterials.forEach((mat, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        // Giảm dashOffset làm vệt sáng tiến về phía trước
        mat.dashOffset -= 0.8 * direction; 
      });
    // ==========================================
      // DI CHUYỂN PHI HÀNH GIA LƠ LỬNG (VIP PRO)
      // ==========================================
      if (astronautMixer) astronautMixer.update(delta);
      
      if (astronautModel) {
        // Trôi nổi nhấp nhô theo trục Y quanh mức ngang bằng mặt trăng (0)
        const floatY = Math.sin(elapsedTime * 0.8) * 400; // Tăng biên độ nhấp nhô lên 400 cho đẹp
        
        // Toán học VIP: Cho phi hành gia bay theo quỹ đạo khổng lồ bao quanh hệ mặt trời
        const giantOrbitRadius = 12000; 
        const orbitSpeed = 0.02; // Tốc độ bay cực chậm tạo cảm giác vĩ đại
        
        astronautModel.position.x = Math.cos(elapsedTime * orbitSpeed + Math.PI * 1.25) * giantOrbitRadius;
        astronautModel.position.z = Math.sin(elapsedTime * orbitSpeed + Math.PI * 1.25) * giantOrbitRadius;
        astronautModel.position.y = floatY;

        // Bắt phi hành gia luôn hướng mặt nhìn về Mặt trăng ở trung tâm
        astronautModel.lookAt(0, 0, 0);
        
        // Thêm một chút nghiêng người (nghiêng trục Z) cho ngầu
        astronautModel.rotateZ(Math.sin(elapsedTime * 0.5) * 0.1); 
      }
      // ==========================================

      const moonWrapper = coreGroup.getObjectByName("moon_wrapper");
      if (moonWrapper) moonWrapper.rotation.y += 0.003;

      movieObjects.forEach(group => {
        if (focusedGroup !== group) {
          // Nhân thêm orbitDirection để hành tinh bay ĐÚNG CHIỀU với dòng chảy ánh sáng của quỹ đạo
          group.userData.currentAngle += (group.userData.orbitSpeed * 0.005 * group.userData.orbitDirection);
          group.position.x = Math.cos(group.userData.currentAngle) * group.userData.orbitRadius;
          group.position.z = Math.sin(group.userData.currentAngle) * group.userData.orbitRadius;
          
          const innerModel = group.getObjectByName("3d_model");
          if (innerModel) innerModel.rotation.y += 0.01;
        }

        // ==========================================
        // TÍNH TOÁN CHE KHUẤT (OCCLUSION) CHO NHÃN 
        // ==========================================
        const labelObj = group.getObjectByName("planet_label") as unknown as CSS2DObject;
        if (labelObj) {
            labelObj.getWorldPosition(labelWorldPos);
            
            // Cài đặt tia nhìn từ Camera đến Nhãn
            sightRay.origin.copy(camera.position);
            sightRay.direction.subVectors(labelWorldPos, camera.position).normalize();
            
            const distToLabel = camera.position.distanceTo(labelWorldPos);
            const intersectPoint = new THREE.Vector3();
            
            // Kiểm tra xem tia nhìn có bị cắt ngang bởi mặt trăng không
            const isHit = sightRay.intersectSphere(occlusionSphere, intersectPoint);
            
            // Nếu bị chắn VÀ điểm chắn gần camera hơn là cái nhãn => Ẩn nhãn
            if (isHit && camera.position.distanceTo(intersectPoint) < distToLabel) {
                labelObj.element.style.opacity = '0';
                labelObj.element.style.pointerEvents = 'none'; // Chống click xuyên mặt trăng
            } else {
                labelObj.element.style.opacity = '1';
                labelObj.element.style.pointerEvents = 'auto';
            }
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

    // 10. CLEANUP
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(loadingInterval);
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
    <div className={`cineverse-3d-container ${showMovies ? 'show-movies-mode' : ''}`}>
      
      {/* LỚP BỌC VŨ TRỤ 3D (Sẽ bay lên và mờ đi khi bấm Khám Phá) */}
      <div className="canvas-wrapper">
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      </div>

      {/* MÀN HÌNH LOADING */}
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

     {/* NÚT CLICK KÍCH HOẠT HIỆU ỨNG */}
      {!isLoading && !showMovies && (
        <div className="scroll-indicator" onClick={() => setShowMovies(true)}>
          {/* Biểu tượng Radar nhấp nháy thay cho con lăn chuột */}
          <div className="click-target"></div>
          <span className="btn-text">CLICK KHÁM PHÁ</span>
        </div>
      )}

      {/* ================= GIAO DIỆN PHIM HOT & ĐỀ XUẤT VIP PRO ================= */}
      {/* ================= GIAO DIỆN PHIM HOT & ĐỀ XUẤT VIP PRO ================= */}
      <div className={`movies-dashboard ${showMovies ? 'active' : ''}`}>
        
        {/* Nút quay lại Vũ trụ (Hiệu ứng tên lửa bay) */}
        <button className="back-btn" onClick={() => setShowMovies(false)}>
          <span className="rocket">🚀</span> Trở Về Trạm Không Gian
        </button>

        {/* TIÊU ĐỀ PHIM HOT */}
        <h2 className="top-movies-title">🔥 TOP PHIM HOT HÔM NAY</h2>

        {/* Khối chứa 2 bảng nằm cạnh nhau */}
        {/* ================= DANH SÁCH TOP PHIM (NETFLIX STYLE) ================= */}
        <div className="top-movies-row">
          {TOP_FAVORITE_MOVIES.map((movie) => (
            <div className="movie-card-wrapper" key={movie.id}>
              
              {/* THẺ CƠ BẢN (BASE CARD) */}
              <div className="movie-base-card">
                <div className="poster-container">
                  <img src={movie.poster} alt={movie.title} />
                </div>
                <div className="movie-info-bottom">
                  <span className="big-rank">{movie.id}</span>
                  <div className="movie-text">
                    <h4>{movie.title}</h4>
                    <p className="sub">{movie.sub}</p>
                    <p className="tags">{movie.tags}</p>
                  </div>
                </div>
              </div>

              {/* THẺ PHÓNG TO KHI HOVER (EXPANDED CARD) */}
              <div className="movie-expanded-card">
                <div className="expanded-cover">
                  <img src={movie.cover} alt={movie.title} />
                  <div className="cover-gradient"></div>
                </div>
                <div className="expanded-info">
                  <h4>{movie.title}</h4>
                  <p className="sub">{movie.sub}</p>
                  
                  <div className="action-buttons">
                    <button className="btn-play" onClick={() => onMovieSelect?.(movie.movieId)}>
                      ▶ Xem ngay
                    </button>
                    <button className="btn-circle">♥</button>
                    <button className="btn-circle">i</button>
                  </div>
                  
                  <div className="meta-tags">
                    <span className="imdb">IMDb 8.5</span>
                    <span className="age">T16</span>
                    <span>2026</span>
                    <span>Phần 1</span>
                  </div>
                  <p className="genres">{movie.genre}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
        {/* ====================================================================== */}
      </div>
      {/* =========================================================== */}
      {/* =========================================================== */}
      
      {/* BẢNG THÔNG TIN PHIM KHI HOVER HÀNH TINH */}
      <div id="movie-info" className={`glass-panel ${hoveredMovie && !showMovies ? '' : 'hidden'}`}>
        <h2>{hoveredMovie?.title}</h2>
        <p>{hoveredMovie?.desc}</p>
        <button className="watch-btn" onClick={() => onMovieClick(hoveredMovie?.title || '')}>
          🎬 Xem Phim Thể Loại Này
        </button>
      </div>
    </div>
  );
};
