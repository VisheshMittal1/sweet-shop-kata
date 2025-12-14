import { useState, useEffect } from "react";
import "./App.css";
import RegisterForm from "./RegisterForm";

const API_BASE_URL = "http://localhost:4000/api";

function App() {
  const [email, setEmail] = useState("test@examplh.com");
  const [password, setPassword] = useState("password123");
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");

  const [sweets, setSweets] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // NEW: register screen toggle
  const [showRegister, setShowRegister] = useState(false);

  // ---------- IMAGE HELPER ----------
  function getSweetImage(s) {
    if (s.imageUrl) return s.imageUrl;

    const name = s.name.toLowerCase();

    if (name.includes("gulab")) return "/images/Gulab jamun.jpg";
    if (name.includes("rasgulla")) return "/images/Rasgulla.jpg";
    if (name.includes("kaju")) return "/images/kaju katli.jpg";
    if (name.includes("rasmalai")) return "/images/Rasmalai.jpg";
    if (name.includes("peda")) return "/images/peda.jpg";
    if (name.includes("soan") || name.includes("son"))
      return "/images/Sona papdi.jpg";
    if (name.includes("modak")) return "/images/modak.jpg";
    if (name.includes("chamcha") || name.includes("chamcham"))
      return "/images/Chamcham.jpg";
    if (name.includes("gajar")) return "/images/Gajar ka halwa.jpg";

    return "/images/default-sweet.jpg";
  }

  // ---------- LOGIN ----------
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }

      setToken(data.token);
    } catch {
      setLoginError("Network error");
    }
  }

  // ---------- REGISTER ----------
  async function handleRegister(e) {
    e.preventDefault();
    setLoginError("");

    const form = e.target;
    const name = form.name.value;
    const regEmail = form.email.value;
    const regPassword = form.password.value;
    const confirm = form.confirm.value;

    if (regPassword !== confirm) {
      setLoginError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: regEmail, password: regPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Registration failed");
        return;
      }

      // direct login after register
      setToken(data.token);
      setEmail(data.user?.email || regEmail);
      setPassword("");
      setShowRegister(false);
    } catch {
      setLoginError("Network error");
    }
  }

  // ---------- LOAD SWEETS ----------
  async function loadSweets(currentToken = token) {
    setLoadError("");

    try {
      const res = await fetch(`${API_BASE_URL}/sweets`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setLoadError(data.error || "Failed to load sweets");
        return;
      }

      setSweets(data);
    } catch {
      setLoadError("Network error");
    }
  }

  useEffect(() => {
    if (token) {
      loadSweets(token);
    }
  }, [token]);

  // ---------- PURCHASE ----------
  async function purchaseSweet(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Purchase failed");
        return;
      }

      let purchasedSweet;
      setSweets((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            purchasedSweet = { ...s, quantity: s.quantity - 1 };
            return purchasedSweet;
          }
          return s;
        })
      );

      setCartItems((prevCart) => {
        const existing = prevCart.find((item) => item.id === id);
        if (existing) {
          return prevCart.map((item) =>
            item.id === id
              ? { ...item, cartQty: item.cartQty + 1 }
              : item
          );
        }
        const base = purchasedSweet || sweets.find((s) => s.id === id);
        if (!base) return prevCart;

        return [
          ...prevCart,
          {
            id: base.id,
            name: base.name,
            price: base.price,
            cartQty: 1,
          },
        ];
      });

      setIsCartOpen(true);
    } catch {
      alert("Network error");
    }
  }

  // ---------- CART DECREASE ----------
  function decreaseCartItem(id) {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, cartQty: item.cartQty - 1 }
            : item
        )
        .filter((item) => item.cartQty > 0)
    );
  }

  const filteredSweets = sweets.filter((s) =>
    `${s.name} ${s.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.cartQty,
    0
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );

  // ---------- AUTH PAGE ----------
  if (!token) {
    // agar register screen dikhani hai
    if (showRegister) {
      return (
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-left">
              <h1>Join Sweet Shop</h1>
              <p>Create your account to start buying your favourite sweets.</p>
            </div>

            <div className="auth-right">
              <h2>Register</h2>
              <form onSubmit={handleRegister} className="login-form">
                <label>
                  Name
                  <input name="name" type="text" required />
                </label>

                <label>
                  Email
                  <input name="email" type="email" required />
                </label>

                <label>
                  Password
                  <input name="password" type="password" required />
                </label>

                <label>
                  Confirm password
                  <input name="confirm" type="password" required />
                </label>

                <button className="primary-btn full-width" type="submit">
                  Create account
                </button>

                {loginError && <p className="error-text">{loginError}</p>}
              </form>

              <div className="auth-footer">
                <span>Already have an account?</span>
                <button
                  className="secondary-btn small"
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setLoginError("");
                  }}
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // normal login screen
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <h1>Welcome to Sweet Shop</h1>
            <p>
              Login or create an account to browse and purchase your favourite
              sweets with real-time stock updates.
            </p>
          </div>

          <div className="auth-right">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button className="primary-btn full-width" type="submit">
                Login
              </button>

              {loginError && <p className="error-text">{loginError}</p>}
            </form>

            <div className="auth-footer">
              <span>New here?</span>
              <button
                className="secondary-btn small"
                type="button"
                onClick={() => {
                  setShowRegister(true);
                  setLoginError("");
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="page">
      <header className="navbar">
        <div className="nav-left">
          <div className="logo-circle">SS</div>
          <span className="logo-text">Sweet Shop</span>
        </div>

        <div className="nav-center">
          <input
            className="nav-search"
            placeholder="Search for sweets, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nav-right">
          <button className="nav-link">Login</button>

          <button
            className="nav-link"
            type="button"
            onClick={() => setIsCartOpen((open) => !open)}
          >
            Cart ({cartCount})
          </button>

          <div className="profile-chip">
            <span className="avatar">{email[0]?.toUpperCase()}</span>
            <span className="profile-email">{email}</span>
          </div>
          <button
            className="nav-link"
            onClick={() => {
              setToken("");
              setSweets([]);
              setCartItems([]);
              setIsCartOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="banner">
        <div className="banner-left">
          <h1>End of Season Sweet Sale</h1>
          <p>Get up to 60% off on laddoos, barfis, chocolates and more.</p>
          <button className="primary-btn" onClick={() => loadSweets()}>
            Shop now
          </button>
        </div>
        <div className="banner-right">
          <div className="banner-circle banner-circle-1" />
          <div className="banner-circle banner-circle-2" />
          <div className="banner-circle banner-circle-3" />
        </div>
      </section>

      <section className="category-row">
        <button className="category-pill">All sweets</button>
        <button className="category-pill">Candy</button>
        <button className="category-pill">Chocolate</button>
        <button className="category-pill">Cake & bakery</button>
        <button className="category-pill">Sugar‑free</button>
      </section>

      <div className="main-with-cart">
        <main className="sweets-section">
          <div className="sweets-header">
            <h2>Sweets</h2>
          </div>

          {loadError && <p className="error-text">{loadError}</p>}

          <div className="cards-grid">
            {filteredSweets.map((s) => (
              <div key={s.id} className="sweet-card">
                <div className="sweet-badge">{s.category}</div>

                <div className="sweet-image">
                  <img src={getSweetImage(s)} alt={s.name} />
                </div>

                <h3 className="sweet-name">{s.name}</h3>
                <p className="sweet-price">₹{s.price}</p>
                <p className="sweet-qty">
                  Qty:{" "}
                  <span className={s.quantity === 0 ? "qty-zero" : "qty-ok"}>
                    {s.quantity}
                  </span>
                </p>
                <button
                  className="primary-btn full-width"
                  onClick={() => purchaseSweet(s.id)}
                  disabled={s.quantity === 0}
                >
                  {s.quantity === 0 ? "Out of stock" : "Purchase"}
                </button>
              </div>
            ))}

            {filteredSweets.length === 0 && !loadError && (
              <p className="muted">
                No sweets found. Try a different search.
              </p>
            )}
          </div>
        </main>

        {isCartOpen && (
          <aside className="cart-card">
            <div className="cart-header-row">
              <h3>Cart</h3>
              <button
                className="cart-close-btn"
                type="button"
                onClick={() => setIsCartOpen(false)}
              >
                ✕
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p className="muted">Cart is empty.</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cartItems.map((item) => (
                    <li key={item.id} className="cart-row">
                      <span className="cart-name">{item.name}</span>

                      <div className="cart-row-actions">
                        <button
                          className="cart-qty-btn"
                          onClick={() => decreaseCartItem(item.id)}
                        >
                          -
                        </button>
                        <span className="cart-qty-text">{item.cartQty}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => purchaseSweet(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-line">
                        ₹{item.price * item.cartQty}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="cart-total">
                  <span>Total:</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  className="primary-btn cart-pay-btn"
                  type="button"
                  onClick={() => {
                    if (!cartTotal) return;
                    alert(`Proceeding to payment of ₹${cartTotal}`);
                  }}
                >
                  Proceed to payment
                </button>
              </>
            )}
          </aside>
        )}
      </div>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <h4>Sweet Shop</h4>
            <p>Bringing you the sweetest treats, fresh every day.</p>
            <p className="footer-subtext">
              Laddoos, barfis, chocolates, cakes and more delivered with love.
            </p>
          </div>

          <div className="footer-col">
            <h5>About</h5>
            <a href="#about">About us</a>
            <a href="#careers">Careers</a>
            <a href="#blog">Sweet stories</a>
          </div>

          <div className="footer-col">
            <h5>Help</h5>
            <a href="#payments">Payments</a>
            <a href="#shipping">Shipping</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <a href="#contact">Contact us</a>
            <a href="#support">Support</a>
            <a href="#whatsapp">WhatsApp chat</a>
          </div>

          <div className="footer-col footer-social">
            <h5>Follow us</h5>
            <div className="footer-social-row">
              <span>🐦</span>
              <span>📸</span>
              <span>📘</span>
              <span>▶️</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="footer-logo">SS</span>
            <span>© {new Date().getFullYear()} Sweet Shop</span>
          </div>
          <div className="footer-bottom-right">
            <span>Made with React &amp; Node.js</span>
            <span className="footer-divider">•</span>
            <span>India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

