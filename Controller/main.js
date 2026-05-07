import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Nhớ import GLTFLoader
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
//gsap
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// ==========================================
// 1. KHỞI TẠO SCENE, CAMERA, RENDERER
// ==========================================
const scene = new THREE.Scene();
// Giảm độ đặc của sương mù xuống mức cực nhỏ để phù hợp với vũ trụ khổng lồ
scene.fog = new THREE.FogExp2(0x000000, 0.0003);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 20000);
// camera.position.set(800, 600, 1400);
camera.position.set(0, 800, 1500);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
// Giới hạn Pixel Ratio tối đa là 2 để cứu GPU trên các màn hình độ phân giải siêu cao
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Khởi tạo CSS2DRenderer cho nhãn tên
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // Cho phép click xuyên qua label
document.body.appendChild(labelRenderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 2500;
controls.minDistance = 2;

// ==========================================
// THIẾT LẬP POST-PROCESSING (HIỆU ỨNG BLOOM TỎA SÁNG)
// ==========================================
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.1; // Chỉ những vùng sáng hơn mức này mới phát sáng
bloomPass.strength = 1.0;  // Độ rực của quầng sáng (Tùy chỉnh: 1.0 đến 2.0)
bloomPass.radius = 0.5;    // Độ lan tỏa

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// ==========================================
// 2. THÊM ÁNH SÁNG (Bắt buộc cho model .glb)
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Thêm HDRI Environment để mô hình có phản quang chân thực
new RGBELoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/royal_esplanade_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Áp dụng ánh sáng lên mọi vật liệu PBR
});

// ==========================================
// 3. TẠO HỆ THỐNG VŨ TRỤ (DEEP SPACE & NEBULA)
// ==========================================

// --- Tầng 1: Sao xa lấp lánh (Background Stars) ---
const starsCount = 15000;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsCount * 3);
const starsColors = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
    // Phân bố theo hình cầu khổng lồ bao quanh toàn bộ hệ mặt trời
    const r = 3000; // Bán kính phủ kín web
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    
    starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
    starsPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    starsPositions[i + 2] = r * Math.cos(phi);

    // Mix 3 màu: Trắng, Xanh nhạt, Vàng nhạt cho lung linh
    const colors = [0xffffff, 0x70d6ff, 0xffd670];
    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    starsColors[i] = color.r;
    starsColors[i+1] = color.g;
    starsColors[i+2] = color.b;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

const starsMaterial = new THREE.PointsMaterial({
    size: 3.0, // Kích thước sao to hơn xíu để dễ thấy
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true 
});
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// --- Tầng 2: Bụi ngân hà (Galactic Dust) ---
const dustCount = 8000;
const dustGeometry = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount * 3; i++) {
    dustPos[i] = (Math.random() - 0.5) * 4000; // Phủ rộng ra 4000 đơn vị
}
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0x4b0082, // Màu tím không gian
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
const dustField = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dustField);

