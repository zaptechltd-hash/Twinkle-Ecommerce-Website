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

// const sections = [
//   {
//     num: "01",
//     title: "General",
//     body: "TWINKLE is an online fashion brand specialising in nightwear products in Pakistan. Continued use of the website after updates means you accept the revised terms.",
//     items: [
//       "Update or modify these Terms & Conditions at any time",
//       "Refuse service to any customer for valid reasons",
//       "Cancel orders in case of pricing errors, fraud suspicion, or stock unavailability",
//     ],
//     itemsLabel: "We reserve the right to:",
//   },
//   {
//     num: "02",
//     title: "Products & Availability",
//     body: "We aim to ensure all product details are accurate. All products are subject to availability.",
//     items: [
//       "Colors may slightly vary due to screen settings",
//       "Product availability may change without notice",
//       "We may discontinue any product at any time",
//     ],
//   },
//   {
//     num: "03",
//     title: "Pricing",
//     body: "All prices are listed in Pakistani Rupees (PKR). Customers will be informed before processing if any issue occurs.",
//     items: [
//       "Change prices without prior notice",
//       "Correct pricing errors",
//       "Cancel orders placed with incorrect pricing",
//     ],
//     itemsLabel: "TWINKLE reserves the right to:",
//   },
//   {
//     num: "04",
//     title: "Orders",
//     body: "After placing an order you will receive confirmation via SMS, email, or WhatsApp. Orders are processed after verification.",
//     items: [
//       "Incorrect details",
//       "Fraud suspicion",
//       "Stock unavailability",
//       "Failed verification",
//     ],
//     itemsLabel: "TWINKLE may cancel or refuse orders due to:",
//   },
//   {
//     num: "05",
//     title: "Payment Methods",
//     body: "All payments are processed through secure systems. TWINKLE does not store full card details.",
//     items: [
//       "Cash on Delivery (COD)",
//       "JazzCash",
//       "Easypaisa",
//       "Visa",
//       "Mastercard",
//     ],
//     itemsLabel: "We accept:",
//   },
//   {
//     num: "06",
//     title: "Order Cancellation",
//     body: "Customers may cancel their order within 8 hours of placing it by contacting customer support. After 8 hours, orders may already be processed or shipped and cancellation requests may not be accepted. Refunds (if applicable) will be processed according to the original payment method.",
//     items: [
//       "Stock issues",
//       "Fraud detection",
//       "Incorrect information",
//       "Verification failure",
//     ],
//     itemsLabel: "TWINKLE may cancel orders due to:",
//   },
//   {
//     num: "07",
//     title: "Shipping Policy",
//     body: "Please refer to our full Shipping Policy for complete details.",
//     items: [
//       "Delivery across Pakistan",
//       "3–5 business days standard delivery",
//       "Remote areas may take longer",
//     ],
//     itemsLabel: "Summary:",
//   },
//   {
//     num: "08",
//     title: "Exchange & Return",
//     body: "Please refer to our full Exchange & Return Policy for complete details.",
//     items: [
//       "Exchanges and returns accepted within 28 days",
//       "Items must be unused with original tags",
//       "Sale items are not eligible for return or exchange",
//       "Damaged or wrong items must be reported with proof",
//     ],
//     itemsLabel: "Summary:",
//   },
//   {
//     num: "09",
//     title: "Promotions & Discounts",
//     items: [
//       "Offers are time-limited",
//       "Cannot be combined unless stated",
//       "TWINKLE may modify or cancel promotions at any time",
//       "Misuse of discount codes may result in order cancellation",
//     ],
//   },
//   {
//     num: "10",
//     title: "Intellectual Property",
//     body: "All content on the website — including logos, images, designs, text, and graphics — is the property of TWINKLE and cannot be copied or reused without written permission.",
//   },
//   {
//     num: "11",
//     title: "User Conduct",
//     body: "Violations may result in order cancellation or account restrictions.",
//     items: [
//       "Provide false information",
//       "Misuse the website",
//       "Attempt unauthorized access",
//       "Interfere with website functionality",
//     ],
//     itemsLabel: "Users agree not to:",
//   },
//   {
//     num: "12",
//     title: "WhatsApp, SMS & Email Consent",
//     body: "By providing your contact details, you consent that TWINKLE may contact you via WhatsApp, SMS, and email for order confirmations, delivery updates, promotional campaigns, and new arrivals. You may opt out of marketing messages anytime by replying STOP or contacting support. Transactional messages will still be sent.",
//   },
//   {
//     num: "13",
//     title: "Third-Party Services",
//     body: "TWINKLE is not responsible for the policies or performance of third-party services.",
//     items: [
//       "Payment gateways",
//       "Courier companies",
//       "Advertising platforms (Google & Meta)",
//     ],
//     itemsLabel: "We use third-party services such as:",
//   },
//   {
//     num: "14",
//     title: "Limitation of Liability",
//     body: "Our liability is limited to the value of the purchased product.",
//     items: [
//       "Courier delays",
//       "Technical issues",
//       "Indirect damages",
//       "Losses beyond our control",
//     ],
//     itemsLabel: "TWINKLE is not liable for:",
//   },
//   {
//     num: "15",
//     title: "Privacy Policy",
//     body: "Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.",
//   },
//   {
//     num: "16",
//     title: "Governing Law",
//     body: "These Terms & Conditions are governed by the laws of Pakistan. Any disputes will fall under Pakistani jurisdiction.",
//   },
// ];

