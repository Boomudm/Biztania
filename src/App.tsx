import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  Factory,
  FileText,
  Fish,
  Info,
  Layers3,
  List,
  Map,
  MapPin,
  Navigation,
  Network,
  Plus,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Waves,
  X,
} from "lucide-react";
import { anchor, observationLabels, reports } from "./data/reports";
import { buildDemoCluster } from "./services/clusteringService";
import { assessRisk } from "./services/riskService";
import { analyzeIncident, type ConciergeAnalysis } from "./services/aiService";
import { evaluateDemoCluster } from "./services/evaluationService";
import type { Report } from "./types";
import { formatTime } from "./utils/format";

type Screen =
  | "report"
  | "citizen-success"
  | "tracking"
  | "officer-dashboard"
  | "officer-reports"
  | "officer-complete"
  | "incident"
  | "structured"
  | "how";
type Role = "citizen" | "officer";
const cluster = buildDemoCluster(reports),
  otherReports = reports.filter((r) => !cluster.some((c) => c.id === r.id)),
  risk = assessRisk(cluster);
const evaluation = evaluateDemoCluster();
const EcoAlertMark = () => (
  <svg
    className="eco-alert-mark"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <path
      className="mark-dark"
      d="M10 24C13.8 12.5 22 7 32 7s18.2 5.5 22 17"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      className="mark-lime"
      d="M8 31c8-5.5 15-5.5 23 0s15 5.5 25 0"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      className="mark-dark"
      d="M12 42c7-4.5 13-4.5 20 0s13 4.5 20 0"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path className="mark-dark-fill" d="M21 50h22L32 62 21 50Z" />
  </svg>
);
const Logo = () => (
  <div className="brand">
    <span className="logo">
      <EcoAlertMark />
    </span>
    <span>
      <b>
        <span>Eco-</span>
        <em>Alert</em>
      </b>
      <small>ผู้ช่วยเฝ้าระวังสิ่งแวดล้อม</small>
    </span>
  </div>
);
const Badge = ({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: string;
}) => <span className={`badge ${tone}`}>{children}</span>;
const SafetyNote = () => (
  <div className="safety-note">
    <ShieldCheck />
    <div>
      <b>AI ประเมิน “ความเร่งด่วน” ไม่ได้ระบุชนิดของสารเคมี</b>
      <span>
        ต้องมีเจ้าหน้าที่ตรวจสอบพื้นที่และตรวจทางห้องปฏิบัติการเพื่อยืนยัน
      </span>
    </div>
  </div>
);
const Concierge = () => (
  <div className="concierge">
    <span>
      <Sparkles />
    </span>
    <div>
      <b>Eco-Alert AI</b>
      <small>ผู้ช่วยวิเคราะห์และเชื่อมโยงเหตุสิ่งแวดล้อม</small>
    </div>
  </div>
);
const Journey = ({ step }: { step: 1 | 2 | 3 | 4 }) => (
  <div className="ai-journey">
    {["รับข้อมูล", "เชื่อมโยง", "ประเมิน", "เตรียมส่ง"].map((label, i) => (
      <div key={label} className={i + 1 <= step ? "active" : ""}>
        <span>{i + 1 < step ? <Check /> : i + 1}</span>
        <b>{label}</b>
        {i < 3 && <i />}
      </div>
    ))}
  </div>
);
type DemoCase = {
  id: string;
  title: string;
  area: string;
  reportIds: string[];
  confidence: number;
  score: number;
  level: string;
  signals: string;
  decision: string;
};
const demoCases: DemoCase[] = [
  {
    id: "PB-024",
    title: "เหตุคุณภาพน้ำริมคลอง",
    area: "คลองปราจีนบุรี",
    reportIds: [
      "R-101",
      "R-102",
      "R-103",
      "R-104",
      "R-105",
      "R-106",
      "R-107",
      "R-108",
    ],
    confidence: 91,
    score: 87,
    level: "เร่งด่วนสูง",
    signals: "กลิ่นฉุน · คราบสีรุ้ง · ปลาตาย",
    decision: "รวมเป็นเหตุการณ์เดียว",
  },
  {
    id: "PB-031",
    title: "น้ำเสียบริเวณตลาด",
    area: "ตลาดฝั่งตะวันตก",
    reportIds: ["R-301", "R-302", "R-303"],
    confidence: 84,
    score: 62,
    level: "เฝ้าระวัง",
    signals: "น้ำเสีย · ฟอง · กลิ่นเหม็น",
    decision: "รวมเป็นกลุ่มเหตุใหม่",
  },
  {
    id: "PB-041",
    title: "ควันผิดปกติริมถนน",
    area: "ถนนเขตอุตสาหกรรม",
    reportIds: ["R-201", "R-209", "R-210"],
    confidence: 88,
    score: 71,
    level: "เร่งด่วนสูง",
    signals: "ควันดำ · กลิ่นไหม้ · จุดเดิม",
    decision: "รวมเป็นกลุ่มเหตุใหม่",
  },
];
function ClusterExplorer({
  active,
  onChange,
}: {
  active: DemoCase;
  onChange: (demoCase: DemoCase) => void;
}) {
  const activeReports = reports.filter((r) => active.reportIds.includes(r.id));
  return (
    <section className="cluster-explorer">
      <div className="section-heading">
        <span>ทดลองดูการจัดกลุ่ม</span>
        <h2>เลือกเคสเพื่อดูว่า AI รวมรายงานอย่างไร</h2>
      </div>
      <div className="case-tabs">
        {demoCases.map((c) => (
          <button
            key={c.id}
            className={active.id === c.id ? "active" : ""}
            onClick={() => onChange(c)}
          >
            <span>{c.id}</span>
            <b>{c.title}</b>
            <small>
              {c.reportIds.length} รายงาน · {c.area}
            </small>
          </button>
        ))}
      </div>
      <div className="case-result">
        <div className="mini-cluster">
          <div className="mini-ring" />
          {activeReports.map((r, i) => (
            <button
              key={r.id}
              title={r.description}
              style={
                {
                  "--i": i,
                  "--count": activeReports.length,
                } as React.CSSProperties
              }
            >
              <MapPin />
              <span>{r.id}</span>
            </button>
          ))}
          <div className="mini-center">
            <b>{active.reportIds.length}</b>
            <small>รายงาน</small>
          </div>
        </div>
        <div className="case-reason">
          <Badge tone={active.score >= 70 ? "red" : "amber"}>
            {active.level}
          </Badge>
          <h3>
            {active.reportIds.length} รายงาน → {active.decision}
          </h3>
          <p>{active.signals}</p>
          <div className="case-metrics">
            <span>
              <b>{active.confidence}%</b>ความมั่นใจ
            </span>
            <span>
              <b>{active.score}/100</b>ความเร่งด่วน
            </span>
          </div>
          <div className="case-logic">
            <span>
              <Check /> ตำแหน่งใกล้กัน
            </span>
            <span>
              <Check /> เวลาใกล้เคียงกัน
            </span>
            <span>
              <Check /> ลักษณะเหตุสอดคล้องกัน
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomNav({
  screen,
  go,
  role,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  role: Role;
}) {
  if (role === "officer") return null;
  return (
    <nav className="bottom-nav">
      <button
        className={screen === "report" ? "active" : ""}
        onClick={() => go("report")}
      >
        <Plus />
        <span>แจ้งเหตุ</span>
      </button>
      <button
        className={
          screen === "tracking" || screen === "citizen-success" ? "active" : ""
        }
        onClick={() => go("tracking")}
      >
        <Clock3 />
        <span>ติดตาม</span>
      </button>
    </nav>
  );
}
function Shell({
  screen,
  go,
  role,
  switchRole,
  children,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  role: Role;
  switchRole: (role: Role) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`app-shell ${role}-shell`}>
      <header>
        <button
          className="brand-button"
          onClick={() =>
            go(role === "citizen" ? "report" : "officer-dashboard")
          }
        >
          <Logo />
        </button>
        <nav className="top-nav">
          {role === "citizen" ? (
            <>
              <button
                className={screen === "report" ? "active" : ""}
                onClick={() => go("report")}
              >
                แจ้งเหตุ
              </button>
              <button
                className={
                  screen === "tracking" || screen === "citizen-success"
                    ? "active"
                    : ""
                }
                onClick={() => go("tracking")}
              >
                ติดตาม
              </button>
            </>
          ) : (
            <>
              <button
                className={screen === "officer-dashboard" ? "active" : ""}
                onClick={() => go("officer-dashboard")}
              >
                ภาพรวม
              </button>
              <button
                className={
                  screen === "incident" || screen === "structured"
                    ? "active"
                    : ""
                }
                onClick={() => go("incident")}
              >
                เหตุการณ์
              </button>
              <button
                className={screen === "officer-reports" ? "active" : ""}
                onClick={() => go("officer-reports")}
              >
                รายงานประชาชน
              </button>
              <button
                className={screen === "how" ? "active" : ""}
                onClick={() => go("how")}
              >
                ระบบ AI
              </button>
            </>
          )}
        </nav>
        <div className="header-actions">
          <div className="role-switch" aria-label="สลับบทบาทสำหรับ Demo">
            <small>Demo Mode</small>
            <button
              className={role === "citizen" ? "active" : ""}
              onClick={() => switchRole("citizen")}
            >
              ประชาชน
            </button>
            <button
              className={role === "officer" ? "active" : ""}
              onClick={() => switchRole("officer")}
            >
              เจ้าหน้าที่
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <BottomNav screen={screen} go={go} role={role} />
    </div>
  );
}

function HomePage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page home-page">
      <section className="hero">
        <div>
          <Badge>
            <Radar /> ระบบเฝ้าระวังเหตุสิ่งแวดล้อม
          </Badge>
          <h1>
            เห็นเหตุการณ์ใหญ่
            <br />
            จากรายงานเล็ก ๆ
          </h1>
          <p>
            AI เชื่อมโยงรายงานจากประชาชนกับบริบทพื้นที่
            เพื่อช่วยให้เจ้าหน้าที่เห็นว่า <em>ควรตรวจสอบที่ใดก่อน</em>
          </p>
          <div className="hero-actions">
            <button className="primary big" onClick={() => go("report")}>
              <AlertTriangle /> แจ้งเหตุผิดปกติ <ArrowRight />
            </button>
            <button className="secondary" onClick={() => go("incident")}>
              <Map /> ดูเหตุการณ์ใกล้เคียง
            </button>
          </div>
        </div>
        <div className="signal-visual">
          <div className="radar-ring r1" />
          <div className="radar-ring r2" />
          <div className="signal-core">
            <span>8</span>
            <small>รายงาน</small>
          </div>
          {cluster.map((_, n) => (
            <i key={n} style={{ "--n": n } as React.CSSProperties} />
          ))}
        </div>
      </section>
      <section className="nearby-card">
        <div className="nearby-image">
          <img src="/assets/canal-evidence.png" />
          <Badge tone="red">เร่งด่วนสูง</Badge>
        </div>
        <div className="nearby-copy">
          <div className="eyebrow">
            <Navigation /> พบเหตุใกล้คุณ 1.2 กม.
          </div>
          <h2>อาจพบเหตุการณ์มลพิษ</h2>
          <p>
            รายงานหลายรายการบริเวณคลองปราจีนบุรีอาจเกี่ยวข้องกับเหตุการณ์เดียวกัน
          </p>
          <div className="incident-stats">
            <span>
              <b>PB-024</b>
              <small>เหตุการณ์</small>
            </span>
            <span>
              <b>8</b>
              <small>รายงาน</small>
            </span>
            <span>
              <b>12 นาที</b>
              <small>ล่าสุด</small>
            </span>
          </div>
          <button className="link" onClick={() => go("incident")}>
            ดูเหตุการณ์ <ArrowRight />
          </button>
        </div>
      </section>
      <SafetyNote />
    </div>
  );
}

function ReportPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page narrow citizen-report-page">
      <div className="citizen-report-head">
        <div>
          <span>Eco-Alert · แจ้งเหตุ</span>
          <h1>พบสิ่งผิดปกติ?</h1>
          <p className="page-intro">
            ส่งภาพสิ่งที่คุณพบ Eco-Alert AI จะช่วยตรวจสอบและจัดข้อมูล
            เพื่อให้เจ้าหน้าที่ตรวจสอบต่อ
          </p>
        </div>
      </div>
      <div className="report-grid">
        <section className="upload-card">
          <img src="/assets/canal-evidence.png" />
          <div className="photo-label">
            <Check /> เลือกภาพแล้ว
          </div>
          <button>
            <Upload /> ถ่ายภาพหรือเลือกภาพใหม่
          </button>
        </section>
        <section className="form-card">
          <div className="capture-row">
            <div>
              <MapPin />
              <span>
                <b>13.9298, 101.5741</b>
                <small>ตำแหน่ง GPS · ± 8 ม.</small>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <b>11:36 น.</b>
                <small>2 ต.ค. 2569</small>
              </span>
            </div>
          </div>
          <label>
            เล่าเพิ่มเติมว่าเกิดอะไรขึ้น <small>(ไม่บังคับ)</small>
          </label>
          <textarea
            defaultValue={anchor.description}
            placeholder="เช่น น้ำมีกลิ่นผิดปกติ หรือพบปลาตาย"
          />
          <div className="citizen-ai-note">
            <Sparkles />
            <span>
              <b>ไม่ต้องเลือกประเภทเหตุ</b>
              <small>Eco-Alert AI จะช่วยจัดข้อมูลให้เจ้าหน้าที่</small>
            </span>
          </div>
          <div className="privacy">
            <Info /> ระบบใช้ภาพ ตำแหน่ง และเวลาเพื่อส่งต่อให้เจ้าหน้าที่ตรวจสอบ
          </div>
          <button
            className="primary full citizen-submit"
            onClick={() => go("citizen-success")}
          >
            <Send /> ส่งรายงาน <ArrowRight />
          </button>
        </section>
      </div>
    </div>
  );
}

