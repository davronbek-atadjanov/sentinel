import PageHeader from "@/components/shared/PageHeader"
import {
    Brain,
    Code,
    Play,
    RotateCcw,
    Shield,
    Zap
} from "lucide-react"

const payloads = [
  {
    id: 1,
    vector: "SQL Injection (Blind Boolean)",
    payload: "' OR 1=1-- -",
    status: "Bajarildi",
    result: "Zaif",
    resultColor: "text-sentinel-error",
    confidence: 98,
  },
  {
    id: 2,
    vector: "XSS Reflected (Script Tag)",
    payload: '<script>alert("XSS")</script>',
    status: "Bajarildi",
    result: "Bloklandi (WAF)",
    resultColor: "text-primary",
    confidence: 72,
  },
  {
    id: 3,
    vector: "SSRF (Internal Network)",
    payload: "http://169.254.169.254/latest/meta-data/",
    status: "Navbatda",
    result: "Kutilmoqda",
    resultColor: "text-[hsl(35,90%,55%)]",
    confidence: null,
  },
  {
    id: 4,
    vector: "Path Traversal (LFI)",
    payload: "../../etc/passwd",
    status: "Bajarildi",
    result: "Zaif Emas",
    resultColor: "text-primary",
    confidence: 95,
  },
];

const PayloadLabPage = () => {
  return (
    <div>
      <PageHeader
        title="AI Payload Laboratoriyasi"
        description="Avtomatlashtirilgan payload yaratish, mutatsiya va uni bajarish. Sizning infratuzilmangizga qarshi sun'iy intellektga asoslangan hujum vektorini sinash."
        badge={
          <span className="flex items-center gap-1.5 ml-3 mt-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-primary font-bold uppercase">AI Bilan Quvvatlangan</span>
          </span>
        }
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <RotateCcw className="w-4 h-4" />
              Laboratoriyani Qayta O'rnatish
            </button>
            <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
              <Play className="w-4 h-4" />
              Barchasini Bajarish
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left: Payload Editor ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Target Config */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Nishon Sozlamalari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Maqsadli Manzil
                </label>
                <input
                  type="text"
                  defaultValue="https://api.v-scan.prod/v1/auth"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  HTTP Metodi
                </label>
                <select className="w-full bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none">
                  <option>POST</option>
                  <option>GET</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payloads Table */}
          <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
            <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)] flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                Yaratilgan Payloadlar
              </h3>
              <span className="text-[10px] text-[hsl(215,15%,45%)] font-semibold">
                {payloads.length} ta vektorlar
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.15)]">
                    <th className="px-5 py-3">Hujum Vektori</th>
                    <th className="px-5 py-3">Payload</th>
                    <th className="px-5 py-3">Natija</th>
                    <th className="px-5 py-3">Ishonch Darajasi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {payloads.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                      <td className="px-5 py-4 font-medium text-on-surface">{p.vector}</td>
                      <td className="px-5 py-4">
                        <code className="text-xs text-primary bg-surface-container px-2 py-1 rounded font-mono">
                          {p.payload}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${p.resultColor}`}>{p.result}</span>
                      </td>
                      <td className="px-5 py-4">
                        {p.confidence ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-surface-high rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${p.confidence > 90 ? "bg-primary" : "bg-[hsl(35,90%,55%)]"}`}
                                style={{ width: `${p.confidence}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[hsl(215,15%,55%)] font-mono">{p.confidence}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[hsl(215,15%,40%)]">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right: AI Sidebar ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Tahlili
            </h3>
            <div className="space-y-4">
              <div className="bg-[hsl(222,60%,4%)] rounded-lg p-4">
                <p className="text-xs text-primary font-semibold mb-2">Tavsiya</p>
                <p className="text-xs text-[hsl(215,15%,55%)] leading-relaxed">
                  Nishon manzil session_token parametri orqali yashirin (blind) SQL inyektsiyasiga zaiflikni ko'rsatmoqda.
                  Test qamrovini vaqtga asoslangan (time-based) va UNION-asosidagi inyektsiya vektorlarini o'z ichiga oladigan tarzda kengaytirish tavsiya etiladi.
                </p>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[hsl(215,15%,45%)]">Model Ishonchi</span>
                <span className="text-primary font-bold">94.2%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[hsl(215,15%,45%)]">Sinalgan Vektorlar</span>
                <span className="text-on-surface font-bold">1,284</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[hsl(215,15%,45%)]">Muvaffaqiyatli Ekspluatatsiyalar</span>
                <span className="text-sentinel-error font-bold">23</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Himoya Profili
            </h3>
            <div className="space-y-3">
              {[
                { label: "WAF Aniqlash", value: "Cloudflare", active: true },
                { label: "Cheklash (Rate Limiting)", value: "50 talab/min", active: true },
                { label: "CSRF Himoyasi", value: "Token-asosida", active: false },
                { label: "Kiritishni Tozalash (Sanitization)", value: "Qisman", active: false },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-[hsl(215,15%,50%)]">{item.label}</span>
                  <span className={`text-xs font-bold ${item.active ? "text-primary" : "text-sentinel-tertiary"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadLabPage;
