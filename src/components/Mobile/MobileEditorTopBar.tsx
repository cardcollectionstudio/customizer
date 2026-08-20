'use client';

import { useStore } from '@/store/useStore';
import { designsInPack, totalSleevesAssigned } from '@/lib/packOrder';

export default function MobileEditorTopBar() {
  const { packs, sleeves, activeSleeveId } = useStore();

  const activeDesign = sleeves.find((s) => s.id === activeSleeveId);
  const pack = activeDesign
    ? packs.find((p) => p.id === activeDesign.packId)
    : packs[0];

  if (!pack) return null;

  const packDesigns = designsInPack(sleeves, pack.id);
  const assigned = totalSleevesAssigned(packDesigns);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-[#181818] px-3 py-2 lg:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{pack.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {pack.sleeveType === 'Japanese' ? 'Japanese' : 'Standard'} · {pack.size} cap
        </p>
      </div>
      <p className="shrink-0 text-xs font-mono tabular-nums text-primary">
        {assigned}/{pack.size}
      </p>

    </div>
  );
}
