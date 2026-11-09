import Modal from "./Modal";

function getConfig({ type, name, isEditing }, selectedCount) {
  switch (type) {
    case "single":
      return {
        symbol: "!",
        title: "حذف این مخاطب؟",
        message: `مخاطب «${name}» حذف خواهد شد. این کار قابل بازگشت نیست.`,
        confirmLabel: "بله، حذف شود",
        danger: true,
      };
    case "bulk":
      return {
        symbol: "!",
        title: "حذف مخاطبان انتخاب‌شده؟",
        message: `قرار است ${selectedCount} مخاطب حذف شوند. این کار قابل بازگشت نیست.`,
        confirmLabel: "بله، حذف شود",
        danger: true,
      };
    case "save":
      return {
        symbol: "?",
        title: isEditing ? "ذخیره تغییرات؟" : "افزودن این مخاطب؟",
        message: isEditing
          ? `تغییرات مخاطب «${name}» ذخیره خواهد شد.`
          : `مخاطب «${name}» به دفترچه اضافه می‌شود.`,
        confirmLabel: isEditing ? "بله، ذخیره شود" : "بله، اضافه شود",
        danger: false,
      };
    case "export":
      return {
        symbol: "?",
        title: "دریافت فایل پشتیبان؟",
        message: "یک فایل JSON از همه مخاطبان دانلود می‌شود.",
        confirmLabel: "بله، دانلود شود",
        danger: false,
      };
    default:
      return null;
  }
}

function ConfirmModal({ confirm, selectedCount, onConfirm, onClose }) {
  const config = getConfig(confirm, selectedCount);
  if (!config) return null;

  return (
    <Modal className="confirm-modal" onClose={onClose}>
      <div className="confirm-symbol">{config.symbol}</div>
      <button className="close-button confirm-close" onClick={onClose}>×</button>
      <h3>{config.title}</h3>
      <p>{config.message}</p>
      <div className="modal-actions">
        <button className="secondary-button" onClick={onClose}>نه، منصرف شدم</button>
        <button className={config.danger ? "delete-button" : "primary-button"} onClick={onConfirm}>
          {config.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