// /* ── Reusable sub-label (Option D: dot marker) ── */
// function SubLabel({ children }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         marginBottom: "0.9rem",
//         marginTop: "1.25rem",
//       }}
//     >
//       <span
//         style={{
//           width: "5px",
//           height: "5px",
//           borderRadius: "50%",
//           background: "#b4a58f",
//           flexShrink: 0,
//           display: "inline-block",
//         }}
//       />
//       <span
//         style={{
//           fontSize: "11px",
//           letterSpacing: "0.2em",
//           color: "#4a3f35",
//           textTransform: "uppercase",
//         }}
//       >
//         {children}
//       </span>
//     </div>
//   );
// }

// export default function TermsConditionsPage() {
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
//     return {
//       id: data.user.id,
//       email: data.user.email,
//       name: email.split("@")[0],
//     };
//   };

//   const handleRegister = async (name, email, password, phoneNumber) => {
//     const data = await customerRegister({
//       name,
//       email,
//       password,
//       phone: phoneNumber,
//     });
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

//         .rule { height: 0.5px; width: 100%; background-color: rgba(180,165,145,0.35); }

//         .cta-link {
//           color: #c8b8a8;
//           text-decoration: none;
//           border-bottom: 0.5px solid rgba(200,184,168,0.4);
//           padding-bottom: 2px;
//           font-size: 11px;
//           letter-spacing: 0.18em;
//           transition: color 0.2s, border-color 0.2s;
//         }
//         .cta-link:hover {
//           color: #fff;
//           border-color: rgba(255,255,255,0.6);
//         }

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

//         .policy-section {
//           padding: 2.5rem 0;
//           border-bottom: 0.5px solid rgba(180,165,145,0.2);
//         }
//         .policy-section:last-child { border-bottom: none; }

//         .policy-item {
//           display: flex;
//           gap: 1rem;
//           align-items: flex-start;
//           padding: 0.65rem 0;
//           border-bottom: 0.5px solid rgba(180,165,145,0.12);
//         }
//         .policy-item:last-child { border-bottom: none; }

//         .toc-item {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           padding: 0.7rem 0;
//           border-bottom: 0.5px solid rgba(180,165,145,0.15);
//           text-decoration: none;
//           transition: opacity 0.2s;
//         }
//         .toc-item:last-child { border-bottom: none; }
//         .toc-item:hover { opacity: 0.6; }

//         .section-divider {
//           height: 0.5px;
//           background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
//         }

//         .highlight-box {
//           border-left: 1.5px solid rgba(180,165,145,0.4);
//           padding: 1rem 1.25rem;
//           margin-bottom: 1.25rem;
//           background: rgba(180,165,145,0.05);
//         }
//       `}</style>

//       <Navbar
//         cartCount={cartCount}
//         onCartOpen={() => setCartOpen(true)}
//         wishlistCount={wishlist.length}
//         onWishlistOpen={() => setWishlistOpen(true)}
//         user={user}
//         onUserClick={() => setAuthOpen(true)}
//         currentPage="terms-conditions"
//       />

//       {/* ── HERO ───────────────────────────────────────────── */}
//       <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
//         <p
//           className="f1 uppercase mb-6"
//           style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//         >
//           Legal · Last Updated May 2026
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
//           Terms &amp;
//           <br />
//           Conditions.
//         </h1>
//         <div className="f3" style={{ maxWidth: "500px" }}>
//           <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9" }}>
//             Welcome to TWINKLE. These Terms &amp; Conditions govern your use of
//             our website and services. By accessing our website or placing an
//             order, you agree to be bound by these terms.
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
//             If you do not agree with any part of these terms, please do not use
//             our website.
//           </p>
//         </div>
//       </section>

