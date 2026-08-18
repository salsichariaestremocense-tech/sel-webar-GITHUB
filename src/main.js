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
// DEBUG GLOBAL
// ======================================================

let debugPanel = null;

// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setClearColor(0x000000, 0);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";

renderer.domElement.style.width = "100vw";
renderer.domElement.style.height = "100vh";

renderer.domElement.style.zIndex = "1";
renderer.domElement.style.pointerEvents = "none";

document.body.appendChild(renderer.domElement);

// ======================================================
// CENA
// ======================================================

const scene = new THREE.Scene();

// ======================================================
// CÂMARA THREE.JS
// ======================================================

const camera = new THREE.Camera();

scene.add(camera);

// ======================================================
// PAINEL DEBUG
// ======================================================

function createDebugPanel() {

  if (document.getElementById("device-debug")) {

    debugPanel =
      document.getElementById("device-debug");

    return;
  }

  debugPanel =
    document.createElement("div");

  debugPanel.id =
    "device-debug";

  debugPanel.style.position =
    "fixed";

  debugPanel.style.top =
    "10px";

  debugPanel.style.left =
    "10px";

  debugPanel.style.right =
    "10px";

  debugPanel.style.zIndex =
    "2147483647";

  debugPanel.style.background =
    "rgba(0,0,0,0.88)";

  debugPanel.style.color =
    "#00ff00";

  debugPanel.style.padding =
    "12px";

  debugPanel.style.borderRadius =
    "10px";

  debugPanel.style.border =
    "1px solid rgba(0,255,0,0.4)";

  debugPanel.style.boxShadow =
    "0 4px 20px rgba(0,0,0,0.5)";

  debugPanel.style.fontFamily =
    "monospace";

  debugPanel.style.fontSize =
    "12px";

  debugPanel.style.lineHeight =
    "1.45";

  debugPanel.style.maxHeight =
    "90vh";

  debugPanel.style.overflow =
    "auto";

  debugPanel.style.pointerEvents =
    "none";

  debugPanel.innerHTML = `
    <b>🔧 DEBUG WebAR</b><br>
    ─────────────────────────────<br>
    ⏳ A iniciar diagnóstico...
  `;

  document.body.appendChild(
    debugPanel
  );

  console.log(
    "🔧 Painel DEBUG criado"
  );
}

createDebugPanel();

// ======================================================
// AR.JS — CÂMARA
// ======================================================

const arToolkitSource =
  new THREEx.ArToolkitSource({

    sourceType: "webcam",

    // Mantemos resolução de processamento
    // moderada para melhorar desempenho.

    sourceWidth: 640,
    sourceHeight: 480,

  });

// ======================================================
// AR.JS — CONTEXTO
// ======================================================