// ==========================================
// 4. DỮ LIỆU PHIM & LOAD MODEL GLB
// ==========================================
const movies = [
    { title: "CHIẾU RẠP", desc: "Thành phố của những giấc mơ.", modelPath: '../model/theLoai/chieurap.glb', targetSize: 30, radius: 30, speed: 0.30, orbitColor: 0x00d4ff },
    { title: "KINH DỊ", desc: "Hành trình vào nỗi sợ hãi.", modelPath: '../model/theLoai/kinhdi.glb', targetSize: 30, radius: 55, speed: 0.25, orbitColor: 0xff1a1a },
    { title: "TÌNH CẢM", desc: "Những cung bậc cảm xúc lãng mạn.", modelPath: '../model/theLoai/tinhcam.glb', targetSize: 30, radius: 85, speed: 0.22, orbitColor: 0xff66b2 },
    { title: "ÂM NHẠC", desc: "Giai điệu vượt không gian và thời gian.", modelPath: '../model/theLoai/amNhac.glb', targetSize: 30, radius: 120, speed: 0.20, orbitColor: 0xcc99ff },
    { title: "BÍ ẨN", desc: "Những câu đố chưa có lời giải đáp.", modelPath: '../model/theLoai/biAn-v2.glb', targetSize: 30, radius: 160, speed: 0.18, orbitColor: 0x4b0082 },
    { title: "CHIẾN TRANH", desc: "Ký ức lịch sử và những bản anh hùng ca.", modelPath: '../model/theLoai/chientranh.glb', targetSize: 30, radius: 205, speed: 0.16, orbitColor: 0x8b4513 },
    { title: "CHÍNH KỊCH", desc: "Những góc khuất chân thực của cuộc sống.", modelPath: '../model/theLoai/chinhKich.glb', targetSize: 30, radius: 255, speed: 0.15, orbitColor: 0x3366ff },
    { title: "CỔ TRANG", desc: "Hào quang của các triều đại lịch sử.", modelPath: '../model/theLoai/cotrang.glb', targetSize: 30, radius: 310, speed: 0.14, orbitColor: 0xd4af37 },
    { title: "GIA ĐÌNH", desc: "Tình thân là sức mạnh lớn lao nhất.", modelPath: '../model/theLoai/giadinh-v2.glb', targetSize: 30, radius: 370, speed: 0.13, orbitColor: 0x66ff66 },
    { title: "HÀI HƯỚC", desc: "Tiếng cười giải trí bất tận.", modelPath: '../model/theLoai/haihuoc.glb', targetSize: 2.5, radius: 435, speed: 0.12, orbitColor: 0xffff00 },
    { title: "HÌNH SỰ", desc: "Trí tuệ trong cuộc chiến thiện ác.", modelPath: '../model/theLoai/hinhSu-v2.glb', targetSize: 30, radius: 505, speed: 0.11, orbitColor: 0x000080 },
    { title: "HOẠT HÌNH", desc: "Thế giới muôn màu của trí tưởng tượng.", modelPath: '../model/theLoai/hoatHinh-v1.glb', targetSize: 30, radius: 580, speed: 0.10, orbitColor: 0xff9933 },
    { title: "PHIÊU LƯU", desc: "Những cuộc hành trình đầy kỳ thú.", modelPath: '../model/theLoai/phieuLuu-v1-v2.glb', targetSize: 40, radius: 780, speed: 0.08, orbitColor: 0x32cd32 },
    { title: "TÂM LÝ", desc: "Chiều sâu phức tạp trong tâm hồn.", modelPath: '../model/theLoai/tamLy-v4.glb', targetSize: 30, radius: 850, speed: 0.07, orbitColor: 0x9932cc },
    { title: "HỌC ĐƯỜNG", desc: "Kỷ niệm thanh xuân rực rỡ dưới mái trường.", modelPath: '../model/theLoai/truongHoc.glb', targetSize: 30, radius: 960, speed: 0.06, orbitColor: 0xffffff },
    { title: "VIỄN TƯỞNG", desc: "Tương lai của công nghệ máy móc.", modelPath: '../model/theLoai/vientuong-v3.glb', targetSize: 30, radius: 1080, speed: 0.05, orbitColor: 0x00ff00 },
    { title: "KHOA HỌC", desc: "Khám phá giới hạn của tri thức nhân loại.", modelPath: '../model/theLoai/khoahoc1-v5.glb', targetSize: 250.0, radius: 660, speed: 0.09, orbitColor: 0x00ffcc },
    { title: "VÕ THUẬT", desc: "Tinh hoa võ học đỉnh cao.", modelPath: '../model/theLoai/voThuat.glb', targetSize: 30, radius: 1210, speed: 0.04, orbitColor: 0xff4500 }
];

const movieObjects = []; // Chứa model gốc .glb
const posters = []; 
const mixers = [];     // Chứa các tấm poster để làm billboard
const textureLoader = new THREE.TextureLoader();
const hitboxes = [];

