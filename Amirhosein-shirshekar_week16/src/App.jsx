import CityInput from "./components/CityInput";

export default function App() {
  return (
    <main className="page">
      <h1>🏙️ City Suggest</h1>
      <p className="sub">
        شروع به تایپ کنید؛ نزدیک‌ترین شهر به املای شما پیشنهاد می‌شود
        (حساس به حروف کوچک و بزرگ).
      </p>
      <CityInput />
    </main>
  );
}
