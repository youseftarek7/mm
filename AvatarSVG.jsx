/**
 * AvatarSVG.jsx — 3D GLB Avatar
 * ================================
 * بيحل محل الأفاتار SVG القديم بالكامل
 *
 * HOW TO SETUP:
 *   1. ضع ملف model.glb في مجلد /public في مشروعك
 *   2. استبدل هذا الملف بـ AvatarSVG.jsx القديم
 *   3. npm install three  (لو مش مثبت)
 *
 * FEATURES:
 *   ✅ يحمل model.glb من /public
 *   ✅ يطبق ألوان الـ outfit على المواد تلقائياً
 *   ✅ Responsive على الموبايل (ResizeObserver)
 *   ✅ إضاءة وردية/بنفسجية تناسب theme التطبيق
 *   ✅ Animation float هادي + bounce عند الرقص
 *   ✅ Fallback procedural avatar لو GLB فشل يحمل
 *   ✅ Cache للـ GLB (يحمل مرة واحدة بس)
 *
 * PROPS:
 *   outfit       — { hair, tops, bottoms, shoes, skin, accessories }
 *   size         — رقم مضاعف (default 1 = 160×380px)
 *   animating    — true لتفعيل الـ bounce/dance
 *   fillContainer— true لملء الـ parent div بالكامل
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader }  from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { STORE_CATALOG } from "./avatarConfig_updated";

// ── مسار الـ model (لازم يكون في /public) ─────────────────────
const MODEL_URL = "/model.glb";

// ── ربط أسماء المواد في الـ GLB بفئات الـ outfit ──────────────
// عدّل الأسماء دي لو mesh names في موديلك مختلفة
const MATERIAL_CAT = {
  "avaturn_body_material":    "skin",
  "avaturn_hair_0_material":  "hair",
  "avaturn_hair_1_material":  "hair",
  "avaturn_shoes_0_material": "shoes",
  "avaturn_look_0_material":  "tops",
  // أضف أي mesh names إضافية هنا لو الموديل عنده أكتر
};

// ── Helpers ────────────────────────────────────────────────────
function shade(hex = "#888", pct = 0) {
  try {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const n = parseInt(c, 16);
    const cl = v => Math.min(255, Math.max(0, v));
    const r = cl((n >> 16) + Math.round(2.55 * pct));
    const g = cl(((n >> 8) & 0xff) + Math.round(2.55 * pct));
    const b = cl((n & 0xff) + Math.round(2.55 * pct));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  } catch { return hex; }
}

function blendHex(hex1, hex2, t = 0.4) {
  try {
    const p = h => {
      let c = h.replace("#", "");
      if (c.length === 3) c = c.split("").map(x => x + x).join("");
      const n = parseInt(c, 16);
      return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
    };
    const [r1, g1, b1] = p(hex1);
    const [r2, g2, b2] = p(hex2);
    return "#" + [
      Math.round(r1 + (r2 - r1) * t),
      Math.round(g1 + (g2 - g1) * t),
      Math.round(b1 + (b2 - b1) * t),
    ].map(v => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0")).join("");
  } catch { return hex1; }
}

// جيب لون العنصر من الـ catalog
function getCatalogColor(cat, outfit) {
  const items = STORE_CATALOG[cat] || [];
  return items.find(i => i.id === outfit?.[cat])?.color || null;
}

// حوّل outfit IDs لألوان
function resolveColors(outfit) {
  return {
    skin:    getCatalogColor("skin",    outfit),
    hair:    getCatalogColor("hair",    outfit),
    tops:    getCatalogColor("tops",    outfit),
    bottoms: getCatalogColor("bottoms", outfit),
    shoes:   getCatalogColor("shoes",   outfit),
  };
}

// ── طبّق الألوان على الـ GLB ──────────────────────────────────
function applyOutfitColors(model, outfit) {
  if (!model || !outfit) return;

  const colors  = resolveColors(outfit);
  const { skin, hair, tops, bottoms, shoes } = colors;

  // للـ mesh اللي بيمثل كامل اللبس، بنخلط tops + bottoms
  const lookColor = tops && bottoms
    ? blendHex(tops, bottoms, 0.35)
    : tops || bottoms || null;

  model.traverse(obj => {
    if (!obj.isMesh) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach(mat => {
      if (!mat?.color) return;
      const cat = MATERIAL_CAT[mat.name];
      const target =
        cat === "skin"  ? skin :
        cat === "hair"  ? hair :
        cat === "shoes" ? shoes :
        cat === "tops"  ? lookColor :
        null;
      if (target) {
        mat.color.set(target);
        if (mat.isMeshStandardMaterial) {
          if (cat === "hair")  { mat.roughness = 0.52; mat.metalness = 0.04; }
          if (cat === "shoes") { mat.roughness = 0.28; mat.metalness = 0.12; }
          if (cat === "skin")  { mat.roughness = 0.82; mat.metalness = 0.00; }
          if (cat === "tops")  { mat.roughness = 0.74; mat.metalness = 0.00; }
        }
        mat.needsUpdate = true;
      }
    });
  });
}

// ── إضاءة المشهد ───────────────────────────────────────────────
function setupLights(scene) {
  // ضوء محيطي دافئ
  scene.add(new THREE.AmbientLight(0xFFF0F8, 0.55));

  // ضوء رئيسي (key light) - دافئ من الأمام العلوي
  const key = new THREE.DirectionalLight(0xFFF4E8, 2.0);
  key.position.set(1.5, 4, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.001;
  scene.add(key);

  // ضوء تعبئة (fill) - أزرق بارد من اليسار
  const fill = new THREE.DirectionalLight(0xA0C8FF, 0.5);
  fill.position.set(-2.5, 1.5, -1);
  scene.add(fill);

  // ضوء حواف وردي (rim) - signature color التطبيق
  const rim = new THREE.DirectionalLight(0xFF6B9D, 1.15);
  rim.position.set(0.5, 2.5, -4);
  scene.add(rim);

  // ضوء علوي للشعر
  const topL = new THREE.DirectionalLight(0xFFEEFF, 0.45);
  topL.position.set(0, 6, 0.5);
  scene.add(topL);

  // ضوء ارتداد من الأرض
  scene.add(new THREE.HemisphereLight(0xFFDDEE, 0x442244, 0.35));
}

// ── Fallback Avatar إجرائي لو GLB مش موجود ────────────────────
function buildFallbackAvatar(outfit) {
  const colors  = resolveColors(outfit);
  const sk  = colors.skin    || "#F0B882";
  const hr  = colors.hair    || "#7A4E24";
  const tc  = colors.tops    || "#F9C8D8";
  const bc  = colors.bottoms || "#E8A0C0";
  const shc = colors.shoes   || "#F0C0D8";

  const grp = new THREE.Group();
  const mat = col => new THREE.MeshStandardMaterial({ color: col, roughness: 0.75, metalness: 0 });
  const mk  = (geo, col, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat(col));
    m.position.set(x, y, z);
    m.castShadow = true;
    return m;
  };

  // أبعاد الجسم
  const headY = 1.60, torsoY = 1.18, hipY = 0.88, kneeY = 0.52, ankleY = 0.07;
  const torsoH = 0.30;

  // رأس + شعر
  const head = mk(new THREE.SphereGeometry(0.13, 28, 28), sk, 0, headY, 0);
  head.scale.set(1, 1.08, 0.94); grp.add(head);
  [[-.05, headY + .01, .12], [.05, headY + .01, .12]].forEach(([x, y, z]) => {
    grp.add(mk(new THREE.SphereGeometry(.032, 12, 12), "#FFFFFF", x, y, z));
    grp.add(mk(new THREE.SphereGeometry(.020, 10, 10), "#060816", x, y, z + .016));
    grp.add(mk(new THREE.SphereGeometry(.008,  6,  6), "#FFFFFF", x + .010, y + .011, z + .026));
  });
  grp.add(mk(new THREE.SphereGeometry(.013, 8, 8), shade(sk, -20), 0, headY - .025, .128));
  const hairCap = mk(new THREE.SphereGeometry(0.136, 28, 28), hr, 0, headY + .01, -.01);
  hairCap.scale.set(1.07, 1.06, 1.05); grp.add(hairCap);
  [-1, 1].forEach(sx =>
    [-.04, -.20, -.38, -.54, -.68].forEach((dy, i) => {
      const s = mk(new THREE.SphereGeometry(.058, 10, 10), hr, sx * .12, headY + dy, 0);
      s.scale.set(.88, 1.32 - i * .08, .70 - i * .05);
      grp.add(s);
    })
  );

  // رقبة + جذع
  grp.add(mk(new THREE.CylinderGeometry(.044, .054, .11, 16), sk, 0, headY - .115, 0));
  grp.add(mk(new THREE.CylinderGeometry(.152, .138, torsoH, 32), tc, 0, torsoY, 0));
  grp.add(mk(new THREE.CylinderGeometry(.136, .148, .08, 28), sk, 0, torsoY - .135, 0));

  // أذرع
  [-1, 1].forEach(side => {
    const atY = torsoY + torsoH / 2 - .05;
    const ua = mk(new THREE.CylinderGeometry(.040, .034, .23, 16), tc, side * .21, atY - .115, 0);
    ua.rotation.z = side * .18; grp.add(ua);
    grp.add(mk(new THREE.SphereGeometry(.036, 12, 12), sk, side * .25, atY - .25, 0));
    const fa = mk(new THREE.CylinderGeometry(.030, .024, .21, 16), sk, side * .262, atY - .375, 0);
    fa.rotation.z = side * .08; grp.add(fa);
    const hand = mk(new THREE.SphereGeometry(.030, 12, 12), sk, side * .272, atY - .505, 0);
    hand.scale.set(.88, .78, .74); grp.add(hand);
  });

  // أرداف + أرجل
  grp.add(mk(new THREE.CylinderGeometry(.162, .156, .13, 32), bc, 0, hipY, 0));
  [-1, 1].forEach(side => {
    grp.add(mk(new THREE.CylinderGeometry(.062, .055, .32, 16), bc, side * .088, hipY - .21, 0));
    grp.add(mk(new THREE.CylinderGeometry(.055, .048, .29, 16), bc, side * .088, kneeY, 0));
    grp.add(mk(new THREE.SphereGeometry(.028, 10, 10), sk, side * .088, ankleY + .025, 0));
    grp.add(mk(new THREE.BoxGeometry(.092, .048, .14), shc, side * .088, ankleY + .002, .014));
    const toe = mk(new THREE.SphereGeometry(.042, 10, 10), shade(shc, -10), side * .088, ankleY, .070);
    toe.scale.set(.78, .52, 1.22); grp.add(toe);
  });

  // ارفع الـ group لأرضية المشهد
  const box = new THREE.Box3().setFromObject(grp);
  grp.position.y = -box.min.y + .01;
  grp.userData.isFallback = true;
  return grp;
}

// ── Spinner تحميل ─────────────────────────────────────────────
function LoadingSpinner({ progress }) {
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 8,
      background: "rgba(12,6,18,0.75)", backdropFilter: "blur(4px)",
      borderRadius: "inherit", pointerEvents: "none",
    }}>
      <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,107,157,0.12)" strokeWidth={3} />
        <circle
          cx={26} cy={26} r={r} fill="none"
          stroke="url(#avatarSpinGrad)" strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress / 100)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.25s ease" }}
        />
        <defs>
          <linearGradient id="avatarSpinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF6B9D" />
            <stop offset="100%" stopColor="#C084B8" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        fontSize: 9, color: "rgba(196,155,176,0.55)",
        fontFamily: "'Cairo', sans-serif", letterSpacing: 0.5,
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ── GLB Cache — يحمل الـ model مرة واحدة بس ─────────────────
let _cachedGLTF   = null;
let _loadPromise  = null;

function loadGLBOnce(onProgress) {
  if (_cachedGLTF)  return Promise.resolve(_cachedGLTF);
  if (_loadPromise) return _loadPromise;

  const loader = new GLTFLoader();
  const draco  = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  loader.setDRACOLoader(draco);

  _loadPromise = new Promise((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf) => { _cachedGLTF = gltf; draco.dispose(); resolve(gltf); },
      onProgress,
      (err)  => { _loadPromise = null; draco.dispose(); reject(err); }
    );
  });
  return _loadPromise;
}

// ── COMPONENT الرئيسي ─────────────────────────────────────────
export const AvatarSVG = ({
  outfit       = {},
  size         = 1,
  animating    = false,
  fillContainer = false,
}) => {
  const mountRef  = useRef(null);
  const rendRef   = useRef(null);
  const sceneRef  = useRef(null);
  const cameraRef = useRef(null);
  const modelRef  = useRef(null);
  const rafRef    = useRef(null);
  const clockRef  = useRef(new THREE.Clock());
  const outfitRef = useRef(outfit);
  const animRef   = useRef(animating);

  const [loading,  setLoading]  = useState(true);
  const [progress, setProgress] = useState(0);

  // sync refs
  useEffect(() => { outfitRef.current = outfit; }, [outfit]);
  useEffect(() => { animRef.current   = animating; }, [animating]);

  // طبّق تغييرات الـ outfit على الـ model فوراً
  useEffect(() => {
    if (modelRef.current && !modelRef.current.userData.isFallback) {
      applyOutfitColors(modelRef.current, outfit);
    }
  }, [outfit]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // أبعاد أولية
    const baseW = fillContainer
      ? (el.clientWidth  || 220)
      : Math.round(160 * size);
    const baseH = fillContainer
      ? (el.clientHeight || 380)
      : Math.round(380 * size);

    // ── Scene + Camera ─────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, baseW / baseH, 0.01, 100);
    camera.position.set(0, 1.1, 2.4);
    camera.lookAt(0, 0.85, 0);
    sceneRef.current  = scene;
    cameraRef.current = camera;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: "high-performance",
    });
    renderer.setSize(baseW, baseH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled   = true;
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
    renderer.outputEncoding      = THREE.sRGBEncoding;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.physicallyCorrectLights = true;
    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;border-radius:inherit;";
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    // ── إضاءة ─────────────────────────────────────────────
    setupLights(scene);

    // طبق الأرض (لاستقبال الظل)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── ResizeObserver — موبايل ريسبونسيف ─────────────────
    let lastW = baseW, lastH = baseH;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const nw = Math.max(60,  Math.round(width));
      const nh = Math.max(120, Math.round(height));
      if (nw === lastW && nh === lastH) return;
      lastW = nw; lastH = nh;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(el);

    // ── تحميل GLB ─────────────────────────────────────────
    let cancelled = false;

    // Progress تقديري أثناء التحميل
    const progTimer = setInterval(() => {
      setProgress(p => p >= 88 ? p : Math.min(p + 4, 88));
    }, 300);

    loadGLBOnce((evt) => {
      if (evt.lengthComputable)
        setProgress(Math.round(evt.loaded / evt.total * 90));
    })
    .then((gltf) => {
      if (cancelled) return;

      // Clone المشهد علشان كل instance يبقى مستقل
      const model = gltf.scene.clone(true);

      // حجم + توسيط تلقائي
      const bbox = new THREE.Box3().setFromObject(model);
      const h    = bbox.getSize(new THREE.Vector3()).y;
      model.scale.setScalar(1.85 / h);
      bbox.setFromObject(model);
      const center = bbox.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -bbox.min.y + 0.01, -center.z);

      model.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        // ترقية المواد لـ PBR لو مش كذا
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(mat => {
          if (mat && !mat.isMeshStandardMaterial) {
            obj.material = new THREE.MeshStandardMaterial({
              color: mat.color, map: mat.map,
              roughness: 0.72, metalness: 0,
            });
          }
        });
      });

      scene.add(model);
      modelRef.current = model;
      applyOutfitColors(model, outfitRef.current);

      clearInterval(progTimer);
      setProgress(100);
      setTimeout(() => setLoading(false), 150);
    })
    .catch((err) => {
      if (cancelled) return;
      console.warn(
        "⚠️ model.glb مش موجود في /public — شغّال بالأفاتار الاحتياطي.\n" +
        "عشان يشتغل صح: ضع model.glb في مجلد /public.\n",
        err.message
      );
      const fallback = buildFallbackAvatar(outfitRef.current);
      scene.add(fallback);
      modelRef.current = fallback;
      clearInterval(progTimer);
      setProgress(100);
      setTimeout(() => setLoading(false), 150);
    });

    // ── Animation Loop ─────────────────────────────────────
    let t = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      t += clockRef.current.getDelta();

      if (modelRef.current) {
        const floatY  = Math.sin(t * 1.3) * 0.018;
        const bounceY = animRef.current
          ? Math.abs(Math.sin(t * 5.0)) * 0.09
          : 0;
        const swayY   = Math.sin(t * 0.65) * 0.014;
        const baseY   = modelRef.current.userData.isFallback
          ? (modelRef.current.userData.baseY || 0) : 0;

        modelRef.current.position.y  = baseY + floatY + bounceY;
        modelRef.current.rotation.y  = swayY;
      }

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelled = true;
      clearInterval(progTimer);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => m?.dispose());
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillContainer, size]);

  // ── Render ─────────────────────────────────────────────
  const W = fillContainer ? "100%" : Math.round(160 * size);
  const H = fillContainer ? "100%" : Math.round(380 * size);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: W,
        height: H,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 12,
        flexShrink: 0,
      }}
    >
      {loading && <LoadingSpinner progress={progress} />}
    </div>
  );
};

export default AvatarSVG;