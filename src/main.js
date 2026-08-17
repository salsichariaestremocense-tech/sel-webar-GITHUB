import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex.mjs";

const BASE_URL = import.meta.env.BASE_URL;

console.log("📁 Base URL:", BASE_URL);

console.log("Three.js carregado =", !!THREE);
console.log("AR.js carregado =", !!THREEx);

// ======================================================
// TESTE 1 — NFT TRACKING SEM MODELO 3D
// ======================================================

console.log("🔴 TESTE 1 ATIVO — SEM GLB");

// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.zIndex = "1";

document.body.appendChild(renderer.domElement);

// ======================================================
// CENA
// ======================================================

const scene = new THREE.Scene();

// ======================================================
// CÂMARA
// ======================================================

const camera = new THREE.Camera();

scene.add(camera);

// ======================================================
// ILUMINAÇÃO
// ======================================================

// Não precisamos de iluminação neste teste,
// porque a bola usa MeshBasicMaterial.

// ======================================================
// AR.JS - CÂMARA
// ======================================================

const arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
  sourceWidth: 640,
  sourceHeight: 480,
});

arToolkitSource.init(() => {

  console.log("📷 Câmara AR.js inicializada");

  setTimeout(() => {

    onResize();

    showDeviceInfo();

    const video = arToolkitSource.domElement;

    console.log("========== INFO CÂMARA ==========");

    console.log(
      "📐 VideoWidth:",
      video.videoWidth
    );

    console.log(
      "📐 VideoHeight:",
      video.videoHeight
    );

    console.log(
      "📱 WindowWidth:",
      window.innerWidth
    );

    console.log(
      "📱 WindowHeight:",
      window.innerHeight
    );

    console.log(
      "📊 DevicePixelRatio:",
      window.devicePixelRatio
    );

    console.log(
      "📐 Aspect Ratio Câmara:",
      video.videoWidth / video.videoHeight
    );

    console.log(
      "📐 Aspect Ratio Ecrã:",
      window.innerWidth / window.innerHeight
    );

    console.log(
      "================================");

  }, 1000);
});

// ======================================================
// DEBUG - INFORMAÇÃO DO DISPOSITIVO
// ======================================================

function showDeviceInfo() {

  const video = arToolkitSource.domElement;

  // Remover painel anterior, caso exista
  const oldInfo = document.getElementById(
    "device-debug"
  );

  if (oldInfo) {
    oldInfo.remove();
  }

  const info = document.createElement("div");

  info.id = "device-debug";

  info.style.position = "fixed";
  info.style.top = "10px";
  info.style.left = "10px";

  info.style.zIndex = "99999";

  info.style.background =
    "rgba(0,0,0,0.80)";

  info.style.color =
    "#00ff00";

  info.style.padding =
    "12px";

  info.style.borderRadius =
    "8px";

  info.style.fontFamily =
    "monospace";

  info.style.fontSize =
    "13px";

  info.style.lineHeight =
    "1.5";

  info.style.pointerEvents =
    "none";

  const cameraWidth =
    video.videoWidth;

  const cameraHeight =
    video.videoHeight;

  const screenWidth =
    window.innerWidth;

  const screenHeight =
    window.innerHeight;

  const cameraAspect =
    cameraHeight
      ? cameraWidth / cameraHeight
      : 0;

  const screenAspect =
    screenHeight
      ? screenWidth / screenHeight
      : 0;

  const pixelRatio =
    window.devicePixelRatio;

  info.innerHTML = `
    <b>🔧 DEBUG WebAR</b><br>
    ─────────────────────<br>

    📷 CÂMARA<br>
    Resolução: ${cameraWidth} × ${cameraHeight}<br>
    Aspect: ${cameraAspect.toFixed(3)}<br><br>

    📱 ECRÃ<br>
    Window: ${screenWidth} × ${screenHeight}<br>
    Aspect: ${screenAspect.toFixed(3)}<br><br>

    🔍 PIXEL RATIO<br>
    ${pixelRatio}<br><br>

    🖥️ SCREEN<br>
    ${window.screen.width} × ${window.screen.height}<br><br>

    🔄 ORIENTAÇÃO<br>
    ${window.innerWidth > window.innerHeight
      ? "LANDSCAPE"
      : "PORTRAIT"}
  `;

  document.body.appendChild(info);

  console.log(
    "🔧 DEBUG DEVICE INFO:",
    {
      cameraWidth,
      cameraHeight,
      cameraAspect,
      screenWidth,
      screenHeight,
      screenAspect,
      pixelRatio,
      screenWidthPhysical: window.screen.width,
      screenHeightPhysical: window.screen.height,
      orientation:
        window.innerWidth > window.innerHeight
          ? "LANDSCAPE"
          : "PORTRAIT"
    }
  );
}

// ======================================================
// AR.JS - CONTEXTO
// ======================================================

const arToolkitContext = new THREEx.ArToolkitContext(
  {
    detectionMode: "mono",
    canvasWidth: 640,
    canvasHeight: 480,
  },
  {
    sourceWidth: 640,
    sourceHeight: 480,
  }
);

arToolkitContext.init(() => {
  camera.projectionMatrix.copy(
    arToolkitContext.getProjectionMatrix()
  );

  console.log("✅ AR.js Context inicializado");
});

// ======================================================
// NFT ROOT
// ======================================================

const markerRoot = new THREE.Group();

markerRoot.visible = false;

scene.add(markerRoot);

// ======================================================
// TESTE — BOLA VERMELHA
// ======================================================

const testBallGeometry = new THREE.SphereGeometry(
  50,
  32,
  32
);

const testBallMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});

const testBall = new THREE.Mesh(
  testBallGeometry,
  testBallMaterial
);

// POSIÇÃO QUE JÁ SABEMOS QUE FUNCIONA

testBall.position.set(
  100,
  0,
  -100
);

markerRoot.add(testBall);

console.log("🔴 BOLA DE TESTE ADICIONADA");

// ======================================================
// ESTABILIZAÇÃO EXTRA DO TRACKING
// ======================================================

let lastPosition = new THREE.Vector3();
let lastQuaternion = new THREE.Quaternion();

let trackingInitialized = false;

// Mantemos exatamente os valores da versão atual

const POSITION_SMOOTHING = 1.0;
const ROTATION_SMOOTHING = 1.0;

// ======================================================
// NFT / IMAGE TRACKING
// ======================================================

console.log("========== DEBUG PATHS ==========");

console.log(
  "🔥 DESCRIPTORS URL FINAL:",
  `${BASE_URL}markers/presunto_100_alentejano`
);

console.log(
  "🔥 FSET URL ESPERADA:",
  new URL(
    `${BASE_URL}markers/presunto_100_alentejano.fset`,
    window.location.href
  ).href
);

console.log(
  "🔥 FSET3 URL ESPERADA:",
  new URL(
    `${BASE_URL}markers/presunto_100_alentejano.fset3`,
    window.location.href
  ).href
);

console.log(
  "🔥 ISET URL ESPERADA:",
  new URL(
    `${BASE_URL}markers/presunto_100_alentejano.iset`,
    window.location.href
  ).href
);

console.log("================================");

// ======================================================
// CONTROLOS NFT
// ======================================================

const markerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot,
  {
    type: "nft",

    descriptorsUrl:
      "sel-webar-GITHUB/markers/presunto_100_alentejano",

    changeMatrixMode:
      "modelViewMatrix",

    smooth: true,
    smoothCount: 30,
    smoothTolerance: 0.02,
    smoothThreshold: 10,
  }
);

console.log("🎯 NFT Marker configurado");

let markerLostTimeout = null;

// ======================================================
// EVENTO - MARKER ENCONTRADO
// ======================================================

markerControls.addEventListener(
  "markerFound",
  () => {

    console.log("🔥 MARKER ENCONTRADO");

    // Cancelar eventual desaparecimento pendente

    if (markerLostTimeout !== null) {

      clearTimeout(markerLostTimeout);

      markerLostTimeout = null;
    }

    markerRoot.visible = true;
  }
);

// ======================================================
// EVENTO - MARKER PERDIDO
// ======================================================

markerControls.addEventListener(
  "markerLost",
  () => {

    console.log(
      "⚠️ MARKER PERDIDO - A AGUARDAR..."
    );

    // NÃO esconder imediatamente

    markerLostTimeout = setTimeout(() => {

      console.log(
        "❌ MARKER PERDIDO DEFINITIVAMENTE"
      );

      markerRoot.visible = false;

      trackingInitialized = false;

      markerLostTimeout = null;

    }, 500);
  }
);

// ======================================================
// RESIZE
// ======================================================

function onResize() {

  if (!arToolkitSource.ready) {
    return;
  }

  arToolkitSource.onResizeElement();

  arToolkitSource.copyElementSizeTo(
    renderer.domElement
  );

  if (
    arToolkitContext.arController !==
    null
  ) {

    arToolkitSource.copyElementSizeTo(
      arToolkitContext.arController.canvas
    );
  }
}

window.addEventListener(
  "resize",
  onResize
);

// ======================================================
// NFT CARREGADO
// ======================================================

window.addEventListener(
  "arjs-nft-loaded",
  () => {

    console.log(
      "✅ NFT CARREGADO COM SUCESSO"
    );
  }
);

// ======================================================
// LOOP AR
// ======================================================

function animate() {

  requestAnimationFrame(
    animate
  );

  // ==================================================
  // ESPERAR PELA CÂMARA
  // ==================================================

  if (!arToolkitSource.ready) {

    renderer.render(
      scene,
      camera
    );

    return;
  }

  // ==================================================
  // ATUALIZAR TRACKING
  // ==================================================

  arToolkitContext.update(
    arToolkitSource.domElement
  );

  // ==================================================
  // ESTABILIZAÇÃO EXTRA DO NFT
  // ==================================================

  if (markerRoot.visible) {

    // -----------------------------------------------
    // PRIMEIRA DETEÇÃO
    // -----------------------------------------------

    if (!trackingInitialized) {

      lastPosition.copy(
        markerRoot.position
      );

      lastQuaternion.copy(
        markerRoot.quaternion
      );

      trackingInitialized = true;
    }

    // -----------------------------------------------
    // SUAVIZAR POSIÇÃO
    // -----------------------------------------------

    lastPosition.lerp(
      markerRoot.position,
      POSITION_SMOOTHING
    );

    markerRoot.position.copy(
      lastPosition
    );

    // -----------------------------------------------
    // SUAVIZAR ROTAÇÃO
    // -----------------------------------------------

    lastQuaternion.slerp(
      markerRoot.quaternion,
      ROTATION_SMOOTHING
    );

    markerRoot.quaternion.copy(
      lastQuaternion
    );

  } else {

    trackingInitialized = false;
  }

  // ==================================================
  // RENDER
  // ==================================================

  renderer.render(
    scene,
    camera
  );
}

// ======================================================
// INICIAR
// ======================================================

animate();

console.log(
  "🚀 TESTE 1 INICIADO — NFT + BOLA VERMELHA"
);