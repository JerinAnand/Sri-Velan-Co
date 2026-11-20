import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Layers } from 'lucide-react';
import { RepeaterItem } from './RepeaterItem';
import { EmptyState } from './SectionCard';

interface EditableItemListProps<T extends { id: string }> {
  title: string;
  description?: string;
  items: T[];
  onUpdateItems: (items: T[]) => void;
  createNewItem: () => T;
  renderItemFields: (item: T, index: number, updateItem: (updatedItem: T) => void) => React.ReactNode;
  getItemTitle?: (item: T, index: number) => string;
  getItemSubtitle?: (item: T, index: number) => string | undefined;
  addButtonText?: string;
  emptyStateText?: string;
}

const EMPTY_ITEMS: never[] = [];

export function EditableItemList<T extends { id: string }>({
  title,
  description,
  items = EMPTY_ITEMS as T[],
  onUpdateItems,
  createNewItem,
  renderItemFields,
  getItemTitle = (item, idx) => `Item #${idx + 1}`,
  getItemSubtitle,
  addButtonText = 'Add item',
  emptyStateText = 'No items added yet. Click below to add your first entry.',
}: EditableItemListProps<T>) {
  const itemKeys = useMemo(
    () => items.map((item, idx) => item.id || String(idx)),
    [items]
  );
  const itemKeysSignature = itemKeys.join('|');
  const firstKey = itemKeys[0] ?? null;

  // Only one item expanded by default (the first item if available)
  const [expandedId, setExpandedId] = useState<string | null>(() => firstKey);

  // If items change and expandedId no longer exists, keep collapsed or select first
  useEffect(() => {
    if (expandedId && !itemKeys.includes(expandedId)) {
      setExpandedId(firstKey);
    }
  }, [itemKeysSignature, expandedId, firstKey, itemKeys]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAddItem = () => {
    const newItem = createNewItem();
    onUpdateItems([...items, newItem]);
    setExpandedId(newItem.id || String(items.length));
  };

  const handleRemoveItem = (index: number) => {
    const next = [...items];
    const [removed] = next.splice(index, 1);
    onUpdateItems(next);
    const removedKey = removed ? removed.id || String(index) : null;
    if (removedKey && removedKey === expandedId) {
      const nextExpanded = next[index]
        ? next[index].id || String(index)
        : next[index - 1]
          ? next[index - 1].id || String(index - 1)
          : null;
      setExpandedId(nextExpanded);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...items];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onUpdateItems(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const next = [...items];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onUpdateItems(next);
  };

  const handleUpdateItem = (index: number, updatedItem: T) => {
    const next = [...items];
    next[index] = updatedItem;
    onUpdateItems(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-semibold text-base text-white">
              {title}
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              ({items.length})
            </span>
          </div>
          {description && (
            <p className="text-xs text-slate-400">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gold-300 border border-brand-gold-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{addButtonText}</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description={emptyStateText}
          actionLabel={addButtonText}
          onAction={handleAddItem}
          icon={<Layers className="w-5 h-5" />}
        />
      ) : (
        <div className="space-y-2.5">
          {items.map((item, index) => {
            const itemKey = item.id || String(index);
            const isExpanded = expandedId === itemKey;
            return (
              <RepeaterItem
                key={itemKey}
                index={index}
                total={items.length}
                title={getItemTitle(item, index)}
                subtitle={getItemSubtitle?.(item, index)}
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(itemKey)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onRemove={() => handleRemoveItem(index)}
              >
                {renderItemFields(item, index, (updated) =>
                  handleUpdateItem(index, updated)
                )}
              </RepeaterItem>
            );
          })}
        </div>
      )}
    </div>
  );
}