function AnalysisPage({ go }: { go: (s: Screen) => void }) {
  const [stage, setStage] = useState(0),
    [result, setResult] = useState<ConciergeAnalysis | null>(null);
  useEffect(() => {
    const ids = [0, 1, 2, 3, 4].map((_, i) =>
      setTimeout(() => setStage(i + 1), 350 + i * 430),
    );
    analyzeIncident(anchor)
      .then(setResult)
      .catch(() => setResult(null));
    return () => ids.forEach(clearTimeout);
  }, []);
  const work = [
    ["ทำความเข้าใจสิ่งที่คุณพบ", "คราบสีรุ้ง · กลิ่นฉุน · ปลาตาย"],
    ["ตรวจสอบบริบทพื้นที่", "พบพื้นที่อุตสาหกรรมใกล้เคียง"],
    ["ค้นหารายงานที่เกี่ยวข้อง", "พบอีก 7 รายงานในพื้นที่ใกล้เคียง"],
    ["เชื่อมโยงรูปแบบเหตุการณ์", "ตำแหน่ง · เวลา · ลักษณะเหตุ"],
  ];
  const ready = stage >= 5;
  return (
    <div className="page analysis-page">
      <Journey step={ready ? 3 : 2} />
      <div className="analysis-head">
        <Concierge />
        <h1>Eco-Alert AI กำลังตรวจสอบเหตุนี้</h1>
        <p>คุณส่งหลักฐานแล้ว ที่เหลือให้เราจัดการข้อมูลที่ซับซ้อน</p>
      </div>
      <div className="processing-list concierge-work">
        {work.map(([title, detail], i) => (
          <div className={stage > i ? "done" : "working"} key={title}>
            <span>{stage > i ? <Check /> : <CircleDot />}</span>
            <div>
              <b>{title}</b>
              <small>{stage > i ? detail : "กำลังดำเนินการ…"}</small>
            </div>
          </div>
        ))}
      </div>
      {ready && (
        <>
          <div className="integration-source">
            <Database />
            <span>
              <b>
                {result?.mode === "live"
                  ? "AI วิเคราะห์จากรูปและข้อความ"
                  : "โหมดสาธิตที่เชื่อถือได้"}
              </b>
              <small>
                {result?.nearbyReports.sourceLabelTh ||
                  "ข้อมูลจำลองสำหรับ Prototype"}{" "}
                · {result?.context.safety.sourceLabelTh || "Mock/RAG"}
              </small>
            </span>
          </div>
          <div className="connection-found">
            <Badge>
              <Check /> พบความเชื่อมโยง
            </Badge>
            <div>
              <b>{result?.cluster.reports.length || 8} รายงาน</b>
              <ArrowRight />
              <strong>อาจเป็นเหตุการณ์เดียวกัน</strong>
            </div>
          </div>
          <section className="analysis-result">
            <div className="score-ring">
              <span>{result?.urgency.score || risk.score}</span>
              <small>/ 100</small>
            </div>
            <div>
              <span className="result-label">ความเร่งด่วน</span>
              <Badge tone="red">สูง</Badge>
              <h2>ควรตรวจสอบภาคสนามโดยเร็ว</h2>
              <p>
                {result?.explanationTh ||
                  "AI จัดลำดับจากหลายรายงานและบริบทพื้นที่ร่วมกัน"}
              </p>
            </div>
          </section>
          <SafetyNote />
          <button className="primary centered" onClick={() => go("incident")}>
            ดูการเชื่อมโยงบนแผนที่ <ArrowRight />
          </button>
        </>
      )}
    </div>
  );
}

function DetailPanel({
  selected,
  onOverview,
  activeCase,
  caseReports,
}: {
  selected: Report | null;
  onOverview: () => void;
  activeCase: DemoCase;
  caseReports: Report[];
}) {
  const orderedReports = [...caseReports].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  if (!selected)
    return (
      <section className="selection-panel overview-panel">
        <div className="panel-kicker">
          <Sparkles /> Eco-Alert AI พบความเชื่อมโยง
        </div>
        <h2>เหตุการณ์ #{activeCase.id}</h2>
        <div className="overview-count">
          <b>{caseReports.length}</b>
          <span>
            รายงานจากประชาชน
            <br />
            อาจเกี่ยวข้องกับเหตุเดียวกัน
          </span>
        </div>
        <div className="overview-stats">
          <span>
            <b>{formatTime(orderedReports[0]?.timestamp || "")}</b>รายงานแรก
          </span>
          <span>
            <b>{formatTime(orderedReports.at(-1)?.timestamp || "")}</b>
            รายงานล่าสุด
          </span>
          <span>
            <b>{activeCase.confidence}%</b>ความมั่นใจ
          </span>
          <span>
            <b>{activeCase.score}/100</b>
            {activeCase.level}
          </span>
        </div>
        <p>AI เชื่อมโยงจากตำแหน่ง เวลา ลักษณะเหตุ และบริบทพื้นที่</p>
      </section>
    );
  return (
    <section className="selection-panel report-panel" key={selected.id}>
      <div className="panel-kicker">
        <MapPin /> หลักฐานดิบจากประชาชน · {selected.id}
      </div>
      <h2>รายงานเมื่อ {formatTime(selected.timestamp)} น.</h2>
      {selected.image ? (
        <img
          src={selected.image}
          style={{
            objectPosition: `${30 + ((Number(selected.id.slice(-1)) * 7) % 60)}% center`,
          }}
        />
      ) : (
        <div className={`report-visual case-${activeCase.id.toLowerCase()}`}>
          {activeCase.id === "PB-041" ? <Factory /> : <Waves />}
          <span>{activeCase.title}</span>
          <small>รายงานนี้ไม่มีภาพแนบ</small>
        </div>
      )}
      <blockquote>“{selected.description}”</blockquote>
      <div className="report-location">
        <Navigation /> {activeCase.area} · จาก GPS รายงาน
      </div>
      <label className="ai-understands">
        <Sparkles /> Eco-Alert AI เข้าใจว่า
      </label>
      <div className="tags">
        {selected.observations.map((o) => (
          <span key={o}>{observationLabels[o]}</span>
        ))}
      </div>
      <button className="link" onClick={onOverview}>
        กลับไปดูภาพรวมเหตุการณ์
      </button>
    </section>
  );
}

