export default function CallBanner() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 overflow-hidden rounded-2xl bg-brand-500 text-white"
    >
      <div className="flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-right">
        <div>
          <h2 className="text-xl font-extrabold">خرید تلفنی از تورینو</h2>
          <p className="mt-1 text-sm text-brand-50">برای راهنمایی و رزرو با ما در تماس باشید</p>
        </div>
        <a
          href="tel:02118400"
          dir="ltr"
          className="rounded-lg bg-white px-6 py-3 text-lg font-bold text-brand-700"
        >
          ۰۲۱-۱۸۴۰
        </a>
      </div>
    </section>
  );
}