const arToolkitContext =
  new THREEx.ArToolkitContext(

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

// ======================================================
// FUNÇÃO — DIMENSÕES DO VIEWPORT
// ======================================================

function getViewportInfo() {

  const width =
    window.innerWidth;

  const height =
    window.innerHeight;

  const aspect =
    height > 0
      ? width / height
      : 0;

  return {
    width,
    height,
    aspect,
  };
}

// ======================================================
// FUNÇÃO — INFORMAÇÃO DO VÍDEO
// ======================================================

function getVideoInfo() {

  const video =
    arToolkitSource.domElement;

  if (!video) {

    return {
      width: 0,
      height: 0,
      aspect: 0,
    };

  }

  const width =
    video.videoWidth || 0;

  const height =
    video.videoHeight || 0;

  return {

    width,
    height,

    aspect:
      height > 0
        ? width / height
        : 0,

  };

}

// ======================================================
// FUNÇÃO — AJUSTAR RENDERER
// ======================================================

function updateRendererViewport() {

  const viewport =
    getViewportInfo();

  const pixelRatio =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  // ----------------------------------------------------
  // Pixel ratio limitado a 2
  //
  // Isto evita que dispositivos com DPR 3,
  // 3.5 ou superior criem um canvas demasiado pesado.
  // ----------------------------------------------------

  renderer.setPixelRatio(
    pixelRatio
  );

  // ----------------------------------------------------
  // Renderer ocupa exatamente o viewport visual
  // ----------------------------------------------------

  renderer.setSize(
    viewport.width,
    viewport.height,
    false
  );

  // ----------------------------------------------------
  // Garantir que o canvas acompanha o viewport
  // ----------------------------------------------------

  renderer.domElement.style.width =
    `${viewport.width}px`;

  renderer.domElement.style.height =
    `${viewport.height}px`;

  console.log(
    "🎨 Renderer atualizado:",
    {
      width: viewport.width,
      height: viewport.height,
      aspect: viewport.aspect,
      pixelRatio,
    }
  );

}

// ======================================================
// DEBUG — ATUALIZAR PAINEL
// ======================================================

function updateDebugPanel() {

  if (!debugPanel) {
    return;
  }

  const video =
    arToolkitSource.domElement;

  const videoInfo =
    getVideoInfo();

  const viewport =
    getViewportInfo();

  const pixelRatio =
    window.devicePixelRatio || 1;

  // ====================================================
  // SCREEN
  // ====================================================

  const screenWidth =
    window.screen.width;

  const screenHeight =
    window.screen.height;

  // ====================================================
  // ORIENTAÇÃO
  // ====================================================

  const orientation =
    window.innerWidth >
    window.innerHeight
      ? "LANDSCAPE"
      : "PORTRAIT";

  // ====================================================
  // VISUAL VIEWPORT
  // ====================================================

  const visualViewport =
    window.visualViewport;

  const viewportWidth =
    visualViewport
      ? visualViewport.width
      : 0;

  const viewportHeight =
    visualViewport
      ? visualViewport.height
      : 0;

  const viewportScale =
    visualViewport
      ? visualViewport.scale
      : 0;

  // ====================================================
  // RENDERER
  // ====================================================

  const rendererCanvas =
    renderer.domElement;

  const rendererWidth =
    rendererCanvas.width;

  const rendererHeight =
    rendererCanvas.height;

  const rendererAspect =
    rendererHeight
      ? rendererWidth /
        rendererHeight
      : 0;

  const rendererCSSWidth =
    rendererCanvas.clientWidth;

  const rendererCSSHeight =
    rendererCanvas.clientHeight;

  const rendererCSSAspect =
    rendererCSSHeight
      ? rendererCSSWidth /
        rendererCSSHeight
      : 0;

  // ====================================================
  // AR.JS CANVAS
  // ====================================================

  const arCanvas =
    arToolkitContext
      .arController
      ?.canvas || null;

  const arCanvasWidth =
    arCanvas
      ? arCanvas.width
      : 0;

  const arCanvasHeight =
    arCanvas
      ? arCanvas.height
      : 0;

  const arCanvasCSSWidth =
    arCanvas
      ? arCanvas.clientWidth
      : 0;

  const arCanvasCSSHeight =
    arCanvas
      ? arCanvas.clientHeight
      : 0;

  const arCanvasAspect =
    arCanvasHeight
      ? arCanvasWidth /
        arCanvasHeight
      : 0;

  // ====================================================
  // VIDEO CSS
  // ====================================================

  const videoCSSWidth =
    video
      ? video.clientWidth
      : 0;

  const videoCSSHeight =
    video
      ? video.clientHeight
      : 0;

  const videoCSSAspect =
    videoCSSHeight
      ? videoCSSWidth /
        videoCSSHeight
      : 0;

  // ====================================================
  // POSIÇÕES
  // ====================================================

  const videoRect =
    video
      ? video.getBoundingClientRect()
      : null;

  const rendererRect =
    rendererCanvas
      ? rendererCanvas.getBoundingClientRect()
      : null;

  // ====================================================
  // PAINEL
  // ====================================================

  debugPanel.innerHTML = `

    <b>🔧 DEBUG WebAR — TESTE 1</b><br>

    ─────────────────────────────<br>

    📷 <b>CÂMARA</b><br>

    Resolução:
    ${videoInfo.width} × ${videoInfo.height}<br>

    Aspect:
    ${
      videoInfo.aspect
        ? videoInfo.aspect.toFixed(3)
        : "—"
    }<br>

    CSS:
    ${videoCSSWidth} × ${videoCSSHeight}<br>

    CSS Aspect:
    ${
      videoCSSAspect
        ? videoCSSAspect.toFixed(3)
        : "—"
    }<br>

    ─────────────────────────────<br>

    📱 <b>ECRÃ</b><br>

    Window:
    ${viewport.width} × ${viewport.height}<br>

    Aspect:
    ${
      viewport.aspect
        ? viewport.aspect.toFixed(3)
        : "—"
    }<br>

    Screen:
    ${screenWidth} × ${screenHeight}<br>

    Orientação:
    ${orientation}<br>

    ─────────────────────────────<br>

    🔍 <b>PIXEL RATIO</b><br>

    Original:
    ${pixelRatio}<br>

    Usado pelo Renderer:
    ${
      Math.min(pixelRatio, 2)
    }<br>

    ─────────────────────────────<br>

    👁️ <b>VISUAL VIEWPORT</b><br>

    ${
      viewportWidth
        ? viewportWidth.toFixed(1)
        : "—"
    }
    ×
    ${
      viewportHeight
        ? viewportHeight.toFixed(1)
        : "—"
    }<br>

    Scale:
    ${
      viewportScale || "—"
    }<br>

    ─────────────────────────────<br>

    🎨 <b>THREE.JS RENDERER</b><br>

    Canvas:
    ${rendererWidth} × ${rendererHeight}<br>

    Aspect:
    ${
      rendererAspect
        ? rendererAspect.toFixed(3)
        : "—"
    }<br>

    CSS:
    ${rendererCSSWidth} × ${rendererCSSHeight}<br>

    CSS Aspect:
    ${
      rendererCSSAspect
        ? rendererCSSAspect.toFixed(3)
        : "—"
    }<br>

    ─────────────────────────────<br>

    🧠 <b>AR.JS CANVAS</b><br>

    Canvas:
    ${arCanvasWidth} × ${arCanvasHeight}<br>

    Aspect:
    ${
      arCanvasAspect
        ? arCanvasAspect.toFixed(3)
        : "—"
    }<br>

    CSS:
    ${arCanvasCSSWidth} × ${arCanvasCSSHeight}<br>

    ─────────────────────────────<br>

    📍 <b>POSIÇÃO DOS ELEMENTOS</b><br>

    VIDEO:<br>

    X:
    ${
      videoRect
        ? videoRect.x.toFixed(1)
        : "—"
    }<br>

    Y:
    ${
      videoRect
        ? videoRect.y.toFixed(1)
        : "—"
    }<br>

    W:
    ${
      videoRect
        ? videoRect.width.toFixed(1)
        : "—"
    }<br>

    H:
    ${
      videoRect
        ? videoRect.height.toFixed(1)
        : "—"
    }<br><br>

    RENDERER:<br>

    X:
    ${
      rendererRect
        ? rendererRect.x.toFixed(1)
        : "—"
    }<br>

    Y:
    ${
      rendererRect
        ? rendererRect.y.toFixed(1)
        : "—"
    }<br>

    W:
    ${
      rendererRect
        ? rendererRect.width.toFixed(1)
        : "—"
    }<br>

    H:
    ${
      rendererRect
        ? rendererRect.height.toFixed(1)
        : "—"
    }

  `;

  // ====================================================
  // CONSOLE
  // ====================================================

  console.log(
    "========== DEBUG COMPLETO =========="
  );

  console.log(
    "📷 CÂMARA:",
    videoInfo
  );

  console.log(
    "📱 VIEWPORT:",
    viewport
  );

  console.log(
    "🔍 PIXEL RATIO:",
    pixelRatio
  );

  console.log(
    "🎨 RENDERER:",
    {
      canvasWidth:
        rendererWidth,

      canvasHeight:
        rendererHeight,

      aspect:
        rendererAspect,

      cssWidth:
        rendererCSSWidth,

      cssHeight:
        rendererCSSHeight,

      cssAspect:
        rendererCSSAspect,
    }
  );

  console.log(
    "🧠 AR.JS CANVAS:",
    {
      width:
        arCanvasWidth,

      height:
        arCanvasHeight,

      aspect:
        arCanvasAspect,

      cssWidth:
        arCanvasCSSWidth,

      cssHeight:
        arCanvasCSSHeight,
    }
  );

  console.log(
    "📍 VIDEO RECT:",
    videoRect
  );

  console.log(
    "📍 RENDERER RECT:",
    rendererRect
  );

  console.log(
    "===================================="
  );

}

// ======================================================
// AR.JS — RESIZE
// ======================================================

function onResize() {

  if (!arToolkitSource.ready) {
    return;
  }

  // ----------------------------------------------------
  // AR.JS ajusta o elemento da câmara
  // ----------------------------------------------------

  arToolkitSource
    .onResizeElement();

  // ----------------------------------------------------
  // NÃO copiamos o tamanho da câmara diretamente
  // para o renderer.
  //
  // O renderer deve seguir o viewport do dispositivo.
  // ----------------------------------------------------

  if (
    arToolkitContext.arController
  ) {

    arToolkitSource
      .copyElementSizeTo(
        arToolkitContext
          .arController
          .canvas
      );

  }

  // ----------------------------------------------------
  // Atualizar renderer
  // ----------------------------------------------------

  updateRendererViewport();

  // ----------------------------------------------------
  // Debug
  // ----------------------------------------------------

  updateDebugPanel();

}

// ======================================================
// AR.JS — INICIALIZAR CÂMARA
// ======================================================

arToolkitSource.init(
  () => {

    console.log(
      "📷 Câmara AR.js inicializada"
    );

    setTimeout(
      () => {

        onResize();

      },
      1000
    );

  }
);

// ======================================================
// AR.JS — INICIALIZAR CONTEXTO
// ======================================================

arToolkitContext.init(
  () => {

    camera.projectionMatrix.copy(
      arToolkitContext
        .getProjectionMatrix()
    );

    console.log(
      "✅ AR.js Context inicializado"
    );

    updateDebugPanel();

  }
);

// ======================================================
// NFT ROOT
// ======================================================

const markerRoot =
  new THREE.Group();

markerRoot.visible =
  false;

scene.add(
  markerRoot
);

// ======================================================
// TESTE — BOLA VERMELHA
// ======================================================

const testBallGeometry =
  new THREE.SphereGeometry(
    50,
    32,
    32
  );

const testBallMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });

