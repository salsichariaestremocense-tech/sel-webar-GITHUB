import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex.mjs";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const BASE_URL = import.meta.env.BASE_URL;

console.log("📁 Base URL:", BASE_URL);

console.log("Three.js carregado =", !!THREE);
console.log("AR.js carregado =", !!THREEx);

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

const hemisphereLight = new THREE.HemisphereLight(
  0xffffff,
  0xbbbbff,
  1.5
);

scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(
  0xffffff,
  2
);

directionalLight.position.set(1, 2, 2);

scene.add(directionalLight);

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
  }, 1000);
});

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
// ESTABILIZAÇÃO EXTRA DO TRACKING
// ======================================================

let lastPosition = new THREE.Vector3();
let lastQuaternion = new THREE.Quaternion();

let trackingInitialized = false;

// Quanto maior, mais estável.
// Quanto menor, mais rápido reage ao movimento.
//
// Valores:
// 0.05 = muito rápido
// 0.10 = rápido
// 0.12 = equilibrado
// 0.15 = mais estável
// 0.20 = muito estável

const POSITION_SMOOTHING = 0.12;
const ROTATION_SMOOTHING = 0.12;

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

const markerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot,
  {
    type: "nft",
    
    descriptorsUrl:
      "sel-webar-GITHUB/public/markers/presunto_100_alentejano",

    changeMatrixMode:
      "modelViewMatrix",

    smooth: true,
    smoothCount: 20,
    smoothTolerance: 0.02,
    smoothThreshold: 8,
  }
);

console.log("🎯 NFT Marker configurado");

// ======================================================
// EVENTO - MARKER ENCONTRADO
// ======================================================

markerControls.addEventListener(
  "markerFound",
  () => {
    console.log("🔥 MARKER ENCONTRADO");

    markerRoot.visible = true;
  }
);

// ======================================================
// EVENTO - MARKER PERDIDO
// ======================================================

markerControls.addEventListener(
  "markerLost",
  () => {
    console.log("❌ MARKER PERDIDO");

    markerRoot.visible = false;

    trackingInitialized = false;
  }
);

// ======================================================
// PRESUNTO 3D
// ======================================================

const loader = new GLTFLoader();

// ======================================================
// CAMINHO RELATIVO DO GLB
// ======================================================

const modelURL =
  `${BASE_URL}presunto_100_alentejano.glb`;

console.log(
  "🔎 URL DO MODELO:",
  new URL(
    modelURL,
    window.location.href
  ).href
);

// ======================================================
// CARREGAR GLB
// ======================================================

