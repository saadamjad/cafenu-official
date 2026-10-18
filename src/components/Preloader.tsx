// CSS-only intro: draws the wordmark, then wipes up. Never blocks content without JS.
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="flex flex-col items-center gap-6">
        <svg className="preloader__bean h-12 w-12" viewBox="0 0 64 64">
          <ellipse cx="32" cy="32" rx="14" ry="20" fill="#d9b98c" />
          <path d="M32 12c-6 7 6 13 0 20s6 13 0 20" fill="none" stroke="#1a1411" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg className="preloader__word w-64" viewBox="0 0 320 80">
          <text
            x="160"
            y="58"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="62"
            fill="none"
            stroke="#f7f1e8"
            strokeWidth="1.4"
          >
            Cafe Nu
          </text>
        </svg>
      </div>
    </div>
  );
}
