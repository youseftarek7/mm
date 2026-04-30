/**
 * Avatar3D.jsx — Realistic 3D Avatar System
 * ============================================
 * ✅ GLB Model loading via GLTFLoader
 * ✅ Ready Player Me rigged avatars
 * ✅ AnimationMixer (idle breathing animation)
 * ✅ OrbitControls (rotate / zoom / pan)
 * ✅ PMREMGenerator realistic environment lighting
 * ✅ Directional + rim + fill lights with shadows
 * ✅ Lazy GLB loading with progress indicator
 * ✅ Clothing GLB overlay system
 * ✅ Fallback avatar if GLB fails to load
 *
 * Requirements:
 *   npm install three
 *
 * Imports used from 'three/examples/jsm':
 *   GLTFLoader, DRACOLoader, OrbitControls
 *
 * Usage:
 *   import Avatar3D from "./Avatar3D";
 *   <Avatar3D outfit={outfit} style={{ width: "100%", height: 400 }} />
 */
import { AvatarSVG } from "./AvatarSVG";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ─────────────────────────────────────────────────────────────
// AVATAR CONFIGURATION
// ─────────────────────────────────────────────────────────────

/**
 * Ready Player Me Avatar URLs
 * These are real RPM demo avatars with CORS enabled.
 * Replace with your own RPM avatar ID from readyplayer.me
 */
const RPM_BASE = "https://models.readyplayer.me";

// Public demo avatars from Ready Player Me
// Format: {avatarId}.glb?morphTargets=ARKit&lod=0
export const AVATAR_PRESETS = {
  default: `${RPM_BASE}/64d61e5a9f77a93e4dc39bc2.glb?morphTargets=ARKit&lod=0`,
  alt1:    `${RPM_BASE}/63bc43e4ede3ca7c6b3f0ee8.glb?morphTargets=ARKit&lod=0`,
  alt2:    `${RPM_BASE}/64d61e5a9f77a93e4dc39bc2.glb?morphTargets=ARKit&lod=1`,
};

/**
 * Clothing GLB overlays
 * These are separate GLB files positioned on the avatar skeleton.
 * Each clothing item targets specific bones for alignment.
 *
 * NOTE: Replace these URLs with your actual clothing GLB assets.
 * Clothing GLBs should be created with Blender and rigged to RPM skeleton.
 * Until you have real clothing GLBs, the system uses material-based color changes.
 */
export const CLOTHING_GLBS = {
  // tops
  top_tie_white:   null, // Use material color change
  top_silk_cream:  null,
  top_red_crop:    null,
  crop_rib_black:  null,
  top_white_btn:   null,
  crop_satin:      null,
  crop_corset:     null,
  top_fuchsia:     null,
  top_sequin:      null,
  // bottoms
  pants_pink_cargo: null,
  pants_dark_denim: null,
  pants_wide_black: null,
  // shoes
  shoes_pink_runner: null,
  shoes_white_snkr:  null,
  shoes_loafer:      null,
};

// ─────────────────────────────────────────────────────────────
// SCENE SETUP HELPERS
// ─────────────────────────────────────────────────────────────

function createEnvLighting(renderer, scene) {
  // PMREMGenerator for realistic IBL (Image Based Lighting)
  const pmremGen = new THREE.PMREMGenerator(renderer);
  pmremGen.compileEquirectangularShader();

  // Create a procedural gradient environment (warm studio lighting)
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(50, 32, 32);
  const envMat = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    vertexColors: true,
  });

  // Build gradient color buffer (top = warm white, bottom = deep purple)
  const colors = [];
  const geo = envGeo;
  const posArr = geo.attributes.position.array;
  for (let i = 0; i < posArr.length; i += 3) {
    const y = posArr[i + 1];
    const t = (y + 50) / 100; // 0 = bottom, 1 = top
    // Top: warm cream #FFF5E8, Bottom: deep purple #1A0A28
    colors.push(
      THREE.MathUtils.lerp(0.1, 1.0, t),  // R
      THREE.MathUtils.lerp(0.04, 0.96, t), // G
      THREE.MathUtils.lerp(0.16, 0.91, t)  // B
    );
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  envScene.add(new THREE.Mesh(geo, envMat));

  const envRT = pmremGen.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  scene.background = null; // transparent canvas
  pmremGen.dispose();

  return envRT;
}

