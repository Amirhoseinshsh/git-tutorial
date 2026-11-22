'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center">
      <p className="text-5xl" aria-hidden="true">
        🔌
      </p>
      <h1 className="text-xl font-bold">اتصال با سرور برقرار نیست!</h1>
      <p className="text-sm text-slate-500">لطفا بعدا دوباره امتحان کنید.</p>
      <button type="button" onClick={reset} className="btn-outline">
        تلاش مجدد
      </button>
    </div>
  );
}
