import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface EditableItemListProps<T extends { id: string }> {
  title: string;
  items: T[];
  onUpdateItems: (items: T[]) => void;
  createNewItem: () => T;
  renderItemFields: (item: T, index: number, updateItem: (updatedItem: T) => void) => React.ReactNode;
  getItemTitle?: (item: T, index: number) => string;
  addButtonText?: string;
  emptyStateText?: string;
}

export function EditableItemList<T extends { id: string }>({
  title,
  items = [],
  onUpdateItems,
  createNewItem,
  renderItemFields,
  getItemTitle = (item, idx) => `Item #${idx + 1}`,
  addButtonText = 'Add New Item',
  emptyStateText = 'No items added yet. Click below to add one.',
}: EditableItemListProps<T>) {
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItem = () => {
    const newItem = createNewItem();
    onUpdateItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    const next = [...items];
    next.splice(index, 1);
    onUpdateItems(next);
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-gold-400" />
          {title}
          <span className="text-xs font-mono bg-neutral-800 text-neutral-300 border border-white/10 px-2 py-0.5 rounded-full">
            {items.length} Item{items.length === 1 ? '' : 's'}
          </span>
        </h3>

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          {addButtonText}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-2xl">
          <p className="font-mono text-xs">{emptyStateText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isCollapsed = collapsedMap[item.id] || false;
            return (
              <div
                key={item.id || index}
                className="bg-neutral-950/80 border border-white/10 rounded-2xl p-4 space-y-4 hover:border-brand-gold-500/30 transition-all shadow-lg"
              >
                {/* Header bar for item */}
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div
                    onClick={() => toggleCollapse(item.id)}
                    className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-neutral-200 hover:text-brand-gold-400 transition-colors flex-1 truncate"
                  >
                    <button type="button" className="text-neutral-500">
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-xs text-brand-gold-400/80 uppercase">#{index + 1}</span>
                    <span className="truncate">{getItemTitle(item, index)}</span>
                  </div>

                  {/* Item Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded-lg transition-all cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded-lg transition-all cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer ml-1"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body fields (collapsed toggle) */}
                {!isCollapsed && (
                  <div className="space-y-3 pt-1">
                    {renderItemFields(item, index, (updated) => handleUpdateItem(index, updated))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
