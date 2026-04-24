import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw, RefreshCcw, Info } from "lucide-react";

type Vec2 = { real: number; imag: number };

const ComplexNumbersLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [z, setZ] = useState<Vec2>({ real: 3, imag: 2 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Three.js refs
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);
  const current = useRef(new THREE.Vector3(3, 2, 0));
  const target = useRef(new THREE.Vector3(3, 2, 0));

  // ─── MATH ACTIONS ─────────────────────────────────────────────
  const multiplyByI = () => {
    const { real, imag } = z;
    const newZ = { real: -imag, imag: real };
    setZ(newZ);
    target.current.set(newZ.real, newZ.imag, 0);
    setIsAnimating(true);
  };

  const reset = () => {
    const base = { real: 3, imag: 2 };
    setZ(base);
    target.current.set(3, 2, 0);
    setIsAnimating(true);
  };

  // ─── INIT SCENE ONCE ──────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();

    const aspect = el.clientWidth / el.clientHeight;
    const d = 10;

    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    el.appendChild(renderer.domElement);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x4f46e5, 0x1e293b);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    // Axes
    const material = new THREE.LineBasicMaterial({ color: 0x94a3b8 });

    const xAxis = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0),
    ]);

    const yAxis = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, 10, 0),
    ]);

    scene.add(new THREE.Line(xAxis, material));
    scene.add(new THREE.Line(yAxis, material));

    // Arrow
    const arrow = new THREE.ArrowHelper(
      current.current.clone().normalize(),
      new THREE.Vector3(),
      current.current.length(),
      0x818cf8
    );

    arrowRef.current = arrow;
    scene.add(arrow);

    // ─── ANIMATION LOOP ─────────────────────────────────────────
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      // smooth interpolation
      current.current.lerp(target.current, 0.08);

      const len = current.current.length();

      if (len > 0.01 && arrowRef.current) {
        arrowRef.current.setDirection(current.current.clone().normalize());
        arrowRef.current.setLength(len, 0.5, 0.3);
      }

      if (current.current.distanceTo(target.current) < 0.01) {
        setIsAnimating(false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // resize
    const handleResize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      const aspect = width / height;

      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // ─── SYNC TARGET WHEN SLIDERS CHANGE ──────────────────────────
  useEffect(() => {
    target.current.set(z.real, z.imag, 0);
  }, [z]);

  // ─── UI ───────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row gap-6">

      {/* Canvas */}
      <div className="flex-[2] relative rounded-3xl overflow-hidden border border-white/10 bg-black/40">

        <div ref={mountRef} className="absolute inset-0" />

        <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-xl">
          <div className="text-xs text-slate-400">Z</div>
          <div className="text-lg text-indigo-400 font-bold">
            {z.real} {z.imag >= 0 ? "+" : "-"} {Math.abs(z.imag)}i
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 p-6 rounded-3xl border border-white/10 bg-black/40 flex flex-col gap-6">

        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Info size={18} className="text-indigo-400" />
            Controls
          </h2>
          <p className="text-sm text-slate-400">
            Multiply by i rotates the vector by 90° in the complex plane.
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400">Real: {z.real}</label>
            <input
              type="range"
              min="-8"
              max="8"
              value={z.real}
              disabled={isAnimating}
              onChange={(e) =>
                setZ({ ...z, real: Number(e.target.value) })
              }
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Imag: {z.imag}</label>
            <input
              type="range"
              min="-8"
              max="8"
              value={z.imag}
              disabled={isAnimating}
              onChange={(e) =>
                setZ({ ...z, imag: Number(e.target.value) })
              }
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-3">
          <button
            onClick={multiplyByI}
            disabled={isAnimating}
            className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500"
          >
            Multiply by i
          </button>

          <button
            onClick={reset}
            disabled={isAnimating}
            className="w-full py-2 border border-white/10 rounded-xl"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplexNumbersLab;