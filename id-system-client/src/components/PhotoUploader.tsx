import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Loader2, X, Check, RotateCcw, ImagePlus } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoProcessed: (photoUrl: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoProcessed }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });
      streamRef.current = stream;
      setCameraReady(false);
      setShowCamera(true);
    } catch {
      alert('Could not access your camera. Please check browser permissions.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setShowCamera(false);
    setCameraReady(false);
    setCountdown(null);
  };

  const startCountdown = () => {
    if (!cameraReady || countdown !== null) return;
    setCountdown(3);
    let n = 3;
    countdownRef.current = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        if (countdownRef.current) {
          window.clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(n);
      }
    }, 700);
  };

  // Crop window in the SVG mask (viewBox 75x100): x=7.5, y=8, w=60, h=80.
  const CROP_X_PCT = 0.10;
  const CROP_Y_PCT = 0.08;
  const CROP_W_PCT = 0.80;
  const CROP_H_PCT = 0.80;
  // Final output resolution for the ID photo (square, high-res for sharp PDF print).
  const OUTPUT_SIZE = 800;

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    setIsCapturing(true);

    const TARGET_ASPECT = 3 / 4;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    let visW: number;
    let visH: number;
    if (vw / vh > TARGET_ASPECT) {
      visH = vh;
      visW = visH * TARGET_ASPECT;
    } else {
      visW = vw;
      visH = visW / TARGET_ASPECT;
    }
    const visX = (vw - visW) / 2;
    const visY = (vh - visH) / 2;

    // Crop region inside the visible 3:4 viewport (matches SVG mask).
    const cropX = visX + visW * CROP_X_PCT;
    const cropY = visY + visH * CROP_Y_PCT;
    const cropW = visW * CROP_W_PCT;
    const cropH = visH * CROP_H_PCT;

    // Output square (1:1) with the face centered in the upper portion.
    // We take a 1:1 region from the top of the 3:4 crop.
    const outSide = Math.min(cropW, cropH);
    const sx = cropX + (cropW - outSide) / 2;
    // Bias upward (~10% of the way down) so the face sits naturally framed.
    const sy = cropY + Math.max(0, cropH * 0.05);

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsCapturing(false);
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, sx, sy, outSide, outSide, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        setIsCapturing(false);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          stopCamera();
        }
      },
      'image/jpeg',
      0.95
    );
  };

  const confirmPhoto = () => {
    if (!previewUrl) return;
    onPhotoProcessed(previewUrl);
    setPreviewUrl(null);
  };

  const retakePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    startCamera();
  };

  const cancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Please choose a file under 10MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  if (previewUrl) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Review your photo
        </h3>
        <div className="relative">
          <div className="w-44 h-56 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-blue-200/60 dark:ring-blue-800/60">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
            <Check className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-xs">
          Make sure your face is clear and well-lit. You can retake if needed.
        </p>
        <div className="flex space-x-3 pt-2">
          <button
            onClick={retakePhoto}
            className="flex items-center px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retake
          </button>
          <button
            onClick={confirmPhoto}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md hover:shadow-lg"
          >
            <Check className="w-4 h-4 mr-2" /> Use this photo
          </button>
        </div>
        <button
          onClick={cancelPreview}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (showCamera) {
    return (
      <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-slate-700 shadow-2xl">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Camera active</span>
        </div>

        <div className="relative w-full max-w-xs">
          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-black shadow-2xl ring-4 ring-blue-500/30">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                videoRef.current?.play();
                setCameraReady(true);
              }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 75 100"
              preserveAspectRatio="none"
            >
              <defs>
                <mask id="cropMask">
                  <rect width="75" height="100" fill="white" />
                  <rect x="7.5" y="8" width="60" height="80" rx="2" fill="black" />
                </mask>
              </defs>
              {/* Darken everything OUTSIDE the bright capture rectangle */}
              <rect
                width="75"
                height="100"
                fill="rgba(0,0,0,0.6)"
                mask="url(#cropMask)"
              />
              {/* Capture rectangle border (this is what gets photographed) */}
              <rect
                x="7.5"
                y="8"
                width="60"
                height="80"
                rx="2"
                fill="none"
                stroke="white"
                strokeWidth="0.3"
                strokeDasharray="2 1.5"
                opacity="0.7"
              />
              {/* Big face positioning oval — fits a face comfortably */}
              <ellipse
                cx="37.5"
                cy="40"
                rx="22"
                ry="28"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="0.4"
                strokeDasharray="1.5 1"
                opacity="0.85"
              />
              {/* Corner brackets on the capture rectangle */}
              <path d="M 11.5 8 L 7.5 8 L 7.5 12" stroke="#10b981" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M 63.5 8 L 67.5 8 L 67.5 12" stroke="#10b981" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M 67.5 84 L 67.5 88 L 63.5 88" stroke="#10b981" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M 11.5 88 L 7.5 88 L 7.5 84" stroke="#10b981" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            </svg>

            {cameraReady && countdown === null && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <p className="text-[10px] font-semibold text-white uppercase tracking-wider">
                  Fit face inside the blue oval
                </p>
              </div>
            )}

            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <p className="text-xs text-white mt-2">Starting camera...</p>
                </div>
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span
                  key={countdown}
                  className="text-white font-black text-[120px] leading-none drop-shadow-2xl animate-ping-once"
                  style={{
                    animation: 'pulse 0.7s ease-out',
                  }}
                >
                  {countdown}
                </span>
              </div>
            )}

            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-3">
            <button
              onClick={startCountdown}
              disabled={!cameraReady || countdown !== null || isCapturing}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center shadow-lg disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all hover:shadow-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              {countdown !== null ? 'Hold still...' : 'Capture'}
            </button>
            <button
              onClick={stopCamera}
              className="px-5 py-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-xl flex items-center hover:bg-slate-600 transition"
            >
              <X className="w-5 h-5 mr-1" /> Cancel
            </button>
          </div>

          <div className="mt-3 px-3 py-2 bg-slate-700/50 rounded-lg">
            <p className="text-[11px] text-slate-300 text-center leading-relaxed">
              💡 Face the light • Plain background • Neutral expression
            </p>
          </div>
        </div>

        <style>{`
          @keyframes flash {
            0% { opacity: 0.8; }
            100% { opacity: 0; }
          }
          .animate-flash { animation: flash 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center mb-3 shadow-inner">
          <ImagePlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Student Photo</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Upload a photo or capture one with your webcam
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition shadow-sm"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload
        </button>
        <button
          onClick={startCamera}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow transition hover:shadow-md"
        >
          <Camera className="w-4 h-4 mr-2" /> Webcam
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PhotoUploader;
