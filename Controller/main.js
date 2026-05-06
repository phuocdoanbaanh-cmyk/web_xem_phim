import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Nhớ import GLTFLoader
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// ==========================================
// 1. KHỞI TẠO SCENE, CAMERA, RENDERER
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 20000);
camera.position.set(0, 10, 40);

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
controls.maxDistance = 200;
controls.minDistance = 2;

// ==========================================
// 2. THÊM ÁNH SÁNG (Bắt buộc cho model .glb)
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// ==========================================
// 3. TẠO HỆ THỐNG HẠT (GALAXY PARTICLES)
// ==========================================
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 150;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1, color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
});
const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// ==========================================
// 4. DỮ LIỆU PHIM & LOAD MODEL GLB
// ==========================================
const movies = [
    { 
        title: "CHIẾU RẠP", desc: "Thành phố của những giấc mơ.", modelPath: '../model/theLoai/chieurap.glb', targetSize: 3, 
        radius: 12, speed: 0.30, orbitColor: 0x00d4ff // Xanh lục bảo (Cyan)
    },
    { 
        title: "KINH DỊ", desc: "Hành trình vào nỗi sợ hãi.", modelPath: '../model/theLoai/kinhdi.glb', targetSize: 2.5,
        radius: 16, speed: 0.25, orbitColor: 0xff1a1a // Đỏ máu
    },
    { 
        title: "TÌNH CẢM", desc: "Những cung bậc cảm xúc lãng mạn.", modelPath: '../model/theLoai/tinhcam.glb', targetSize: 3.5,
        radius: 20, speed: 0.22, orbitColor: 0xff66b2 // Hồng phấn
    },
    { 
        title: "ÂM NHẠC", desc: "Giai điệu vượt không gian và thời gian.", modelPath: '../model/theLoai/amNhac.glb', targetSize: 3.5,
        radius: 24, speed: 0.20, orbitColor: 0xcc99ff // Tím nhạt
    },
    { 
        title: "BÍ ẨN", desc: "Những câu đố chưa có lời giải đáp.", modelPath: '../model/theLoai/biAn-v2.glb', targetSize: 3.5,
        radius: 28, speed: 0.18, orbitColor: 0x4b0082 // Tím chàm sâu thẳm
    },
    { 
        title: "CHIẾN TRANH", desc: "Ký ức lịch sử và những bản anh hùng ca.", modelPath: '../model/theLoai/chientranh.glb', targetSize: 3.5,
        radius: 32, speed: 0.16, orbitColor: 0x8b4513 // Nâu đất/Khaki
    },
    { 
        title: "CHÍNH KỊCH", desc: "Những góc khuất chân thực của cuộc sống.", modelPath: '../model/theLoai/chinhKich.glb', targetSize: 3.5,
        radius: 36, speed: 0.15, orbitColor: 0x3366ff // Xanh dương đậm
    },
    { 
        title: "CỔ TRANG", desc: "Hào quang của các triều đại lịch sử.", modelPath: '../model/theLoai/cotrang.glb', targetSize: 3.5,
        radius: 40, speed: 0.14, orbitColor: 0xd4af37 // Vàng hoàng gia
    },
    { 
        title: "GIA ĐÌNH", desc: "Tình thân là sức mạnh lớn lao nhất.", modelPath: '../model/theLoai/giadinh-v2.glb', targetSize: 3.5,
        radius: 44, speed: 0.13, orbitColor: 0x66ff66 // Xanh lá ấm áp
    },
    { 
        title: "HÀI HƯỚC", desc: "Tiếng cười giải trí bất tận.", modelPath: '../model/theLoai/haihuoc.glb', targetSize: 2.5,
        radius: 48, speed: 0.12, orbitColor: 0xffff00 // Vàng chanh tươi sáng
    },
    { 
        title: "HÌNH SỰ", desc: "Trí tuệ trong cuộc chiến thiện ác.", modelPath: '../model/theLoai/hinhSu-v2.glb', targetSize: 3.5,
        radius: 52, speed: 0.11, orbitColor: 0x000080 // Xanh Navy bí ẩn
    },
    { 
        title: "HOẠT HÌNH", desc: "Thế giới muôn màu của trí tưởng tượng.", modelPath: '../model/theLoai/hoatHinh-v1.glb', targetSize: 3.5,
        radius: 56, speed: 0.10, orbitColor: 0xff9933 // Cam rực rỡ
    },
    { 
        title: "KHOA HỌC", desc: "Khám phá giới hạn của tri thức nhân loại.", modelPath: '../model/theLoai/khoahoc1-v5.glb', targetSize: 15.0,
        radius: 60, speed: 0.09, orbitColor: 0x00ffcc // Xanh ngọc bích
    },
    { 
        title: "PHIÊU LƯU", desc: "Những cuộc hành trình đầy kỳ thú.", modelPath: '../model/theLoai/phieuLuu-v1.glb', targetSize: 3.5,
        radius: 64, speed: 0.08, orbitColor: 0x32cd32 // Xanh lục (Lime green)
    },
    { 
        title: "TÂM LÝ", desc: "Chiều sâu phức tạp trong tâm hồn.", modelPath: '../model/theLoai/tamLy-v4.glb', targetSize: 15.0,
        radius: 68, speed: 0.07, orbitColor: 0x9932cc // Tím phong lan (Orchid)
    },
    { 
        title: "HỌC ĐƯỜNG", desc: "Kỷ niệm thanh xuân rực rỡ dưới mái trường.", modelPath: '../model/theLoai/truongHoc.glb', targetSize: 3.5,
        radius: 72, speed: 0.06, orbitColor: 0xffffff // Trắng tinh khôi
    },
    { 
        title: "VIỄN TƯỞNG", desc: "Tương lai của công nghệ máy móc.", modelPath: '../model/theLoai/vientuong-v3.glb', targetSize: 5,
        radius: 76, speed: 0.05, orbitColor: 0x00ff00 // Xanh Neon Sci-fi
    },
    { 
        title: "VÕ THUẬT", desc: "Tinh hoa võ học đỉnh cao.", modelPath: '../model/theLoai/voThuat.glb', targetSize: 3.5,
        radius: 80, speed: 0.04, orbitColor: 0xff4500 // Đỏ cam cháy (Orange Red)
    }
];

