import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3000";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  // اتصال به بک‌اند
  const api = useMemo(() => {
    return axios.create({
      baseURL: API,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    });
  }, [token]);

  // ورود مدیر
  async function login(e) {
    e.preventDefault();
    setError("");
localStorage.removeItem("token");
setToken("");
    try {
      const response = await axios.post(
        `${API}/auth/login`,
        {
          username,
          password
        }
      );

      const data = response.data || {};

      const newToken =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.data?.token ||
        data.data?.accessToken ||
        data.data?.access_token;

      if (!newToken) {
        setError("توکن ورود در پاسخ سرور پیدا نشد.");
        return;
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || "ورود ناموفق بود."
      );
    }
  }

  // دریافت محصولات
  async function loadProducts() {
    try {
      setLoading(true);

      const response = await api.get("/products");
      const data = response.data;

      let result = [];

      if (Array.isArray(data)) {
        result = data;
      } else if (Array.isArray(data?.data)) {
        result = data.data;
      } else if (Array.isArray(data?.products)) {
        result = data.products;
      } else if (Array.isArray(data?.data?.products)) {
        result = data.data.products;
      }

      setProducts(result);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "دریافت محصولات ناموفق بود."
      );

    } finally {
      setLoading(false);
    }
  }

  // دریافت خودکار محصولات پس از ورود
  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  // پاک کردن فرم
  function resetForm() {
    setForm({
      name: "",
      price: "",
      quantity: ""
    });

    setEditingId(null);
  }

  // افزودن و ویرایش محصول
  async function saveProduct(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !name ||
      form.price === "" ||
      form.quantity === ""
    ) {
      setError("لطفاً تمام فیلدها را تکمیل کن.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      !Number.isInteger(quantity) ||
      price < 0 ||
      quantity < 0
    ) {
      setError("قیمت و موجودی باید عدد معتبر و غیرمنفی باشند.");
      return;
    }

    const payload = {
      name,
      price,
      quantity
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await api.put(
          `${API}/products/${editingId}`,
          payload
        );
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      await loadProducts();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "ذخیره محصول ناموفق بود."
      );

    } finally {
      setSaving(false);
    }
  }

  // انتخاب محصول برای ویرایش
  function editProduct(product) {
    const id = product.id ?? product._id;

    if (id === undefined || id === null) {
      setError("شناسه محصول پیدا نشد.");
      return;
    }

    setEditingId(id);
    setForm({
      name: product.name || "",
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? "")
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // حذف محصول
  async function deleteProduct(id) {
    const confirmed = window.confirm(
      "آیا از حذف این محصول مطمئنی؟"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      await loadProducts();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "حذف محصول ناموفق بود."
      );
    }
  }

  // خروج مدیر
  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setProducts([]);
    setError("");
    resetForm();
  }

  // جست‌وجوی محصولات
  const filteredProducts = products.filter((product) =>
    String(product.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );
  // صفحه‌بندی
const PAGE_SIZE = 5;
const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
const pagedProducts = filteredProducts.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);

  // مجموع موجودی
  const totalQuantity = products.reduce(
    (sum, product) =>
      sum + Number(product.quantity || 0),
    0
  );

  // صفحه ورود
  if (!token) {
    return (
      <main className="login-page" dir="rtl">
        <form
          className="login-card"
          onSubmit={login}
        >
          <h1>ورود مدیر</h1>

          <p>پنل مدیریت انبار</p>

          <input
            type="text"
            placeholder="نام کاربری"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="error">{error}</p>
          )}

          <button type="submit">
            ورود به پنل
          </button>
        </form>
      </main>
    );
  }

  // داشبورد
  return (
    <main className="dashboard" dir="rtl">

      <header className="topbar">
        <div>
          <h1>مدیریت محصولات</h1>
          <p>پنل مدیریت انبار</p>
        </div>

        <button
          className="logout"
          onClick={logout}
        >
          خروج از حساب
        </button>
      </header>

      {/* آمار محصولات */}
      <section className="stats">

        <div className="stat-card">
          <span>تعداد محصولات</span>

          <strong>
            {products.length.toLocaleString("fa-IR")}
          </strong>
        </div>

        <div className="stat-card">
          <span>مجموع موجودی</span>

          <strong>
            {totalQuantity.toLocaleString("fa-IR")}
          </strong>
        </div>

      </section>

      {/* فرم افزودن و ویرایش */}
      <section className="panel">

        <h2>
          {editingId !== null
            ? "ویرایش محصول"
            : "افزودن محصول جدید"}
        </h2>

        <form
          className="product-form"
          onSubmit={saveProduct}
        >

          <input
            type="text"
            placeholder="نام محصول"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            required
          />

          <input
            type="number"
            min="0"
            step="any"
            placeholder="قیمت"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value
              })
            }
            required
          />

          <input
            type="number"
            min="0"
            step="1"
            placeholder="تعداد موجودی"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value
              })
            }
            required
          /><button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "در حال ذخیره..."
              : editingId !== null
                ? "ثبت تغییرات"
                : "افزودن محصول"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="cancel"
              onClick={resetForm}
            >
              انصراف
            </button>
          )}

        </form>
      </section>

      {/* فهرست محصولات */}
      <section className="panel">

        <div className="list-heading">
          <h2>فهرست محصولات</h2>

          <input
            className="search"
            type="search"
            placeholder="جست‌وجوی محصول..."
            value={search}
            onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
              
            
          />
        </div>

        {error && (
          <p className="error">{error}</p>
        )}

        {loading ? (
          <p>در حال دریافت اطلاعات...</p>
        ) : (
          <div className="table-wrap">

            <table>
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>نام محصول</th>
                  <th>قیمت</th>
                  <th>موجودی</th>
                  <th>عملیات</th>
                </tr>
              </thead>

              <tbody>

                {pagedProducts.map((product, index) => {
                  const id = product.id ?? product._id;

                  return (
                    <tr key={id ?? index}>

                      <td>{id ?? "-"}</td>

                      <td>{product.name || "-"}</td>

                      <td>
                        {Number(
                          product.price || 0
                        ).toLocaleString("fa-IR")}
                      </td>

                      <td>
                        {Number(
                          product.quantity || 0
                        ).toLocaleString("fa-IR")}
                      </td>

                      <td>
                        <button
                          className="edit"
                          onClick={() =>
                            editProduct(product)
                          }
                        >
                          ویرایش
                        </button>

                        <button
                          className="delete"
                          disabled={
                            id === undefined || id === null
                          }
                          onClick={() =>
                            deleteProduct(id)
                          }
                        >
                          حذف
                        </button>
                      </td>

                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      محصولی پیدا نشد.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
            <div className="pagination">
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      type="button"
      className={page === currentPage ? "page-btn active" : "page-btn"}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </button>
  ))}
</div>

          </div>
        )}

      </section>

    </main>
  );
}

export default App;