// ==========================================
// TÍCH HỢP LOADING SCREEN
// ==========================================
THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    document.getElementById('loading-progress').style.width = progress + '%';
    
    if(progress === 100) {
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            // Đợi mờ dần xong thì ẩn hẳn để nhấp chuột được
            setTimeout(() => document.getElementById('loading-screen').style.display = 'none', 800);
        }, 1000); // Đợi 1 giây sau khi load xong 100% mới mờ đi
    }
};

// 1. Khởi tạo DRACOLoader
const dracoLoader = new DRACOLoader();
// 2. Chỉ định đường dẫn chứa bộ giải mã của Google (Dùng CDN của Three.js)
dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/gltf/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

movies.forEach((movie, index) => {
    // --- VẼ ĐƯỜNG QUỸ ĐẠO (ORBIT LINE) ---
    const curve = new THREE.EllipseCurve(
        0, 0,            // Tâm x, y
        movie.radius, movie.radius, // Bán kính x, y
        0, 2 * Math.PI,  // Vẽ đủ 1 vòng tròn 360 độ
        false, 0
    );
// Vẽ số lượng điểm phụ thuộc vào độ lớn của bán kính (vòng càng to vẽ càng nhiều điểm cho mượt)
    const points = curve.getPoints(Math.max(100, movie.radius * 2));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
// Tăng opacity lên 0.85 và thêm AdditiveBlending để đường line phát sáng rực rỡ trên nền đen
    const material = new THREE.LineBasicMaterial({ 
        color: movie.orbitColor, 
        transparent: true, 
        opacity: 0.8, // Bạn có thể chỉnh 0.6 đến 0.8 tùy độ sáng mong muốn
        blending: THREE.AdditiveBlending,
        fog: false
    });
        const orbitLine = new THREE.Line(geometry, material);
    orbitLine.rotation.x = Math.PI / 2;
    scene.add(orbitLine);

    // ==========================================
    // CÁCH GIẢI QUYẾT: TẠO GROUP BAO BỌC
    // ==========================================
    const planetGroup = new THREE.Group(); // Nhóm chứa cả Model và Label
    // THÊM ĐOẠN NÀY VÀO LÀM LỆCH TRỤC Y (MỖI HÀNH TINH LỆCH TỪ -40 ĐẾN 40)
    const randomY = (Math.random() - 0.5) * 80;
    planetGroup.position.y = randomY;
    
    planetGroup.userData = {
        orbitRadius: movie.radius,
        orbitSpeed: movie.speed,
        currentAngle: Math.random() * Math.PI * 2,
        // LƯU THÊM KÍCH THƯỚC VÀO ĐÂY ĐỂ TÍNH ZOOM
        targetSize: movie.targetSize || 3 
    };

    scene.add(planetGroup);
    movieObjects.push(planetGroup); // Raycaster sẽ quét qua Group này

    // --- TẠO NHÃN TÊN (LABEL) CHUẨN NASA ---
    const labelDiv = document.createElement('div');
    labelDiv.className = 'planet-label';
    labelDiv.textContent = movie.title;
    const label = new CSS2DObject(labelDiv);
    
    // Đặt vị trí Label và thêm thẳng vào Group (Không bị ảnh hưởng bởi scale/xoay của model)
// Chia đôi targetSize (tức là lấy bán kính) để chữ nằm ngay sát mép mô hình
    label.position.set((movie.targetSize / 2) + 1.5, 0, 0);    planetGroup.add(label);

   // --- LOAD MODEL .GLB ---
    gltfLoader.load(movie.modelPath, (gltf) => {
        const model = gltf.scene;

        // 1. Autoscale Model
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = movie.targetSize / maxDimension;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // ==========================================
        // 2. FIX LỖI TÂM LỆCH TRONG BLENDER (AUTO-CENTER)
        // ==========================================
        // Tính toán lại hộp bao sau khi đã scale
        const centeredBox = new THREE.Box3().setFromObject(model);
        const center = centeredBox.getCenter(new THREE.Vector3());
        
        // Kéo model lùi lại đúng bằng khoảng cách nó bị lệch
        model.position.sub(center); 

        // Tạo một cái vỏ bọc chứa model để vòng lặp animate() xoay cái vỏ bọc này
        const modelWrapper = new THREE.Group(); 
        modelWrapper.name = "3d_model";
        modelWrapper.add(model);
        // ==========================================

        // Gắn dữ liệu và bật trong suốt
        model.traverse((child) => {
            if (child.isMesh) {
                child.userData = { title: movie.title, desc: movie.desc, type: 'star' };
                child.material.transparent = true; 
                child.material.needsUpdate = true;
            }
        });

        // Kích hoạt Animation (Nếu có)
        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
            mixers.push(mixer);
        }

        // --- A. BỌC HITBOX TÀNG HÌNH ĐỂ TỐI ƯU RAYCASTER ---
        const hitboxGeo = new THREE.SphereGeometry(Math.max(movie.targetSize * 1.5, 18), 16, 16); 
        const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
        hitbox.userData = { title: movie.title, desc: movie.desc, type: 'star' };
        planetGroup.add(hitbox);
        hitboxes.push(hitbox); 

        // --- B. CACHE MESH ĐỂ TRÁNH TRAVERSE TRONG ANIMATE ---
        const meshesToFade = [];
        model.traverse((child) => {
            if (child.isMesh) {
                meshesToFade.push(child); 
                child.material.transparent = true; 
            }
        });
        planetGroup.userData.meshesToFade = meshesToFade;
        
        // --- QUAN TRỌNG: THÊM WRAPPER VÀO GROUP THAY VÌ THÊM MODEL ---
        planetGroup.add(modelWrapper); 
    });
});

