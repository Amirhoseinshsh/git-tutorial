// یک input قابل استفاده مجدد (reusable)
// هر بار فقط label و name و register و error را می‌دهیم
export default function FormInput({ label, name, register, error, type = "text" }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...register(name)} />
      {/* اگر خطا وجود داشت، پیام آن را نشان بده */}
      {error && <span className="error">{error.message}</span>}
    </div>
  );
}
