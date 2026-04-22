import PageHeader from "@/components/shared/PageHeader"
import { ScansService } from "@/services/scans.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar, Lightbulb, Lock, Sliders, Zap } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const scanTypes = [
  { id: "quick", label: "Tezkor skanerlash", desc: "OWASP Top 10 xavflarining yuzaki tahlili.", active: true },
  { id: "full", label: "To'liq audit", desc: "Keng qamrovli tarkibiy va mantiqiy testlar." },
  { id: "custom", label: "Maxsus profil", desc: "Foydalanuvchi tomonidan belgilangan siyosat va qoidalar." },
];

const assetTypes = [
  { id: "WEB_APP", label: "Veb ilova" },
  { id: "API", label: "API yakuniy nuqtasi" },
  { id: "NETWORK", label: "Tarmoq infratuzilmasi" },
  { id: "MOBILE", label: "Mobil ilova" },
];

const schedules = [
  { label: "Kunlik texnik xizmat", active: true },
  { label: "Haftalik salomatlik tekshiruvi" },
  { label: "Oylik muvofiqlik auditi" },
];

const ScanConfigPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Primary Configuration
  const [targetUrl, setTargetUrl] = useState("https://api.production-environment.com");
  const [selectedType, setSelectedType] = useState("quick");
  const [useAssetTypeOverride, setUseAssetTypeOverride] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState("WEB_APP");

  // Auth Configuration
  const [authEnabled, setAuthEnabled] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoginUrl, setAuthLoginUrl] = useState("https://api.production-environment.com/v1/auth/login");

  // Advanced Parameters
  const [depth, setDepth] = useState(10);
  const [parallelism, setParallelism] = useState(25);
  const [forceHttps, setForceHttps] = useState(false);
  const [followRedirects, setFollowRedirects] = useState(true);

  // Schedule Configuration
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(schedules[0]?.label || "");
  const [scheduleStartTime, setScheduleStartTime] = useState("02:00");
  const [scheduleEndTime, setScheduleEndTime] = useState("05:00");

  const startScanMutation = useMutation({
    mutationFn: ScansService.createScan,
    onSuccess: () => {
      toast.success("Skanerlash muvaffaqiyatli boshlandi");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      // Redirect to list to see progress
      navigate("/app/scans");
    },
    onError: (err: any) => {
      toast.error(err.message || "Skanerlashni boshlashda xatolik yuz berdi");
    }
  });

  const handleExecuteScan = () => {
    // Validation: Target URL
    if (!targetUrl.trim()) {
      toast.error("Nishon URL manzili kiritilishi shart");
      return;
    }

    // Validation: URL format
    try {
      new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      toast.error("Noto'g'ri URL formati. Misal: https://example.com yoki example.com");
      return;
    }

    // Validation: Auth if enabled
    if (authEnabled) {
      if (!authUsername.trim()) {
        toast.error("Foydalanuvchi nomi kiritilishi shart (auth yoqilgan)");
        return;
      }
      if (!authPassword.trim()) {
        toast.error("Parol kiritilishi shart (auth yoqilgan)");
        return;
      }
    }

    // Validation: Schedule if enabled
    if (scheduleEnabled) {
      if (!selectedSchedule) {
        toast.error("Takrorlanish qonuniyati tanlanishi shart (schedule yoqilgan)");
        return;
      }
      // Validate time format
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(scheduleStartTime)) {
        toast.error("Boshlang'ich vaqti noto'g'ri (HH:MM formatida)");
        return;
      }
      if (!timeRegex.test(scheduleEndTime)) {
        toast.error("Tugash vaqti noto'g'ri (HH:MM formatida)");
        return;
      }
      // Validate time logic
      if (scheduleStartTime >= scheduleEndTime) {
        toast.error("Boshlang'ich vaqt tugash vaqtidan oldin bo'lishi kerak");
        return;
      }
    }

    // Validation: Advanced parameters
    if (depth < 1 || depth > 20) {
      toast.error("Qidiruv chuqurligi 1-20 oralig'ida bo'lishi kerak");
      return;
    }
    if (parallelism < 1 || parallelism > 100) {
      toast.error("Parallelizm 1-100 oralig'ida bo'lishi kerak");
      return;
    }

    // Build config object with all parameters
    const config: any = {};

    // Asset type override
    if (useAssetTypeOverride) {
      config.asset_type = selectedAssetType;
    }

    // Auth configuration
    if (authEnabled && authUsername.trim()) {
      config.auth = {
        username: authUsername,
        password: authPassword,
        login_url: authLoginUrl || undefined,
      };
    }

    // Advanced parameters
    config.advanced = {
      depth,
      parallelism,
      force_https: forceHttps,
      follow_redirects: followRedirects,
    };

    // Schedule configuration
    if (scheduleEnabled && selectedSchedule) {
      config.schedule = {
        frequency: selectedSchedule.toLowerCase().includes("kun")
          ? "DAILY"
          : selectedSchedule.toLowerCase().includes("hafta")
            ? "WEEKLY"
            : "MONTHLY",
        start_time: scheduleStartTime,
        end_time: scheduleEndTime,
      };
    }

    startScanMutation.mutate({
      target_url: targetUrl,
      scan_type: selectedType.toUpperCase(),
      config: Object.keys(config).length > 0 ? config : undefined,
    });
  };

  return (
    <div>
      <PageHeader
        title="Skanerlash sozlamalari"
        description="Yangi maqsadli skanerlashni boshlang yoki rejalashtirilgan takroriy baholashlarni yangilang."
        actions={
          <>
            <button 
              onClick={() => navigate("/app/scans")}
              className="bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              O'zgarishlarni bekor qilish
            </button>
            <button 
              onClick={handleExecuteScan}
              disabled={startScanMutation.isPending}
              className="bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50"
            >
              {startScanMutation.isPending ? "Boshlanmoqda..." : "Skanerlashni boshlash"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Column: Config Form ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Primary Objective */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold font-headline text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-primary rounded-full" />
              </span>
              Asosiy maqsad
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-2">
                  Nishon URL / host nomi
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-2">
                  Aktiv turini qo'lda belgilash
                </label>
                <label className="flex items-center gap-3 text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={useAssetTypeOverride}
                    onChange={(event) => setUseAssetTypeOverride(event.target.checked)}
                    className="w-4 h-4 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30"
                  />
                  Aktiv turini tanlash
                </label>
                {useAssetTypeOverride ? (
                  <select
                    value={selectedAssetType}
                    onChange={(event) => setSelectedAssetType(event.target.value)}
                    className="w-full mt-3 bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                  >
                    {assetTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[10px] text-[hsl(215,15%,45%)] mt-2">
                    Avto aniqlash rejimida URL ichida /api bo'lsa API, aks holda WEB_APP olinadi.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {scanTypes.map((type) => {
                  const isActive = type.id === selectedType;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-surface-container border-ghost hover:bg-surface-high"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-sm font-bold ${isActive ? "text-primary" : "text-on-surface"}`}>
                          {type.label}
                        </h4>
                        {isActive && <span className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <p className="text-xs text-[hsl(215,15%,45%)]">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Authenticated Scanning */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline text-white text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Autentifikatsiyalangan skanerlash
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">Holat:</span>
                <span className={`text-[10px] uppercase font-bold ${authEnabled ? "text-primary" : "text-[hsl(215,15%,50%)]"}`}>
                  {authEnabled ? "Yoqilgan" : "O'chirilgan"}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-on-surface mb-4">
              <input
                type="checkbox"
                checked={authEnabled}
                onChange={(event) => setAuthEnabled(event.target.checked)}
                className="w-4 h-4 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30"
              />
              Autentifikatsiyalangan skanerlashni yoqish
            </label>

            {authEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                    Foydalanuvchi nomi / API kaliti
                  </label>
                  <input
                    type="text"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="admin / API_KEY"
                    className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                    Parol / maxfiy so'z
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {authEnabled && (
              <div className="mt-4">
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Tizimga kirish formasi URL (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={authLoginUrl}
                  onChange={(e) => setAuthLoginUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/auth/login"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Advanced Parameters */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold font-headline text-white text-lg flex items-center gap-2 mb-6">
              <Sliders className="w-5 h-5 text-primary" />
              Murakkab parametrlar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                    Maksimal qidiruv chuqurligi
                  </label>
                  <span className="text-sm text-primary font-mono font-bold">{depth} daraja</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1 bg-surface-high rounded-full appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-primary/60 mt-2">
                  Qidiruv botining kataloglar tuzilmasini qanchalik chuqur o'rganishini belgilaydi.
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                    So'rovlar parallelizmi
                  </label>
                  <span className="text-sm text-primary font-mono font-bold">{parallelism} so'rov/s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={parallelism}
                  onChange={(e) => setParallelism(parseInt(e.target.value))}
                  className="w-full h-1 bg-surface-high rounded-full appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-primary/60 mt-2">
                  Nishon server resurslarini haddan tashqari yuklamaslik uchun sozlang.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <label className="flex items-start gap-3 p-4 bg-surface-container rounded-lg cursor-pointer hover:bg-surface-high transition-colors">
                <input
                  type="checkbox"
                  checked={forceHttps}
                  onChange={(e) => setForceHttps(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30"
                />
                <div>
                  <span className="text-sm font-semibold text-on-surface block">HTTPS dan majburiy foydalanish</span>
                  <span className="text-xs text-[hsl(215,15%,45%)]">Barcha xavfsiz bo'lmagan ulanishlarni avtomatik ravishda yangilaydi.</span>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 bg-surface-container rounded-lg cursor-pointer hover:bg-surface-high transition-colors">
                <input
                  type="checkbox"
                  checked={followRedirects}
                  onChange={(e) => setFollowRedirects(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30"
                />
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Qayta yo'naltirishlarni kuzatish</span>
                  <span className="text-xs text-[hsl(215,15%,45%)]">Kashfiyot davomida 301/302 status kodlarini kuzatish.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-surface-low rounded-xl p-5 border-ghost border-l-4 border-l-primary/30">
            <h4 className="text-sm font-bold text-white mb-2">Qisqa yo'riqnoma</h4>
            <ul className="space-y-2 text-xs text-[hsl(215,15%,45%)]">
              <li>Skan boshlanganida target URL bo'yicha aktiv mavjudligi tekshiriladi.</li>
              <li>Aktiv topilmasa, tizim avtomatik ravishda aktiv yaratadi va ro'yxatga qo'shadi.</li>
              <li>Aktiv turini belgilash yoqilsa shu qiymat ishlatiladi, aks holda /api bo'lsa API tanlanadi.</li>
            </ul>
          </div>
        </div>

        {/* ── Right Column: Schedule & Summary ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Temporal Schedule */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Vaqtinchalik reja
              </h3>
              <div
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                  scheduleEnabled ? "bg-primary" : "bg-surface-high"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-on-surface-variant rounded-full transition-transform ${
                    scheduleEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>

            {scheduleEnabled && (
              <>
                <div className="space-y-1 mb-6">
                  <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Takrorlanish qonuniyati
                  </p>
                  {schedules.map((s) => (
                    <div
                      key={s.label}
                      onClick={() => setSelectedSchedule(s.label)}
                      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                        s.label === selectedSchedule
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-surface-container hover:bg-surface-high"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          s.label === selectedSchedule ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {s.label}
                      </span>
                      {s.label === selectedSchedule && (
                        <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-on-primary-fixed font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Bajarish oynasi (UTC)
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={scheduleStartTime}
                      onChange={(e) => setScheduleStartTime(e.target.value)}
                      className="flex-1 bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface text-center font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
                    />
                    <span className="text-[hsl(215,15%,45%)] text-sm">gacha</span>
                    <input
                      type="time"
                      value={scheduleEndTime}
                      onChange={(e) => setScheduleEndTime(e.target.value)}
                      className="flex-1 bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface text-center font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-[hsl(215,15%,40%)] mt-3">
                    Xizmat butunligini saqlash uchun tizim skanerlari past trafikli vaqtlarga moslashtirilgan.
                  </p>
                </div>
              </>
            )}

            {!scheduleEnabled && (
              <p className="text-sm text-[hsl(215,15%,45%)]">
                Vaqtinchalik rejani yoqish uchun yuqoridagi tugmani bosing.
              </p>
            )}
          </div>

          {/* Execution Summary */}
          <div className="bg-surface-low rounded-xl p-6 border border-primary/20">
            <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-4">
              Bajarilish Xulosasi
            </p>
            <div className="space-y-3">
              {[
                { label: "Jami Modullar", value: "142" },
                { label: "Taxminiy Davomiyligi", value: "~14 daq" },
                { label: "Tarmoqqa Ta'siri", value: "MINIMAL", valueColor: "text-primary" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-[hsl(215,15%,55%)]">{item.label}</span>
                  <span className={`text-sm font-bold font-mono ${item.valueColor || "text-on-surface"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ready for Deployment */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h4 className="font-bold text-white mb-1">Bajarishga Tayyor</h4>
            <p className="text-xs text-[hsl(215,15%,45%)]">
              Agent "Sentinel-Alpha" kutish rejimida
            </p>
          </div>

          {/* Configuration Tip */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost border-l-4 border-l-primary/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Sozlash Maslahati</h4>
                <p className="text-xs text-[hsl(215,15%,45%)]">
                  Parallelizm darajasining 50 so'rov/soniyadan oshishi zamonaviy bulutli muhitlarda WAF cheklovini keltirib chiqarishi mumkin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanConfigPage;