//       {/* ── RULE ───────────────────────────────────────────── */}
//       <div className="px-8 md:px-24 max-w-5xl mx-auto pb-16">
//         <div className="rule" />
//       </div>

//       {/* ── TABLE OF CONTENTS ──────────────────────────────── */}
//       <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
//           <div>
//             <p
//               className="uppercase mb-3"
//               style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
//             >
//               Contents
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
//               Quick
//               <br />
//               <em>Navigation.</em>
//             </h2>
//           </div>
//           <div>
//             <div style={{ height: "0.5px", backgroundColor: "#e8e0d6" }} />
//             {sections.map((s) => (
//               <a key={s.num} href={`#tc-section-${s.num}`} className="toc-item">
//                 <span
//                   className="serif font-light flex-shrink-0"
//                   style={{ fontSize: "16px", color: "rgba(180,165,145,0.5)", minWidth: "28px" }}
//                 >
//                   {s.num}
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "12px",
//                     letterSpacing: "0.12em",
//                     color: "#4a3f35",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   {s.title}
//                 </span>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="section-divider" />

//       {/* ── SECTIONS ───────────────────────────────────────── */}
//       <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
//         {sections.map((s) => (
//           <div
//             key={s.num}
//             id={`tc-section-${s.num}`}
//             className="policy-section grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start"
//           >
//             {/* Left sticky label */}
//             <div className="md:sticky top-24">
//               <span
//                 className="serif font-light"
//                 style={{
//                   fontSize: "13px",
//                   color: "rgba(180,165,145,0.5)",
//                   display: "block",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {s.num}
//               </span>
//               <h3
//                 className="serif leading-snug"
//                 style={{
//                   fontSize: "clamp(22px, 2.5vw, 30px)",
//                   color: "#2c2520",
//                   letterSpacing: "-0.01em",
//                   fontWeight: 500,
//                 }}
//               >
//                 {s.title}
//               </h3>
//             </div>

//             {/* Right content */}
//             <div>
//               {s.body && (
//                 <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#4a3f35" }}>
//                   {s.body}
//                 </p>
//               )}

//               {s.items && (
//                 <>
//                   {s.itemsLabel && <SubLabel>{s.itemsLabel}</SubLabel>}
//                   <div>
//                     {s.items.map((item, i) => (
//                       <div key={i} className="policy-item">
//                         <span
//                           className="serif font-light flex-shrink-0"
//                           style={{
//                             fontSize: "15px",
//                             color: "rgba(180,165,145,0.4)",
//                             marginTop: "1px",
//                           }}
//                         >
//                           —
//                         </span>
//                         <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#4a3f35" }}>
//                           {item}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
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
//               17 / Contact
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
//             <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#4a3f35", marginBottom: "1.5rem" }}>
//               For any queries regarding these Terms &amp; Conditions, please
//               reach out to our customer support team.
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
//           Shop with Confidence
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
//           Crafted with care,
//           <br />
//           <em>delivered with trust.</em>
//         </h2>
//         <p
//           className="mx-auto mb-14"
//           style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e", maxWidth: "360px" }}
//         >
//           Every order is handled with the same attention and intention that goes
//           into every stitch of our nightwear.
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

