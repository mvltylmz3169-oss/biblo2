"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToOrders, updateOrderStatus } from "@/lib/orders";
import { getAdminSettings, updateAdminSettings, getPricing, updatePricing } from "@/lib/adminStorage";

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

const formatShortDate = (value) => {
  if (!value) return "—";
  try {
    const date = new Date(value);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
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
    info: "border-teal-400/30 bg-teal-400/10 text-teal-200 backdrop-blur-sm",
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
    accountName: "Biblo 3d Studio Tasarım ve Üretim Ltd. Şti.",
    iban: "TR12 3456 7890 1234 5678 0001 23",
    bank: "Bank Craft A.Ş.",
    branch: "Maslak Kurumsal Şube",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [pricing, setPricing] = useState({
    sizes: [],
    extraPersonFee: "400 TL",
    maxPersonsIncluded: 4,
  });
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);

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
          accountName: settings.authorizedName || "Biblo 3d Studio Tasarım ve Üretim Ltd. Şti.",
          iban: settings.iban || "TR12 3456 7890 1234 5678 0001 23",
          bank: settings.bank || "Bank Biblo 3d Studio A.Ş.",
          branch: settings.branch || "Maslak Kurumsal Şube",
        });
      } catch (error) {
        console.error("Error loading admin settings:", error);
        setSettingsError("Ayarlar yüklenirken hata oluştu.");
      }
    };

    const loadPricing = async () => {
      try {
        const pricingData = await getPricing();
        setPricing(pricingData);
      } catch (error) {
        console.error("Error loading pricing:", error);
        setPricingError("Fiyat bilgileri yüklenirken hata oluştu.");
      }
    };

    loadSettings();
    loadPricing();
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
        accent: "from-teal-500 to-slate-600",
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
        accent: "from-cyan-500 to-teal-500",
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

  const handlePricingUpdate = async (e) => {
    e.preventDefault();
    setPricingLoading(true);
    setPricingError(null);

    try {
      await updatePricing(pricing);
      alert("Fiyat bilgileri başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating pricing:", error);
      setPricingError("Fiyat bilgileri güncellenirken hata oluştu.");
    } finally {
      setPricingLoading(false);
    }
  };

  const handleAddSize = () => {
    const newOrder = pricing.sizes.length + 1;
    setPricing({
      ...pricing,
      sizes: [...pricing.sizes, { size: "", price: "", order: newOrder }],
    });
  };

  const handleRemoveSize = (index) => {
    const newSizes = pricing.sizes.filter((_, i) => i !== index);
    setPricing({ ...pricing, sizes: newSizes });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...pricing.sizes];
    newSizes[index][field] = value;
    setPricing({ ...pricing, sizes: newSizes });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-teal-500/10 backdrop-blur-xl">
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
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
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
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-rose-300">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-teal-600 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5"
            >
              Admin Girişi Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-teal-500/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-200">
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
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-teal-500/10 backdrop-blur-xl"
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

        {/* Sipariş Listesi - Tam Genişlik */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-teal-500/10 backdrop-blur-xl">
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
              <span className="text-sm font-medium text-teal-200">
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
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-5 gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div>Tarih</div>
              <div>Müşteri</div>
              <div>Ürün</div>
              <div>Dekont</div>
              <div>Aksiyonlar</div>
            </div>
            {/* Table Header - Mobile */}
            <div className="md:hidden grid grid-cols-3 gap-2 border-b border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div>Tarih</div>
              <div>Müşteri</div>
              <div>Ürün</div>
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
                    {/* Main Table Row - Desktop */}
                    <div
                      className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-white/5"
                      onClick={() => toggleRowExpansion(order.id)}
                    >
                      <div className="text-sm text-white">
                        {formatShortDate(order.createdAt)}
                      </div>
                      <div className="text-sm text-white truncate">
                        {customerName}
                      </div>
                      <div className="text-sm text-white">
                        <div className="truncate">{productTitle}</div>
                        <div className="text-xs text-teal-300 mt-1">
                          {productPrice}
                        </div>
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
                            Aç
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">Yok</span>
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

                    {/* Main Table Row - Mobile */}
                    <div
                      className="md:hidden grid grid-cols-3 gap-2 px-3 py-3 cursor-pointer transition-colors hover:bg-white/5 items-center"
                      onClick={() => toggleRowExpansion(order.id)}
                    >
                      <div className="text-xs text-white">
                        {formatShortDate(order.createdAt)}
                      </div>
                      <div className="text-xs text-white truncate">
                        {customerName}
                      </div>
                      <div className="text-xs text-white flex items-center justify-between gap-1">
                        <span className="truncate flex-1">{productTitle}</span>
                        <button
                          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(order.id);
                          }}
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-[500px] md:max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-white/10 bg-black/40 px-3 md:px-6 py-4 md:py-6 max-h-[500px] md:max-h-96 overflow-y-auto">
                        {/* Tarih ve Durum - Sadece detaylarda */}
                        <div className="mb-4 pb-4 border-b border-white/10">
                          <div className="flex flex-wrap gap-2 items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400">Sipariş Tarihi</p>
                              <p className="text-sm text-white font-semibold">{orderCreatedAt}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {badges
                                .filter((badge) => badge.value)
                                .map((badge) => (
                                  <span
                                    key={`${order.id}-${badge.label}`}
                                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${badge.className}`}
                                  >
                                    {badge.label}: {badge.value}
                                  </span>
                                ))}
                            </div>
                          </div>
                          {/* Aksiyonlar - Mobilde buraya taşındı */}
                          {actions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2 md:hidden">
                              {actions.map((action) => (
                                <button
                                  key={action.label}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                  }}
                                  disabled={updatingId === order.id}
                                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {updatingId === order.id
                                    ? "İşleniyor..."
                                    : action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400">
                              Ürün Detayları
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {productTitle}
                            </p>
                            <p className="text-sm text-teal-300">{productPrice}</p>
                            {order.product?.size && (
                              <p className="text-xs text-gray-400 mt-1">
                                Boyut: {order.product.size}
                              </p>
                            )}
                            {order.product?.packageType && (
                              <p className="text-xs text-gray-400 mt-1">
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

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
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

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
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
                          <div className="mt-4 md:mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                            <img
                              src={previewImage}
                              alt="Sipariş görseli"
                              className="h-40 md:h-48 w-full object-cover"
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

        {/* Alt Kısım - Ödeme ve Fiyat Ayarları */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Sol - Ödeme Bilgileri */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 shadow-xl shadow-teal-500/10 backdrop-blur-xl overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Ödeme Bilgileri
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
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
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
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
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
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
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
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
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                  placeholder="Şube adı"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={settingsLoading}
                className="w-full rounded-full bg-linear-to-r from-teal-600 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {settingsLoading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </button>
            </form>

            {/* Önizleme */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 md:p-6 overflow-hidden">
              <h3 className="text-base md:text-lg font-semibold text-white mb-4">
                Müşteri Görünümü Önizlemesi
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                  <span className="text-gray-400 flex-shrink-0">Hesap Sahibi:</span>
                  <span className="text-white font-medium break-words">{adminSettings.accountName}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                  <span className="text-gray-400 flex-shrink-0">IBAN:</span>
                  <span className="text-white font-mono text-xs break-all">{adminSettings.iban}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                  <span className="text-gray-400 flex-shrink-0">Banka:</span>
                  <span className="text-white break-words">{adminSettings.bank}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                  <span className="text-gray-400 flex-shrink-0">Şube:</span>
                  <span className="text-white break-words">{adminSettings.branch}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sağ - Fiyat Yönetimi */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 shadow-xl shadow-teal-500/10 backdrop-blur-xl overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Fiyat Yönetimi
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                3D Figür boyutlarına göre fiyatları düzenleyin.
              </p>
            </div>

            {pricingError && (
              <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {pricingError}
              </div>
            )}

            <form onSubmit={handlePricingUpdate} className="space-y-6">
              {/* Boyut ve Fiyat Listesi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Boyut ve Fiyat Listesi
                </label>
                <div className="space-y-3">
                  {pricing.sizes.map((sizeItem, index) => (
                    <div key={index} className="flex gap-2 items-center min-w-0">
                      <input
                        type="text"
                        value={sizeItem.size}
                        onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 md:px-4 py-2 text-white text-xs md:text-sm outline-none transition focus:border-teal-500"
                        placeholder="10 cm"
                        required
                      />
                      <input
                        type="text"
                        value={sizeItem.price}
                        onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 md:px-4 py-2 text-white text-xs md:text-sm outline-none transition focus:border-teal-500"
                        placeholder="1.850 TL"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="p-2 flex-shrink-0 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Sil"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="mt-3 w-full rounded-xl border border-dashed border-white/20 bg-black/20 px-4 py-2 text-sm text-gray-400 hover:border-teal-500/50 hover:text-white transition-colors"
                >
                  + Yeni Boyut Ekle
                </button>
              </div>

              {/* Ekstra Kişi Ücreti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Max Kişi Sayısı
                  </label>
                  <input
                    type="number"
                    value={pricing.maxPersonsIncluded}
                    onChange={(e) =>
                      setPricing((prev) => ({
                        ...prev,
                        maxPersonsIncluded: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                    placeholder="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Ekstra Kişi Ücreti
                  </label>
                  <input
                    type="text"
                    value={pricing.extraPersonFee}
                    onChange={(e) =>
                      setPricing((prev) => ({
                        ...prev,
                        extraPersonFee: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                    placeholder="400 TL"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pricingLoading}
                className="w-full rounded-full bg-linear-to-r from-teal-600 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pricingLoading ? "Güncelleniyor..." : "Fiyatları Güncelle"}
              </button>
            </form>

            {/* Önizleme */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 md:p-6 overflow-hidden">
              <h3 className="text-base md:text-lg font-semibold text-white mb-4">
                Müşteri Görünümü Önizlemesi
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400 break-words">
                  Bir görselde Max {pricing.maxPersonsIncluded} kişi - {pricing.maxPersonsIncluded}'ten fazla kişi için +{pricing.extraPersonFee}
                </p>
                {pricing.sizes.map((sizeItem, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <span className="text-white break-words">{sizeItem.size}</span>
                    <span className="text-teal-300 font-medium whitespace-nowrap">{sizeItem.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}