"use client";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-linear-to-r from-purple-900/40 via-blue-900/20 to-transparent blur-3xl opacity-60"></div>
          <div className="relative z-10 mx-auto max-w-6xl space-y-12 text-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
                Güvendiğiniz Başarım
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Neden <span className="text-purple-400">Craft Maket 3D</span>?
              </h2>
              <p className="mx-auto max-w-3xl text-base text-gray-300 md:text-lg">
                Her figürü, sanat ve mühendisliğin birleştiği bir hassasiyetle üretiyoruz. Yalnızca özel anılarınızı değil,
                size özel deneyimi de ölümsüzleştiriyoruz.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Premium SLA Teknolojisi",
                  description:
                    "0.025 mm katman hassasiyeti ile kusursuz yüzeyler ve en ince ayrıntılar. Profesyonel stüdyo ortamında üretim.",
                  icon: "🎯",
                },
                {
                  title: "Kişiselleştirilmiş Tasarım",
                  description:
                    "Deneyimli tasarım ekibimiz fotoğraflarınızı 360° üç boyutlu modele dönüştürür; size özel revizyon imkanı sunar.",
                  icon: "🧩",
                },
                {
                  title: "Denetlenmiş Kalite",
                  description:
                    "Her baskı aşamasında manuel kontrol, UV kürleme ve özel boya koruması ile uzun ömürlü parlaklık garantisi.",
                  icon: "🛡️",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/5 bg-white/5 p-8 text-left shadow-lg shadow-purple-500/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-purple-500/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="production-process" className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 via-purple-900/10 to-transparent blur-3xl opacity-70"></div>
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid items-center gap-16 lg:grid-cols-[1.2fr,1fr]">
              <div>
                <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Üretim Sürecimiz
                </span>
                <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Her Adımda Şeffaflık ve Profesyonellik</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
                  Siparişinizin ilk dokunuştan paketlemeye kadar geçen her aşamasını şeffaf şekilde raporluyoruz. Böylece
                  üretimin ne kadar titiz ilerlediğini adım adım takip edebiliyorsunuz.
                </p>

                <div className="mt-10 space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Tasarım ve Modelleme",
                      description:
                        "Yüklediğiniz görseller profesyonel 3D artistlerimiz tarafından modellenir; sizinle paylaşılan önizleme onayınıza sunulur.",
                    },
                    {
                      step: "2",
                      title: "Hassas Baskı ve Kürleme",
                      description:
                        "SLA makinelerimizde baskı sonrası destekler temizlenir, parça UV ile kürlenir ve dayanıklılığı test edilir.",
                    },
                    {
                      step: "3",
                      title: "Boyama ve Final Kontrol",
                      description:
                        "El işçiliği ile yapılan detay boyama, çizilmeye dayanıklı vernik ve özel paketleme ile figürünüz gönderime hazır.",
                    },
                  ].map((stage) => (
                    <div key={stage.step} className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-lg font-bold text-blue-200">
                        {stage.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-linear-to-br from-gray-900 via-gray-950 to-black p-8 shadow-2xl shadow-blue-500/20">
                <div className="absolute -top-10 -right-10 hidden h-40 w-40 rounded-full bg-blue-500/20 blur-3xl md:block"></div>
                <h3 className="text-2xl font-bold text-white">
                  3D Stüdyo <span className="text-blue-400">Kontrol Paneli</span>
                </h3>
                <p className="mt-4 text-sm text-gray-300">
                  Siparişinizle birlikte size özel hazırlanan Dijital Kontrol Paneli bağlantısı, üretim ilerlemenizi gerçek
                  zamanlı görmenizi sağlar.
                </p>
                <ul className="mt-6 space-y-4 text-sm text-gray-300">
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">✓</span>
                    Fotoğraf ve revizyon yönetimi
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">✓</span>
                    Üretim adımı bildirimleri
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">✓</span>
                    Kargo takibi ve teslim onayı
                  </li>
                </ul>
                <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                  <p className="text-lg font-semibold text-white">%94 müşteri memnuniyeti</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-blue-200">
                    son 12 ayda 1400+ üretim teslim edildi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-linear-to-r from-purple-900/20 via-fuchsia-900/10 to-transparent blur-3xl opacity-60"></div>
          <div className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-lg md:p-14">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <span className="inline-flex items-center rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-pink-200">
                  Her Figürde Deneyim
                </span>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Hayal Ettiğiniz Figürü <span className="text-pink-300">7/24 Destek</span> ile Tasarlıyoruz
                </h2>
                <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                  Siparişinizin her aşamasında WhatsApp ve e-posta üzerinden iletişimde kalıyoruz. Birlikte tasarladığımız
                  figürlerin uzun yıllar dayanması için garanti kapsamında bakım ve onarım desteği sunuyoruz.
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { number: "3.200+", label: "Teslim Edilen Figür" },
                    { number: "4.9/5", label: "Ort. Müşteri Puanı" },
                    { number: "48 saat", label: "İlk Taslak Teslimi" },
                    { number: "%100", label: "Memnuniyet Garantisi" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/40 p-5 text-center">
                      <p className="text-2xl font-bold text-pink-300">{stat.number}</p>
                      <p className="mt-2 text-xs uppercase tracking-widest text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-black/60 p-6 shadow-inner shadow-purple-500/20">
                  <p className="text-lg leading-relaxed text-gray-100">
                    “Craft Maket 3D ekibi düğünümüz için hazırladığı figürü tam hayal ettiğimiz gibi teslim etti. Süreç
                    boyunca her adımı paylaştıkları için kendimizi atölyelerinin içinde hissettik.”
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400"></div>
                    <div>
                      <p className="text-sm font-semibold text-white">İdil & Burak H.</p>
                      <p className="text-xs uppercase tracking-widest text-gray-400">İstanbul | 2025</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                  <h3 className="text-xl font-semibold text-white">Hemen İletişime Geçelim</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Projenizi birkaç cümleyle anlatın, tasarım ekibimiz sizinle aynı gün içinde iletişime geçsin.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/905513481332"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-green-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-transform duration-300 hover:-translate-y-1"
                    >
                      WhatsApp ile Yaz
                    </a>
                    <a
                     
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                    >
                      Proje Formu Gönder
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}