function AiSheet({ close }: { close: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={close}>
      <section className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={close}>
          <X />
        </button>
        <span className="sheet-kicker">เบื้องหลังการจัดกลุ่ม</span>
        <h2>AI พิจารณาจากอะไร?</h2>
        <div className="reason-rows">
          <div>
            <MapPin />
            <span>
              <b>ตำแหน่ง</b>
              <small>รายงานอยู่ใกล้กันภายในประมาณ 500 เมตร</small>
            </span>
          </div>
          <div>
            <Clock3 />
            <span>
              <b>เวลา</b>
              <small>เกิดขึ้นในช่วงเวลาใกล้เคียงกัน</small>
            </span>
          </div>
          <div>
            <List />
            <span>
              <b>ลักษณะเหตุ</b>
              <small>พบกลิ่นฉุน คราบสีรุ้ง และปลาตายซ้ำกัน</small>
            </span>
          </div>
          <div>
            <Layers3 />
            <span>
              <b>บริบทพื้นที่</b>
              <small>ใกล้พื้นที่อุตสาหกรรมและอยู่ในพื้นที่น้ำท่วม</small>
            </span>
          </div>
        </div>
        <div className="technical-box">
          <b>น้ำหนักสำหรับ Prototype</b>
          <div>
            <span>ความคล้ายคลึงด้านตำแหน่ง</span>
            <strong>40%</strong>
          </div>
          <div>
            <span>ความคล้ายคลึงด้านเวลา</span>
            <strong>30%</strong>
          </div>
          <div>
            <span>ความคล้ายคลึงด้านความหมาย</span>
            <strong>30%</strong>
          </div>
          <small>ยังไม่ใช่โมเดลที่ผ่านการรับรองทางวิทยาศาสตร์</small>
        </div>
      </section>
    </div>
  );
}
function ReportsSheet({
  close,
  select,
  activeCase,
  caseReports,
}: {
  close: () => void;
  select: (r: Report) => void;
  activeCase: DemoCase;
  caseReports: Report[];
}) {
  return (
    <div className="sheet-backdrop" onClick={close}>
      <section className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={close}>
          <X />
        </button>
        <span className="sheet-kicker">รายงานในกลุ่ม</span>
        <h2>
          รายงานใน {activeCase.id} ทั้งหมด {caseReports.length} รายการ
        </h2>
        <div className="report-list">
          {caseReports.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                select(r);
                close();
              }}
            >
              <time>{formatTime(r.timestamp)}</time>
              <span>
                <b>{r.description}</b>
                <small>
                  {r.id} · {activeCase.area}
                </small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function OfficerWorkflow({
  activeCase,
  openReport,
  returnToMain,
}: {
  activeCase: DemoCase;
  openReport: () => void;
  returnToMain: () => void;
}) {
  return (
    <section className="officer-workflow above-fold">
      <div className="workflow-heading">
        <span>เจ้าหน้าที่ต้องทำอะไรต่อ?</span>
        <h2>ตรวจหลักฐาน แล้วเปิดรายงานที่ AI เตรียมไว้</h2>
        <p>
          คลิกหมุดบนแผนที่เพื่อตรวจหลักฐาน เมื่อพร้อมแล้วให้ตรวจรายงานก่อนส่งต่อ
        </p>
      </div>
      <div className="workflow-steps">
        <div className="done">
          <span>
            <Check />
          </span>
          <b>1. ตรวจเหตุและหลักฐาน</b>
        </div>
        <div className="active">
          <span>2</span>
          <b>2. ตรวจรายงาน</b>
        </div>
        <div>
          <span>3</span>
          <b>3. ส่งต่อ</b>
        </div>
      </div>
      <div className="workflow-action">
        {activeCase.id === "PB-024" ? (
          <button className="primary big" onClick={openReport}>
            <FileText /> ตรวจรายงานที่ AI เตรียมไว้ <ArrowRight />
          </button>
        ) : (
          <button className="primary big" onClick={returnToMain}>
            กลับไปเคสหลัก PB-024 <ArrowRight />
          </button>
        )}
        <small>
          AI เตรียมข้อมูลแล้ว แต่เจ้าหน้าที่ต้องตรวจและเป็นผู้กดส่งต่อเอง
        </small>
      </div>
    </section>
  );
}

function ConciergeWorkbench({
  activeCase,
  caseReports,
}: {
  activeCase: DemoCase;
  caseReports: Report[];
}) {
  const representative =
    caseReports.find((report) => report.image) || caseReports[0];
  const context =
    activeCase.id === "PB-024"
      ? [
          "โรงงานจำลอง 420 ม.",
          "ชั้นข้อมูลพื้นที่น้ำท่วม",
          "ประวัติเหตุใกล้เคียง 2 เหตุ",
        ]
      : activeCase.id === "PB-031"
        ? ["ตลาดฝั่งตะวันตก", "คลองระบายน้ำ", "รายงานน้ำเสียในช่วง 26 นาที"]
        : [
            "ถนนเขตอุตสาหกรรม",
            "จุดรายงานซ้ำริมถนน",
            "ควันและกลิ่นไหม้ในช่วง 27 นาที",
          ];
  return (
    <section className="concierge-workbench">
      <div className="concierge-workbench-head">
        <div>
          <span>
            <Sparkles /> AI CONCIERGE WORKBENCH
          </span>
          <h2>จากรายงานดิบ สู่ข้อมูลที่พร้อมให้เจ้าหน้าที่ตรวจสอบ</h2>
          <p>
            นี่คืองานข้อมูลที่ Eco-Alert AI ทำให้ในเคส {activeCase.id} —
            ไม่ได้ตัดสินใจแทนเจ้าหน้าที่
          </p>
        </div>
        <Badge tone={activeCase.score >= 70 ? "red" : "amber"}>
          จัดลำดับ {activeCase.score}/100
        </Badge>
      </div>
      <div className="concierge-transform">
        <article className="concierge-input">
          <small>INPUT · หลักฐานดิบ</small>
          <b>{caseReports.length} รายงานประชาชน</b>
          <blockquote>“{representative?.description}”</blockquote>
          <span>ข้อความ · GPS · เวลา · ภาพถ่าย</span>
        </article>
        <div className="concierge-orchestration">
          <div>
            <i>1</i>
            <span>
              <b>เข้าใจหลักฐาน</b>
              <small>สกัดข้อมูลที่สังเกตได้: {activeCase.signals}</small>
            </span>
            <Badge>AI</Badge>
          </div>
          <div>
            <i>2</i>
            <span>
              <b>ค้นและเชื่อมรายงาน</b>
              <small>
                พบ {caseReports.length} จาก {reports.length} รายงานที่ตำแหน่ง
                เวลา และความหมายสัมพันธ์กัน
              </small>
            </span>
            <Badge tone="blue">AI + Rule</Badge>
          </div>
          <div>
            <i>3</i>
            <span>
              <b>ดึงบริบทที่เกี่ยวข้อง</b>
              <small>{context.join(" · ")}</small>
            </span>
            <Badge tone="amber">Data retrieval</Badge>
          </div>
          <div>
            <i>4</i>
            <span>
              <b>จัดลำดับและเตรียม brief</b>
              <small>คำนวณคะแนนแบบโปร่งใส พร้อมเหตุผลและแหล่งข้อมูล</small>
            </span>
            <Badge tone="blue">Rule + AI</Badge>
          </div>
        </div>
        <article className="concierge-output">
          <small>OUTPUT · พร้อมตรวจสอบ</small>
          <b>Officer brief #{activeCase.id}</b>
          <ul>
            <li>{caseReports.length} หลักฐานถูกรวมไว้ในเคสเดียว</li>
            <li>มี observation และ context พร้อมที่มา</li>
            <li>มีเหตุผลประกอบคะแนน {activeCase.score}/100</li>
          </ul>
          <span>
            <ShieldCheck /> เจ้าหน้าที่เป็นผู้ตรวจสอบและส่งต่อ
          </span>
        </article>
      </div>
      <div className="concierge-evidence-strip">
        <b>หลักฐานที่รองรับข้อเสนอแนะ</b>
        {context.map((item) => (
          <span key={item}>
            <Check /> {item}
          </span>
        ))}
        <span>
          <Check /> Cluster confidence {activeCase.confidence}%
        </span>
      </div>
      <div className="concierge-disclaimer">
        <Info />
        <span>
          <b>ขอบเขตของ AI</b> ไม่ระบุชนิดสารเคมี ไม่ยืนยันความรุนแรง
          และไม่สั่งการหน่วยงานอัตโนมัติ
        </span>
      </div>
    </section>
  );
}

function IncidentPage({ go }: { go: (s: Screen) => void }) {
  const [selected, setSelected] = useState<Report | null>(null),
    [sheet, setSheet] = useState<"ai" | "reports" | null>(null),
    [activeCase, setActiveCase] = useState<DemoCase>(demoCases[0]);
  const caseReports = reports.filter((r) =>
    activeCase.reportIds.includes(r.id),
  );
  const excludedReports = reports.filter(
    (r) => !activeCase.reportIds.includes(r.id),
  );
  const changeCase = (demoCase: DemoCase) => {
    setActiveCase(demoCase);
    setSelected(null);
    setSheet(null);
  };
  return (
    <div className="page incident-page">
      <Journey step={3} />
      <ClusterExplorer active={activeCase} onChange={changeCase} />
      <section className="dataset-strip">
        <Database />
        <span>
          <b>ฐานข้อมูลจำลอง {reports.length} รายงาน</b>
          <small>
            AI จัดเข้า {activeCase.id} จำนวน {caseReports.length} รายงาน ·
            แยกออก {excludedReports.length} รายงาน
          </small>
        </span>
      </section>
      <section className="incident-hero">
        <div>
          <span>เหตุการณ์ #{activeCase.id}</span>
          <Badge tone={activeCase.score >= 70 ? "red" : "amber"}>
            {activeCase.level}
          </Badge>
          <h1>
            <strong>Eco-Alert AI พบความเชื่อมโยง</strong>
          </h1>
          <div className="connection-equation">
            <b>{caseReports.length} รายงาน</b>
            <ArrowRight />
            <b>1 เหตุการณ์ที่อาจเกี่ยวข้องกัน</b>
          </div>
          <p>เชื่อมโยงจากตำแหน่ง เวลา ลักษณะเหตุ และบริบทพื้นที่</p>
        </div>
        <div className="confidence-card">
          <span>ความมั่นใจในการจัดกลุ่ม</span>
          <b>{activeCase.confidence}%</b>
          <small>Cluster confidence</small>
        </div>
        <button className="secondary compact" onClick={() => setSheet("ai")}>
          <Sparkles /> ดูว่า AI เชื่อมโยงอย่างไร
        </button>
      </section>
      <OfficerWorkflow
        activeCase={activeCase}
        openReport={() => go("structured")}
        returnToMain={() => changeCase(demoCases[0])}
      />
      <div className="incident-layout">
        <section className="map-panel">
          <div className={`map-bg case-${activeCase.id.toLowerCase()}`}>
            {activeCase.id !== "PB-041" && <div className="river" />}
            <div className="road a" />
            <div className="road b" />
            {activeCase.id === "PB-024" && (
              <>
                <div className="zone industrial">
                  <Factory /> พื้นที่อุตสาหกรรม
                </div>
                <div className="zone flood">
                  <Waves /> พื้นที่น้ำท่วม
                </div>
              </>
            )}
            {activeCase.id === "PB-031" && (
              <>
                <div className="market-grid" />
                <div className="zone market">
                  <Users /> ตลาดฝั่งตะวันตก
                </div>
                <div className="zone drain">
                  <Waves /> คลองระบายน้ำ
                </div>
              </>
            )}
            {activeCase.id === "PB-041" && (
              <>
                <div className="smoke-plume">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="zone industrial">
                  <Factory /> เขตอุตสาหกรรม
                </div>
                <div className="zone road-label">
                  <Navigation /> ถนนสายหลัก
                </div>
              </>
            )}
            <div className="cluster-area" />
            <button
              className={`cluster-center ${selected === null ? "selected" : ""}`}
              onClick={() => setSelected(null)}
            >
              <span>{caseReports.length}</span>
              <small>รายงาน</small>
            </button>
            {caseReports.map((r, i) => (
              <button
                aria-label={`เปิดรายงาน ${r.id}`}
                key={r.id}
                className={`map-pin ${selected?.id === r.id ? "selected" : ""}`}
                style={{
                  left: `${31 + (i % 4) * 9 + (i % 2) * 2}%`,
                  top: `${25 + Math.floor(i / 4) * 27 + (i % 3) * 3}%`,
                }}
                onClick={() => setSelected(r)}
              >
                <MapPin />
                <span>{formatTime(r.timestamp)}</span>
              </button>
            ))}
            {excludedReports.slice(0, 6).map((r, i) => (
              <button
                aria-label={`รายงานที่ถูกแยก ${r.id}`}
                key={r.id}
                className="map-pin unrelated external-report"
                style={{
                  left: `${[8, 84, 12, 88, 20, 78][i]}%`,
                  top: `${[16, 14, 76, 72, 44, 48][i]}%`,
                }}
                onClick={() => setSelected(r)}
              >
                <MapPin />
                <span>{r.id} · ไม่รวมกลุ่ม</span>
              </button>
            ))}
            <div className="map-legend">
              <span>
                <i className="included" />
                รวมใน {activeCase.id}
              </span>
              <span>
                <i className="excluded" />
                AI แยกออก
              </span>
            </div>
            <div className="map-message">
              <Sparkles />
              <b>AI เชื่อม {caseReports.length} รายงานเป็นเหตุการณ์เดียว</b>
            </div>
          </div>
        </section>
        <DetailPanel
          selected={selected}
          onOverview={() => setSelected(null)}
          activeCase={activeCase}
          caseReports={caseReports}
        />
      </div>
      <button className="all-reports" onClick={() => setSheet("reports")}>
        <List /> ดูรายงานใน {activeCase.id} ทั้งหมด {caseReports.length} รายการ{" "}
        <ChevronRight />
      </button>
      <ConciergeWorkbench activeCase={activeCase} caseReports={caseReports} />
      <section className="mock-overview">
        <div className="section-heading">
          <span>ชุดข้อมูลจำลองทั้งหมด</span>
          <h2>AI ไม่ได้รวมทุกอย่างเป็นเหตุเดียว</h2>
        </div>
        <div className="mock-overview-grid">
          <div>
            <b>PB-024</b>
            <strong>8 รายงาน</strong>
            <span>กลิ่นฉุน · คราบสีรุ้ง · ปลาตาย</span>
            <Badge tone="red">เร่งด่วนสูง</Badge>
          </div>
          <div>
            <b>กลุ่มตลาดฝั่งตะวันตก</b>
            <strong>3 รายงาน</strong>
            <span>น้ำเสีย · ฟอง · กลิ่น</span>
            <Badge tone="amber">เฝ้าระวัง</Badge>
          </div>
          <div>
            <b>รายงานที่แยกออก</b>
            <strong>{otherReports.length - 3} รายงาน</strong>
            <span>ตำแหน่ง เวลา หรือลักษณะเหตุไม่สัมพันธ์กัน</span>
            <Badge tone="blue">ไม่รวมกลุ่ม</Badge>
          </div>
        </div>
      </section>
      <section className="context-section">
        <div className="section-heading">
          <span>การเชื่อมโยงหลายแหล่งข้อมูล</span>
          <h2>Eco-Alert AI เชื่อมโยงอะไรได้บ้าง?</h2>
        </div>
        <div className="context-grid">
          <div>
            <Factory />
            <span>
              <b>พื้นที่อุตสาหกรรม · 420 ม.</b>
              <small>แหล่งข้อมูล: Mock factory registry</small>
            </span>
          </div>
          <div>
            <Waves />
            <span>
              <b>อยู่ในพื้นที่น้ำท่วม</b>
              <small>แหล่งข้อมูล: Mock flood layer</small>
            </span>
          </div>
          <div>
            <Users />
            <span>
              <b>รายงานใกล้เคียง · 8 รายงาน</b>
              <small>แหล่งข้อมูล: Citizen reports</small>
            </span>
          </div>
          <div>
            <Fish />
            <span>
              <b>สัญญาณร่วม · กลิ่นฉุน 6/8</b>
              <small>จากสิ่งที่ AI เข้าใจในรายงาน</small>
            </span>
          </div>
        </div>
      </section>
      <section className="reasoning-card">
        <div className="urgency-score">
          <span>ความเร่งด่วน</span>
          <b>
            87 <small>/ 100</small>
          </b>
          <Badge tone="red">สูง</Badge>
        </div>
        <div>
          <h2>ทำไม Eco-Alert AI จึงให้ความสำคัญ</h2>
          <ul>
            <li>มีหลายรายงานอิสระในพื้นที่เดียวกัน</li>
            <li>รายงานเกิดขึ้นในช่วงเวลาใกล้กัน</li>
            <li>อยู่ใกล้พื้นที่อุตสาหกรรมและพื้นที่น้ำท่วม</li>
            <li>หลายรายงานพบปลาตายและกลิ่นฉุน</li>
          </ul>
          <small className="prototype-score-note">
            คะแนนจัดลำดับความสำคัญสำหรับ Prototype
            ไม่ใช่ค่าความรุนแรงทางวิทยาศาสตร์
          </small>
        </div>
      </section>
      <SafetyNote />
      {sheet === "ai" && <AiSheet close={() => setSheet(null)} />}{" "}
      {sheet === "reports" && (
        <ReportsSheet
          close={() => setSheet(null)}
          select={setSelected}
          activeCase={activeCase}
          caseReports={caseReports}
        />
      )}
    </div>
  );
}

function StructuredPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page narrow-report">
      <Journey step={4} />
      <div className="structured-next-step">
        <span>ขั้นตอน 2 จาก 3</span>
        <b>ตรวจข้อมูลด้านล่าง แล้วกด “ยืนยันและส่งต่อ”</b>
        <small>หากข้อมูลยังไม่ถูกต้อง ให้กลับไปยังเหตุการณ์ก่อนส่งต่อ</small>
      </div>
      <div className="page-title">
        <button className="icon-btn" onClick={() => go("incident")}>
          <ArrowLeft />
        </button>
        <div>
          <span>Eco-Alert AI ดำเนินการให้แล้ว</span>
          <h1>รายงานที่ Eco-Alert AI เตรียมไว้</h1>
          <p className="page-intro">
            ตรวจสอบข้อมูลก่อนส่งเข้าสู่ระบบรับเรื่องจำลอง
          </p>
        </div>
        <Badge>
          <Check /> ข้อมูลครบ
        </Badge>
      </div>
      <article className="document">
        <div className="doc-head">
          <Logo />
          <div>
            <span>รายงานข้อมูลเหตุการณ์</span>
            <b>#PB-024</b>
          </div>
        </div>
        <div className="doc-alert">
          <AlertTriangle />
          <div>
            <b>เร่งด่วนสูง · 87 / 100</b>
            <span>ต้องตรวจสอบพื้นที่เพื่อยืนยัน</span>
          </div>
          <div>
            <b>91%</b>
            <span>ความมั่นใจในการจัดกลุ่ม</span>
          </div>
        </div>
        <div className="doc-grid">
          <div>
            <label>สถานที่ · จาก GPS รายงาน</label>
            <b>บริเวณคลองปราจีนบุรี</b>
            <span>13.9298, 101.5741</span>
          </div>
          <div>
            <label>ช่วงเวลา</label>
            <b>2 ต.ค. 2569 · 09:42–11:36 น.</b>
            <span>รายงานล่าสุดเมื่อ 12 นาทีที่แล้ว</span>
          </div>
          <div>
            <label>รายงานและหลักฐาน</label>
            <b>8 รายงาน · ภาพถ่าย 4 ภาพ</b>
            <span>จากฐานข้อมูลเหตุร้องเรียน</span>
          </div>
          <div>
            <label>บริบทพื้นที่</label>
            <b>ใกล้อุตสาหกรรม · พื้นที่น้ำท่วม</b>
            <span>จากชั้นข้อมูลจำลอง</span>
          </div>
        </div>
        <section>
          <label>สิ่งที่พบจากรายงาน</label>
          <div className="tags big">
            <span>คราบสีรุ้ง · 3 รายงาน</span>
            <span>กลิ่นฉุน · 6 รายงาน</span>
            <span>ปลาตาย · 3 รายงาน</span>
          </div>
        </section>
        <section>
          <label>สรุปเหตุผลของ AI</label>
          <p>
            รายงานอิสระ 8 รายการมีความสัมพันธ์กันด้านตำแหน่งและเวลา
            เมื่อรวมกับสิ่งที่พบและบริบทพื้นที่
            จึงควรได้รับการตรวจสอบภาคสนามโดยเร็ว
          </p>
        </section>
        <section className="routing-card">
          <div className="routing-head">
            <span>
              <Sparkles /> AI Concierge แนะนำปลายทาง
            </span>
            <Badge tone="blue">Routing จำลอง</Badge>
          </div>
          <div className="routing-primary">
            <div className="routing-icon">
              <Send />
            </div>
            <span>
              <small>หน่วยงานหลัก</small>
              <b>สำนักงานสิ่งแวดล้อมและควบคุมมลพิษในพื้นที่</b>
              <p>ตรวจคุณภาพน้ำ · เก็บตัวอย่าง · ประสานห้องปฏิบัติการ</p>
            </span>
            <Badge>แนะนำ</Badge>
          </div>
          <div className="routing-support">
            <span>
              <Users />
              <b>องค์กรปกครองส่วนท้องถิ่น</b>
              <small>ประสานพื้นที่และแจ้งเตือนประชาชน</small>
            </span>
            <span>
              <Factory />
              <b>หน่วยงานกำกับโรงงานในพื้นที่</b>
              <small>ตรวจสอบโรงงานและเอกสารที่เกี่ยวข้อง</small>
            </span>
          </div>
          <div className="routing-note">
            <ShieldCheck />
            <span>
              <b>เจ้าหน้าที่เป็นผู้ยืนยันปลายทาง</b> AI
              แนะนำจากประเภทเหตุและความสามารถของหน่วยงาน
              แต่ไม่ส่งหรือสั่งการอัตโนมัติ
            </span>
          </div>
        </section>
        <SafetyNote />
        <div className="doc-source">
          <Database /> แหล่งข้อมูล: รายงานประชาชน · GPS · เวลา · Mock factory
          registry · Mock flood layer · ฐานความรู้ความปลอดภัย (Mock/RAG)
        </div>
      </article>
      <div className="submit-bar">
        <div>
          <Badge tone="blue">ขั้นตอนสุดท้าย</Badge>
          <p>
            <b>ตรวจข้อมูลครบแล้วใช่ไหม?</b>
            <br />
            ส่งแบบจำลองไปยังสำนักงานสิ่งแวดล้อมและควบคุมมลพิษในพื้นที่
          </p>
        </div>
        <button className="secondary" onClick={() => go("incident")}>
          <ArrowLeft /> กลับไปตรวจเหตุการณ์
        </button>
        <button className="primary big" onClick={() => go("officer-complete")}>
          <Send /> ยืนยันปลายทางและส่งต่อ <ArrowRight />
        </button>
      </div>
    </div>
  );
}

