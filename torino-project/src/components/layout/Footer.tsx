import Link from 'next/link';

const COMPANY_LINKS = ['درباره ما', 'تماس با ما', 'چرا تورینو', 'بیمه مسافرتی'];
const SUPPORT_LINKS = ['پشتیبانی آنلاین', 'راهنمای خرید', 'راهنمای استرداد', 'پرسش و پاسخ'];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-8 border-b border-dashed border-slate-300 pb-8 md:grid-cols-3">
          <div>
            <h2 className="mb-4 text-lg font-bold">تورینو</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {COMPANY_LINKS.map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-brand-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold">خدمات مشتریان</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {SUPPORT_LINKS.map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-brand-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="flex items-center gap-2 text-xl font-extrabold text-brand-600">
              <span aria-hidden="true">✈</span>
              تورینو
            </p>
            <p className="mt-3 text-sm text-slate-600">
              تلفن پشتیبانی: <span dir="ltr">۰۲۱-۸۵۷۴</span>
            </p>
          </div>
        </div>
        <p className="pt-6 text-center text-xs text-slate-500">
          کلیه حقوق این وب سایت متعلق به تورینو میباشد.
        </p>
      </div>
    </footer>
  );
}
