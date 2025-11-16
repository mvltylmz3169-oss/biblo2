"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToOrders, updateOrderStatus } from "@/lib/orders";
import { getAdminSettings, updateAdminSettings } from "@/lib/adminStorage";

const ADMIN_CREDENTIALS = {
  username: "admin16kasim2025",
  password: "31312269",
};

const SESSION_KEY = "filamentbiblo3d-admin-auth";

const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

const statusLabelMap = {
  awaiting_payment: "Ödeme Bekleniyor",
  awaiting_verification: "Dekont İncelemede",
  completed: "Tamamlandı",
  awaiting_receipt: "Dekont Bekleniyor",
  receipt_submitted: "Dekont Gönderildi",
  verified: "Ödeme Onaylandı",
};

const statusVariantMap = {
  awaiting_payment: "info",
  awaiting_verification: "warning",
  completed: "success",
  awaiting_receipt: "info",
  receipt_submitted: "warning",
  verified: "success",
};

const badgeClassMap = {
  success:
    "border-green-500/30 bg-green-500/10 text-green-200 backdrop-blur-sm",
  warning:
    "border-amber-400/30 bg-amber-400/10 text-amber-200 backdrop-blur-sm",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-200 backdrop-blur-sm",
};

const orderTypeLabel = (orderType) => {
  switch (orderType) {
    case "figure":
      return "3D Figür";
    case "anikuresi":
      return "Anı Küresi";
    default:
      return "Sipariş";
  }
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [adminSettings, setAdminSettings] = useState({
    accountName: "Craft Maket 3D Tasarım ve Üretim Ltd. Şti.",
    iban: "TR12 3456 7890 1234 5678 0001 23",
    bank: "Bank Craft A.Ş.",
    branch: "Maslak Kurumsal Şube",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const unsubscribe = subscribeToOrders(
      (ordersData) => {
        setOrders(ordersData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setError("Siparişler yüklenirken hata oluştu.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSettings = async () => {
      try {
        const settings = await getAdminSettings();
        setAdminSettings({
          accountName: settings.authorizedName || "Craft Maket 3D Tasarım ve Üretim Ltd. Şti.",
          iban: settings.iban || "TR12 3456 7890 1234 5678 0001 23",
          bank: settings.bank || "Bank Craft Maket 3D A.Ş.",
          branch: settings.branch || "Maslak Kurumsal Şube",
        });
      } catch (error) {
        console.error("Error loading admin settings:", error);
        setSettingsError("Ayarlar yüklenirken hata oluştu.");
      }
    };

    loadSettings();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((order) => order.status === "completed").length;
    const pendingPayments = orders.filter((order) => order.paymentStatus === "awaiting_receipt").length;
    const pendingVerifications = orders.filter((order) => order.paymentStatus === "receipt_submitted").length;

    return [
      {
        label: "Toplam Sipariş",
        value: totalOrders,
        accent: "from-purple-500 to-blue-500",
      },
      {
        label: "Tamamlanan",
        value: completedOrders,
        accent: "from-green-500 to-emerald-500",
      },
      {
        label: "Ödeme Bekleyen",
        value: pendingPayments,
        accent: "from-amber-500 to-orange-500",
      },
      {
        label: "Dekont İncelemede",
        value: pendingVerifications,
        accent: "from-rose-500 to-pink-500",
      },
    ];
  }, [orders]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, "true");
      }
      setError("");
    } else {
      setError("Kullanıcı adı veya şifre hatalı.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  const handleUpdateStatus = async (orderId, updates) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, updates);
    } catch (updateError) {
      console.error("Error updating order status:", updateError);
      alert("Sipariş güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError(null);

    try {
      await updateAdminSettings({
        authorizedName: adminSettings.accountName,
        iban: adminSettings.iban,
        bank: adminSettings.bank,
        branch: adminSettings.branch,
      });
      alert("Ödeme bilgileri başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating settings:", error);
      setSettingsError("Ayarlar güncellenirken hata oluştu.");
    } finally {
      setSettingsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Admin Girişi</h1>
            <p className="mt-2 text-sm text-gray-400">
              Sipariş yönetim paneline erişmek için giriş yapın.
            </p>
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Şifre
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-rose-300">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5"
            >
              Admin Girişi Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-purple-200">
              Yönetim Paneli
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Sipariş Takip Merkezi
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              3D figür ve anı küresi siparişlerinizi gerçek zamanlı takip edin,
              ödeme dekontlarını görüntüleyin ve sipariş durumlarını güncelleyin.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
          >
            Oturumu Kapat
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-purple-500/10 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-widest text-gray-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
              <div
                className={`mt-4 h-1 rounded-full bg-linear-to-r ${stat.accent}`}
              ></div>
            </div>
          ))}
        </section>

        <div className="grid gap-10 lg:grid-cols-[70%,30%]">
          {/* Sol Taraf - Sipariş Listesi */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Tüm Siparişler
              </h2>
              <p className="text-sm text-gray-400">
                En yeni siparişler en üstte olacak şekilde listelenir.
              </p>
            </div>
            {loading && (
              <span className="text-sm font-medium text-purple-200">
                Veriler yükleniyor...
              </span>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div>Sipariş Tarihi</div>
              <div>Müşteri</div>
              <div>Ürün</div>
              <div>Durum</div>
              <div>Dekont</div>
              <div>Aksiyonlar</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {orders.map((order) => {
                const productTitle =
                  order.productLabel || orderTypeLabel(order.orderType);
                const productPrice =
                  order.product?.price || order.price || "Belirtilmedi";
                const orderCreatedAt = formatDateTime(order.createdAt);
                const previewImage =
                  order.image?.url || order.displayImage || null;
                const receiptUrl = order.payment?.receiptUrl || null;
                const receiptUploadedAt = formatDateTime(
                  order.payment?.uploadedAt
                );

                const badges = [
                  {
                    label: "Sipariş",
                    value: statusLabelMap[order.status] || order.status,
                    className:
                      badgeClassMap[statusVariantMap[order.status] || "info"],
                  },
                  {
                    label: "Ödeme",
                    value:
                      statusLabelMap[order.paymentStatus] || order.paymentStatus,
                    className:
                      badgeClassMap[
                        statusVariantMap[order.paymentStatus] || "info"
                      ],
                  },
                ];

                const actions = [];
                if (order.paymentStatus === "receipt_submitted") {
                  actions.push({
                    label: "Ödemeyi Onayla",
                    onClick: () =>
                      handleUpdateStatus(order.id, {
                        paymentStatus: "verified",
                        status: "completed",
                      }),
                  });
                }
                if (order.status !== "completed") {
                  actions.push({
                    label: "Siparişi Tamamla",
                    onClick: () =>
                      handleUpdateStatus(order.id, {
                        status: "completed",
                      }),
                  });
                }

                const customerName =
                  order.customer?.name || order.name || "Belirtilmedi";
                const customerPhone =
                  order.customer?.phone || order.phone || "Belirtilmedi";
                const addressLine = order.shipping?.address
                  ? `${order.shipping.address}${
                      order.shipping.city ? ` • ${order.shipping.city}` : ""
                    }`
                  : order.address
                  ? `${order.address}${order.city ? ` • ${order.city}` : ""}`
                  : "Belirtilmedi";

                const isExpanded = expandedRows.has(order.id);

                return (
                  <div key={order.id} className="bg-black/20">
                    {/* Main Table Row */}
                    <div
                      className="grid grid-cols-6 gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-white/5"
                      onClick={() => toggleRowExpansion(order.id)}
                    >
                      <div className="text-sm text-white">
                        {orderCreatedAt}
                      </div>
                      <div className="text-sm text-white">
                        {customerName}
                      </div>
                      <div className="text-sm text-white">
                        {productTitle}
                        <div className="text-xs text-purple-300 mt-1">
                          {productPrice}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {badges
                          .filter((badge) => badge.value)
                          .map((badge) => (
                            <span
                              key={`${order.id}-${badge.label}`}
                              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                            >
                              {badge.value}
                            </span>
                          ))}
                      </div>
                      <div>
                        {receiptUrl ? (
                          <a
                            href={receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                          >
                            Dekontu Aç
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">Dekont Yok</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {actions.length > 0 && (
                          <div className="flex gap-1">
                            {actions.map((action) => (
                              <button
                                key={action.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick();
                                }}
                                disabled={updatingId === order.id}
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingId === order.id
                                  ? "..."
                                  : action.label === "Ödemeyi Onayla" ? "✓" : "✓"}
                              </button>
                            ))}
                          </div>
                        )}
                        <button
                          className="text-white/60 hover:text-white transition-colors"
                          onClick={() => toggleRowExpansion(order.id)}
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-white/10 bg-black/40 px-6 py-6">
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400">
                              Ürün Detayları
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {productTitle}
                            </p>
                            <p className="text-sm text-purple-300">{productPrice}</p>
                            {order.product?.size && (
                              <p className="text-xs text-gray-400">
                                Boyut: {order.product.size}
                              </p>
                            )}
                            {order.product?.packageType && (
                              <p className="text-xs text-gray-400">
                                Paket:{" "}
                                {order.product.packageType === "premium"
                                  ? "Anı Küresi + Hoparlör"
                                  : "Sadece Anı Küresi"}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Sipariş No: #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400">
                              İletişim Bilgileri
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {customerName}
                            </p>
                            <p className="text-sm text-gray-300">{customerPhone}</p>
                            <p className="mt-2 text-xs text-gray-400">
                              Adres: {addressLine}
                            </p>
                            {order.notes && (
                              <p className="mt-2 text-xs text-gray-400">
                                Not: {order.notes}
                              </p>
                            )}
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400">
                              Ödeme Bilgileri
                            </p>
                            {receiptUrl ? (
                              <div>
                                <a
                                  href={receiptUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                                >
                                  Dekontu Görüntüle
                                </a>
                                {receiptUploadedAt && (
                                  <p className="mt-2 text-xs text-gray-500">
                                    Yüklendi: {receiptUploadedAt}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-gray-400">
                                Henüz dekont yüklenmedi
                              </p>
                            )}
                          </div>
                        </div>

                        {previewImage && (
                          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                            <img
                              src={previewImage}
                              alt="Sipariş görseli"
                              className="h-48 w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {orders.length === 0 && !loading && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-sm text-gray-300">
              Henüz kayıtlı bir sipariş bulunmuyor.
            </div>
          )}
          </section>

          {/* Sağ Taraf - Ödeme Bilgileri Düzenleme */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Ödeme Bilgileri
              </h2>
              <p className="text-sm text-gray-400">
                Müşterilerin göreceği banka ve IBAN bilgilerini düzenleyin.
              </p>
            </div>

            {settingsError && (
              <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {settingsError}
              </div>
            )}

            <form onSubmit={handleSettingsUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Hesap Sahibi / Şirket Adı
                </label>
                <input
                  type="text"
                  value={adminSettings.accountName}
                  onChange={(e) =>
                    setAdminSettings((prev) => ({
                      ...prev,
                      accountName: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="Şirket/Kişi adı"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  IBAN Numarası
                </label>
                <input
                  type="text"
                  value={adminSettings.iban}
                  onChange={(e) =>
                    setAdminSettings((prev) => ({
                      ...prev,
                      iban: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Banka Adı
                </label>
                <input
                  type="text"
                  value={adminSettings.bank}
                  onChange={(e) =>
                    setAdminSettings((prev) => ({
                      ...prev,
                      bank: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="Banka adı"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Şube Adı
                </label>
                <input
                  type="text"
                  value={adminSettings.branch}
                  onChange={(e) =>
                    setAdminSettings((prev) => ({
                      ...prev,
                      branch: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="Şube adı"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={settingsLoading}
                className="w-full rounded-full bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {settingsLoading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </button>
            </form>

            {/* Önizleme */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Müşteri Görünümü Önizlemesi
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hesap Sahibi:</span>
                  <span className="text-white font-medium">{adminSettings.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IBAN:</span>
                  <span className="text-white font-mono text-xs">{adminSettings.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Banka:</span>
                  <span className="text-white">{adminSettings.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Şube:</span>
                  <span className="text-white">{adminSettings.branch}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}