function OfficerComplete({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page officer-complete-page">
      <div className="success-icon done">
        <Check />
      </div>
      <Badge>ส่งต่อแล้ว · จบขั้นตอน Demo</Badge>
      <h1>เตรียมส่งต่อไปยังหน่วยงานหลักแล้ว</h1>
      <p>
        เหตุการณ์ #PB-024
        ถูกส่งผ่านระบบจำลองไปยังสำนักงานสิ่งแวดล้อมและควบคุมมลพิษในพื้นที่
        และเปลี่ยนสถานะเป็น “รอดำเนินการ”
      </p>
      <div className="completion-summary">
        <span>
          <Check /> ตรวจรายงานที่ AI เตรียมแล้ว
        </span>
        <span>
          <Check /> ระบุปลายทางและเตรียมส่งต่อแล้ว (Mock)
        </span>
      </div>
      <div className="officer-complete-actions">
        <button className="primary" onClick={() => go("officer-dashboard")}>
          กลับหน้าภาพรวม <ArrowRight />
        </button>
        <button className="secondary" onClick={() => go("incident")}>
          ดูเหตุการณ์อีกครั้ง
        </button>
      </div>
    </div>
  );
}

function CitizenSuccessPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page citizen-success-page">
      <div className="success-icon done">
        <Check />
      </div>
      <span className="citizen-kicker">ส่งข้อมูลสำเร็จ</span>
      <h1>รับรายงานแล้ว</h1>
      <p>Eco-Alert AI กำลังช่วยจัดข้อมูล เพื่อส่งต่อให้เจ้าหน้าที่ตรวจสอบ</p>
      <div className="citizen-reference">
        <span>หมายเลขรายงาน</span>
        <b>R-10824</b>
        <small>ใช้หมายเลขนี้เพื่อติดตามสถานะ</small>
      </div>
      <div className="citizen-progress">
        <div className="done">
          <span>
            <Check />
          </span>
          <b>รับรายงาน</b>
        </div>
        <div className="active">
          <span>
            <CircleDot />
          </span>
          <b>กำลังตรวจสอบข้อมูล</b>
        </div>
        <div>
          <span />
          <b>รอเจ้าหน้าที่ตรวจสอบ</b>
        </div>
      </div>
      <button className="primary" onClick={() => go("tracking")}>
        ติดตามสถานะ <ChevronRight />
      </button>
    </div>
  );
}

