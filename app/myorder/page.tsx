// "use client";

// import { useAppSelector, useAppDispatch } from "../store/hooks";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Navbar from "../components/Header";
// import useOrderService from "../services/order/index";
// import type { Order } from "../services/order/types";
// import {
//   addToCart,
//   removeFromCart,
//   toggleWishlist,
//   removeFromWishlist,
//   login,
//   logout,
// } from "../store/index";
// import useAuthService from "../services/auth/index";
// import {
//   setAccessToken,
//   setRefreshToken,
//   getRefreshToken,
//   clearTokens,
// } from "../utils/token";
// import CartSidebar from "../components/CartSidebar";
// import WishlistSidebar from "../components/WishlistSidebar";
// import AuthModal from "../components/AuthModal";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import type { RootState } from "../store/index";

// const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"] as const;

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleDateString("en-PK", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// }

// function shortId(id: string) {
//   return id.slice(0, 8).toUpperCase();
// }

// // ── Sub-components ─────────────────────────────────────────────────────────────
// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     Pending: "bg-yellow-50 text-yellow-800",
//     Processing: "bg-blue-50 text-blue-800",
//     Shipped: "bg-indigo-50 text-indigo-800",
//     Delivered: "bg-green-50 text-green-800",
//     Cancelled: "bg-red-50 text-red-800",
//   };
//   return (
//     <span
//       className={`text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full font-medium ${styles[status] ?? "bg-stone-100 text-stone-600"}`}
//     >
//       {status.toUpperCase()}
//     </span>
//   );
// }

// function PaymentBadge({ status }: { status: string }) {
//   return (
//     <span
//       className={`text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full font-medium ${
//         status === "Paid"
//           ? "bg-green-50 text-green-800"
//           : "bg-amber-50 text-amber-800"
//       }`}
//     >
//       {status.toUpperCase()}
//     </span>
//   );
// }

// function ShipmentStatus({ order }: { order: Order }) {
//   if (!order.isShipmentBooked) {
//     return (
//       <div className="px-5 py-3.5 border-b border-stone-100">
//         <p className="text-[10px] tracking-[0.15em] text-stone-400">
//           SHIPMENT NOT YET BOOKED
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="px-5 py-3.5 border-b border-stone-100 space-y-1.5">
//       <div className="flex justify-between text-[10px] tracking-[0.1em]">
//         <span className="text-stone-400">TRACKING NUMBER</span>
//         <span className="text-stone-700">{order.trackingNumber ?? "—"}</span>
//       </div>
//       <div className="flex justify-between text-[10px] tracking-[0.1em]">
//         <span className="text-stone-400">SHIPMENT STATUS</span>
//         <span className="text-stone-700">{order.shipmentStatus ?? "Pending"}</span>
//       </div>
//     </div>
//   );
// }

// function OrderCard({ order }: { order: Order }) {
//   const savings = order.items.reduce(
//     (s, i) => s + (i.originalPrice - i.unitPrice) * i.qty,
//     0,
//   );
//   return (
//     <div className="bg-white border border-stone-100 rounded-lg mb-4 overflow-hidden">
//       {/* Header */}
//       <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
//         <div>
//           <p className="text-[10px] tracking-[0.2em] text-stone-400">
//             Order #{shortId(order.id)}
//           </p>
//           <p className="text-[11px] text-stone-500 mt-0.5">
//             {formatDate(order.createdAt)}
//           </p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <StatusBadge status={order.status} />
//           <PaymentBadge status={order.paymentStatus} />
//           <span className="text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 font-medium">
//             {order.paymentMethod.toUpperCase()}
//           </span>
//         </div>
//       </div>

//       {/* Tracking */}
//        <ShipmentStatus order={order} />

//       {/* Items */}
//       <div className="px-5 py-4">
//         {order.items.map((item, i) => (
//           <div
//             key={item.id}
//             className={`flex gap-3.5 py-3 ${
//               i < order.items.length - 1 ? "border-b border-stone-100" : ""
//             }`}
//           >
//             <img
//               src={item.image || ""}
//               alt={item.productName}
//               className="w-16 h-20 object-cover rounded flex-shrink-0 bg-stone-100"
//             />
//             <div className="flex-1">
//               <p className="text-[11px] tracking-[0.12em] text-stone-800 uppercase leading-snug mb-1">
//                 {item.productName}
//               </p>
//               <p className="text-[10px] text-stone-400">
//                 Size: {item.size} · Qty: {item.qty}
//               </p>
//             </div>
//             <div className="text-right flex-shrink-0">
//               <p className="text-[12px] text-stone-700">
//                 PKR {item.lineTotal.toLocaleString()}
//               </p>
//               {item.originalPrice > item.unitPrice && (
//                 <p className="text-[10px] text-stone-300 line-through mt-0.5">
//                   PKR {(item.originalPrice * item.qty).toLocaleString()}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50 flex items-end justify-between">
//         <div className="text-[10px] text-stone-400 leading-relaxed">
//           <p>
//             {order.firstName} {order.lastName}
//           </p>
//           <p>
//             {order.city}, {order.postalCode}
//           </p>
//           <p>+92 {order.phone}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-[9px] tracking-[0.2em] text-stone-400 mb-1">
//             ORDER TOTAL
//           </p>
//           <p className="text-[15px] text-stone-900">
//             PKR {order.totalAmount.toLocaleString()}
//           </p>
//           {savings > 0 && (
//             <p className="text-[10px] text-green-600 mt-0.5">
//               You saved PKR {savings.toLocaleString()}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Page ───────────────────────────────────────────────────────────────────────
// export default function MyOrdersPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const { getMyOrders } = useOrderService();
//   const { customerLogin, customerRegister, customerLogout } = useAuthService();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);
//   const [wishlistOpen, setWishlistOpen] = useState(false);

//   const cart = useAppSelector((s) => s.cart);
//   const user = useAppSelector((s) => s.auth);
//   const wishlist = useAppSelector((s) => s.wishlist);
//   const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

//   useEffect(() => {
//     getMyOrders().then(setOrders);
//   }, []);

//   useEffect(() => {
//     if (!user) router.push("/");
//   }, [user]);

//   const handleLogout = async () => {
//     const refreshToken = getRefreshToken() ?? '';
//     try {
//       await customerLogout(refreshToken);
//     } finally {
//       clearTokens();
//       dispatch(logout());
//     }
//   };

//   const handleLogin = async (
//     email: string,
//     password: string,
//   ): Promise<{ id: string; email: string; name: string }> => {
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

//   const handleRegister = async (
//     name: string,
//     email: string,
//     password: string,
//     phoneNumber: string,
//   ): Promise<{ id: string; email: string; name: string }> => {
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

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <Navbar
//         cartCount={cartCount}
//         onCartOpen={() => setCartOpen(true)}
//         wishlistCount={wishlist.length}
//         onWishlistOpen={() => setWishlistOpen(true)}
//         user={user}
//         onUserClick={() => setAuthOpen(true)}
//         currentPage="about"
//       />

//       <main className="max-w-2xl mx-auto px-4 py-10">
//         <div className="mb-8">
//           <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-1.5">
//             Account
//           </p>
//           <h1 className="text-2xl font-light tracking-[0.15em] text-stone-800 uppercase">
//             My Orders
//           </h1>
//         </div>

//         {orders.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-[12px] tracking-[0.2em] text-stone-400 uppercase mb-2">
//               No orders yet
//             </p>
//             <p className="text-[11px] text-stone-400">
//               Your orders will appear here once you place one.
//             </p>
//             <Link
//               href="/"
//               className="inline-block mt-6 text-[10px] tracking-[0.3em] uppercase border-b border-stone-400 pb-0.5 text-stone-600 hover:text-stone-900"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           orders.map((order, i) => (
//             <OrderCard key={`${order.id}-${i}`} order={order} />
//           ))
//         )}
//       </main>

//       {cartOpen && (
//         <CartSidebar
//           cart={cart}
//           onClose={() => setCartOpen(false)}
//           onRemove={(idx: number) => dispatch(removeFromCart(idx))}
//         />
//       )}

//       {authOpen && (
//         <AuthModal
//           user={user}
//           onClose={() => setAuthOpen(false)}
//           onLogin={(userData:any) => dispatch(login(userData))}
//           onSubmitLogin={handleLogin}
//           onSubmitRegister={handleRegister}
//           onError={(msg: string) => toast.error(msg)}
//           onSubmitLogout={handleLogout}
//         />
//       )}

//       {wishlistOpen && (
//         <WishlistSidebar
//           wishlist={wishlist}
//           onClose={() => setWishlistOpen(false)}
//           onRemove={(idx: number) => dispatch(removeFromWishlist(idx))}
//           onMoveToCart={(item: RootState['wishlist'][number], idx: number) => {
//             dispatch(addToCart({ ...item, qty: item.qty ?? 1, selectedSize: item.selectedSize ?? '' }));
//             dispatch(removeFromWishlist(idx));
//             setWishlistOpen(false);
//             setCartOpen(true);
//           }}
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
//     </div>
//   );
// }

"use client";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Header";
import useOrderService from "../services/order/index";
import type { Order } from "../services/order/types";
import {
  addToCart,
  removeFromCart,
  toggleWishlist,
  removeFromWishlist,
  login,
  logout,
} from "../store/index";
import useAuthService from "../services/auth/index";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../utils/token";
import CartSidebar from "../components/CartSidebar";
import WishlistSidebar from "../components/WishlistSidebar";
import AuthModal from "../components/AuthModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { RootState } from "../store/index";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full font-medium ${
        status === "Paid"
          ? "bg-green-50 text-green-800"
          : "bg-amber-50 text-amber-800"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

function ShipmentStatus({ order }: { order: Order }) {
  if (!order.isShipmentBooked) {
    return (
      <div className="px-5 py-3.5 border-b border-stone-100">
        <p className="text-[10px] tracking-[0.15em] text-stone-400">
          SHIPMENT NOT YET BOOKED
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 py-3.5 border-b border-stone-100 space-y-1.5">
      <div className="flex justify-between text-[10px] tracking-[0.1em]">
        <span className="text-stone-400">TRACKING NUMBER</span>
        <span className="text-stone-700">{order.trackingNumber ?? "—"}</span>
      </div>
      <div className="flex justify-between text-[10px] tracking-[0.1em]">
        <span className="text-stone-400">SHIPMENT STATUS</span>
        <span className="text-stone-700">{order.shipmentStatus ?? "Pending"}</span>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const savings = order.items.reduce(
    (s, i) => s + (i.originalPrice - i.unitPrice) * i.qty,
    0,
  );
  return (
    <div className="bg-white border border-stone-100 rounded-lg mb-4 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            Order #{order.id}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PaymentBadge status={order.paymentStatus} />
          <span className="text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 font-medium">
            {order.paymentMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Shipment (Sonic) */}
      <ShipmentStatus order={order} />

      {/* Items */}
      <div className="px-5 py-4">
        {order.items.map((item, i) => (
          <div
            key={item.id}
            className={`flex gap-3.5 py-3 ${
              i < order.items.length - 1 ? "border-b border-stone-100" : ""
            }`}
          >
            <img
              src={item.image || ""}
              alt={item.productName}
              className="w-16 h-20 object-cover rounded flex-shrink-0 bg-stone-100"
            />
            <div className="flex-1">
              <p className="text-[11px] tracking-[0.12em] text-stone-800 uppercase leading-snug mb-1">
                {item.productName}
              </p>
              <p className="text-[10px] text-stone-400">
                Size: {item.size} · Qty: {item.qty}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[12px] text-stone-700">
                PKR {item.lineTotal.toLocaleString()}
              </p>
              {item.originalPrice > item.unitPrice && (
                <p className="text-[10px] text-stone-300 line-through mt-0.5">
                  PKR {(item.originalPrice * item.qty).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50 flex items-end justify-between">
        <div className="text-[10px] text-stone-400 leading-relaxed">
          <p>
            {order.firstName} {order.lastName}
          </p>
          <p>
            {order.city}, {order.postalCode}
          </p>
          <p>+92 {order.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] tracking-[0.2em] text-stone-400 mb-1">
            ORDER TOTAL
          </p>
          <p className="text-[15px] text-stone-900">
            PKR {order.totalAmount.toLocaleString()}
          </p>
          {savings > 0 && (
            <p className="text-[10px] text-green-600 mt-0.5">
              You saved PKR {savings.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { getMyOrders } = useOrderService();
  const { customerLogin, customerRegister, customerLogout } = useAuthService();

  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const cart = useAppSelector((s) => s.cart);
  const user = useAppSelector((s) => s.auth);
  const wishlist = useAppSelector((s) => s.wishlist);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    getMyOrders().then(setOrders);
  }, []);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const handleLogout = async () => {
    const refreshToken = getRefreshToken() ?? '';
    try {
      await customerLogout(refreshToken);
    } finally {
      clearTokens();
      dispatch(logout());
    }
  };

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; name: string }> => {
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

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
  ): Promise<{ id: string; email: string; name: string }> => {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="about"
      />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-1.5">
            Account
          </p>
          <h1 className="text-2xl font-light tracking-[0.15em] text-stone-800 uppercase">
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[12px] tracking-[0.2em] text-stone-400 uppercase mb-2">
              No orders yet
            </p>
            <p className="text-[11px] text-stone-400">
              Your orders will appear here once you place one.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-[10px] tracking-[0.3em] uppercase border-b border-stone-400 pb-0.5 text-stone-600 hover:text-stone-900"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order, i) => (
            <OrderCard key={`${order.id}-${i}`} order={order} />
          ))
        )}
      </main>

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx: number) => dispatch(removeFromCart(idx))}
        />
      )}

      {authOpen && (
        <AuthModal
          user={user}
          onClose={() => setAuthOpen(false)}
          onLogin={(userData:any) => dispatch(login(userData))}
          onSubmitLogin={handleLogin}
          onSubmitRegister={handleRegister}
          onError={(msg: string) => toast.error(msg)}
          onSubmitLogout={handleLogout}
        />
      )}

      {wishlistOpen && (
        <WishlistSidebar
          wishlist={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemove={(idx: number) => dispatch(removeFromWishlist(idx))}
          onMoveToCart={(item: RootState['wishlist'][number], idx: number) => {
            dispatch(addToCart({ ...item, qty: item.qty ?? 1, selectedSize: item.selectedSize ?? '' }));
            dispatch(removeFromWishlist(idx));
            setWishlistOpen(false);
            setCartOpen(true);
          }}
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
    </div>
  );
}