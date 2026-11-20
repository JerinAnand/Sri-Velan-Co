import React, { useState, useId } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { FieldLabel, HelperText, inputBaseClasses } from './SectionCard';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  section?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  section = 'general',
  placeholder = 'https://example.com/image.jpg or upload an image file',
  helperText,
  className = '',
}) => {
  const inputId = useId();
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
    <div className={className}>
      <FieldLabel htmlFor={inputId} label={label} />

      <div className="space-y-2.5">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => {
              setImgError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className={`${inputBaseClasses} pl-10 pr-28`}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-24 p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear image URL"
              aria-label="Clear image URL"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <label className="absolute right-1.5 h-8 bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors duration-150">
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

        {helperText && <HelperText>{helperText}</HelperText>}

        {uploading && (
          <div className="space-y-1.5 bg-[#050d1a] border border-brand-gold-500/30 rounded-xl p-3 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold-400" />
                Uploading image to Firebase Storage...
              </span>
              <span className="text-brand-gold-400 font-mono tabular-nums font-semibold">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-gold-400 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{uploadError}</span>
          </p>
        )}

        {value && !uploading && (
          <div className="flex items-center gap-3 p-2.5 bg-[#050d1a] border border-white/10 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-[#091529] overflow-hidden border border-white/10 flex items-center justify-center shrink-0">
              {!imgError ? (
                <img
                  src={value}
                  alt={label}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-slate-300 truncate">{value}</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{imgError ? 'Preview unavailable (check URL)' : 'Image preview loaded'}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
