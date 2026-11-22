const REASONS = [
  {
    icon: '٪',
    title: 'بصرفه ترین قیمت',
    text: 'بصرفه ترین و ارزان ترین قیمت تور را از ما بخواهید.',
  },
  {
    icon: '☎',
    title: 'پشتیبانی',
    text: 'پشتیبانی و همراهی ۲۴ ساعته در تمامی مراحل سفر شما.',
  },
  {
    icon: '♥',
    title: 'رضایت کاربران',
    text: 'رضایت بیش از ۱۰هزار کاربر از تور های ما.',
  },
];

export default function WhyTorino() {
  return (
    <section id="why" className="scroll-mt-20">
      <h2 className="mb-6 text-xl font-bold">چرا تورینو؟</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="card flex items-start gap-4 p-5">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-xl text-brand-700"
            >
              {reason.icon}
            </span>
            <div>
              <h3 className="font-bold">{reason.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{reason.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
