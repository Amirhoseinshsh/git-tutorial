function StatCard({ label, icon, iconClass, value, unit, foot }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon ${iconClass}`}>{icon}</span></div>
      <div className="stat-number">{value}<small>{unit}</small></div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}

function StatsGrid({ total, favoriteCount, dueCount }) {
  return (
    <section className="stats-grid">
      <StatCard label="کل مخاطبان" icon="▦" iconClass="violet" value={total} unit="نفر" foot="همه ارتباطات ذخیره‌شده" />
      <StatCard label="علاقه‌مندی‌ها" icon="☆" iconClass="amber" value={favoriteCount} unit="نفر" foot="دسترسی سریع به افراد مهم" />
      <StatCard label="نیازمند پیگیری" icon="↗" iconClass="mint" value={dueCount} unit="مورد" foot="تاریخ پیگیری امروز یا قبل‌تر" />
    </section>
  );
}

export default StatsGrid;