const sections = [
  {
    num: "01",
    title: "General",
    body: "TWINKLE is an online fashion brand specialising in nightwear products in Pakistan. Continued use of the website after updates means you accept the revised terms.",
    items: [
      "Update or modify these Terms & Conditions at any time",
      "Refuse service to any customer for valid reasons",
      "Cancel orders in case of pricing errors, fraud suspicion, or stock unavailability",
    ],
    itemsLabel: "We reserve the right to:",
  },
  {
    num: "02",
    title: "Products & Availability",
    body: "We aim to ensure all product details are accurate. All products are subject to availability.",
    items: [
      "Colors may slightly vary due to screen settings",
      "Product availability may change without notice",
      "We may discontinue any product at any time",
    ],
  },
  {
    num: "03",
    title: "Pricing",
    body: "All prices are listed in Pakistani Rupees (PKR). Customers will be informed before processing if any issue occurs.",
    items: [
      "Change prices without prior notice",
      "Correct pricing errors",
      "Cancel orders placed with incorrect pricing",
    ],
    itemsLabel: "TWINKLE reserves the right to:",
  },
  {
    num: "04",
    title: "Orders",
    body: "After placing an order you will receive confirmation via SMS, email, or WhatsApp. Orders are processed after verification.",
    items: [
      "Incorrect details",
      "Fraud suspicion",
      "Stock unavailability",
      "Failed verification",
    ],
    itemsLabel: "TWINKLE may cancel or refuse orders due to:",
  },
  {
    num: "05",
    title: "Payment Methods",
    body: "All payments are processed through secure systems. TWINKLE does not store full card details.",
    items: [
      "Cash on Delivery (COD)",
      "JazzCash",
      "Easypaisa",
      "Visa",
      "Mastercard",
    ],
    itemsLabel: "We accept:",
  },
  {
    num: "06",
    title: "Order Cancellation",
    body: "Customers may cancel their order within 8 hours of placing it by contacting customer support. After 8 hours, orders may already be processed or shipped and cancellation requests may not be accepted. Refunds (if applicable) will be processed according to the original payment method.",
    items: [
      "Stock issues",
      "Fraud detection",
      "Incorrect information",
      "Verification failure",
    ],
    itemsLabel: "TWINKLE may cancel orders due to:",
  },
  {
    num: "07",
    title: "Shipping Policy",
    body: "Please refer to our full Shipping Policy for complete details.",
    items: [
      "Delivery across Pakistan",
      "3–5 business days standard delivery",
      "Remote areas may take longer",
    ],
    itemsLabel: "Summary:",
  },
  {
    num: "08",
    title: "Exchange & Return",
    body: "Please refer to our full Exchange & Return Policy for complete details.",
    items: [
      "Exchanges and returns accepted within 28 days",
      "Items must be unused with original tags",
      "Sale items are not eligible for return or exchange",
      "Damaged or wrong items must be reported with proof",
    ],
    itemsLabel: "Summary:",
  },
  {
    num: "09",
    title: "Promotions & Discounts",
    items: [
      "Offers are time-limited",
      "Cannot be combined unless stated",
      "TWINKLE may modify or cancel promotions at any time",
      "Misuse of discount codes may result in order cancellation",
    ],
  },
  {
    num: "10",
    title: "Intellectual Property",
    body: "All content on the website — including logos, images, designs, text, and graphics — is the property of TWINKLE and cannot be copied or reused without written permission.",
  },
  {
    num: "11",
    title: "User Conduct",
    body: "Violations may result in order cancellation or account restrictions.",
    items: [
      "Provide false information",
      "Misuse the website",
      "Attempt unauthorized access",
      "Interfere with website functionality",
    ],
    itemsLabel: "Users agree not to:",
  },
  {
    num: "12",
    title: "WhatsApp, SMS & Email Consent",
    body: "By providing your contact details, you consent that TWINKLE may contact you via WhatsApp, SMS, and email for order confirmations, delivery updates, promotional campaigns, and new arrivals. You may opt out of marketing messages anytime by replying STOP or contacting support. Transactional messages will still be sent.",
  },
  {
    num: "13",
    title: "Third-Party Services",
    body: "TWINKLE is not responsible for the policies or performance of third-party services.",
    items: [
      "Payment gateways",
      "Courier companies",
      "Advertising platforms (Google & Meta)",
    ],
    itemsLabel: "We use third-party services such as:",
  },
  {
    num: "14",
    title: "Limitation of Liability",
    body: "Our liability is limited to the value of the purchased product.",
    items: [
      "Courier delays",
      "Technical issues",
      "Indirect damages",
      "Losses beyond our control",
    ],
    itemsLabel: "TWINKLE is not liable for:",
  },
  {
    num: "15",
    title: "Privacy Policy",
    body: "Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.",
  },
  {
    num: "16",
    title: "Governing Law",
    body: "These Terms & Conditions are governed by the laws of Pakistan. Any disputes will fall under Pakistani jurisdiction.",
  },
];

