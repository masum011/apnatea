import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/contactActions';

export default function WhatsAppButton({
  variant = 'inline',
  label = 'Chat on WhatsApp',
  message,
  className = '',
}) {
  const href = buildWhatsAppUrl(message);

  if (variant === 'floating') {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Apna Tea on WhatsApp"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-5 right-5 z-30 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1F9D55] text-[#FFFDF8] shadow-[0_8px_24px_rgba(31,157,85,0.38)] border border-[#FFFDF8]/25 hover:bg-[#198748] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E59F29] ${className}`}
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#1F9D55] hover:bg-[#198748] text-[#FFFDF8] text-sm font-semibold whitespace-nowrap shrink-0 shadow-[0_6px_18px_rgba(31,157,85,0.28)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E59F29] ${className}`}
    >
      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </motion.a>
  );
}