function createLights(scene) {
  // Key light (main directional - warm)
  const keyLight = new THREE.DirectionalLight(0xFFF4E8, 2.2);
  keyLight.position.set(2.5, 5, 3.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -1.5;
  keyLight.shadow.camera.right = 1.5;
  keyLight.shadow.camera.top = 2.5;
  keyLight.shadow.camera.bottom = -0.5;
  keyLight.shadow.camera.far = 12;
  keyLight.shadow.bias = -0.001;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  // Fill light (cool blue, opposite key)
  const fillLight = new THREE.DirectionalLight(0xA0C8FF, 0.8);
  fillLight.position.set(-3, 2, -1);
  scene.add(fillLight);

  // Rim light (pink accent from behind - fashion studio style)
  const rimLight = new THREE.DirectionalLight(0xFF6B9D, 1.4);
  rimLight.position.set(0.5, 3, -4);
  scene.add(rimLight);

  // Hair/top highlight
  const topLight = new THREE.DirectionalLight(0xFFEEFF, 0.6);
  topLight.position.set(0, 6, 1);
  scene.add(topLight);

  // Ambient for depth
  const ambient = new THREE.AmbientLight(0xFFF0F8, 0.5);
  scene.add(ambient);

  // Subtle ground bounce (warm)
  const bounceLight = new THREE.HemisphereLight(0xFFDDEE, 0x442244, 0.4);
  scene.add(bounceLight);

  return { keyLight, fillLight, rimLight };
}

function createPlatform(scene) {
  // Glowing platform with ring effects
  const platGroup = new THREE.Group();

  const platGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.04, 80);
  const platMat = new THREE.MeshStandardMaterial({
    color: 0x1A0A28,
    emissive: 0x3D0A52,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.8,
  });
  const plat = new THREE.Mesh(platGeom, platMat);
  plat.receiveShadow = true;
  platGroup.add(plat);

  // Glow rings
  const ringDefs = [
    { r: 1.18, w: 0.022, col: 0xFF6B9D },
    { r: 0.95, w: 0.012, col: 0x9944CC },
    { r: 0.72, w: 0.016, col: 0x7744FF },
  ];
  const rings = [];
  ringDefs.forEach(({ r, w, col }) => {
    const geo = new THREE.TorusGeometry(r, w, 12, 100);
    const mat = new THREE.MeshBasicMaterial({ color: col });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.025;
    platGroup.add(ring);
    rings.push({ mesh: ring, mat, baseCol: new THREE.Color(col) });
  });

  // Floating sparkle particles
  const PCT = 60;
  const pPos = new Float32Array(PCT * 3);
  const pVel = new Float32Array(PCT);
  for (let i = 0; i < PCT; i++) {
    const r = Math.random() * 1.8;
    const a = Math.random() * Math.PI * 2;
    pPos[i * 3]     = Math.cos(a) * r;
    pPos[i * 3 + 1] = Math.random() * 3.5;
    pPos[i * 3 + 2] = Math.sin(a) * r;
    pVel[i] = 0.003 + Math.random() * 0.005;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xFF88CC,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  platGroup.add(particles);

  scene.add(platGroup);
  return { platGroup, rings, particles, pPos, pVel, PCT };
}

// ─────────────────────────────────────────────────────────────
// OUTFIT → MATERIAL MAPPING
// Maps outfit item IDs to material changes on the avatar mesh
// ─────────────────────────────────────────────────────────────

const MESH_TARGETS = {
  // RPM mesh names (these are standard RPM avatar mesh names)
  tops: [
    "Wolf3D_Outfit_Top",
    "Wolf3D_Body",
    "Outfit_Top",
    "Body_Top",
  ],
  bottoms: [
    "Wolf3D_Outfit_Bottom",
    "Outfit_Bottom",
    "Body_Bottom",
  ],
  shoes: [
    "Wolf3D_Outfit_Footwear",
    "Outfit_Footwear",
    "Footwear",
  ],
  hair: [
    "Wolf3D_Hair",
    "Hair",
  ],
  skin: [
    "Wolf3D_Body",
    "Wolf3D_Avatar",
    "Body",
    "Skin",
  ],
};

function applyOutfitToAvatar(avatarGroup, outfit, catalog) {
  if (!avatarGroup || !outfit || !catalog) return;

  const getItem = (cat) =>
    catalog[cat]?.find((x) => x.id === outfit[cat]) || catalog[cat]?.[0];

  const items = {
    tops:       getItem("tops"),
    bottoms:    getItem("bottoms"),
    shoes:      getItem("shoes"),
    hair:       getItem("hair"),
    skin:       getItem("skin"),
    accessories: getItem("accessories"),
  };

  avatarGroup.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const name = obj.name;

    // Match mesh to category and apply color
    Object.entries(MESH_TARGETS).forEach(([cat, targets]) => {
      const matched = targets.some(
        (t) => name.toLowerCase().includes(t.toLowerCase())
      );
      if (matched && items[cat]?.color) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          if (mat.color) mat.color.set(items[cat].color);
          // Enhance material quality
          if (mat.isMeshStandardMaterial || mat.isMeshPhongMaterial) {
            mat.roughness = cat === "shoes" ? 0.3 : cat === "hair" ? 0.6 : 0.7;
            mat.metalness = cat === "shoes" ? 0.15 : 0.0;
            mat.needsUpdate = true;
          }
        });
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LOADING INDICATOR COMPONENT
// ─────────────────────────────────────────────────────────────

function LoadingOverlay({ progress, error, onRetry }) {
  const msgs = [
    "جاري تحميل الشخصية...",
    "تجهيز الملابس...",
    "إضاءة المشهد...",
    "اللمسات الأخيرة...",
  ];
  const msgIdx = Math.min(3, Math.floor((progress / 100) * 4));

  if (error) {
    return (
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "rgba(13,9,20,0.92)", backdropFilter: "blur(8px)",
        borderRadius: "inherit", gap: 12,
      }}>
        <div style={{ fontSize: 36 }}>⚠️</div>
        <div style={{ fontSize: 12, color: "#C49BB0", textAlign: "center", maxWidth: 220, lineHeight: 1.6, fontFamily: "'Cairo',sans-serif" }}>
          تعذّر تحميل الموديل<br />
          <span style={{ color: "#6B4558", fontSize: 10 }}>{error}</span>
        </div>
        <button
          onClick={onRetry}
          style={{
            padding: "8px 20px", borderRadius: 20, border: "none",
            background: "linear-gradient(135deg,#FF6B9D,#D94F7E)",
            color: "#fff", fontWeight: 700, cursor: "pointer",
            fontFamily: "'Cairo',sans-serif", fontSize: 12,
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "rgba(13,9,20,0.92)", backdropFilter: "blur(8px)",
      borderRadius: "inherit", gap: 16, pointerEvents: "none",
      transition: "opacity 0.4s", opacity: progress >= 100 ? 0 : 1,
    }}>
      {/* Spinner ring */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(255,107,157,0.15)" strokeWidth={4} />
          <circle
            cx={36} cy={36} r={30} fill="none"
            stroke="url(#spinGrad)" strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 30}`}
            strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          <defs>
            <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B9D" />
              <stop offset="100%" stopColor="#C084B8" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#FF6B9D",
          fontFamily: "'Cairo',sans-serif",
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      <div style={{
        fontSize: 12, color: "#C49BB0", fontFamily: "'Cairo',sans-serif",
        fontWeight: 600, letterSpacing: 0.5,
      }}>
        {msgs[msgIdx]}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 160, height: 3, borderRadius: 10,
        background: "rgba(255,255,255,0.06)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg,#FF6B9D,#C084B8)",
          borderRadius: 10, transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN AVATAR3D COMPONENT
// ─────────────────────────────────────────────────────────────

export default function Avatar3D({
  outfit = {},
  catalog = {},
  avatarUrl,          // Custom RPM avatar URL (optional)
  width = "100%",
  height = 400,
  style = {},
  onReady,
}) {
  const mountRef    = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef    = useRef(null);
  const avatarRef   = useRef(null);
  const clothingRef = useRef({});
  const rafRef      = useRef(null);
  const clockRef    = useRef(new THREE.Clock());
  const outfitRef   = useRef(outfit);
  const catalogRef  = useRef(catalog);

  const [loadState, setLoadState] = useState({ progress: 0, loaded: false, error: null });
  const [retryKey, setRetryKey]   = useState(0);

  // Keep refs in sync
  useEffect(() => { outfitRef.current = outfit; }, [outfit]);
  useEffect(() => { catalogRef.current = catalog; }, [catalog]);

  // Apply outfit reactively without rebuild
  useEffect(() => {
    if (avatarRef.current) {
      applyOutfitToAvatar(avatarRef.current, outfit, catalog);
    }
  }, [outfit, catalog]);

  const handleRetry = useCallback(() => {
    setLoadState({ progress: 0, loaded: false, error: null });
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 400;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── Camera ─────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100);
    camera.position.set(0, 1.5, 2.8);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.physicallyCorrectLights = true;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lighting & Environment ──────────────────────────────
    createEnvLighting(renderer, scene);
    createLights(scene);

    // ── Platform ───────────────────────────────────────────
    const { platGroup, rings, particles, pPos, pVel, PCT } = createPlatform(scene);
    platGroup.position.y = -0.02;

    // ── OrbitControls ──────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping    = true;
    controls.dampingFactor    = 0.08;
    controls.minDistance      = 0.8;
    controls.maxDistance      = 6;
    controls.minPolarAngle    = Math.PI * 0.1;
    controls.maxPolarAngle    = Math.PI * 0.85;
    controls.target.set(0, 1.0, 0);
    controls.enablePan        = false;
    controls.rotateSpeed      = 0.6;
    controls.zoomSpeed        = 0.8;
    controls.autoRotate       = false;
    controls.update();
    controlsRef.current = controls;

    // ── GLB Avatar Loading ──────────────────────────────────
    const loader = new GLTFLoader();

    // DRACO decompression for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    loader.setDRACOLoader(dracoLoader);

    // Determine avatar URL (custom > default RPM)
    const modelUrl = avatarUrl || AVATAR_PRESETS.default;

    loader.load(
      modelUrl,
      // onLoad
      (gltf) => {
        const model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Scale to ~1.8 units tall (realistic human height in scene)
        const targetHeight = 1.85;
        const scale = targetHeight / size.y;
        model.scale.setScalar(scale);

        // Recompute after scale
        box.setFromObject(model);
        const newCenter = box.getCenter(new THREE.Vector3());
        const newMin    = box.min;

        // Center horizontally, place feet on platform
        model.position.set(
          -newCenter.x,
          -newMin.y + 0.02,
          -newCenter.z
        );

        // Enable shadows on all meshes
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow    = true;
            obj.receiveShadow = false;

            // Upgrade materials to physically-based
            if (obj.material) {
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              mats.forEach((mat) => {
                if (!mat.isMeshStandardMaterial) {
                  // Convert to PBR
                  const newMat = new THREE.MeshStandardMaterial({
                    color:     mat.color,
                    map:       mat.map,
                    roughness: 0.7,
                    metalness: 0.0,
                  });
                  obj.material = newMat;
                }
                // Boost hair shininess
                if (obj.name.toLowerCase().includes("hair")) {
                  mat.roughness = 0.5;
                  mat.metalness = 0.05;
                }
                // Skin subsurface approximation
                if (obj.name.toLowerCase().includes("body") ||
                    obj.name.toLowerCase().includes("skin") ||
                    obj.name.toLowerCase().includes("avatar")) {
                  mat.roughness = 0.8;
                }
              });
            }
          }
        });

        scene.add(model);
        avatarRef.current = model;

        // Apply outfit colors immediately
        applyOutfitToAvatar(model, outfitRef.current, catalogRef.current);

        // ── AnimationMixer ──────────────────────────────────
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          // Play idle animation (first clip, or named "idle" / "mixamo.com")
          const idleClip =
            gltf.animations.find((a) =>
              a.name.toLowerCase().includes("idle") ||
              a.name.toLowerCase().includes("breath") ||
              a.name.toLowerCase().includes("standing") ||
              a.name.includes("mixamo.com")
            ) || gltf.animations[0];

          const action = mixer.clipAction(idleClip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }

        setLoadState({ progress: 100, loaded: true, error: null });
        onReady?.();
      },
      // onProgress
      (event) => {
        if (event.lengthComputable) {
          const pct = (event.loaded / event.total) * 95; // 95% max during load
          setLoadState((s) => ({ ...s, progress: Math.round(pct) }));
        } else {
          setLoadState((s) => ({ ...s, progress: Math.min(s.progress + 5, 90) }));
        }
      },
      // onError
      (err) => {
        console.error("GLB load error:", err);
        // Load a fallback procedural avatar instead of just showing error
        loadFallbackAvatar(scene, outfitRef.current, catalogRef.current);
        setLoadState({
          progress: 100,
          loaded: true,
          error: `تعذّر تحميل الموديل (${err.message || "CORS/Network error"}). يعمل بالوضع الاحتياطي.`,
        });
        onReady?.();
      }
    );

    // ── Animation Loop ──────────────────────────────────────
    let t = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const delta = clockRef.current.getDelta();
      t += delta;

      controls.update();
      if (mixerRef.current) mixerRef.current.update(delta);

      // Subtle idle bob if no animation clip
      if (avatarRef.current && !mixerRef.current) {
        avatarRef.current.position.y =
          avatarRef.current.userData.baseY !== undefined
            ? avatarRef.current.userData.baseY + Math.sin(t * 1.2) * 0.015
            : avatarRef.current.position.y;
      }

      // Platform rotation
      platGroup.rotation.y += 0.008;

      // Ring pulse
      const pulse = 0.4 + Math.sin(t * 2.8) * 0.35;
      rings[0].mat.color.setRGB(1, 0.18 + pulse * 0.22, 0.42 + pulse * 0.14);
      rings[2].mat.color.setRGB(0.45 + pulse * 0.2, 0.1, 0.9 + pulse * 0.1);

      // Particles
      for (let i = 0; i < PCT; i++) {
        pPos[i * 3 + 1] += pVel[i];
        pPos[i * 3]     += Math.sin(t * 0.4 + i * 0.7) * 0.0008;
        if (pPos[i * 3 + 1] > 3.8) {
          pPos[i * 3 + 1] = 0;
          const r = Math.random() * 1.5;
          const a = Math.random() * Math.PI * 2;
          pPos[i * 3]     = Math.cos(a) * r;
          pPos[i * 3 + 2] = Math.sin(a) * r;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize handler ──────────────────────────────────────
    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // Simulate progress while loading (for UX)
    const progressTimer = setInterval(() => {
      setLoadState((s) => {
        if (s.loaded || s.progress >= 88) return s;
        return { ...s, progress: Math.min(s.progress + 2, 88) };
      });
    }, 400);

    return () => {
      clearInterval(progressTimer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      dracoLoader.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
      // Dispose scene
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m?.dispose());
        }
      });
    };
  }, [retryKey, avatarUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: 12,
        ...style,
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Loading / Error Overlay */}
      {(!loadState.loaded || loadState.error) && (
        <LoadingOverlay
          progress={loadState.progress}
          error={loadState.error}
          onRetry={handleRetry}
        />
      )}

      {/* Controls hint */}
      {loadState.loaded && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            color: "rgba(196,155,176,0.5)",
            fontFamily: "'Cairo',sans-serif",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          🖱 اسحب للتدوير • اسكرول للتكبير
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FALLBACK PROCEDURAL AVATAR
// Shown when GLB fails to load. Uses high-quality PBR meshes.
// ─────────────────────────────────────────────────────────────

function loadFallbackAvatar(scene, outfit, catalog) {
  const getItem = (cat) =>
    catalog[cat]?.find((x) => x.id === outfit[cat]) || catalog[cat]?.[0];

  const skinColor  = getItem("skin")?.color  || "#F0B882";
  const hairColor  = getItem("hair")?.color  || "#7A4E24";
  const topColor   = getItem("tops")?.color  || "#F8F8F8";
  const botColor   = getItem("bottoms")?.color || "#E8A2C0";
  const shoeColor  = getItem("shoes")?.color || "#EFC3D6";

  const skin  = (r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: skinColor,  roughness: r, metalness: m });
  const hair  = (r = 0.5, m = 0.05) => new THREE.MeshStandardMaterial({ color: hairColor,  roughness: r, metalness: m });
  const top   = (r = 0.75) => new THREE.MeshStandardMaterial({ color: topColor,   roughness: r });
  const bot   = (r = 0.8)  => new THREE.MeshStandardMaterial({ color: botColor,   roughness: r });
  const shoe  = (r = 0.35, m = 0.1) => new THREE.MeshStandardMaterial({ color: shoeColor,  roughness: r, metalness: m });
  const eye   = new THREE.MeshStandardMaterial({ color: "#100408", roughness: 0.05, metalness: 0.3 });
  const eyeW  = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.3 });
  const lip   = new THREE.MeshStandardMaterial({ color: "#CC5566", roughness: 0.6 });

  const grp = new THREE.Group();
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    return m;
  };

  // Body proportions (realistic)
  const SCALE = 1.0;
  const headY   = 1.62 * SCALE;
  const torsoY  = 1.20 * SCALE;
  const hipY    = 0.90 * SCALE;
  const kneeY   = 0.55 * SCALE;
  const ankleY  = 0.08 * SCALE;

  // ── Head & Face ───────────────────────────
  const head = mk(new THREE.SphereGeometry(0.13, 32, 32), skin(), 0, headY, 0);
  head.scale.set(1, 1.08, 0.94);
  grp.add(head);

  // Eyes
  [[-.05, headY + 0.01, 0.12], [.05, headY + 0.01, 0.12]].forEach(([x, y, z], i) => {
    grp.add(mk(new THREE.SphereGeometry(0.034, 16, 16), eyeW, x, y, z));
    const pupil = mk(new THREE.SphereGeometry(0.022, 12, 12), eye, x, y, z + 0.018);
    grp.add(pupil);
    // Eyelid crease
    const lid = mk(new THREE.SphereGeometry(0.013, 8, 8),
      new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 }),
      x, y + 0.04, z + 0.01
    );
    lid.scale.set(2.5, 0.4, 0.6);
    grp.add(lid);
    // Highlight
    const hl = mk(new THREE.SphereGeometry(0.007, 6, 6),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      x + (i===0?.012:-.012), y+0.012, z + 0.028
    );
    grp.add(hl);
  });

  // Nose
  const nose = mk(new THREE.SphereGeometry(0.014, 8, 8), skin(0.9), 0, headY - 0.024, 0.128);
  nose.scale.set(0.9, 0.65, 0.75);
  grp.add(nose);

  // Lips
  const lips = mk(new THREE.TorusGeometry(0.028, 0.006, 8, 20, Math.PI), lip, 0, headY - 0.06, 0.12);
  lips.rotation.set(0, 0, Math.PI);
  grp.add(lips);

  // Cheek blush
  [[-0.09, headY - 0.025, 0.1], [0.09, headY - 0.025, 0.1]].forEach(([x, y, z]) => {
    const blush = mk(new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#FF88AA", transparent: true, opacity: 0.18 }),
      x, y, z
    );
    grp.add(blush);
  });

  // Ears
  [[-0.13, headY, 0], [0.13, headY, 0]].forEach(([x, y, z]) => {
    grp.add(mk(new THREE.SphereGeometry(0.025, 10, 10), skin(0.9), x, y, z));
  });

  // ── Hair ──────────────────────────────────
  const hairCap = mk(new THREE.SphereGeometry(0.135, 32, 32), hair(), 0, headY + 0.01, -0.01);
  hairCap.scale.set(1.05, 1.04, 1.03);
  grp.add(hairCap);

  // Hair strands (flowing down both sides)
  const strandPositions = [
    [-0.115, headY - 0.04, -0.02, 0.88, 1.3, 0.7],
    [-0.13,  headY - 0.18, -0.01, 0.84, 1.4, 0.68],
    [-0.12,  headY - 0.34,  0.0,  0.78, 1.38, 0.65],
    [-0.1,   headY - 0.50,  0.01, 0.7,  1.25, 0.6],
    [-0.075, headY - 0.65,  0.01, 0.6,  1.1,  0.55],
    [ 0.115, headY - 0.04, -0.02, 0.88, 1.3, 0.7],
    [ 0.13,  headY - 0.18, -0.01, 0.84, 1.4, 0.68],
    [ 0.12,  headY - 0.34,  0.0,  0.78, 1.38, 0.65],
    [ 0.1,   headY - 0.50,  0.01, 0.7,  1.25, 0.6],
    [ 0.075, headY - 0.65,  0.01, 0.6,  1.1,  0.55],
    [ 0,     headY - 0.22, -0.09, 1.1,  1.04, 0.52],
    [ 0,     headY - 0.38, -0.08, 0.94, 1.08, 0.5],
    [ 0,     headY - 0.52, -0.05, 0.8,  1.0,  0.48],                                                                                                                        
  ];
  strandPositions.forEach(([x, y, z, sx, sy, sz]) => {
    const s = mk(new THREE.SphereGeometry(0.06, 10, 10), hair(), x, y, z);
    s.scale.set(sx, sy, sz);
    grp.add(s);
  });

  // ── Neck ──────────────────────────────────
  const neck = mk(new THREE.CylinderGeometry(0.045, 0.055, 0.11, 16), skin(), 0, headY - 0.115, 0);
  grp.add(neck);

  // ── Torso ─────────────────────────────────
  const isCrop = getItem("tops")?.isCrop;
  const torsoH = isCrop ? 0.25 : 0.38;

  const torso = mk(new THREE.CylinderGeometry(0.155, 0.14, torsoH, 32), top(), 0, torsoY + (isCrop ? 0.04 : 0), 0);
  grp.add(torso);

  if (isCrop) {
    const mid = mk(new THREE.CylinderGeometry(0.138, 0.148, 0.08, 32), skin(), 0, torsoY - 0.135, 0);
    grp.add(mid);
  }

  // Collar / décolletage
  const collar = mk(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16), skin(0.8), 0, torsoY + torsoH / 2 + 0.01, 0);
  grp.add(collar);

  // ── Arms ──────────────────────────────────
  [-1, 1].forEach((side) => {
    const armTop = torsoY + torsoH / 2 - 0.05;
    // Upper arm
    const ua = mk(new THREE.CylinderGeometry(0.042, 0.036, 0.24, 16), top(), side * 0.21, armTop - 0.12, 0);
    ua.rotation.z = side * 0.18;
    grp.add(ua);

    // Elbow
    const elb = mk(new THREE.SphereGeometry(0.038, 12, 12), skin(0.8), side * 0.25, armTop - 0.25, 0);
    grp.add(elb);

    // Forearm
    const fa = mk(new THREE.CylinderGeometry(0.032, 0.026, 0.22, 16), skin(), side * 0.265, armTop - 0.38, 0);
    fa.rotation.z = side * 0.08;
    grp.add(fa);

    // Hand
    const hand = mk(new THREE.SphereGeometry(0.032, 12, 12), skin(), side * 0.275, armTop - 0.51, 0);
    hand.scale.set(0.88, 0.8, 0.75);
    grp.add(hand);
  });

  // ── Hips ──────────────────────────────────
  const isSkirt  = getItem("bottoms")?.isSkirt;
  const isWide   = getItem("bottoms")?.isWide;
  const isCargo  = getItem("bottoms")?.isCargo;
  const isMini   = getItem("bottoms")?.isMini;
  const legW = isWide ? 0.085 : 0.06;

  const hips = mk(new THREE.CylinderGeometry(isWide ? 0.185 : 0.165, 0.16, 0.13, 32), bot(), 0, hipY, 0);
  grp.add(hips);

  if (isSkirt) {
    const skH = isMini ? 0.3 : 0.62;
    const sk = mk(new THREE.CylinderGeometry(
      (isWide ? 0.185 : 0.165) + (isMini ? 0.22 : 0.26),
      (isWide ? 0.185 : 0.165) + 0.01,
      skH, 32
    ), bot(), 0, hipY - skH / 2 + 0.01, 0);
    grp.add(sk);
  }

  [-1, 1].forEach((side) => {
    if (!isSkirt) {
      const ul = mk(new THREE.CylinderGeometry(legW + 0.006, legW, 0.32, 16), bot(), side * 0.088, hipY - 0.21, 0);
      grp.add(ul);
      const ll = mk(new THREE.CylinderGeometry(legW, legW - 0.004, 0.3, 16), bot(), side * 0.088, kneeY, 0);
      grp.add(ll);

      if (isCargo) {
        const pkt = mk(new THREE.BoxGeometry(0.065, 0.085, 0.022),
          new THREE.MeshStandardMaterial({ color: botColor, roughness: 0.8 }),
          side * (0.088 + 0.062), hipY - 0.12, 0.006
        );
        grp.add(pkt);
      }
    } else if (isSkirt && isMini) {
      // Visible legs under mini skirt
      const lg = mk(new THREE.CylinderGeometry(0.048, 0.042, 0.38, 16), skin(), side * 0.068, kneeY + 0.02, 0);
      grp.add(lg);
    }

    // Ankle
    const ankle = mk(new THREE.SphereGeometry(0.03, 10, 10), skin(0.85), side * 0.088, ankleY + 0.025, 0);
    grp.add(ankle);

    // Shoe / foot
    const shoeB = mk(new THREE.BoxGeometry(0.095, 0.05, 0.145), shoe(), side * 0.088, ankleY + 0.003, 0.015);
    grp.add(shoeB);
    const toeCap = mk(new THREE.SphereGeometry(0.044, 10, 10), shoe(0.3, 0.15), side * 0.088, ankleY, 0.07);
    toeCap.scale.set(0.78, 0.55, 1.25);
    grp.add(toeCap);
    const sole = mk(new THREE.BoxGeometry(0.11, 0.02, 0.165),
      new THREE.MeshStandardMaterial({ color: "#F0EEEE", roughness: 0.5 }),
      side * 0.088, ankleY - 0.012, 0.012
    );
    grp.add(sole);
  });

  // Center the group
  const box = new THREE.Box3().setFromObject(grp);
  const minY = box.min.y;
  grp.position.y = -minY + 0.02;
  grp.userData.baseY = grp.position.y;

  scene.add(grp);
  return grp;
}