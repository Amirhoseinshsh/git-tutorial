function BulkBar({ count, onDelete, onCancel }) {
  if (count === 0) return null;
  return (
    <div className="bulk-bar">
      <span>{count} مخاطب انتخاب شده</span>
      <button onClick={onDelete}>حذف انتخاب‌شده‌ها</button>
      <button className="cancel-selection" onClick={onCancel}>لغو انتخاب</button>
    </div>
  );
}

export default BulkBar;
