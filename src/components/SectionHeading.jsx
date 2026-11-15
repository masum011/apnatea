export default function SectionHeading({
  eyebrow,
  title,
  accentTitle,
  subtitle,
  align = 'center',
  dark = false,
  showLines = true,
}) {
  const isCentered = align === 'center';
  const titleColor = dark ? 'text-[#FFFDF8]' : 'text-[#321B13]';
  const accentColor = dark ? 'text-[#E59F29]' : 'text-[#6B3D25]';
  const eyebrowColor = dark ? 'text-[#E59F29]' : 'text-[#C88B36]';
  const subtitleColor = dark ? 'text-[#F6EBDD]/80' : 'text-[#6B3D25]/85';
  const lineColor = dark ? 'bg-[#C88B36]/35' : 'bg-[#6B3D25]/20';

  return (
    <div className={isCentered ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold tracking-[0.18em] uppercase mb-2.5 ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}

      <div
        className={`flex items-center gap-5 ${
          isCentered ? 'justify-center' : 'justify-start'
        }`}
      >
        {showLines && isCentered && (
          <span className={`hidden sm:block h-px w-14 md:w-24 ${lineColor}`} aria-hidden="true" />
        )}

        <h2
          className={`font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold leading-tight tracking-tight ${titleColor}`}
        >
          {title}{' '}
          {accentTitle && <span className={accentColor}>{accentTitle}</span>}
        </h2>

        {showLines && isCentered && (
          <span className={`hidden sm:block h-px w-14 md:w-24 ${lineColor}`} aria-hidden="true" />
        )}
      </div>

      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
