import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Pencil } from 'lucide-react';

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
  const { isAdmin, getValue, updateValue } = useAdmin();
  const currentValue = getValue(id, defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string | number>(currentValue);

  // Synchronize internal state with changes in context (e.g. if we Reset to Defaults)
  useEffect(() => {
    setTempValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    setIsEditing(false);
    // Convert to number if the original value was a number
    let finalVal = tempValue;
    if (typeof defaultValue === 'number') {
      const parsed = Number(tempValue);
      finalVal = isNaN(parsed) ? defaultValue : parsed;
    }
    updateValue(id, finalVal);
    if (onSave) {
      onSave(finalVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(currentValue);
    }
  };

  if (isAdmin) {
    if (isEditing) {
      return (
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={(e) => e.stopPropagation()} // Prevent clicking parent containers
          className="bg-neutral-800 text-white px-2 py-0.5 rounded border border-brand-gold-500 focus:outline-none focus:ring-2 focus:ring-brand-gold-500 max-w-[120px] font-mono text-inherit inline-block"
        />
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
          title="Click to edit value"
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
