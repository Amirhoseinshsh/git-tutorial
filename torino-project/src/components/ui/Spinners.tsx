'use client';

import { TailSpin, ThreeDots } from 'react-loader-spinner';

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <TailSpin height="44" width="44" color="#28a745" ariaLabel="در حال بارگذاری" />
    </div>
  );
}

export function ButtonSpinner() {
  return <ThreeDots height="20" width="36" color="#ffffff" ariaLabel="در حال ارسال" />;
}
