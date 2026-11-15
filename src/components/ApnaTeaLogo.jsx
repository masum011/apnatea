export default function ApnaTeaLogo({ showTagline = false, size = 'md' }) {
  const cupSize = size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${cupSize} shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M24 17C24 14.5 26 13.5 26 11"
          stroke="#F6EBDD"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M32 15C32 12 34.5 11 34.5 8"
          stroke="#E59F29"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M40 17C40 14.5 42 13.5 42 11"
          stroke="#F6EBDD"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M17 24H43V35C43 41.6274 37.6274 47 31 47H29C22.3726 47 17 41.6274 17 35V24Z"
          fill="#A83224"
          stroke="#FFFDF8"
          strokeWidth="2.2"
        />
        <path
          d="M43 27.5H46.5C48.9853 27.5 51 29.5147 51 32C51 34.4853 48.9853 36.5 46.5 36.5H43"
          stroke="#FFFDF8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <ellipse cx="30" cy="24.5" rx="12" ry="2.6" fill="#C88B36" />
        <path
          d="M13 49.5C20 53 40 53 47 49.5"
          stroke="#FFFDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-tight ${titleSize} text-[#FFFDF8]`}>
          Apna <span className="text-[#E59F29]">Tea</span>
          <sup className="text-[0.55em] font-sans font-semibold text-[#C88B36] ml-0.5">™</sup>
        </span>
        {showTagline && (
          <span className="text-[11px] font-sans font-medium tracking-wider text-[#F6EBDD]/75 mt-1">
            Chai · Snacks · More
          </span>
        )}
      </span>
    </span>
  );
}
