import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Coffee, Minus, Plus, ShieldAlert, ShoppingBag } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { ProductCardSkeleton } from '../Skeletons';
import { formatCurrency } from '../../utils/orderUtils';

function ProductCard({ product, quantityInCart, onAdd, onUpdateQty }) {
  const isRestrictedNoImage = !product.image && !product.webpSrc;
  const imageSource = product.webpSrc || product.image;
  const [loadedImage, setLoadedImage] = useState('');
  const imageReady = !imageSource || loadedImage === imageSource;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={product.available ? { y: -3 } : undefined}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-busy={!imageReady}
      inert={!imageReady}
      className={`relative rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/15 shadow-[0_6px_20px_rgba(50,27,19,0.06)] overflow-hidden flex flex-col ${
        !product.available ? 'opacity-80' : ''
      }`}
    >
      {!imageReady && (
        <div className="absolute inset-0 z-10">
          <ProductCardSkeleton className="h-full" />
        </div>
      )}
      {/* 4:3 Image / Fallback Container */}
      <div className="p-3 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#321B13]">
          {!isRestrictedNoImage ? (
            <OptimizedImage
              src={product.image}
              webpSrc={product.webpSrc}
              webpSrcSet={product.webpSrcSet}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 29vw"
              width={product.width || 800}
              height={product.height || 600}
              alt={product.alt}
              onReady={() => setLoadedImage(imageSource)}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                product.available ? 'hover:scale-105' : 'grayscale-[40%]'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[radial-gradient(circle_at_top,rgba(200,139,54,0.22),#22110B)]">
              {product.restricted ? (
                <>
                  <div className="w-11 h-11 rounded-full border border-[#E59F29]/50 bg-[#321B13] text-[#E59F29] flex items-center justify-center mb-2">
                    <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E59F29]">
                    18+ Counter Only
                  </p>
                  <p className="text-xs text-[#F6EBDD]/75 mt-1 max-w-[180px]">
                    {product.name}
                  </p>
                </>
              ) : (
                <>
                  <Coffee className="w-8 h-8 text-[#E59F29] mb-2" aria-hidden="true" />
                  <p className="text-xs font-medium text-[#F6EBDD]/80">{product.name}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#6B3D25]/80">
            <span className="truncate">
              {product.categoryLabel} · {product.unit}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold whitespace-nowrap shrink-0 ${
                product.available ? 'text-[#1F9D55]' : 'text-[#A83224]'
              }`}
            >
              {product.available ? (
                <>
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>Available</span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-[#321B13] mt-1.5 leading-snug">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-[#6B3D25]/85 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#6B3D25]/12 flex items-center justify-between gap-3">
          <div className="tabular-nums">
            <span className="text-lg font-bold text-[#321B13]">
              {formatCurrency(product.price)}
            </span>
          </div>

          {!product.available ? (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-full bg-[#F6EBDD] text-[#6B3D25]/60 text-xs font-semibold border border-[#6B3D25]/15 cursor-not-allowed whitespace-nowrap shrink-0"
            >
              Unavailable
            </button>
          ) : quantityInCart > 0 ? (
            <div className="inline-flex items-center rounded-full bg-[#321B13] text-[#FFFDF8] p-1 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, quantityInCart - 1)}
                aria-label={`Decrease quantity of ${product.name}`}
                className="w-7 h-7 rounded-full bg-[#4A291D] hover:bg-[#6B3D25] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold tabular-nums min-w-[18px] text-center">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, quantityInCart + 1)}
                aria-label={`Increase quantity of ${product.name}`}
                className="w-7 h-7 rounded-full bg-[#E59F29] text-[#22110B] hover:bg-[#f0ad3a] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onAdd(product)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E59F29] hover:bg-[#f0ad3a] text-[#22110B] text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321B13]"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add to Cart</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
