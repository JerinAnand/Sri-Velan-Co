/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../context/TranslationContext';
import { Pencil, AlertCircle } from 'lucide-react';

interface EditableValueProps {
  id: string;
  defaultValue: string | number;
  className?: string;
  type?: 'text' | 'number';
  displaySuffix?: string;
  onSave?: (value: any) => void;
}

export function EditableValue({
  id,
  defaultValue,
  className = '',
  type = 'text',
  displaySuffix = '',
  onSave,
}: EditableValueProps) {
  const { isAdmin, getValue, updateValue, validateValue, getBoundsDescription } = useAdmin();
  const { language } = useTranslation(); // Subscribe to language changes to force instant re-render
  const currentValue = getValue(id, defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string | number>(currentValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize internal state with changes in context (e.g. if we Reset to Defaults or language change)
  useEffect(() => {
    setTempValue(currentValue);
    setValidationError(null);
  }, [currentValue, language]);

  const handleSave = () => {
    // Convert to number if the original value was a number
    let finalVal = tempValue;
    if (typeof defaultValue === 'number') {
      const parsed = Number(tempValue);
      finalVal = isNaN(parsed) ? defaultValue : parsed;
    }

    const result = validateValue(id, finalVal);
    if (!result.isValid) {
      setValidationError(result.error || 'Invalid value');
      return;
    }

    setValidationError(null);
    setIsEditing(false);
    updateValue(id, finalVal);
    if (onSave) {
      onSave(finalVal);
    }
  };

  const handleBlur = () => {
    let finalVal = tempValue;
    if (typeof defaultValue === 'number') {
      const parsed = Number(tempValue);
      finalVal = isNaN(parsed) ? defaultValue : parsed;
    }

    const result = validateValue(id, finalVal);
    if (!result.isValid) {
      // Auto-clamp or correct to safe value to prevent layout breakage on blur
      const clampedVal = result.value;
      setTempValue(clampedVal);
      setValidationError(null);
      setIsEditing(false);
      updateValue(id, clampedVal);
      if (onSave) {
        onSave(clampedVal);
      }
    } else {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValidationError(null);
      setTempValue(currentValue);
    }
  };

  if (isAdmin) {
    if (isEditing) {
      const bounds = getBoundsDescription(id);
      return (
        <span className="relative inline-block z-30 font-mono" onClick={(e) => e.stopPropagation()}>
          <input
            type={type}
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
              setValidationError(null);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`bg-neutral-800 text-white px-2 py-0.5 rounded border focus:outline-none focus:ring-2 max-w-[140px] font-mono text-inherit inline-block transition-all ${
              validationError
                ? 'border-red-500 focus:ring-red-500 ring-2 ring-red-500/20'
                : 'border-brand-gold-500 focus:ring-brand-gold-500'
            }`}
            title={bounds}
          />
          {validationError && (
            <span className="absolute left-0 top-full mt-1.5 bg-red-950 border border-red-500 text-red-200 text-[10px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5 font-sans z-50">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              {validationError}
            </span>
          )}
        </span>
      );
    } else {
      return (
        <span
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering card-level clicks
            setTempValue(currentValue);
            setIsEditing(true);
          }}
          className={`cursor-pointer inline-flex items-center gap-1 group/editable border-b border-dashed border-brand-gold-500/60 hover:bg-brand-gold-500/10 hover:text-brand-gold-400 transition-all admin-editable-highlight ${className}`}
          title={`Click to edit. ${getBoundsDescription(id)}`}
        >
          {currentValue}
          {displaySuffix}
          <Pencil className="w-3 h-3 text-brand-gold-400 opacity-60 group-hover/editable:opacity-100 transition-opacity shrink-0 ml-0.5" />
        </span>
      );
    }
  }

  return (
    <span className={className}>
      {currentValue}
      {displaySuffix}
    </span>
  );
}