// ==========================================
// 5. TƯƠNG TÁC (RAYCASTER)
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const uiPanel = document.getElementById('movie-info');
const uiTitle = document.getElementById('movie-title');
const uiDesc = document.getElementById('movie-desc');

let hoveredObject = null;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
// Biến lưu trữ hành tinh đang được người dùng chọn
let focusedGroup = null;

// ==========================================
// BẮT SỰ KIỆN CLICK ĐỂ CAMERA BAY LẠI GẦN
// ==========================================
window.addEventListener('click', () => {
   if (hoveredObject) {
        // 1. Gán hành tinh đang được chọn
        focusedGroup = hoveredObject.parent;

        // 2. Lấy tên phim và kích thước mô hình
        const movieTitle = hoveredObject.userData.title;
        const modelSize = focusedGroup.userData.targetSize || 3;

        const targetWorldPos = new THREE.Vector3();
        focusedGroup.getWorldPosition(targetWorldPos);

        // ==========================================
        // TRƯỜNG HỢP 1: NẾU LÀ PHI HÀNH GIA (khoa học)
        // ==========================================
        if (movieTitle === "KHOA HỌC") {
            // 1. ĐIỂM NHÌN (Focus): Nhìn vào phần bụng/ngực mô hình (hạ thấp xuống so với trước)
            const lookAtTarget = targetWorldPos.clone();
            lookAtTarget.y += modelSize * 0.2; 

            // 2. VỊ TRÍ CAMERA (Chỗ đứng): Đẩy lên thật CAO để tạo góc nhìn chúc xuống
            const newCameraPos = targetWorldPos.clone();
            newCameraPos.y += modelSize * 4.0; // <-- Mấu chốt: Nâng camera lên cao gấp 2.5 lần kích thước

            // 3. Tính hướng ngang và lùi ra xa
            const horizontalDirection = new THREE.Vector3().subVectors(camera.position, targetWorldPos);
            horizontalDirection.y = 0;
            horizontalDirection.normalize();

            // 4. Lùi camera ra xa vừa phải để bao quát từ trên xuống
            newCameraPos.add(horizontalDirection.multiplyScalar(modelSize * 2.0));

            // Bay Camera tới vị trí trên cao
            gsap.to(camera.position, {
                x: newCameraPos.x,
                y: newCameraPos.y, // Ở tầm rất cao
                z: newCameraPos.z,
                duration: 1.5,
                ease: "power2.inOut"
            });

            // Chĩa ống kính chúc xuống bụng/ngực
            gsap.to(controls.target, {
                x: lookAtTarget.x,
                y: lookAtTarget.y, // Focus tầm thấp
                z: lookAtTarget.z,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => controls.update()
            });

        }
        // ==========================================
        // TRƯỜNG HỢP 2: CÁC MÔ HÌNH KHÁC (NHÌN CHÍNH DIỆN)
        // ==========================================
        else {
            // Giữ nguyên đoạn mã này
            const dynamicDistance = (modelSize * 1.5) + 10.0;
            const heightOffset = modelSize * 0.2;

            const lookAtTarget = new THREE.Vector3(
                targetWorldPos.x,
                targetWorldPos.y + heightOffset,
                targetWorldPos.z
            );

            const direction = new THREE.Vector3().subVectors(camera.position, lookAtTarget).normalize();

            const newCameraPos = new THREE.Vector3().addVectors(
                lookAtTarget,
                direction.multiplyScalar(dynamicDistance)
            );

            gsap.to(camera.position, {
                x: newCameraPos.x,
                y: newCameraPos.y,
                z: newCameraPos.z,
                duration: 1.5,
                ease: "power2.inOut"
            });

            gsap.to(controls.target, {
                x: lookAtTarget.x,
                y: lookAtTarget.y,
                z: lookAtTarget.z,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => controls.update()
            });
        }
    } else {
        // Nếu click ra khoảng không vũ trụ -> Hủy chọn
        focusedGroup = null;
    }
});

