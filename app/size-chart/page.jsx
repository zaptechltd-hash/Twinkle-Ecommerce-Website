// "use client";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import Navbar from "../components/Header";
// import { useState } from "react";
// import { removeFromCart, login, logout } from "../store/index";
// import Footer from "../components/Footer";
// import CartSidebar from "../components/CartSidebar";
// import WishlistSidebar from "../components/WishlistSidebar";
// import AuthModal from "../components/AuthModal";
// import { removeFromWishlist, addToCart } from "../store/index";
// import useAuthService from "../services/auth/index";
// import { toast, ToastContainer } from "react-toastify";
// import {
//   setAccessToken,
//   setRefreshToken,
//   getRefreshToken,
//   clearTokens,
// } from "../utils/token";
// import "react-toastify/dist/ReactToastify.css";

// const topChart = {
//   label: "Top / Shirt",
//   note: "All measurements in inches",
//   headers: ["Size", "Length", "Width", "Sleeve"],
//   rows: [
//     { size: "S", values: ["27", "20", "20"] },
//     { size: "M", values: ["28", "23", "21"] },
//     { size: "L", values: ["29", "25", "22"] },
//   ],
// };

// const bottomChart = {
//   label: "Bottom / Trouser",
//   note: "All measurements in inches",
//   headers: ["Size", "Length", "Hip", "Crotch"],
//   rows: [
//     { size: "S", values: ["37", "48", "15.5"] },
//     { size: "M", values: ["38", "52", "15.5"] },
//     { size: "L", values: ["39", "56", "16"] },
//   ],
// };

// const tips = [
//   {
//     num: "01",
//     title: "How to Measure",
//     body: "Use a soft measuring tape and measure over light clothing or directly on the body for the most accurate fit. Keep the tape parallel to the floor.",
//   },
//   {
//     num: "02",
//     title: "Between Sizes?",
//     body: "If you fall between two sizes, we recommend sizing up for a relaxed, comfortable fit — especially for nightwear and loungewear.",
//   },
//   {
//     num: "03",
//     title: "Fabric & Fit",
//     body: "Our nightwear is designed with ease of movement in mind. Measurements refer to garment dimensions, not body measurements.",
//   },
// ];

// export default function SizeChartPage() {
//   const dispatch = useAppDispatch();
//   const cart = useAppSelector((s) => s.cart);
//   const wishlist = useAppSelector((s) => s.wishlist);
//   const user = useAppSelector((s) => s.auth);
//   const settings = useAppSelector((s) => s.settings);
//   const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

//   const { customerLogin, customerRegister, customerLogout } = useAuthService();

//   const [cartOpen, setCartOpen] = useState(false);
//   const [wishlistOpen, setWishlistOpen] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);

//   const handleLogin = async (email, password) => {
//     const data = await customerLogin({ email, password });
//     setAccessToken(data.accessToken);
//     setRefreshToken(data.refreshToken);
//     toast.success("Welcome back!");
//     return { id: data.user.id, email: data.user.email, name: email.split("@")[0] };
//   };

//   const handleRegister = async (name, email, password, phoneNumber) => {
//     const data = await customerRegister({ name, email, password, phone: phoneNumber });
//     setAccessToken(data.accessToken);
//     setRefreshToken(data.refreshToken);
//     toast.success("Account created successfully!");
//     return { id: data.user.id, email: data.user.email, name };
//   };

//   const handleLogout = async () => {
//     const refreshToken = getRefreshToken();
//     try {
//       await customerLogout(refreshToken);
//     } finally {
//       clearTokens();
//       dispatch(logout());
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#EFEBE2" }} className="min-h-screen">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

//         .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .f1 { animation: fadeUp 1.1s ease 0.1s both; }
//         .f2 { animation: fadeUp 1.1s ease 0.3s both; }
//         .f3 { animation: fadeUp 1.1s ease 0.55s both; }
//         .f4 { animation: fadeUp 1.1s ease 0.75s both; }

//         .rule { height: 0.5px; width: 100%; background-color: rgba(180,165,145,0.35); }

