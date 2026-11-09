function PageHeader({ title, onAdd }) {
  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">فضای کاری <span>/</span> <b>{title}</b></div>
        <div className="top-actions">
          <span className="today-pill"><i></i> فضای شخصی</span>
          <button className="avatar-small">م</button>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <div className="eyebrow">مرکز ارتباطات تو</div>
          <h1>ارتباطاتت، <span>مرتب و آماده.</span></h1>
          <p className="subtitle">آدم‌های مهمت را یک‌جا نگه دار و پیگیری‌های بعدی را از دست نده.</p>
        </div>
        <button className="primary-button" onClick={onAdd}><span>＋</span> افزودن مخاطب</button>
      </section>
    </>
  );
}

export default PageHeader;
