'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import CanvasEditor from '@/components/Editor/CanvasEditor';
import MultiSleeveList from '@/components/Order/MultiSleeveList';
import EditorSidebar from '@/components/Editor/EditorSidebar';
import EditorSubPanel from '@/components/Editor/EditorSubPanel';
import MobileEditorLayout from '@/components/Mobile/MobileEditorLayout';

import { ShoppingCart, Undo2, Redo2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { orderMeetsPackRequirements, isOrderPackSize, isSleeveMaterial, isValidMaterialForCut } from '@/lib/packOrder';
import { dispatchCanvasAction } from '@/lib/events';

export default function Home() {
  const router = useRouter();
  const {
    packs,
    sleeves,
    activeSleeveId,
    createPack,
  } = useStore();

  const [isCheckingOut] = useState(false);
  const [variantId, setVariantId] = useState<string | null>(null);

  // Read the Shopify variantId + pack config passed via the iframe URL.
  // Auto-create the first pack so the user goes straight into designing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariantId(params.get('variantId'));

    if (packs.length === 0) {
      // count: only 65 or 110 accepted — all else defaults to 65
      const rawCount = parseInt(params.get('count') ?? '65', 10);
      const count = isOrderPackSize(rawCount) ? rawCount : 65;

      // size: Standard or Japanese — all else defaults to Standard
      // We do a case-insensitive check in case Shopify sends "japanese"
      const rawSize = (params.get('size') ?? 'standard').toLowerCase();
      const sleeveType: 'Standard' | 'Japanese' =
        rawSize === 'japanese' ? 'Japanese' : 'Standard';

      // type: must be a valid material and compatible with the sleeve cut
      const rawType = decodeURIComponent(params.get('type') ?? 'standard');
      const material =
        isSleeveMaterial(rawType) && isValidMaterialForCut(rawType, sleeveType)
          ? rawType
          : 'standard';

      createPack({ size: count, sleeveType, material });
    }
  }, []); // intentionally mount-only


  const handleCheckout = () => {
    console.log('[Customizer] Add to Cart button clicked!');
    console.log('[Customizer] Current variantId:', variantId);
    
    if (!variantId) {
      console.warn('[Customizer] No variantId in URL — cannot add to Shopify cart.');
      return;
    }

    console.log('[Customizer] Firing postMessage to parent...');
    // Notify the Shopify parent page to add this variant to the cart.
    // The Shopify liquid listens for this message and calls /cart/add.js.
    window.parent.postMessage(
      { type: 'CUSTOMIZER_ADD_TO_CART', variantId, quantity: 1 },
      '*'
    );
  };

  const handleClose = () => {
    window.parent.postMessage({ type: 'CUSTOMIZER_CLOSE' }, '*');
  };

  const checkoutReady = orderMeetsPackRequirements(packs, sleeves).ok;

  return (
    <main className="h-[100dvh] w-screen bg-background text-foreground flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 sm:h-16 border-b border-border bg-[#181818] flex justify-between items-center px-3 sm:px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleClose}
            className="p-1.5 -ml-2 text-muted-foreground hover:text-white transition-colors flex-shrink-0"
            title="Close Editor"
          >
            <X size={22} />
          </button>
        </div>

        {activeSleeveId && (
          <div className="flex items-center gap-1 bg-black/25 p-1 rounded-lg border border-white/5 shadow-inner">
            <button
              type="button"
              onClick={() => dispatchCanvasAction({ type: 'UNDO' })}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground active:scale-95"
              title="Undo"
              aria-label="Undo"
            >
              <Undo2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => dispatchCanvasAction({ type: 'REDO' })}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground active:scale-95"
              title="Redo"
              aria-label="Redo"
            >
              <Redo2 size={18} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-6 min-w-0">

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || !checkoutReady}
            title={
              checkoutReady
                ? 'Add to cart'
                : 'Every pack needs designs with photos, and each pack’s quantities must match its size'
            }
            className="px-3 sm:px-6 py-2 sm:py-2.5 rounded bg-primary text-black font-bold uppercase tracking-wider text-xs sm:text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            <span className="hidden xs:inline sm:inline">
              {isCheckingOut ? 'Processing…' : 'Add to Cart'}
            </span>
            <span className="xs:hidden sm:hidden">Cart</span>
          </button>
        </div>
      </header>

      {/* Desktop workspace */}
      <div className="hidden lg:flex flex-1 overflow-hidden min-h-0">
        <div className="flex h-full flex-shrink-0">
          <EditorSidebar />
          <EditorSubPanel />
        </div>

        <section className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[#2b2b2b]">
          {activeSleeveId ? (
            <CanvasEditor />
          ) : (
            <div className="flex h-full items-center justify-center px-6">
              <div className="max-w-md text-center text-sm text-muted-foreground">
                {packs.length === 0 ? (
                  <p>
                    Set up your first pack on the right — pick <strong>65 or 110 sleeves</strong> and{' '}
                    <strong>Standard or Japanese</strong>, then start designing. You can add more packs later.
                  </p>
                ) : (
                  <p className="italic">Pick a design on the right to edit it.</p>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="flex w-80 flex-shrink-0 flex-col border-l border-border bg-[#1e1e1e] z-10">
          <div className="flex-shrink-0 border-b border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Designs</h2>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <MultiSleeveList />
          </div>
        </aside>
      </div>

      {/* Mobile workspace — separate flow, no laptop sidebar / 3D / preview grid */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-0 lg:hidden pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <MobileEditorLayout />
      </div>
    </main>
  );
}