//         .section-divider {
//           height: 0.5px;
//           background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
//         }

//         /* ── SIZE TABLE ── */
//         .size-table-wrap {
//           border: 0.5px solid rgba(180,165,145,0.45);
//           overflow: hidden;
//         }

//         .size-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .size-table thead tr {
//           border-bottom: 0.5px solid rgba(180,165,145,0.45);
//         }

//         .size-table thead th {
//           padding: 1.1rem 1.5rem;
//           font-family: 'Cormorant Garamond', Georgia, serif;
//           font-size: 14px;
//           font-style: italic;
//           font-weight: 400;
//           color: #9e8e82;
//           text-align: center;
//           letter-spacing: 0.04em;
//           border-right: 0.5px solid rgba(180,165,145,0.3);
//         }
//         .size-table thead th:first-child { text-align: left; }
//         .size-table thead th:last-child { border-right: none; }

//         .size-table tbody tr {
//           border-bottom: 0.5px solid rgba(180,165,145,0.18);
//           transition: background 0.2s;
//         }
//         .size-table tbody tr:last-child { border-bottom: none; }
//         .size-table tbody tr:hover { background: rgba(180,165,145,0.07); }

//         .size-table tbody td {
//           padding: 1.35rem 1.5rem;
//           font-family: 'Cormorant Garamond', Georgia, serif;
//           font-size: 18px;
//           font-weight: 400;
//           color: #2c2520;
//           text-align: center;
//           border-right: 0.5px solid rgba(180,165,145,0.18);
//           letter-spacing: 0.02em;
//         }
//         .size-table tbody td:first-child {
//           text-align: left;
//           font-size: 15px;
//           letter-spacing: 0.18em;
//           color: #4a3f35;
//           font-weight: 500;
//         }
//         .size-table tbody td:last-child { border-right: none; }

//         /* ── CHART CARD ── */
//         .chart-card {
//           background: rgba(255,255,255,0.38);
//           border: 0.5px solid rgba(180,165,145,0.25);
//           padding: 2.5rem;
//         }

//         /* ── TIPS ── */
//         .tip-section {
//           padding: 2rem 0;
//           border-bottom: 0.5px solid rgba(180,165,145,0.18);
//         }
//         .tip-section:last-child { border-bottom: none; }

//         /* ── CTA ── */
//         .email-link {
//           color: #4a3f35;
//           text-decoration: none;
//           border-bottom: 0.5px solid rgba(74,63,53,0.3);
//           padding-bottom: 1px;
//           transition: border-color 0.2s, color 0.2s;
//         }
//         .email-link:hover {
//           color: #2c2520;
//           border-color: rgba(44,37,32,0.6);
//         }

//         .stat-card {
//           border-top: 0.5px solid rgba(180,165,145,0.2);
//           padding-top: 1.5rem;
//         }
//       `}</style>

//       <Navbar
//         cartCount={cartCount}
//         onCartOpen={() => setCartOpen(true)}
//         wishlistCount={wishlist.length}
//         onWishlistOpen={() => setWishlistOpen(true)}
//         user={user}
//         onUserClick={() => setAuthOpen(true)}
//         currentPage="size-chart"
//       />

//       {/* ── HERO ───────────────────────────────────────────── */}
//       <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
//         <p
//           className="f1 uppercase mb-6"
//           style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//         >
//           Sizing Guide · All measurements in inches
//         </p>
//         <h1
//           className="serif f2 leading-none mb-8"
//           style={{
//             fontSize: "clamp(56px, 10vw, 96px)",
//             color: "#2c2520",
//             letterSpacing: "-0.02em",
//             fontWeight: 500,
//           }}
//         >
//           Size
//           <br />
//           Chart.
//         </h1>
//         <div className="f3" style={{ maxWidth: "480px" }}>
//           <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9" }}>
//             Find your perfect fit with TWINKLE. Our nightwear is designed for
//             comfort and ease — use the charts below to choose the right size for
//             you.
//           </p>
//           <p
//             style={{
//               marginTop: "1rem",
//               fontSize: "13px",
//               color: "#9e8e82",
//               lineHeight: "1.9",
//               fontStyle: "italic",
//             }}
//           >
//             All measurements are of the garment, not the body. When in doubt,
//             size up.
//           </p>
//         </div>
//       </section>

