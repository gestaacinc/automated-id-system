import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Loader2, X, Check } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoProcessed: (photoUrl: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
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
    } catch (err) {
      console.error('Camera access denied', err);
      alert('Could not access your camera. Please check browser permissions.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setShowCamera(false);
    setCameraReady(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      alert('Camera is still loading. Please wait a moment.');
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(video, 0, 0);

    const centerX = tempCanvas.width * 0.5;
    const centerY = tempCanvas.height * 0.45;
    const cropWidth = tempCanvas.width * 0.6;
    const cropHeight = cropWidth * 1.33;

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      tempCanvas,
      centerX - cropWidth / 2,
      centerY - cropHeight / 2,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCamera();
          processImage(blob);
        }
      },
      'image/jpeg',
      0.92
    );
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

    processImage(file);
  };

  const processImage = (imageSource: File | Blob) => {
    setIsProcessing(true);
    try {
      const url = URL.createObjectURL(imageSource);
      onPhotoProcessed(url);
    } catch (error) {
      console.error('Failed to process photo:', error);
      alert('Error processing photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Student Photo</h3>

      {showCamera ? (
        <div className="relative w-full max-w-sm">
          <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                videoRef.current?.play();
                setCameraReady(true);
              }}
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <ellipse
                cx="50"
                cy="35"
                rx="20"
                ry="25"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4 pt-2 space-x-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5 mr-1" /> Snap
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center hover:bg-red-700 transition"
            >
              <X className="w-5 h-5 mr-1" /> Close
            </button>
          </div>
        </div>
      ) : isProcessing ? (
        <div className="flex flex-col items-center py-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-xs text-gray-500 mt-2">Loading photo...</p>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload
          </button>
          <button
            onClick={startCamera}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
      )}
    </div>
  );
};

export default PhotoUploader;
