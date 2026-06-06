import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

// ─── Professional Sunglasses Shapes (Canvas Engine) ────────────────────────
const GLASSES_SHAPES = [
  {
    id: "aviator",
    name: "Aviator",
    draw(ctx, lx, ly, rx, ry, w, color, opacity) {
      const cx = (lx + rx) / 2, cy = (ly + ry) / 2;
      const angle = Math.atan2(ry - ly, rx - lx);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      const hw = w * 0.52, rw = w * 0.24, rh = w * 0.28;
      ctx.globalAlpha = opacity / 100;
      const lg = ctx.createRadialGradient(-hw / 2, 0, 0, -hw / 2, 0, rw * 0.9);
      lg.addColorStop(0, "rgba(200,220,255,0.15)"); lg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = lg; ctx.strokeStyle = color; ctx.lineWidth = w * 0.018;
      ctx.beginPath(); ctx.ellipse(-hw / 2, -rh * 0.05, rw, rh, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(hw / 2, -rh * 0.05, rw, rh, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(-hw / 2 + rw * 0.3, -rh * 0.1); ctx.quadraticCurveTo(0, -rh * 0.3, hw / 2 - rw * 0.3, -rh * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-hw / 2 - rw * 0.9, -rh * 0.1); ctx.lineTo(-hw / 2 - rw * 2.5, -rh * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hw / 2 + rw * 0.9, -rh * 0.1); ctx.lineTo(hw / 2 + rw * 2.5, -rh * 0.1); ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: "wayfarer",
    name: "Wayfarer",
    draw(ctx, lx, ly, rx, ry, w, color, opacity) {
      const cx = (lx + rx) / 2, cy = (ly + ry) / 2;
      const angle = Math.atan2(ry - ly, rx - lx);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      const hw = w * 0.50, rw = w * 0.23, rh = w * 0.20;
      ctx.globalAlpha = opacity / 100;
      const g = ctx.createLinearGradient(0, -rh, 0, rh);
      g.addColorStop(0, "rgba(50,50,80,0.3)"); g.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = g; ctx.strokeStyle = color; ctx.lineWidth = w * 0.025;
      ctx.beginPath(); ctx.roundRect(-hw / 2 - rw * 0.9, -rh * 0.8, rw * 2, rh * 1.6, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(hw / 2 - rw * 1.1, -rh * 0.8, rw * 2, rh * 1.6, 5); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(-hw / 2 + rw * 0.9, -rh * 0.15); ctx.lineTo(hw / 2 - rw * 1.1, -rh * 0.15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-hw / 2 - rw * 0.9, -rh * 0.2); ctx.lineTo(-hw / 2 - rw * 2.8, -rh * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hw / 2 + rw * 0.9, -rh * 0.2); ctx.lineTo(hw / 2 + rw * 2.8, -rh * 0.2); ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: "round",
    name: "Round",
    draw(ctx, lx, ly, rx, ry, w, color, opacity) {
      const cx = (lx + rx) / 2, cy = (ly + ry) / 2;
      const angle = Math.atan2(ry - ly, rx - lx);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      const hw = w * 0.48, r = w * 0.22;
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = "rgba(100,150,200,0.2)"; ctx.strokeStyle = color; ctx.lineWidth = w * 0.022;
      ctx.beginPath(); ctx.arc(-hw / 2, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(hw / 2, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(-hw / 2 + r * 0.7, -r * 0.1); ctx.lineTo(hw / 2 - r * 0.7, -r * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-hw / 2 - r * 0.9, 0); ctx.lineTo(-hw / 2 - r * 2.5, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hw / 2 + r * 0.9, 0); ctx.lineTo(hw / 2 + r * 2.5, 0); ctx.stroke();
      ctx.restore();
    },
  },
];

const FRAME_COLORS = [
  { value: "#111111", label: "Jet Black" },
  { value: "#8B5E3C", label: "Havana Brown" },
  { value: "#C8A96E", label: "Gold" },
  { value: "#C0C0C0", label: "Silver" },
  { value: "#1B3A6B", label: "Navy Blue" },
];

const EliteARView = ({ product, onClose, onBuyNow }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    
    // Customization State
    const [selectedShape, setSelectedShape] = useState(0);
    const [frameColor, setFrameColor] = useState("#111111");
    const [size, setSize] = useState(100);
    const [posY, setPosY] = useState(0);
    const [opacity, setOpacity] = useState(75);

    // Multi-View Asset Pipeline (Keep existing high-fidelity assets)
    const views = useRef({
        front: new Image(),
        left: new Image(),
        right: new Image(),
        isLoaded: false
    });

    // Smoothing state
    const smooth = useRef({
        x: 0, y: 0, scale: 0, angle: 0, yaw: 0, pitch: 0,
        initialized: false
    });

    useEffect(() => {
        const images = product.images || [];
        views.current.front.src = images[0]?.url || images[0];
        views.current.left.src = images[1]?.url || images[1] || views.current.front.src;
        views.current.right.src = images[2]?.url || images[2] || views.current.front.src;
        
        let loadedCount = 0;
        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount >= 3) views.current.isLoaded = true;
        };
        
        views.current.front.onload = onImageLoad;
        views.current.left.onload = onImageLoad;
        views.current.right.onload = onImageLoad;
    }, [product]);

    const takeScreenshot = async () => {
        if (!canvasRef.current) return;
        setIsCapturing(true);
        
        // Take local screenshot
        setTimeout(async () => {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `tryon-${product.name}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            
            // Optional: Upload to backend
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const formData = new FormData();
                formData.append('image', blob, 'screenshot.png');
                const uploadRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tryon/screenshot`, formData);
                
                if (uploadRes.data.success) {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tryon/session`, {
                        glassId: product._id,
                        frameColor,
                        screenshot: uploadRes.data.url
                    });
                }
            } catch (err) {
                console.error("Screenshot upload failed", err);
            }

            setIsCapturing(false);
            toast.success("Professional Snapshot Captured!");
        }, 100);
    };

    useEffect(() => {
        const FaceMesh = window.FaceMesh;
        const Camera = window.Camera;
        if (!FaceMesh || !Camera) return;

        const faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
        });

        const onResults = (results) => {
            if (!canvasRef.current || !videoRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;
            
            ctx.clearRect(0, 0, width, height);
            
            // Draw Video Background
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-width, 0);
            ctx.drawImage(results.image, 0, 0, width, height);
            ctx.restore();

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                setIsFaceDetected(true);
                const landmarks = results.multiFaceLandmarks[0];
                
                const getX = (l) => (1 - l.x) * width;
                const getY = (l) => l.y * height;

                const sLeftEye = landmarks[33];  
                const sRightEye = landmarks[263]; 
                const bridge = landmarks[168];  
                const sLeftEar = landmarks[234]; 
                const sRightEar = landmarks[454];
                const topHead = landmarks[10];
                const chin = landmarks[152];

                const lx = getX(sLeftEye);
                const rx = getX(sRightEye);
                const ly = getY(sLeftEye);
                const ry = getY(sRightEye);
                const nx = getX(bridge);
                const ny = getY(bridge) + posY; // Apply vertical adjustment
                const ex1 = getX(sLeftEar);
                const ex2 = getX(sRightEar);

                // --- AI SPATIAL MATH ---
                const eyeAngle = Math.atan2(ly - ry, lx - rx);
                const dL = Math.abs(nx - ex1);
                const dR = Math.abs(nx - ex2);
                const targetYaw = (dL - dR) / (dL + dR || 1);
                const fHeight = Math.abs(getY(topHead) - getY(chin));
                const targetPitch = (ny - (getY(topHead) + fHeight * 0.4)) / (fHeight || 1);
                const earDist = Math.abs(ex1 - ex2);

                // --- SMOOTHING ---
                if (!smooth.current.initialized) {
                    smooth.current.x = nx; smooth.current.y = ny;
                    smooth.current.scale = earDist; smooth.current.angle = eyeAngle;
                    smooth.current.yaw = targetYaw; smooth.current.pitch = targetPitch;
                    smooth.current.initialized = true;
                } else {
                    const alpha = 0.6;
                    smooth.current.x += (nx - smooth.current.x) * alpha;
                    smooth.current.y += (ny - smooth.current.y) * alpha;
                    smooth.current.scale += (earDist - smooth.current.scale) * 0.3;
                    smooth.current.yaw += (targetYaw - smooth.current.yaw) * 0.2;
                    smooth.current.pitch += (targetPitch - smooth.current.pitch) * 0.2;
                    let angleDiff = eyeAngle - smooth.current.angle;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    smooth.current.angle += angleDiff * 0.3;
                }

                // --- RENDER SEAMLESS AR ---
                const drawX = smooth.current.x;
                const drawY = smooth.current.y;
                const yaw = smooth.current.yaw;
                
                // Determine Opacities for Cross-Fade
                let opFront = 1; let opLeft = 0; let opRight = 0;
                if (yaw > 0.15) { opLeft = Math.min(1, (yaw - 0.15) * 4); opFront = 1 - opLeft; }
                else if (yaw < -0.15) { opRight = Math.min(1, (Math.abs(yaw) - 0.15) * 4); opFront = 1 - opRight; }

                const renderView = (img, op, scaleMult, shiftX) => {
                    if (op <= 0 || !img.complete) return;
                    ctx.save();
                    ctx.globalAlpha = (op * opacity) / 100;
                    const ds = smooth.current.scale * scaleMult * (size / 100);
                    const hs = ds * (img.height / img.width);
                    ctx.translate(drawX, drawY);
                    ctx.rotate(smooth.current.angle);
                    const ox = (product.faceAnchors?.translation?.x || 0) * ds + (shiftX * ds);
                    const oy = ((product.faceAnchors?.translation?.y || 0) + smooth.current.pitch * 0.1) * hs;
                    ctx.drawImage(img, -ds / 2 + ox, -hs / 2 + oy, ds, hs);
                    ctx.restore();
                };

                // Render high-fidelity product images
                renderView(views.current.front, opFront, 1.05, 0);
                renderView(views.current.left, opLeft, 1.25, -0.15);
                renderView(views.current.right, opRight, 1.25, 0.15);

            } else {
                setIsFaceDetected(false);
            }

            if (isLoading) setIsLoading(false);
        };

        faceMesh.onResults(onResults);
        const camera = new Camera(videoRef.current, {
            onFrame: async () => { if (videoRef.current) await faceMesh.send({ image: videoRef.current }); },
            width: 1280, height: 720,
        });
        camera.start();

        return () => { camera.stop(); faceMesh.close(); };
    }, [isLoading, product, posY, size, opacity, frameColor]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden font-sans">
            <video ref={videoRef} className="hidden" playsInline muted />
            
            {/* Main AR Stage */}
            <div className="relative flex-1 h-full bg-black flex items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="w-full h-full object-cover" />
                
                <AnimatePresence>
                    {isCapturing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-[200]" />
                    )}
                </AnimatePresence>

                {/* AR HUD */}
                <div className="absolute top-8 left-8 z-30 flex flex-col gap-4">
                    <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl">
                         <div className="flex items-center gap-3 mb-2">
                              <div className={`w-2 h-2 rounded-full ${isFaceDetected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-amber-500 animate-pulse'}`} />
                              <p className="text-white/50 text-[8px] font-black uppercase tracking-[0.2em]">{isFaceDetected ? 'Neural Lock Active' : 'Scanning Face...'}</p>
                         </div>
                         <h2 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">{product.name}</h2>
                    </div>
                </div>

                <button onClick={onClose} className="absolute top-8 right-8 z-30 w-12 h-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Professional Side Control Panel */}
            <div className="w-80 h-full bg-[#111] border-l border-white/5 flex flex-col z-40">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[#e8c97a] font-black tracking-widest text-[10px] uppercase">VisionX Studio</span>
                    <div className="bg-[#e8c97a] text-black text-[7px] font-bold px-2 py-0.5 rounded-full uppercase">PRO</div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Size Adjuster */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-white/40 text-[9px] font-black uppercase tracking-widest">Scale</label>
                            <span className="text-[#e8c97a] text-[10px] font-bold">{size}%</span>
                        </div>
                        <input type="range" min="60" max="160" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[#e8c97a]" />
                    </div>

                    {/* Position Adjuster */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-white/40 text-[9px] font-black uppercase tracking-widest">Vertical Offset</label>
                            <span className="text-[#e8c97a] text-[10px] font-bold">{posY}px</span>
                        </div>
                        <input type="range" min="-50" max="50" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-[#e8c97a]" />
                    </div>

                    {/* Opacity Adjuster */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-white/40 text-[9px] font-black uppercase tracking-widest">Lens Density</label>
                            <span className="text-[#e8c97a] text-[10px] font-bold">{opacity}%</span>
                        </div>
                        <input type="range" min="20" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[#e8c97a]" />
                    </div>

                    {/* Frame Color Selection */}
                    <div className="space-y-4">
                        <label className="text-white/40 text-[9px] font-black uppercase tracking-widest">Frame Finish</label>
                        <div className="flex gap-3">
                            {FRAME_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => setFrameColor(c.value)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${frameColor === c.value ? 'border-[#e8c97a] scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
                    <button onClick={takeScreenshot} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Save Snapshot
                    </button>
                    <button onClick={() => onBuyNow(product)} className="w-full py-5 bg-[#e8c97a] text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#e8c97a]/10">
                        Add to Cart — Rs. {product.price.toLocaleString()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EliteARView;