function OfficerDashboard({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page officer-page officer-dashboard">
      <section className="officer-welcome">
        <div>
          <span>Eco-Alert AI</span>
          <h1>ศูนย์วิเคราะห์เหตุสำหรับเจ้าหน้าที่</h1>
          <p>
            เหตุที่ AI จัดลำดับให้ตรวจสอบก่อน
            โดยเจ้าหน้าที่เป็นผู้ตัดสินใจดำเนินการ
          </p>
        </div>
        <Badge tone="blue">
          <ShieldCheck /> Officer Console
        </Badge>
      </section>
      <section className="ops-metrics">
        <div>
          <AlertTriangle />
          <span>
            <small>เหตุการณ์เร่งด่วน</small>
            <b>3</b>
          </span>
        </div>
        <div>
          <Clock3 />
          <span>
            <small>รอตรวจสอบ</small>
            <b>7</b>
          </span>
        </div>
        <div>
          <FileText />
          <span>
            <small>รายงานวันนี้</small>
            <b>24</b>
          </span>
        </div>
      </section>
      <div className="section-heading">
        <span>AI PRIORITY QUEUE</span>
        <h2>เหตุที่ควรตรวจสอบก่อน</h2>
      </div>
      <section className="priority-incident">
        <div className="priority-rank">01</div>
        <div className="priority-copy">
          <div>
            <span>เหตุการณ์ #PB-024 · ปราจีนบุรี</span>
            <Badge tone="red">เร่งด่วนสูง</Badge>
          </div>
          <h2>8 รายงานที่อาจเกี่ยวข้องกัน</h2>
          <p>
            AI พบรายงานหลายรายการที่มีความสัมพันธ์กันด้านตำแหน่ง เวลา
            และลักษณะเหตุ
          </p>
          <div className="ai-work-summary">
            <b>
              <Sparkles /> Eco-Alert AI ช่วยตรวจสอบเหตุนี้
            </b>
            <span>
              <Check /> อ่านและจัดโครงสร้างรายงานประชาชน
            </span>
            <span>
              <Check /> พบรายงานที่อาจเกี่ยวข้อง 8 รายการ
            </span>
            <span>
              <Check /> เชื่อมโยงบริบทและประเมินความเร่งด่วน
            </span>
            <span>
              <Check /> เตรียมข้อมูลสำหรับเจ้าหน้าที่
            </span>
          </div>
        </div>
        <div className="priority-score">
          <small>คะแนนจัดลำดับ</small>
          <b>
            87 <em>/ 100</em>
          </b>
          <button className="primary" onClick={() => go("incident")}>
            ตรวจสอบเหตุการณ์ <ArrowRight />
          </button>
        </div>
      </section>
      <section className="secondary-incidents">
        {demoCases.slice(1).map((item) => (
          <div key={item.id}>
            <span>{item.id}</span>
            <b>{item.title}</b>
            <small>
              {item.reportIds.length} รายงาน · {item.area}
            </small>
            <Badge tone={item.score >= 70 ? "red" : "amber"}>
              {item.level}
            </Badge>
          </div>
        ))}
      </section>
    </div>
  );
}