//       {/* ── RULE ───────────────────────────────────────────── */}
//       <div className="px-8 md:px-24 max-w-5xl mx-auto pb-14">
//         <div className="rule" />
//       </div>

//       {/* ── AT-A-GLANCE ────────────────────────────────────── */}
//       <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
//         <p
//           className="uppercase mb-10"
//           style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//         >
//           At a Glance
//         </p>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {[
//             { value: "S", unit: "small", label: "Length 27–37 in" },
//             { value: "M", unit: "medium", label: "Length 28–38 in" },
//             { value: "L", unit: "large", label: "Length 29–39 in" },
//             { value: "3", unit: "sizes available", label: "S · M · L" },
//           ].map((stat) => (
//             <div key={stat.label} className="stat-card">
//               <p
//                 className="serif font-light"
//                 style={{
//                   fontSize: "clamp(32px, 4vw, 44px)",
//                   color: "#2c2520",
//                   letterSpacing: "-0.02em",
//                   lineHeight: "1",
//                 }}
//               >
//                 {stat.value}
//               </p>
//               <p
//                 style={{
//                   fontSize: "10px",
//                   letterSpacing: "0.18em",
//                   color: "#b4a58f",
//                   textTransform: "uppercase",
//                   margin: "0.4rem 0 0.25rem",
//                 }}
//               >
//                 {stat.unit}
//               </p>
//               <p style={{ fontSize: "11px", color: "#9e8e82" }}>{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="section-divider" />

