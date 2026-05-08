import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { ShopContext } from '../context/ShopContext';

/**
 * 3D Sunglasses Model Component
 * Loads a GLB and transforms it based on face landmarks
 */
const SunglassesModel = ({ modelUrl, landmarks, isDetected }) => {
  const { backendUrl } = React.useContext(ShopContext);
  const fullModelUrl = modelUrl ? (modelUrl.startsWith('http') ? modelUrl : `${backendUrl}/models/${modelUrl}`) : null;
  const { scene } = useGLTF(fullModelUrl || 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/glasses/model.gltf');
  const groupRef = useRef();
  
  const smoothedPos = useRef(new THREE.Vector3());
  const smoothedRot = useRef(new THREE.Euler());
  const smoothedScale = useRef(new THREE.Vector3(1, 1, 1));
  const smoothingFactor = 0.2;

  // Clone the scene to avoid reference issues if multiple instances exist
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!isDetected || !landmarks || !groupRef.current) {
        if (groupRef.current) groupRef.current.visible = false;
        return;
    }
    
    groupRef.current.visible = true;

    // Face Landmarks (MediaPipe 468 points)
    const bridge = landmarks[168];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const lTemple = landmarks[234];
    const rTemple = landmarks[454];
    const lEye = landmarks[33];
    const rEye = landmarks[263];

    // 1. Position Calculation
    const x = (bridge.x - 0.5) * -7;   
    const y = (bridge.y - 0.5) * -5; 
    const z = (bridge.z * -5) + 0.5;

    // 2. Rotation Calculation
    const roll = Math.atan2(rEye.y - lEye.y, rEye.x - lEye.x);
    const yaw = ((lTemple.x + rTemple.x) / 2 - bridge.x) * 4;
    const faceHeight = chin.y - forehead.y;
    const bridgeRelY = (bridge.y - forehead.y) / faceHeight;
    const pitch = (bridgeRelY - 0.35) * 3;

    // 3. Scale Calculation
    const faceWidth = Math.sqrt(Math.pow(rTemple.x - lTemple.x, 2) + Math.pow(rTemple.y - lTemple.y, 2));
    const scale = faceWidth * 8.5;

    // 4. Interpolation
    smoothedPos.current.x += (x - smoothedPos.current.x) * smoothingFactor;
    smoothedPos.current.y += (y - smoothedPos.current.y) * smoothingFactor;
    smoothedPos.current.z += (z - smoothedPos.current.z) * smoothingFactor;

    smoothedRot.current.z += (roll - smoothedRot.current.z) * smoothingFactor;
    smoothedRot.current.y += (yaw - smoothedRot.current.y) * smoothingFactor;
    smoothedRot.current.x += (pitch - smoothedRot.current.x) * smoothingFactor;

    smoothedScale.current.x += (scale - smoothedScale.current.x) * smoothingFactor;
    smoothedScale.current.y += (scale - smoothedScale.current.y) * smoothingFactor;
    smoothedScale.current.z += (scale - smoothedScale.current.z) * smoothingFactor;

    // 5. Apply
    groupRef.current.position.set(smoothedPos.current.x, smoothedPos.current.y, smoothedPos.current.z);
    groupRef.current.rotation.set(smoothedRot.current.x, smoothedRot.current.y, smoothedRot.current.z);
    groupRef.current.scale.set(smoothedScale.current.x, smoothedScale.current.y, smoothedScale.current.z);
    
    groupRef.current.position.y -= 0.1;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

/**
 * Background Webcam Feed
 */
const VideoBackground = ({ videoElement }) => {
  const { viewport } = useThree();
  const texture = useMemo(() => {
    if (!videoElement) return null;
    const tex = new THREE.VideoTexture(videoElement);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [videoElement]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial map={texture} depthTest={false} depthWrite={false} />
    </mesh>
  );
};

/**
 * Professional AR Try-On Component
 */
const ProfessionalTryOn = ({ selectedItem, onClose, sunglassesList, onSwitch, isDarkMode }) => {
  const videoRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const [isDetected, setIsDetected] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [status, setStatus] = useState("Initializing AR Engine...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let faceMesh = null;
    let camera = null;
    let active = true;

    const initAR = async () => {
      try {
        const FaceMeshClass = window.FaceMesh;
        const CameraClass = window.Camera;

        if (!FaceMeshClass || !CameraClass) {
          setError("AR Modules not found. Ensure script injection is successful.");
          return;
        }

        faceMesh = new FaceMeshClass({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        faceMesh.onResults((results) => {
          if (!active) return;
          
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            if (results.multiFaceLandmarks.length > 1) {
              setStatus("Multiple faces detected - please stay alone");
              setIsDetected(false);
              return;
            }

            const currentLandmarks = results.multiFaceLandmarks[0];
            setLandmarks(currentLandmarks);
            setIsDetected(true);
            
            if (isValidating) {
                const bridge = currentLandmarks[168];
                const lTemple = currentLandmarks[234];
                const rTemple = currentLandmarks[454];
                
                // 1. Centering Check (Yaw)
                const yaw = Math.abs(((lTemple.x + rTemple.x) / 2 - bridge.x));
                
                // 2. Distance Check (Face Width in screen space)
                const faceWidth = Math.sqrt(Math.pow(rTemple.x - lTemple.x, 2) + Math.pow(rTemple.y - lTemple.y, 2));

                if (yaw > 0.05) {
                    setStatus("Face tilted - look straight at camera");
                    setProgress(p => Math.max(0, p - 1));
                } else if (faceWidth < 0.25) {
                    setStatus("Too far - move closer to camera");
                    setProgress(p => Math.max(0, p - 1));
                } else if (faceWidth > 0.6) {
                    setStatus("Too close - move slightly back");
                    setProgress(p => Math.max(0, p - 1));
                } else {
                    setStatus("Calibrating Optical Alignment...");
                    setProgress(p => (p >= 100 ? 100 : p + 4));
                    if (progress >= 100) setIsValidating(false);
                }
            }
          } else {
            setIsDetected(false);
            if (isValidating) {
                setStatus("Searching for Face Mesh...");
                setProgress(p => Math.max(0, p - 5));
            }
          }
        });

        if (videoRef.current) {
          camera = new CameraClass(videoRef.current, {
            onFrame: async () => {
              if (faceMesh && active && videoRef.current) {
                await faceMesh.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });
          await camera.start();
        }
      } catch (err) {
        console.error("3D AR Error:", err);
        setError("Camera permission denied or MediaPipe error.");
      }
    };

    initAR();
    return () => {
      active = false;
      if (camera) camera.stop();
      if (faceMesh) faceMesh.close();
    };
  }, [progress, isValidating]);

  if (error) {
    return (
        <div className='fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-10 text-center'>
            <div className='w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-5xl mb-8'>!</div>
            <h2 className='text-white text-2xl font-black uppercase mb-4'>AR Failed</h2>
            <p className='text-gray-400 text-sm mb-10'>{error}</p>
            <button onClick={onClose} className='bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs'>Close</button>
        </div>
    );
  }

  return (
    <div className='fixed inset-0 z-[100] flex flex-col bg-[#050505] overflow-hidden'>
      {/* HUD Header */}
      <div className='absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-[90] pointer-events-none'>
        <div className='space-y-1'>
            <h2 className='text-2xl font-black text-white uppercase tracking-tighter'>Live <span className='text-indigo-500'>AR Studio</span></h2>
            <div className='flex items-center gap-2'>
                <div className={`w-2 h-2 rounded-full ${isDetected ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-rose-500 animate-pulse'}`}></div>
                <span className='text-[9px] font-black text-white/40 uppercase tracking-[0.2em]'>{isDetected ? 'Face Tracked' : 'Searching...'}</span>
            </div>
        </div>
        <button onClick={onClose} className='pointer-events-auto w-14 h-14 bg-white/5 hover:bg-rose-600/20 hover:text-rose-500 border border-white/10 rounded-2xl flex items-center justify-center transition-all'>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      {/* Loading Mask */}
      {isValidating && (
        <div className='absolute inset-0 z-[80] bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center'>
            <div className='w-40 h-40 relative mb-10'>
                <svg className='w-full h-full -rotate-90'>
                    <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="2" fill="transparent" className='text-white/5' />
                    <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="471" strokeDashoffset={471 - (471 * progress) / 100} className='text-indigo-500 transition-all duration-500' />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-white font-black text-3xl tracking-tighter'>{progress}%</span>
                </div>
            </div>
            <p className='text-white text-sm font-black uppercase tracking-[0.5em] mb-4'>{status}</p>
        </div>
      )}

      {/* 3D Scene */}
      <div className='flex-1 relative'>
        <video ref={videoRef} className='hidden' playsInline muted />
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <ContactShadows opacity={0.4} scale={10} blur={2.4} far={0.8} />
            <VideoBackground videoElement={videoRef.current} />
            <SunglassesModel 
              modelUrl={selectedItem?.model3D}
              landmarks={landmarks} 
              isDetected={isDetected && !isValidating} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Style Selector */}
      <div className='h-36 bg-black/50 backdrop-blur-2xl border-t border-white/10 flex items-center px-8 gap-8'>
          <div className='flex-1 flex gap-4 overflow-x-auto no-scrollbar py-2'>
              {sunglassesList?.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => onSwitch(item)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl p-4 cursor-pointer transition-all duration-500 flex items-center justify-center ${selectedItem?._id === item._id ? 'bg-indigo-600 scale-105 shadow-xl' : 'bg-white/5 border border-white/10'}`}
                  >
                      <img src={item.image[0]} className='w-full h-full object-contain' alt="" />
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ProfessionalTryOn;
