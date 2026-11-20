import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, AlertCircle, RefreshCw, CheckCircle, Zap } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'file' | 'demo'>('camera');
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'cyber-qr-reader-viewport';

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      setScannerError(null);
      setIsScanning(true);

      const html5QrCode = new Html5Qrcode(readerElementId);
      qrReaderRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          stopCamera();
          onScanSuccess(decodedText);
          onClose();
        },
        () => {
          // Frame scan error (normal during scanning)
        }
      );
    } catch (err: any) {
      console.warn('Camera scan failed or permission denied:', err);
      setScannerError('Camera access unavailable or blocked in this environment. Use simulated scanner presets below or upload a QR image.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (qrReaderRef.current && isScanning) {
      try {
        await qrReaderRef.current.stop();
        qrReaderRef.current.clear();
      } catch (err) {
        // Ignore stop error
      }
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('file-qr-temp-reader');
      const decodedText = await html5QrCode.scanFile(file, true);
      onScanSuccess(decodedText);
      onClose();
    } catch (err) {
      setScannerError('Could not detect a valid CyberRakshak QR code from this image. Please ensure the QR is clear.');
    }
  };

  const handleSimulatedPreset = (noticeId: string) => {
    stopCamera();
    onScanSuccess(noticeId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Notice QR Code Scanner" maxWidth="md">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-cyber-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'camera' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Device Camera
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'file' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload QR Image
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'demo' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Presets
          </button>
        </div>

        {/* Tab 1: Camera */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            <div
              id={readerElementId}
              className="w-full h-64 bg-black/60 rounded-xl overflow-hidden border border-cyber-border flex items-center justify-center"
            >
              {!isScanning && (
                <div className="text-center p-4 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Starting camera feed...</p>
                </div>
              )}
            </div>

            {scannerError && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p>{scannerError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: File Upload */}
        {activeTab === 'file' && (
          <div className="space-y-3">
            <div id="file-qr-temp-reader" className="hidden"></div>
            <label className="border-2 border-dashed border-cyber-border hover:border-cyan-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="font-semibold text-white">Click or drag a QR code image here</span>
              <span className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, or screenshot of college notice</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Tab 3: Presets */}
        <div className="pt-2 border-t border-cyber-border/60">
          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            One-Click Simulated Campus Notice Scans:
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleSimulatedPreset('VIT-NOT-2026-0891')}
              className="w-full text-left p-2.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-emerald-500/50 transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-emerald-400 text-xs">VIT-NOT-2026-0891 (Genuine Published)</div>
                <div className="text-[11px] text-slate-300">Semester Exam Fee & Hall Ticket Release</div>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => handleSimulatedPreset('VIT-NOT-2026-0902')}
              className="w-full text-left p-2.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-amber-500/50 transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-amber-400 text-xs">VIT-NOT-2026-0902 (Pending Approval)</div>
                <div className="text-[11px] text-slate-300">Hostel Mess Dues Clearance - Spring 2026</div>
              </div>
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => handleSimulatedPreset('VIT-NOT-2026-0744')}
              className="w-full text-left p-2.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-rose-500/50 transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-rose-400 text-xs">VIT-NOT-2026-0744 (Revoked Notice)</div>
                <div className="text-[11px] text-slate-300">Outdated Fest Registration Circular</div>
              </div>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