const testBall =
  new THREE.Mesh(
    testBallGeometry,
    testBallMaterial
  );

// ======================================================
// POSIÇÃO DE REFERÊNCIA
// ======================================================

testBall.position.set(
  100,
  0,
  -100
);

markerRoot.add(
  testBall
);

console.log(
  "🔴 BOLA DE TESTE ADICIONADA"
);

// ======================================================
// ESTABILIZAÇÃO EXTRA DO TRACKING
// ======================================================

let lastPosition =
  new THREE.Vector3();

let lastQuaternion =
  new THREE.Quaternion();

let trackingInitialized =
  false;

const POSITION_SMOOTHING =
  1.0;

const ROTATION_SMOOTHING =
  1.0;

// ======================================================
// NFT / IMAGE TRACKING
// ======================================================

console.log(
  "========== DEBUG PATHS =========="
);

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

console.log(
  "================================"
);

// ======================================================
// CONTROLOS NFT
// ======================================================

const markerControls =
  new THREEx.ArMarkerControls(
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

console.log(
  "🎯 NFT Marker configurado"
);

let markerLostTimeout =
  null;

// ======================================================
// EVENTO — MARKER ENCONTRADO
// ======================================================

markerControls.addEventListener(
  "markerFound",
  () => {

    console.log(
      "🔥 MARKER ENCONTRADO"
    );

    if (
      markerLostTimeout !== null
    ) {

      clearTimeout(
        markerLostTimeout
      );

      markerLostTimeout =
        null;

    }

    markerRoot.visible =
      true;

    updateDebugPanel();

  }
);

// ======================================================
// EVENTO — MARKER PERDIDO
// ======================================================

markerControls.addEventListener(
  "markerLost",
  () => {

    console.log(
      "⚠️ MARKER PERDIDO - A AGUARDAR..."
    );

    markerLostTimeout =
      setTimeout(
        () => {

          console.log(
            "❌ MARKER PERDIDO DEFINITIVAMENTE"
          );

          markerRoot.visible =
            false;

          trackingInitialized =
            false;

          markerLostTimeout =
            null;

        },
        500
      );

  }
);

// ======================================================
// RESIZE / ORIENTAÇÃO
// ======================================================

window.addEventListener(
  "resize",
  () => {

    setTimeout(
      () => {

        onResize();

      },
      100
    );

  }
);

window.addEventListener(
  "orientationchange",
  () => {

    console.log(
      "🔄 ORIENTAÇÃO ALTERADA"
    );

    setTimeout(
      () => {

        onResize();

      },
      500
    );

  }
);

// ======================================================
// VISUAL VIEWPORT
// ======================================================

if (
  window.visualViewport
) {

  window.visualViewport.addEventListener(
    "resize",
    () => {

      setTimeout(
        () => {

          updateRendererViewport();
          updateDebugPanel();

        },
        100
      );

    }
  );

}

// ======================================================
// NFT CARREGADO
// ======================================================

window.addEventListener(
  "arjs-nft-loaded",
  () => {

    console.log(
      "✅ NFT CARREGADO COM SUCESSO"
    );

    updateDebugPanel();

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

  if (
    !arToolkitSource.ready
  ) {

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
  // ESTABILIZAÇÃO EXTRA
  // ==================================================

  if (
    markerRoot.visible
  ) {

    // ------------------------------------------------
    // PRIMEIRA DETEÇÃO
    // ------------------------------------------------

    if (
      !trackingInitialized
    ) {

      lastPosition.copy(
        markerRoot.position
      );

      lastQuaternion.copy(
        markerRoot.quaternion
      );

      trackingInitialized =
        true;

    }

    // ------------------------------------------------
    // POSIÇÃO
    // ------------------------------------------------

    lastPosition.lerp(
      markerRoot.position,
      POSITION_SMOOTHING
    );

    markerRoot.position.copy(
      lastPosition
    );

    // ------------------------------------------------
    // ROTAÇÃO
    // ------------------------------------------------

    lastQuaternion.slerp(
      markerRoot.quaternion,
      ROTATION_SMOOTHING
    );

    markerRoot.quaternion.copy(
      lastQuaternion
    );

  } else {

    trackingInitialized =
      false;

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