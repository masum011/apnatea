import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-[#E59F29] text-[#22110B] hover:bg-[#f0ad3a] shadow-[0_6px_20px_rgba(229,159,41,0.28)] border border-[#E59F29]',
  outlineLight:
    'bg-transparent text-[#FFFDF8] border border-[#F6EBDD]/45 hover:border-[#E59F29] hover:bg-[#FFFDF8]/8',
  outlineDark:
    'bg-[#FFFDF8] text-[#321B13] border border-[#6B3D25]/25 hover:border-[#6B3D25] hover:bg-[#FBF5EC]',
  whatsapp:
    'bg-[#1F9D55] text-[#FFFDF8] hover:bg-[#198748] border border-[#1F9D55] shadow-[0_6px_18px_rgba(31,157,85,0.25)]',
  espresso:
    'bg-[#321B13] text-[#FFFDF8] hover:bg-[#44261B] border border-[#321B13]',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm md:text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  onClick,
  type = 'button',
  form,
  className = '',
  ariaLabel,
  disabled = false,
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E59F29] disabled:opacity-55 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        whileHover={{ y: -1.5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={baseClasses}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { y: -1.5 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
}