const movieObjects = []; // Chứa model gốc .glb
const posters = []; 
const mixers = [];     // Chứa các tấm poster để làm billboard
const textureLoader = new THREE.TextureLoader();
const hitboxes = [];
// 1. Khởi tạo DRACOLoader
const dracoLoader = new DRACOLoader();
// 2. Chỉ định đường dẫn chứa bộ giải mã của Google (Dùng CDN của Three.js)
dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/gltf/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

movies.forEach((movie, index) => {
    // --- VẼ ĐƯỜNG QUỸ ĐẠO (ORBIT LINE) ---
    const curve = new THREE.EllipseCurve(
        0, 0,            // Tâm x, y
        movie.radius, movie.radius, // Bán kính x, y
        0, 2 * Math.PI,  // Vẽ đủ 1 vòng tròn 360 độ
        false, 0
    );
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: movie.orbitColor, transparent: true, opacity: 0.4 });
    const orbitLine = new THREE.Line(geometry, material);
    orbitLine.rotation.x = Math.PI / 2;
    scene.add(orbitLine);

    // ==========================================
    // CÁCH GIẢI QUYẾT: TẠO GROUP BAO BỌC
    // ==========================================
    const planetGroup = new THREE.Group(); // Nhóm chứa cả Model và Label
    
    // Lưu thông số động học vào Group thay vì Model
    planetGroup.userData.orbitRadius = movie.radius;
    planetGroup.userData.orbitSpeed = movie.speed;
    planetGroup.userData.currentAngle = Math.random() * Math.PI * 2; 

    scene.add(planetGroup);
    movieObjects.push(planetGroup); // Raycaster sẽ quét qua Group này

    // --- TẠO NHÃN TÊN (LABEL) CHUẨN NASA ---
    const labelDiv = document.createElement('div');
    labelDiv.className = 'planet-label';
    labelDiv.textContent = movie.title;
    const label = new CSS2DObject(labelDiv);
    
    // Đặt vị trí Label và thêm thẳng vào Group (Không bị ảnh hưởng bởi scale/xoay của model)
    label.position.set(movie.targetSize + 1.5, 0, 0); 
    planetGroup.add(label);

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
        const hitboxGeo = new THREE.SphereGeometry(movie.targetSize * 1.2, 16, 16); 
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

    // Hệ thống hạt quay nhẹ
    particleMesh.rotation.y = elapsedTime * 0.01;

    // --- LOGIC DI CHUYỂN THEO QUỸ ĐẠO TRÒN ---
    movieObjects.forEach(group => { // Đổi model thành group (vì đoạn trước bạn đã dùng Group)
        // Cập nhật góc theo thời gian và tốc độ
        group.userData.currentAngle += group.userData.orbitSpeed * 0.01; 
        
        group.position.x = Math.cos(group.userData.currentAngle) * group.userData.orbitRadius;
        group.position.z = Math.sin(group.userData.currentAngle) * group.userData.orbitRadius;
        
        // Tự quay quanh trục của chính nó (Lấy model ra từ trong group để xoay)
        const innerModel = group.getObjectByName("3d_model");
        if (innerModel) {
            innerModel.rotation.y += 0.01;
        }
    });

    // Ngân hà quay từ từ
    particleMesh.rotation.y = elapsedTime * 0.02;

    // Kỹ thuật Billboard: Bắt các tấm poster luôn nhìn về phía người dùng
    posters.forEach(poster => {
        const posterWorldPos = new THREE.Vector3();
        poster.getWorldPosition(posterWorldPos);
        poster.lookAt(camera.position); 
    });

   // ==========================================
    // LOGIC KHOẢNG CÁCH (ĐÃ TỐI ƯU - HẾT LAG)
    // ==========================================
    movieObjects.forEach(group => {
        const poster = group.children.find(child => child.userData && child.userData.type === 'poster');
        const distance = camera.position.distanceTo(group.position);
        
        // Lấy danh sách mesh đã cache ở bước nạp model
        const meshes = group.userData.meshesToFade; 

        if (distance < 18) { 
            if (poster) poster.material.opacity = THREE.MathUtils.lerp(poster.material.opacity, 1, 0.05);
            if (meshes) meshes.forEach(mesh => mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, 0.1, 0.05));
        } else { 
            if (poster) poster.material.opacity = THREE.MathUtils.lerp(poster.material.opacity, 0, 0.05);
            if (meshes) meshes.forEach(mesh => mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, 1, 0.05));
        }
    });

// ==========================================
    // RAYCASTER (ĐÃ TỐI ƯU - CHỈ QUÉT HITBOX)
    // ==========================================
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hitboxes); // Đổi movieObjects thành hitboxes, bỏ chữ 'true'

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
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();