/* eslint-disable @next/next/no-img-element -- tiny local logo; must paint before JS */
// CSS-only intro: the logo settles into focus while a gold ring draws around it, then the curtain lifts.
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="relative grid h-48 w-48 place-items-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle className="preloader__ring" cx="100" cy="100" r="96" fill="none" stroke="#cfaa76" strokeWidth="1.5" pathLength="1000" />
        </svg>
        <img src="/images/cafe-nu-badge.png" alt="" width={160} height={160} className="preloader__logo h-40 w-40" />
      </div>
    </div>
  );
}