/* ── Reusable sub-label (Option D: dot marker) ── */
function SubLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "0.9rem",
        marginTop: "1.25rem",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#6b5642",
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "#241c16",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export default function TermsConditionsPage() {
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
    return {
      id: data.user.id,
      email: data.user.email,
      name: email.split("@")[0],
    };
  };

  const handleRegister = async (name, email, password, phoneNumber) => {
    const data = await customerRegister({
      name,
      email,
      password,
      phone: phoneNumber,
    });
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

        .cta-link {
          color: #c8b8a8;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(200,184,168,0.4);
          padding-bottom: 2px;
          font-size: 11px;
          letter-spacing: 0.18em;
          transition: color 0.2s, border-color 0.2s;
        }
        .cta-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        .email-link {
          color: #241c16;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(46,36,28,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .email-link:hover {
          color: #0d0906;
          border-color: rgba(13,9,6,0.6);
        }

        .policy-section {
          padding: 2.5rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.2);
        }
        .policy-section:last-child { border-bottom: none; }

        .policy-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 0.65rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.12);
        }
        .policy-item:last-child { border-bottom: none; }

        .toc-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.7rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.15);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .toc-item:last-child { border-bottom: none; }
        .toc-item:hover { opacity: 0.6; }

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
        }

        .highlight-box {
          border-left: 1.5px solid rgba(180,165,145,0.4);
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
          background: rgba(180,165,145,0.05);
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="terms-conditions"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
        <p
          className="f1 uppercase mb-6"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
        >
          Legal · Last Updated May 2026
        </p>
        <h1
          className="serif f2 leading-none mb-8"
          style={{
            fontSize: "clamp(56px, 10vw, 96px)",
            color: "#0d0906",
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Terms &amp;
          <br />
          Conditions.
        </h1>
        <div className="f3" style={{ maxWidth: "500px" }}>
          <p style={{ fontSize: "14px", color: "#2e241c", lineHeight: "1.9" }}>
            Welcome to TWINKLE. These Terms &amp; Conditions govern your use of
            our website and services. By accessing our website or placing an
            order, you agree to be bound by these terms.
          </p>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "13px",
              color: "#6b5642",
              lineHeight: "1.9",
              fontStyle: "italic",
            }}
          >
            If you do not agree with any part of these terms, please do not use
            our website.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-5xl mx-auto pb-16">
        <div className="rule" />
      </div>

      {/* ── TABLE OF CONTENTS ──────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              Contents
            </p>
            <h2
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#0d0906",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Quick
              <br />
              <em>Navigation.</em>
            </h2>
          </div>
          <div>
            <div style={{ height: "0.5px", backgroundColor: "#e8e0d6" }} />
            {sections.map((s) => (
              <a key={s.num} href={`#tc-section-${s.num}`} className="toc-item">
                <span
                  className="serif font-light flex-shrink-0"
                  style={{ fontSize: "16px", color: "rgba(107,86,66,0.75)", minWidth: "28px" }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: "#241c16",
                    textTransform: "uppercase",
                  }}
                >
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTIONS ───────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        {sections.map((s) => (
          <div
            key={s.num}
            id={`tc-section-${s.num}`}
            className="policy-section grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start"
          >
            {/* Left sticky label */}
            <div className="md:sticky top-24">
              <span
                className="serif font-light"
                style={{
                  fontSize: "13px",
                  color: "rgba(107,86,66,0.75)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {s.num}
              </span>
              <h3
                className="serif leading-snug"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 30px)",
                  color: "#0d0906",
                  letterSpacing: "-0.01em",
                  fontWeight: 500,
                }}
              >
                {s.title}
              </h3>
            </div>

            {/* Right content */}
            <div>
              {s.body && (
                <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16" }}>
                  {s.body}
                </p>
              )}

              {s.items && (
                <>
                  {s.itemsLabel && <SubLabel>{s.itemsLabel}</SubLabel>}
                  <div>
                    {s.items.map((item, i) => (
                      <div key={i} className="policy-item">
                        <span
                          className="serif font-light flex-shrink-0"
                          style={{
                            fontSize: "15px",
                            color: "rgba(180,165,145,0.4)",
                            marginTop: "1px",
                          }}
                        >
                          —
                        </span>
                        <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="section-divider" />

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              17 / Contact
            </p>
            <h3
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#0d0906",
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
            <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16", marginBottom: "1.5rem" }}>
              For any queries regarding these Terms &amp; Conditions, please
              reach out to our customer support team.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#6b5642",
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
                    color: "#6b5642",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Phone
                </span>
                <span style={{ fontSize: "13px", color: "#241c16" }}>
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
          Shop with Confidence
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
          Crafted with care,
          <br />
          <em>delivered with trust.</em>
        </h2>
        <p
          className="mx-auto mb-14"
          style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e", maxWidth: "360px" }}
        >
          Every order is handled with the same attention and intention that goes
          into every stitch of our nightwear.
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