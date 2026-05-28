import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, AlertCircle, Scan, Camera, Smartphone } from 'lucide-react';
import axiosInstance from '../../api/axios';

const QRScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Small delay to ensure DOM is ready
    const initScanner = setTimeout(() => {
      if (scannerRef.current) return;

      // Calculate responsive size
      const isMobile = window.innerWidth < 640;
      const containerWidth = Math.min(window.innerWidth - 60, 380);
      const qrboxSize = isMobile ? containerWidth - 40 : 280;

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1.0,
          showTorchButton: true,
          torchButtonTitle: "Flash",
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanError);
    }, 100);

    return () => {
      clearTimeout(initScanner);
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      initializedRef.current = false;
    };
  }, []);

  const onScanSuccess = (decodedText, decodedResult) => {
    if (!scanning) return;
    setScanning(false);
    handleAttendance(decodedText);
  };

  const onScanError = (error) => {
    // Silent error handling
  };

  const handleAttendance = async (qrData) => {
    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/attendance/mark', {
        qrData: qrData,
      });

      setScanResult({
        success: true,
        message: response.data.message,
      });
      
      setTimeout(() => {
        resetScanner();
      }, 3000);
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Failed to mark attendance',
      });
      
      setTimeout(() => {
        resetScanner();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setScanResult(null);
    // Reload the page to reset everything cleanly
    window.location.reload();
  };

  return (
    <div className="px-4 py-3 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-800">QR Scanner</h1>
        <p className="text-xs text-gray-400 mt-0.5">Scan employee QR code</p>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Camera size="14" className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Camera Scanner</span>
          </div>
        </div>
        
        <div id="qr-reader" className="w-full"></div>
        
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">Auto-focus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">Flash</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone size="11" className="text-gray-400" />
              <span className="text-xs text-gray-500">Switch camera</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-blue-50/30 border border-blue-100">
        <p className="text-xs text-blue-600 text-center">
          💡 Tap camera icon to switch between front/back camera
        </p>
      </div>

      {/* Result Modal */}
      {scanResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm mx-auto">
            <div className={`p-5 text-center ${scanResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              {scanResult.success ? (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size="24" className="text-green-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size="24" className="text-red-600" />
                </div>
              )}
              <h3 className={`text-base font-semibold ${scanResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {scanResult.success ? 'Success!' : 'Error'}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{scanResult.message}</p>
            </div>
            <div className="px-5 py-3 bg-gray-50 flex justify-center border-t border-gray-100">
              <button
                onClick={resetScanner}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Scan another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-5 text-center mx-4">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;