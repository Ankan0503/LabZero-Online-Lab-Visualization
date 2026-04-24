import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Triangle, Calculator, Info } from "lucide-react";

type Target = { base: number; height: number };

const PythagorasLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [base, setBase] = useState(4);
  const [height, setHeight] = useState(3);

  // Animation refs
  const current = useRef<Target>({ base: 4, height: 3 });
  const target = useRef<Target>({ base: 4, height: 3 });

  const triangleRef = useRef<THREE.Line | null>(null);
  const squareRef = useRef<THREE.Line | null>(null);

  const hypotenuse = Math.sqrt(base ** 2 + height ** 2);

  // ─── INIT SCENE ONCE ──────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();

    const aspect = el.clientWidth / el.clientHeight;
    const d = 12;

    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );

    camera.position.set(6, 6, 10);
    camera.lookAt(6, 6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    el.appendChild(renderer.domElement);

    // ─── GRID ───────────────────────────────────────────────────
    const grid = new THREE.GridHelper(30, 30, 0x4f46e5, 0x1e293b);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    // ─── TRIANGLE ───────────────────────────────────────────────
    const triGeo = new THREE.BufferGeometry();
    const triPos = new Float32Array(12);
    triGeo.setAttribute("position", new THREE.BufferAttribute(triPos, 3));

    const triMat = new THREE.LineBasicMaterial({ color: 0x818cf8 });
    const triangle = new THREE.Line(triGeo, triMat);

    triangleRef.current = triangle;
    scene.add(triangle);

    // ─── RIGHT ANGLE MARKER ─────────────────────────────────────
    const sqGeo = new THREE.BufferGeometry();
    const sqPos = new Float32Array(9);
    sqGeo.setAttribute("position", new THREE.BufferAttribute(sqPos, 3));

    const sqMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
    const square = new THREE.Line(sqGeo, sqMat);

    squareRef.current = square;
    scene.add(square);

    // ─── ANIMATION LOOP ─────────────────────────────────────────
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      // smooth interpolation
      current.current.base +=
        (target.current.base - current.current.base) * 0.08;
      current.current.height +=
        (target.current.height - current.current.height) * 0.08;

      const a = current.current.base;
      const b = current.current.height;

      // update triangle
      if (triangleRef.current) {
        const pos =
          triangleRef.current.geometry.attributes.position
            .array as Float32Array;

        // (0,0) → (a,0) → (a,b) → (0,0)
        pos[0] = 0; pos[1] = 0; pos[2] = 0;
        pos[3] = a; pos[4] = 0; pos[5] = 0;
        pos[6] = a; pos[7] = b; pos[8] = 0;
        pos[9] = 0; pos[10] = 0; pos[11] = 0;

        triangleRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // update right angle square
      if (squareRef.current) {
        const size = Math.min(a, b) * 0.2;

        const pos =
          squareRef.current.geometry.attributes.position
            .array as Float32Array;

        pos[0] = 0; pos[1] = size; pos[2] = 0;
        pos[3] = size; pos[4] = size; pos[5] = 0;
        pos[6] = size; pos[7] = 0; pos[8] = 0;

        squareRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── RESIZE ────────────────────────────────────────────────
    const handleResize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      const aspect = width / height;

      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
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

  // ─── SYNC STATE → TARGET ─────────────────────────────────────
  useEffect(() => {
    target.current = { base, height };
  }, [base, height]);

  // ─── UI ──────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row gap-6">

      {/* Canvas */}
      <div className="flex-[2] relative rounded-3xl overflow-hidden border border-white/10 bg-black/40">
        <div ref={mountRef} className="absolute inset-0" />

        <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Triangle size={12} /> Hypotenuse
          </div>
          <div className="text-xl text-indigo-400 font-bold">
            {hypotenuse.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 p-6 rounded-3xl border border-white/10 bg-black/40 flex flex-col gap-6">

        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Info size={18} className="text-indigo-400" />
            Triangle Controls
          </h2>
          <p className="text-sm text-slate-400">
            Adjust base and height to explore the geometry.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400">
              Base (a): {base}
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">
              Height (b): {height}
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        {/* Math */}
        <div className="mt-auto bg-black/30 p-4 rounded-xl text-sm font-mono">
          <div>a² + b² = c²</div>
          <div>{base}² + {height}² = {base ** 2 + height ** 2}</div>
          <div className="text-indigo-400 font-bold mt-2">
            c = {hypotenuse.toFixed(2)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PythagorasLab;