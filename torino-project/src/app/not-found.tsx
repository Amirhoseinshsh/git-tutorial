import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-12 text-center">
      <svg width="180" height="140" viewBox="0 0 180 140" role="img" aria-label="خطای ۴۰۴">
        <rect x="20" y="30" width="140" height="90" rx="16" fill="#19722f" />
        <rect x="32" y="42" width="92" height="66" rx="10" fill="#effaf2" />
        <text x="78" y="86" textAnchor="middle" fontSize="30" fontWeight="700" fill="#19722f">
          404
        </text>
        <circle cx="144" cy="62" r="7" fill="#b4e6c2" />
        <circle cx="144" cy="86" r="7" fill="#b4e6c2" />
        <path d="M70 30 L52 8 M110 30 L128 8" stroke="#19722f" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <h1 className="text-xl font-bold">صفحه مورد نظر یافت نشد!</h1>
      <Link href="/" className="btn-primary bg-brand-100 text-brand-700 hover:bg-brand-200">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
