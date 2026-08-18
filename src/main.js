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
// BODY / LAYOUT GLOBAL
// ======================================================

document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";
document.documentElement.style.width = "100%";
document.documentElement.style.height = "100%";
document.documentElement.style.overflow = "hidden";

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.overflow = "hidden";
document.body.style.position = "fixed";
document.body.style.top = "0";
document.body.style.left = "0";

// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

// ======================================================
// PIXEL RATIO
// ======================================================

renderer.setPixelRatio(
  window.devicePixelRatio || 1
);

// ======================================================
// TAMANHO INICIAL
// ======================================================

renderer.setSize(
  window.innerWidth,
  window.innerHeight,
  false
);

renderer.setClearColor(
  0x000000,
  0
);

// ======================================================
// CSS DO RENDERER
// ======================================================

renderer.domElement.style.position = "fixed";

renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.right = "0";
renderer.domElement.style.bottom = "0";

renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";

renderer.domElement.style.zIndex = "1";

renderer.domElement.style.pointerEvents = "none";

document.body.appendChild(
  renderer.domElement
);

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
// PAINEL DEBUG
// ======================================================

function createDebugPanel() {

  if (
    document.getElementById(
      "device-debug"
    )
  ) {

    debugPanel =
      document.getElementById(
        "device-debug"
      );

    return;
  }

  debugPanel =
    document.createElement("div");

  debugPanel.id =
    "device-debug";

  // ----------------------------------------------------
  // POSIÇÃO
  // ----------------------------------------------------

  debugPanel.style.position =
    "fixed";

  debugPanel.style.top =
    "10px";

  debugPanel.style.left =
    "10px";

  debugPanel.style.right =
    "10px";

  // ----------------------------------------------------
  // APARÊNCIA
  // ----------------------------------------------------

  debugPanel.style.zIndex =
    "2147483647";

  debugPanel.style.background =
    "rgba(0, 0, 0, 0.88)";

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

  // ----------------------------------------------------
  // TEXTO
  // ----------------------------------------------------

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

  // ----------------------------------------------------
  // NÃO INTERFERIR COM O AR
  // ----------------------------------------------------

  debugPanel.style.pointerEvents =
    "none";

  // ----------------------------------------------------
  // CONTEÚDO INICIAL
  // ----------------------------------------------------

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

// ======================================================
// CRIAR PAINEL IMEDIATAMENTE
// ======================================================

createDebugPanel();

// ======================================================
// AR.JS — CÂMARA
// ======================================================

const arToolkitSource =
  new THREEx.ArToolkitSource({

    sourceType: "webcam",

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
// DEBUG — ATUALIZAR PAINEL
// ======================================================

function updateDebugPanel() {

  if (!debugPanel) {
    return;
  }

  const video =
    arToolkitSource.domElement;

  // ====================================================
  // CÂMARA
  // ====================================================

  const cameraWidth =
    video?.videoWidth || 0;

  const cameraHeight =
    video?.videoHeight || 0;

  const cameraAspect =
    cameraHeight
      ? cameraWidth / cameraHeight
      : 0;

  // ====================================================
  // WINDOW
  // ====================================================

  const windowWidth =
    window.innerWidth;

  const windowHeight =
    window.innerHeight;

  const windowAspect =
    windowHeight
      ? windowWidth / windowHeight
      : 0;

  // ====================================================
  // PIXEL RATIO
  // ====================================================

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
    windowWidth > windowHeight
      ? "LANDSCAPE"
      : "PORTRAIT";

  // ====================================================
  // VISUAL VIEWPORT
  // ====================================================

  const viewport =
    window.visualViewport;

  const viewportWidth =
    viewport
      ? viewport.width
      : 0;

  const viewportHeight =
    viewport
      ? viewport.height
      : 0;

  const viewportScale =
    viewport
      ? viewport.scale
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
  // POSIÇÕES REAIS
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

    <b>🔧 DEBUG WebAR</b><br>

    ─────────────────────────────<br>

    📷 <b>CÂMARA</b><br>

    Resolução:
    ${cameraWidth} × ${cameraHeight}<br>

    Aspect:
    ${
      cameraAspect
        ? cameraAspect.toFixed(3)
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
    ${windowWidth} × ${windowHeight}<br>

    Aspect:
    ${
      windowAspect
        ? windowAspect.toFixed(3)
        : "—"
    }<br>

    Screen:
    ${screenWidth} × ${screenHeight}<br>

    Orientação:
    ${orientation}<br>

    ─────────────────────────────<br>

    🔍 <b>PIXEL RATIO</b><br>

    ${pixelRatio}<br>

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
    }
    <br>

    Y:
    ${
      videoRect
        ? videoRect.y.toFixed(1)
        : "—"
    }
    <br>

    W:
    ${
      videoRect
        ? videoRect.width.toFixed(1)
        : "—"
    }
    <br>

    H:
    ${
      videoRect
        ? videoRect.height.toFixed(1)
        : "—"
    }
    <br><br>

    RENDERER:<br>

    X:
    ${
      rendererRect
        ? rendererRect.x.toFixed(1)
        : "—"
    }
    <br>

    Y:
    ${
      rendererRect
        ? rendererRect.y.toFixed(1)
        : "—"
    }
    <br>

    W:
    ${
      rendererRect
        ? rendererRect.width.toFixed(1)
        : "—"
    }
    <br>

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
    {
      width: cameraWidth,
      height: cameraHeight,
      aspect: cameraAspect,
      cssWidth: videoCSSWidth,
      cssHeight: videoCSSHeight,
      cssAspect: videoCSSAspect
    }
  );

  console.log(
    "📱 ECRÃ:",
    {
      width: windowWidth,
      height: windowHeight,
      aspect: windowAspect,
      screenWidth,
      screenHeight,
      orientation
    }
  );

  console.log(
    "🔍 PIXEL RATIO:",
    pixelRatio
  );

  console.log(
    "👁️ VISUAL VIEWPORT:",
    {
      width: viewportWidth,
      height: viewportHeight,
      scale: viewportScale
    }
  );

  console.log(
    "🎨 RENDERER:",
    {
      canvasWidth: rendererWidth,
      canvasHeight: rendererHeight,
      aspect: rendererAspect,
      cssWidth: rendererCSSWidth,
      cssHeight: rendererCSSHeight,
      cssAspect: rendererCSSAspect
    }
  );

  console.log(
    "🧠 AR.JS CANVAS:",
    {
      width: arCanvasWidth,
      height: arCanvasHeight,
      aspect: arCanvasAspect,
      cssWidth: arCanvasCSSWidth,
      cssHeight: arCanvasCSSHeight
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

        updateDebugPanel();

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
// POSIÇÃO QUE JÁ SABEMOS QUE FUNCIONA
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
// RESIZE
// ======================================================

function onResize() {

  if (
    !arToolkitSource.ready
  ) {

    return;
  }

  // ====================================================
  // AR.JS — DIMENSIONAR A CÂMARA
  // ====================================================

  arToolkitSource
    .onResizeElement();

  // ====================================================
  // IMPORTANTE:
  //
  // NÃO fazemos:
  //
  // arToolkitSource.copyElementSizeTo(
  //   renderer.domElement
  // );
  //
  // porque isso estava a transformar o CSS
  // do renderer em 4:3.
  // ====================================================

  // ====================================================
  // AR.JS CANVAS
  // ====================================================

  if (
    arToolkitContext.arController
    !== null
  ) {

    arToolkitSource
      .copyElementSizeTo(
        arToolkitContext
          .arController
          .canvas
      );

  }

  // ====================================================
  // THREE.JS — VIEWPORT REAL
  // ====================================================

  const viewport =
    window.visualViewport;

  const width =
    viewport
      ? viewport.width
      : window.innerWidth;

  const height =
    viewport
      ? viewport.height
      : window.innerHeight;

  // ====================================================
  // PIXEL RATIO
  // ====================================================

  renderer.setPixelRatio(
    window.devicePixelRatio || 1
  );

  // ====================================================
  // TAMANHO INTERNO DO CANVAS
  // ====================================================

  renderer.setSize(
    width,
    height,
    false
  );

  // ====================================================
  // CSS — FORÇAR VIEWPORT
  // ====================================================

  renderer.domElement.style.position =
    "fixed";

  renderer.domElement.style.top =
    "0";

  renderer.domElement.style.left =
    "0";

  renderer.domElement.style.right =
    "0";

  renderer.domElement.style.bottom =
    "0";

  renderer.domElement.style.width =
    "100%";

  renderer.domElement.style.height =
    "100%";

  renderer.domElement.style.zIndex =
    "1";

  renderer.domElement.style.pointerEvents =
    "none";

  // ====================================================
  // DEBUG
  // ====================================================

  updateDebugPanel();

}

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
// VISUAL VIEWPORT CHANGE
// ======================================================

if (
  window.visualViewport
) {

  window.visualViewport.addEventListener(
    "resize",
    () => {

      setTimeout(
        () => {

          onResize();

        },
        50
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
  // ESTABILIZAÇÃO EXTRA DO NFT
  // ==================================================

  if (
    markerRoot.visible
  ) {

    // -----------------------------------------------
    // PRIMEIRA DETEÇÃO
    // -----------------------------------------------

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