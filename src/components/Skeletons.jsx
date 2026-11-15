export function ProductCardSkeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/12 shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="p-3 pb-0">
        <div className="aspect-[4/3] w-full rounded-xl bg-[#EADCCB] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 w-28 rounded bg-[#EADCCB] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
          <div className="h-3 w-16 rounded bg-[#EADCCB] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>

        <div className="h-5 w-3/4 rounded bg-[#E4D3BE] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-[#EADCCB] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
          <div className="h-3 w-2/3 rounded bg-[#EADCCB] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>

        <div className="pt-3 border-t border-[#6B3D25]/10 flex items-center justify-between">
          <div className="h-6 w-12 rounded bg-[#E4D3BE] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
          <div className="h-9 w-28 rounded-full bg-[#E4D3BE] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SectionSkeleton({ dark = false }) {
  const bg = dark ? 'bg-[#321B13]' : 'bg-[#F6EBDD]';
  const blockBg = dark ? 'bg-[#46271C]' : 'bg-[#EADCCB]';

  return (
    <div className={`${bg} py-16 sm:py-20`} aria-busy="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-md mx-auto space-y-3">
          <div className={`h-3 w-24 mx-auto rounded ${blockBg} overflow-hidden relative`}>
            <div className="skeleton-shimmer w-full h-full" />
          </div>
          <div className={`h-8 w-3/4 mx-auto rounded ${blockBg} overflow-hidden relative`}>
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-60 rounded-2xl ${blockBg} overflow-hidden relative`}>
              <div className="skeleton-shimmer w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6EBDD] pt-16 md:pt-20 pb-16" aria-busy="true">
      <div className="bg-[#321B13] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-4 w-44 rounded bg-[#46271C] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
          <div className="h-10 w-72 rounded bg-[#46271C] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/12 p-3.5 flex items-center justify-between gap-3"
        >
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 rounded bg-[#EADCCB] overflow-hidden relative">
              <div className="skeleton-shimmer w-full h-full" />
            </div>
            <div className="h-4 w-40 rounded bg-[#E4D3BE] overflow-hidden relative">
              <div className="skeleton-shimmer w-full h-full" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-full bg-[#EADCCB] overflow-hidden relative">
            <div className="skeleton-shimmer w-full h-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckoutProcessingSkeleton() {
  return (
    <div className="py-10 px-4 text-center space-y-5" aria-busy="true">
      <div className="w-14 h-14 mx-auto rounded-full bg-[#EADCCB] overflow-hidden relative">
        <div className="skeleton-shimmer w-full h-full" />
      </div>
      <div className="space-y-2 max-w-xs mx-auto">
        <div className="h-5 w-48 mx-auto rounded bg-[#E4D3BE] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
        <div className="h-3 w-64 mx-auto rounded bg-[#EADCCB] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      </div>
      <div className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/12 p-4 space-y-2.5">
        <div className="h-3 w-full rounded bg-[#EADCCB] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
        <div className="h-3 w-5/6 rounded bg-[#EADCCB] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
        <div className="h-4 w-1/2 rounded bg-[#E4D3BE] overflow-hidden relative">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      </div>
    </div>
  );
}