// ==========================================
// 6. VÒNG LẶP RENDER & LOGIC ZOOM-IN
// ==========================================
const clock = new THREE.Clock();

let previousTime = 0; // VỊ TRÍ 2A: Khai báo biến lưu thời gian ở đây
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // VỊ TRÍ 2C: Cập nhật Animation cho các model
    mixers.forEach((mixer) => {
        mixer.update(deltaTime);
    });

    // ==========================================
    // SAO VÀ BỤI VŨ TRỤ LẤP LÁNH & QUAY NHẸ
    // ==========================================
    starField.rotation.y = elapsedTime * 0.002;
    starField.rotation.x = Math.sin(elapsedTime * 0.1) * 0.01;
    dustField.rotation.y = -elapsedTime * 0.005; // Bụi quay ngược chiều tạo độ sâu

    // --- LOGIC DI CHUYỂN THEO QUỸ ĐẠO TRÒN ---
    movieObjects.forEach(group => { 
        // ĐÓNG BĂNG VŨ TRỤ: Chỉ cho phép di chuyển nếu chưa click chọn ai
        if (focusedGroup === null) {
            group.userData.currentAngle += group.userData.orbitSpeed * 0.01; 
            
            group.position.x = Math.cos(group.userData.currentAngle) * group.userData.orbitRadius;
            group.position.z = Math.sin(group.userData.currentAngle) * group.userData.orbitRadius;
            
            const innerModel = group.getObjectByName("3d_model");
            if (innerModel) {
                innerModel.rotation.y += 0.01;
            }
        }
    });

    // Kỹ thuật Billboard: Bắt các tấm poster luôn nhìn về phía người dùng
    posters.forEach(poster => {
        const posterWorldPos = new THREE.Vector3();
        poster.getWorldPosition(posterWorldPos);
        poster.lookAt(camera.position); 
    });

    // ==========================================
    // RAYCASTER (ĐÃ TỐI ƯU - CHỈ QUÉT HITBOX)
    // ==========================================
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hitboxes); 

    if (intersects.length > 0) {
        let object = intersects[0].object; // Bây giờ chạm trúng là chạm Hitbox tàng hình
        
        if (hoveredObject !== object) {
            hoveredObject = object;
            uiTitle.textContent = hoveredObject.userData.title;
            uiDesc.textContent = hoveredObject.userData.desc;
            uiPanel.classList.remove('hidden');
        }
    } else {
        if (hoveredObject) {
            hoveredObject = null;
            uiPanel.classList.add('hidden');
        }
    }

    controls.update();
    composer.render();
    labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

animate();