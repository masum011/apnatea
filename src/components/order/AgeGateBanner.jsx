import { ShieldAlert } from 'lucide-react';
import { ORDER_CONFIG } from '../../data/orderConfig';
import Button from '../Button';

export default function AgeGateBanner({ onConfirmAge, onReturnToMenu }) {
  return (
    <div className="max-w-xl mx-auto my-6 rounded-2xl bg-[#321B13] text-[#FFFDF8] border border-[#C88B36]/35 p-6 sm:p-8 shadow-xl text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-[#A83224] text-[#FFFDF8] flex items-center justify-center mb-4">
        <ShieldAlert className="w-7 h-7" aria-hidden="true" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E59F29]">
        Legally Restricted Category · {ORDER_CONFIG.legal.minimumAge}+ Only
      </p>

      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFDF8] mt-1.5">
        Age Verification Required
      </h3>

      <p className="mt-3 text-sm text-[#F6EBDD]/85 leading-relaxed">
        {ORDER_CONFIG.legal.smokingWarning}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={onConfirmAge} className="w-full sm:w-auto">
          <span>I Confirm I Am 18+ Years Old</span>
        </Button>

        <Button
          variant="outlineLight"
          size="md"
          onClick={onReturnToMenu}
          className="w-full sm:w-auto"
        >
          <span>Return to Food &amp; Drinks</span>
        </Button>
      </div>
    </div>
  );
}