//       {/* ── SIZE CHARTS ────────────────────────────────────── */}
//       <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
//         <p
//           className="uppercase mb-3"
//           style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//         >
//           Measurements
//         </p>
//         <h2
//           className="serif leading-snug mb-14"
//           style={{
//             fontSize: "clamp(28px, 3vw, 38px)",
//             color: "#2c2520",
//             letterSpacing: "-0.015em",
//             fontWeight: 500,
//           }}
//         >
//           Size <em>Charts.</em>
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           {[topChart, bottomChart].map((chart) => (
//             <div key={chart.label}>
//               {/* Card header */}
//               <div className="mb-5 flex items-end justify-between">
//                 <div>
//                   <p
//                     className="serif"
//                     style={{
//                       fontSize: "22px",
//                       color: "#2c2520",
//                       fontWeight: 500,
//                       letterSpacing: "-0.01em",
//                     }}
//                   >
//                     {chart.label}
//                   </p>
//                 </div>
//                 <p
//                   style={{
//                     fontSize: "10px",
//                     letterSpacing: "0.2em",
//                     color: "#b4a58f",
//                     textTransform: "uppercase",
//                     paddingBottom: "3px",
//                   }}
//                 >
//                   {chart.note}
//                 </p>
//               </div>

//               {/* Table */}
//               <div className="chart-card">
//                 <div className="size-table-wrap">
//                   <table className="size-table">
//                     <thead>
//                       <tr>
//                         {chart.headers.map((h) => (
//                           <th key={h}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {chart.rows.map((row) => (
//                         <tr key={row.size}>
//                           <td>{row.size}</td>
//                           {row.values.map((v, i) => (
//                             <td key={i}>{v}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="section-divider" />

//       {/* ── SIZING TIPS ────────────────────────────────────── */}
//       <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
//           <div>
//             <p
//               className="uppercase mb-3"
//               style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//             >
//               Fit Guide
//             </p>
//             <h2
//               className="serif leading-snug"
//               style={{
//                 fontSize: "clamp(28px, 3vw, 38px)",
//                 color: "#2c2520",
//                 letterSpacing: "-0.015em",
//                 fontWeight: 500,
//               }}
//             >
//               Sizing
//               <br />
//               <em>Tips.</em>
//             </h2>
//           </div>

//           <div>
//             {tips.map((tip) => (
//               <div
//                 key={tip.num}
//                 className="tip-section grid grid-cols-[40px_1fr] gap-6 items-start"
//               >
//                 <span
//                   className="serif font-light"
//                   style={{ fontSize: "13px", color: "rgba(180,165,145,0.5)", paddingTop: "2px" }}
//                 >
//                   {tip.num}
//                 </span>
//                 <div>
//                   <h3
//                     className="serif"
//                     style={{
//                       fontSize: "18px",
//                       color: "#2c2520",
//                       fontWeight: 500,
//                       letterSpacing: "-0.01em",
//                       marginBottom: "0.5rem",
//                     }}
//                   >
//                     {tip.title}
//                   </h3>
//                   <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#4a3f35" }}>
//                     {tip.body}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="section-divider" />

//       {/* ── CONTACT ────────────────────────────────────────── */}
//       <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
//           <div>
//             <p
//               className="uppercase mb-3"
//               style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//             >
//               Need Help?
//             </p>
//             <h3
//               className="serif leading-snug"
//               style={{
//                 fontSize: "clamp(28px, 3vw, 38px)",
//                 color: "#2c2520",
//                 letterSpacing: "-0.01em",
//                 fontWeight: 500,
//               }}
//             >
//               Get in
//               <br />
//               <em>Touch.</em>
//             </h3>
//           </div>
//           <div>
//             <p
//               style={{
//                 fontSize: "13px",
//                 lineHeight: "1.9",
//                 color: "#4a3f35",
//                 marginBottom: "1.5rem",
//               }}
//             >
//               Still unsure about your size? Our team is happy to help you find
//               the perfect fit.
//             </p>
//             <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//               <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//                 <span
//                   style={{
//                     fontSize: "10px",
//                     letterSpacing: "0.22em",
//                     color: "#b4a58f",
//                     textTransform: "uppercase",
//                     minWidth: "50px",
//                   }}
//                 >
//                   Email
//                 </span>
//                 <a
//                   href="mailto:info@twinkleofficial.com"
//                   className="email-link"
//                   style={{ fontSize: "13px" }}
//                 >
//                   info@twinkleofficial.com
//                 </a>
//               </div>
//               <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//                 <span
//                   style={{
//                     fontSize: "10px",
//                     letterSpacing: "0.22em",
//                     color: "#b4a58f",
//                     textTransform: "uppercase",
//                     minWidth: "50px",
//                   }}
//                 >
//                   Phone
//                 </span>
//                 <span style={{ fontSize: "13px", color: "#4a3f35" }}>
//                   {settings?.contactNumber || "+92 304 3369149"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── DARK CTA ───────────────────────────────────────── */}
//       <section
//         className="px-8 md:px-24 py-24 text-center"
//         style={{
//           backgroundColor: "#161310",
//           borderTop: "0.5px solid rgba(180,165,145,0.12)",
//         }}
//       >
//         <p
//           className="uppercase mb-6"
//           style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//         >
//           Ready to Shop?
//         </p>
//         <h2
//           className="serif leading-tight mb-8 mx-auto"
//           style={{
//             fontSize: "clamp(40px, 8vw, 80px)",
//             color: "#f0e8de",
//             letterSpacing: "-0.025em",
//             maxWidth: "580px",
//             fontWeight: 500,
//           }}
//         >
//           Dressed for rest,
//           <br />
//           <em>fitted for you.</em>
//         </h2>
//         <p
//           className="mx-auto mb-14"
//           style={{
//             fontSize: "13px",
//             lineHeight: "1.9",
//             color: "#7a6a5e",
//             maxWidth: "360px",
//           }}
//         >
//           Now that you know your size, explore our collection of luxurious
//           nightwear crafted for effortless comfort.
//         </p>
//         <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
//           <a
//             href="/collection"
//             className="inline-block"
//             style={{
//               padding: "16px 52px",
//               backgroundColor: "#2c2520",
//               border: "0.5px solid rgba(180,165,145,0.3)",
//               color: "#e8dfd4",
//               textDecoration: "none",
//               fontSize: "11px",
//               letterSpacing: "0.24em",
//               transition: "background-color 0.2s, border-color 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = "#3d352c";
//               e.currentTarget.style.borderColor = "rgba(180,165,145,0.5)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = "#2c2520";
//               e.currentTarget.style.borderColor = "rgba(180,165,145,0.3)";
//             }}
//           >
//             SHOP NOW
//           </a>
//         </div>
//         <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }} />
//       </section>

//       {/* ── SIDEBARS & MODALS ──────────────────────────────── */}
//       {cartOpen && (
//         <CartSidebar
//           cart={cart}
//           onClose={() => setCartOpen(false)}
//           onRemove={(idx) => dispatch(removeFromCart(idx))}
//         />
//       )}

//       {wishlistOpen && (
//         <WishlistSidebar
//           wishlist={wishlist}
//           onClose={() => setWishlistOpen(false)}
//           onRemove={(idx) => dispatch(removeFromWishlist(idx))}
//           onMoveToCart={(item, idx) => {
//             dispatch(addToCart({ ...item, qty: item.qty ?? 1 }));
//             dispatch(removeFromWishlist(idx));
//             setWishlistOpen(false);
//           }}
//         />
//       )}

//       {authOpen && (
//         <AuthModal
//           user={user}
//           onClose={() => setAuthOpen(false)}
//           onLogin={(userData) => dispatch(login(userData))}
//           onSubmitLogin={handleLogin}
//           onSubmitRegister={handleRegister}
//           onError={(msg) => toast.error(msg)}
//           onSubmitLogout={handleLogout}
//         />
//       )}

//       <ToastContainer
//         position="bottom-center"
//         autoClose={3000}
//         hideProgressBar
//         closeOnClick
//         pauseOnHover={false}
//         toastClassName="text-[11px] tracking-[0.15em] uppercase"
//       />

//       <Footer />
//     </div>
//   );
// }

"use client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Navbar from "../components/Header";
import { useState } from "react";
import { removeFromCart, login, logout } from "../store/index";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import WishlistSidebar from "../components/WishlistSidebar";
import AuthModal from "../components/AuthModal";
import { removeFromWishlist, addToCart } from "../store/index";
import useAuthService from "../services/auth/index";
import { toast, ToastContainer } from "react-toastify";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../utils/token";
import "react-toastify/dist/ReactToastify.css";

// ── Replace these with the actual paths to your images in the project ──
// import topChartImg from "../assets/size-chart-top.png";
// import bottomChartImg from "../assets/size-chart-bottom.png";

const tips = [
  {
    num: "01",
    title: "How to Measure",
    body: "Use a soft measuring tape and measure over light clothing or directly on the body for the most accurate fit. Keep the tape parallel to the floor.",
  },
  {
    num: "02",
    title: "Between Sizes?",
    body: "If you fall between two sizes, we recommend sizing up for a relaxed, comfortable fit — especially for nightwear and loungewear.",
  },
  {
    num: "03",
    title: "Fabric & Fit",
    body: "Our nightwear is designed with ease of movement in mind. Measurements refer to garment dimensions, not body measurements.",
  },
];

export default function SizeChartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const settings = useAppSelector((s) => s.settings);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const { customerLogin, customerRegister, customerLogout } = useAuthService();

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleLogin = async (email, password) => {
    const data = await customerLogin({ email, password });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("Welcome back!");
    return { id: data.user.id, email: data.user.email, name: email.split("@")[0] };
  };

  const handleRegister = async (name, email, password, phoneNumber) => {
    const data = await customerRegister({ name, email, password, phone: phoneNumber });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("Account created successfully!");
    return { id: data.user.id, email: data.user.email, name };
  };

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    try {
      await customerLogout(refreshToken);
    } finally {
      clearTokens();
      dispatch(logout());
    }
  };

  return (
    <div style={{ backgroundColor: "#EFEBE2" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 1.1s ease 0.1s both; }
        .f2 { animation: fadeUp 1.1s ease 0.3s both; }
        .f3 { animation: fadeUp 1.1s ease 0.55s both; }

        .rule { height: 0.5px; width: 100%; background-color: rgba(180,165,145,0.35); }

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
        }

        .chart-image {
          width: 100%;
          display: block;
          border: 0.5px solid rgba(180,165,145,0.25);
        }

        .tip-section {
          padding: 2rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.18);
        }
        .tip-section:last-child { border-bottom: none; }

        .email-link {
          color: #4a3f35;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(74,63,53,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .email-link:hover {
          color: #2c2520;
          border-color: rgba(44,37,32,0.6);
        }

        .stat-card {
          border-top: 0.5px solid rgba(180,165,145,0.2);
          padding-top: 1.5rem;
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="size-chart"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
        <p
          className="f1 uppercase mb-6"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
        >
          Sizing Guide · All measurements in inches
        </p>
        <h1
          className="serif f2 leading-none mb-8"
          style={{
            fontSize: "clamp(56px, 10vw, 96px)",
            color: "#2c2520",
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Size
          <br />
          Chart.
        </h1>
        <div className="f3" style={{ maxWidth: "480px" }}>
          <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9" }}>
            Find your perfect fit with TWINKLE. Our nightwear is designed for
            comfort and ease — use the charts below to choose the right size for
            you.
          </p>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "13px",
              color: "#9e8e82",
              lineHeight: "1.9",
              fontStyle: "italic",
            }}
          >
            All measurements are of the garment, not the body. When in doubt,
            size up.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-5xl mx-auto pb-14">
        <div className="rule" />
      </div>

      {/* ── AT-A-GLANCE ────────────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <p
          className="uppercase mb-10"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
        >
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "S", unit: "small", label: "Length 27–37 in" },
            { value: "M", unit: "medium", label: "Length 28–38 in" },
            { value: "L", unit: "large", label: "Length 29–39 in" },
            { value: "3", unit: "sizes available", label: "S · M · L" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p
                className="serif font-light"
                style={{
                  fontSize: "clamp(32px, 4vw, 44px)",
                  color: "#2c2520",
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "#b4a58f",
                  textTransform: "uppercase",
                  margin: "0.4rem 0 0.25rem",
                }}
              >
                {stat.unit}
              </p>
              <p style={{ fontSize: "11px", color: "#9e8e82" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SIZE CHART IMAGES ──────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <p
          className="uppercase mb-3"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
        >
          Measurements
        </p>
        <h2
          className="serif leading-snug mb-14"
          style={{
            fontSize: "clamp(28px, 3vw, 38px)",
            color: "#2c2520",
            letterSpacing: "-0.015em",
            fontWeight: 500,
          }}
        >
          Size <em>Charts.</em>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Top chart */}
          <div>
            <div className="mb-5 flex items-end justify-between">
              <p
                className="serif"
                style={{
                  fontSize: "22px",
                  color: "#2c2520",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                Top / Shirt
              </p>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#b4a58f",
                  textTransform: "uppercase",
                  paddingBottom: "3px",
                }}
              >
                inches
              </p>
            </div>
            <img
                 src='/TopSizeChart.png'
              alt="Top size chart — S, M, L measurements for length, width and sleeve"
              className="chart-image"
            />
          </div>

          {/* Bottom chart */}
          <div>
            <div className="mb-5 flex items-end justify-between">
              <p
                className="serif"
                style={{
                  fontSize: "22px",
                  color: "#2c2520",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                Bottom / Trouser
              </p>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#b4a58f",
                  textTransform: "uppercase",
                  paddingBottom: "3px",
                }}
              >
                inches
              </p>
            </div>
            <img
              src='/BottomSizeChart.png'
              alt="Bottom size chart — S, M, L measurements for length, hip and crotch"
              className="chart-image"
            />
          </div>

        </div>
      </section>

      <div className="section-divider" />

      {/* ── SIZING TIPS ────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
            >
              Fit Guide
            </p>
            <h2
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#2c2520",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Sizing
              <br />
              <em>Tips.</em>
            </h2>
          </div>

          <div>
            {tips.map((tip) => (
              <div
                key={tip.num}
                className="tip-section grid grid-cols-[40px_1fr] gap-6 items-start"
              >
                <span
                  className="serif font-light"
                  style={{
                    fontSize: "13px",
                    color: "rgba(180,165,145,0.5)",
                    paddingTop: "2px",
                  }}
                >
                  {tip.num}
                </span>
                <div>
                  <h3
                    className="serif"
                    style={{
                      fontSize: "18px",
                      color: "#2c2520",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {tip.title}
                  </h3>
                  <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#4a3f35" }}>
                    {tip.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
            >
              Need Help?
            </p>
            <h3
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#2c2520",
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              Get in
              <br />
              <em>Touch.</em>
            </h3>
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.9",
                color: "#4a3f35",
                marginBottom: "1.5rem",
              }}
            >
              Still unsure about your size? Our team is happy to help you find
              the perfect fit.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#b4a58f",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Email
                </span>
                <a
                  href="mailto:info@twinkleofficial.com"
                  className="email-link"
                  style={{ fontSize: "13px" }}
                >
                  info@twinkleofficial.com
                </a>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#b4a58f",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Phone
                </span>
                <span style={{ fontSize: "13px", color: "#4a3f35" }}>
                  {settings?.contactNumber || "+92 304 3369149"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK CTA ───────────────────────────────────────── */}
      <section
        className="px-8 md:px-24 py-24 text-center"
        style={{
          backgroundColor: "#161310",
          borderTop: "0.5px solid rgba(180,165,145,0.12)",
        }}
      >
        <p
          className="uppercase mb-6"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
        >
          Ready to Shop?
        </p>
        <h2
          className="serif leading-tight mb-8 mx-auto"
          style={{
            fontSize: "clamp(40px, 8vw, 80px)",
            color: "#f0e8de",
            letterSpacing: "-0.025em",
            maxWidth: "580px",
            fontWeight: 500,
          }}
        >
          Dressed for rest,
          <br />
          <em>fitted for you.</em>
        </h2>
        <p
          className="mx-auto mb-14"
          style={{
            fontSize: "13px",
            lineHeight: "1.9",
            color: "#7a6a5e",
            maxWidth: "360px",
          }}
        >
          Now that you know your size, explore our collection of luxurious
          nightwear crafted for effortless comfort.
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
          <a
            href="/collection"
            className="inline-block"
            style={{
              padding: "16px 52px",
              backgroundColor: "#2c2520",
              border: "0.5px solid rgba(180,165,145,0.3)",
              color: "#e8dfd4",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.24em",
              transition: "background-color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3d352c";
              e.currentTarget.style.borderColor = "rgba(180,165,145,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2c2520";
              e.currentTarget.style.borderColor = "rgba(180,165,145,0.3)";
            }}
          >
            SHOP NOW
          </a>
        </div>
        <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }} />
      </section>

      {/* ── SIDEBARS & MODALS ──────────────────────────────── */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx) => dispatch(removeFromCart(idx))}
        />
      )}

      {wishlistOpen && (
        <WishlistSidebar
          wishlist={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemove={(idx) => dispatch(removeFromWishlist(idx))}
          onMoveToCart={(item, idx) => {
            dispatch(addToCart({ ...item, qty: item.qty ?? 1 }));
            dispatch(removeFromWishlist(idx));
            setWishlistOpen(false);
          }}
        />
      )}

      {authOpen && (
        <AuthModal
          user={user}
          onClose={() => setAuthOpen(false)}
          onLogin={(userData) => dispatch(login(userData))}
          onSubmitLogin={handleLogin}
          onSubmitRegister={handleRegister}
          onError={(msg) => toast.error(msg)}
          onSubmitLogout={handleLogout}
        />
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        toastClassName="text-[11px] tracking-[0.15em] uppercase"
      />

      <Footer />
    </div>
  );
}