function OfficerReports({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page officer-page officer-inbox">
      <div className="officer-page-head">
        <div>
          <span>OPERATIONAL INBOX</span>
          <h1>รายงานจากประชาชน</h1>
          <p>
            หลักฐานดิบที่ Eco-Alert AI จัดโครงสร้างและเชื่อมโยงกับเหตุการณ์แล้ว
          </p>
        </div>
        <Badge tone="blue">{reports.length} รายงาน</Badge>
      </div>
      <div className="transformation-labels">
        <span>หลักฐานจากประชาชน</span>
        <ArrowRight />
        <span>AI สกัดข้อมูล</span>
        <ArrowRight />
        <span>เหตุการณ์ที่เกี่ยวข้อง</span>
      </div>
      <section className="inbox-list">
        {reports.slice(0, 10).map((report) => {
          const incident = demoCases.find((item) =>
            item.reportIds.includes(report.id),
          );
          return (
            <article key={report.id} className="inbox-report">
              <div className="raw-report">
                <time>{formatTime(report.timestamp)} น.</time>
                {report.image ? (
                  <img src={report.image} />
                ) : (
                  <div className="inbox-placeholder">
                    <FileText />
                  </div>
                )}
                <span>
                  <b>{report.id}</b>
                  <p>“{report.description}”</p>
                </span>
              </div>
              <div className="structured-observation">
                <small>
                  <Sparkles /> AI ตรวจพบ
                </small>
                <div className="tags">
                  {report.observations.map((o) => (
                    <span key={o}>{observationLabels[o]}</span>
                  ))}
                </div>
              </div>
              <div className="linked-incident">
                {incident ? (
                  <>
                    <Badge>เชื่อมโยงแล้ว</Badge>
                    <b>เหตุการณ์ #{incident.id}</b>
                    <small>{incident.area}</small>
                    <button className="link" onClick={() => go("incident")}>
                      ตรวจสอบ <ChevronRight />
                    </button>
                  </>
                ) : (
                  <>
                    <Badge tone="blue">รอจัดกลุ่ม</Badge>
                    <b>ยังไม่พบเหตุที่เกี่ยวข้อง</b>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function TrackingPage({ go }: { go: (s: Screen) => void }) {
  const timeline = [
    ["รับรายงานแล้ว", true],
    ["AI จัดข้อมูลเบื้องต้นแล้ว", true],
    ["เจ้าหน้าที่กำลังตรวจสอบ", true],
    ["ดำเนินการ", false],
    ["ปิดเหตุ", false],
  ];
  return (
    <div className="page success-page citizen-tracking-page">
      <span className="citizen-kicker">ติดตามรายงาน</span>
      <h1>รายงาน #R-10824</h1>
      <p>สถานะล่าสุดจากเจ้าหน้าที่</p>
      <div className="timeline">
        {timeline.map(([label, active], i) => (
          <div key={String(label)} className={active ? "active" : ""}>
            <span>
              {active ? <Check /> : i === 4 ? <Clock3 /> : <CircleDot />}
            </span>
            <b>{label}</b>
            {i < timeline.length - 1 && <i />}
          </div>
        ))}
      </div>
      <div className="success-actions">
        <button className="primary" onClick={() => go("report")}>
          แจ้งเหตุใหม่
        </button>
      </div>
    </div>
  );
}

function HowPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page officer-page how-page ai-system-page">
      <div className="page-title">
        <button className="icon-btn" onClick={() => go("officer-dashboard")}>
          <X />
        </button>
        <div>
          <span>สถาปัตยกรรมระบบ</span>
          <h1>AI Concierge ทำงานอย่างไร?</h1>
        </div>
      </div>
      <p className="how-lead">
        แสดงให้ชัดว่าแต่ละขั้นใช้ Generative AI, deterministic logic,
        ข้อมูลจำลอง หรือจุดเชื่อมต่อระบบภายนอกอย่างไร
      </p>
      <div className="architecture">
        {[
          [FileText, "รายงานประชาชน"],
          [Bot, "เข้าใจภาพและข้อความ"],
          [Database, "ดึงบริบทพื้นที่"],
          [Network, "จัดกลุ่มเหตุการณ์"],
          [Radar, "ประเมินความเร่งด่วน"],
          [ShieldCheck, "เจ้าหน้าที่ตรวจสอบ"],
          [Send, "ระบบรับเรื่องเดิม"],
        ].map(([Icon, label]: any, i) => (
          <div className="arch-step" key={label}>
            <div>
              <Icon />
              <b>{label}</b>
            </div>
            {i < 6 && <ArrowRight />}
          </div>
        ))}
      </div>
      <section className="system-matrix">
        <div className="matrix-head">
          <span>องค์ประกอบ</span>
          <span>วิธีทำงาน</span>
          <span>สถานะใน Prototype</span>
        </div>
        {[
          [
            "เข้าใจหลักฐาน",
            "OpenAI multimodal + structured output",
            "AI จริง · มี deterministic fallback",
            "ai",
          ],
          [
            "ค้นรายงานใกล้เคียง",
            "Provider adapter / API boundary",
            "Mock dataset · พร้อมเปลี่ยน provider",
            "mock",
          ],
          [
            "จัดกลุ่มเหตุการณ์",
            "Spatial 40% · Temporal 30% · Semantic 30%",
            "Deterministic prototype logic",
            "rule",
          ],
          [
            "ประเมินความเร่งด่วน",
            "Transparent weighted risk factors",
            "Rule-based · เจ้าหน้าที่ต้องยืนยัน",
            "rule",
          ],
          [
            "อธิบายเหตุผล",
            "Grounded AI explanation จากผลคำนวณ",
            "AI จริง · ห้ามวินิจฉัยสารเคมี",
            "ai",
          ],
          [
            "ส่งเข้าระบบเดิม",
            "createIssue / receiveIssueUpdate adapter",
            "Mock connector · API-ready",
            "external",
          ],
        ].map(([name, method, status, tone]) => (
          <div className="matrix-row" key={name}>
            <b>{name}</b>
            <span>{method}</span>
            <Badge
              tone={
                tone === "ai" ? "green" : tone === "mock" ? "amber" : "blue"
              }
            >
              {status}
            </Badge>
          </div>
        ))}
      </section>
      <section className="evaluation-card">
        <div>
          <span>REPRODUCIBLE EVALUATION</span>
          <h2>ผลทดสอบการจัดกลุ่ม PB-024</h2>
          <p>{evaluation.scopeLabelTh}</p>
        </div>
        <div className="evaluation-metrics">
          <span>
            <b>{evaluation.precision}%</b>Precision
          </span>
          <span>
            <b>{evaluation.recall}%</b>Recall
          </span>
          <span>
            <b>{evaluation.f1}%</b>F1 score
          </span>
          <span>
            <b>{evaluation.datasetSize}</b>รายงานทดสอบ
          </span>
        </div>
        <div className="evaluation-confusion">
          <span>รวมถูก {evaluation.truePositive}</span>
          <span>รวมผิด {evaluation.falsePositive}</span>
          <span>ตกหล่น {evaluation.falseNegative}</span>
          <span>แยกถูก {evaluation.trueNegative}</span>
        </div>
        <small>
          <Info /> ตัวเลขสูงเพราะเป็น deterministic synthetic scenario สำหรับ
          regression test ยังต้องทดสอบกับข้อมูลจริงก่อนใช้งานภาคสนาม
        </small>
      </section>
      <div className="principles">
        <section>
          <h2>
            <ShieldCheck /> AI ที่รับผิดชอบ
          </h2>
          <ul>
            <li>ไม่ระบุสารเคมีจากภาพ</li>
            <li>ไม่ทดแทนเจ้าหน้าที่หรือห้องปฏิบัติการ</li>
            <li>แสดงความมั่นใจ แหล่งข้อมูล และเหตุผล</li>
            <li>เหตุเร่งด่วนต้องมีมนุษย์ตรวจสอบเสมอ</li>
          </ul>
        </section>
        <section>
          <h2>
            <Layers3 /> พร้อมเชื่อมต่อระบบเดิม
          </h2>
          <p>
            Service adapter แยกชั้น AI ออกจากระบบรับเรื่อง ทำให้เปลี่ยนจาก Mock
            API เป็น API จริงได้ภายหลัง
          </p>
          <div className="code-lines">
            <code>getNearbyIssues()</code>
            <code>createIssue()</code>
            <code>receiveIssueUpdate()</code>
          </div>
        </section>
      </div>
      <div className="system-actions">
        <button className="secondary" onClick={() => go("officer-dashboard")}>
          <ArrowLeft /> กลับหน้าภาพรวม
        </button>
        <button className="primary" onClick={() => go("incident")}>
          เริ่ม Demo ตรวจเหตุการณ์ <ArrowRight />
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [role, setRole] = useState<Role>("citizen");
  const [screen, setScreen] = useState<Screen>("report");
  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setScreen(nextRole === "citizen" ? "report" : "officer-dashboard");
  };
  const view = useMemo(
    () =>
      ({
        report: <ReportPage go={setScreen} />,
        "citizen-success": <CitizenSuccessPage go={setScreen} />,
        tracking: <TrackingPage go={setScreen} />,
        "officer-dashboard": <OfficerDashboard go={setScreen} />,
        "officer-reports": <OfficerReports go={setScreen} />,
        "officer-complete": <OfficerComplete go={setScreen} />,
        incident: <IncidentPage go={setScreen} />,
        structured: <StructuredPage go={setScreen} />,
        how: <HowPage go={setScreen} />,
      })[screen],
    [screen],
  );
  return (
    <Shell screen={screen} go={setScreen} role={role} switchRole={switchRole}>
      {view}
    </Shell>
  );
}