loader.load(

  modelURL,

  // ====================================================
  // MODELO CARREGADO
  // ====================================================

  (gltf) => {

    console.log(
      "🥩 PRESUNTO 3D CARREGADO"
    );

    const presunto = gltf.scene;

    // ==================================================
    // GARANTIR VISIBILIDADE DOS MESHES
    // ==================================================

    let meshCount = 0;

    presunto.traverse((object) => {

      if (object.isMesh) {

        meshCount++;

        object.visible = true;

        object.frustumCulled = false;

        // Garantir que o modelo é visível
        // independentemente da orientação

        if (object.material) {

          if (
            Array.isArray(
              object.material
            )
          ) {

            object.material.forEach(
              (material) => {

                material.side =
                  THREE.DoubleSide;

                material.needsUpdate =
                  true;

              }
            );

          } else {

            object.material.side =
              THREE.DoubleSide;

            object.material.needsUpdate =
              true;

          }
        }
      }
    });

    console.log(
      "🔲 Meshes encontrados no GLB:",
      meshCount
    );

    // ==================================================
    // CALCULAR DIMENSÕES ORIGINAIS
    // ==================================================

    const box =
      new THREE.Box3().setFromObject(
        presunto
      );

    const size =
      new THREE.Vector3();

    const center =
      new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    console.log(
      "📦 Tamanho original:",
      size
    );

    console.log(
      "📍 Centro original:",
      center
    );

    console.log(
      "📏 Dimensão máxima original:",
      Math.max(
        size.x,
        size.y,
        size.z
      )
    );

    // ==================================================
    // PIVOT
    // ==================================================

    const pivotPresunto =
      new THREE.Group();

    // ==================================================
    // CENTRAR MODELO
    // ==================================================

    presunto.position.set(
      -center.x,
      -center.y,
      -center.z
    );

    // ==================================================
    // ESCALA
    // ==================================================

    const maxDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      );

    // ==================================================
    // TAMANHO DO MODELO NO AR
    // ==================================================

    const targetSize = 50.0;

    const modelScale =
      targetSize /
      maxDimension;

    presunto.scale.set(
      modelScale,
      modelScale,
      modelScale
    );

    console.log(
      "📏 Escala aplicada:",
      modelScale
    );

    // ==================================================
    // ROTAÇÃO DO PRESUNTO
    // ==================================================

    presunto.rotation.set(
      40,
      40,
      -40
    );

    // ==================================================
    // ADICIONAR AO PIVOT
    // ==================================================

    pivotPresunto.add(
      presunto
    );

    // ==================================================
    // POSIÇÃO DO PIVOT
    // ==================================================

    // Mantemos exatamente a posição
    // que encontraste como correta
    // relativamente ao NFT.

    pivotPresunto.position.set(
      40,
      40,
      -40
    );

    // ==================================================
    // ROTAÇÃO DO PIVOT
    // ==================================================

    pivotPresunto.rotation.set(
      0,
      0,
      0
    );

    // ==================================================
    // ESCALA DO PIVOT
    // ==================================================

    pivotPresunto.scale.set(
      1,
      1,
      1
    );

    // ==================================================
    // PLANO INVISÍVEL
    // ==================================================

    // O "chão" imaginário encontra-se em Y = 0.

    // ==================================================
    // ALTURA DO PRESUNTO
    // ==================================================

    const groundOffset = 0;

    presunto.position.y +=
      groundOffset;

    presunto.updateMatrixWorld(
      true
    );

    console.log(
      "📐 Ground offset:",
      groundOffset
    );

    console.log(
      "📍 Posição final do presunto:",
      presunto.position
    );

    // ==================================================
    // VERIFICAÇÃO DO PLANO
    // ==================================================

    const finalGroundBox =
      new THREE.Box3().setFromObject(
        presunto
      );

    console.log(
      "🟢 Presunto assente no plano invisível"
    );

    console.log(
      "📐 Novo ponto inferior:",
      finalGroundBox.min.y
    );

    // ==================================================
    // VISIBILIDADE
    // ==================================================

    pivotPresunto.visible = true;

    presunto.visible = true;

    // ==================================================
    // ADICIONAR AO NFT
    // ==================================================

    markerRoot.add(
      pivotPresunto
    );

    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
      "🥩 PIVOT DO PRESUNTO ADICIONADO"
    );

    console.log(
      "📍 Posição do pivot:",
      pivotPresunto.position
    );

    console.log(
      "📏 Escala do modelo:",
      presunto.scale
    );

    console.log(
      "📍 Posição final do presunto:",
      presunto.position
    );

    console.log(
      "👁️ Modelo visível:",
      presunto.visible
    );

    console.log(
      "👁️ Pivot visível:",
      pivotPresunto.visible
    );

    console.log(
      "👁️ MarkerRoot visível:",
      markerRoot.visible
    );

    console.log(
      "🎯 MarkerRoot:",
      markerRoot
    );
  },

  // ====================================================
  // PROGRESSO
  // ====================================================

  (progress) => {

    if (progress.total > 0) {

      const percent =
        (
          progress.loaded /
          progress.total
        ) * 100;

      console.log(
        `📥 Carregando presunto: ${percent.toFixed(
          0
        )}%`
      );
    }
  },

  // ====================================================
  // ERRO
  // ====================================================

  (error) => {

    console.error(
      "❌ ERRO AO CARREGAR O PRESUNTO 3D:",
      error
    );
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