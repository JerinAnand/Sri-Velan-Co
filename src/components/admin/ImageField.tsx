import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  section?: string;
  placeholder?: string;
  className?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  section = 'general',
  placeholder = 'https://example.com/image.jpg or upload file below...',
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadError(null);
    setImgError(false);

    const timeStamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `siteContent/${section}/${timeStamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        setUploadError(`Upload failed: ${error.message}`);
        setUploading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          setUploading(false);
        } catch (err: any) {
          console.error('Failed to get download URL:', err);
          setUploadError(`Failed to get URL: ${err.message}`);
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider">
        {label}
      </label>

      {/* Input controls layout */}
      <div className="space-y-2">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-neutral-500">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setImgError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-9 pr-24 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-brand-gold-500/80 transition-all font-mono"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-20 p-1 text-neutral-500 hover:text-red-400 transition-colors"
              title="Clear Image URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* File Upload Button */}
          <label className="absolute right-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-sm">
            <Upload className="w-3.5 h-3.5 text-brand-gold-400" />
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="space-y-1 bg-neutral-950/80 border border-brand-gold-500/30 rounded-lg p-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold-400" />
                Uploading to Firebase Storage...
              </span>
              <span className="text-brand-gold-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-gold-400 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {uploadError}
          </p>
        )}

        {/* Image Preview Thumbnail */}
        {value && !uploading && (
          <div className="flex items-center gap-3 p-2 bg-neutral-950/60 border border-white/5 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden border border-white/10 flex items-center justify-center shrink-0 relative">
              {!imgError ? (
                <img
                  src={value}
                  alt={label}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-1 text-neutral-600">
                  <ImageIcon className="w-5 h-5 mx-auto" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono text-neutral-300 truncate">{value}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Valid preview URL
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
