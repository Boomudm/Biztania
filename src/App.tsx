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
import {
  reportingIntegration,
  type Submission,
} from "./services/integrationService";
import { analyzeIncident, type ConciergeAnalysis } from "./services/aiService";
import type { Observation, Report } from "./types";
import { formatTime } from "./utils/format";

type Screen =
  | "home"
  | "report"
  | "analysis"
  | "incident"
  | "structured"
  | "tracking"
  | "how";
const cluster = buildDemoCluster(reports),
  otherReports = reports.filter((r) => !cluster.some((c) => c.id === r.id)),
  risk = assessRisk(cluster);
const Logo = () => (
  <div className="brand">
    <span className="logo">
      <Waves />
      <Radar />
    </span>
    <span>
      <b>Eco-Alert</b>
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
}: {
  screen: Screen;
  go: (s: Screen) => void;
}) {
  const active =
    screen === "report" || screen === "analysis"
      ? "report"
      : screen === "incident" || screen === "structured"
        ? "incident"
        : screen === "tracking"
          ? "tracking"
          : null;
  return (
    <nav className="bottom-nav">
      <button
        className={active === "report" ? "active" : ""}
        onClick={() => go("report")}
      >
        <Plus />
        <span>แจ้งเหตุ</span>
      </button>
      <button
        className={active === "incident" ? "active" : ""}
        onClick={() => go("incident")}
      >
        <CircleDot />
        <span>เหตุการณ์</span>
      </button>
      <button
        className={active === "tracking" ? "active" : ""}
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
  children,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  children: React.ReactNode;
}) {
  const active =
    screen === "report" || screen === "analysis"
      ? "report"
      : screen === "incident" || screen === "structured"
        ? "incident"
        : screen === "tracking"
          ? "tracking"
          : null;
  return (
    <div className="app-shell">
      <header>
        <button className="brand-button" onClick={() => go("home")}>
          <Logo />
        </button>
        <nav className="top-nav">
          <button
            className={active === "report" ? "active" : ""}
            onClick={() => go("report")}
          >
            แจ้งเหตุ
          </button>
          <button
            className={active === "incident" ? "active" : ""}
            onClick={() => go("incident")}
          >
            เหตุการณ์
          </button>
          <button
            className={active === "tracking" ? "active" : ""}
            onClick={() => go("tracking")}
          >
            ติดตาม
          </button>
        </nav>
        <div className="header-actions">
          <Badge tone="blue">
            <CircleDot /> โหมดสาธิต
          </Badge>
          <button className="text-btn" onClick={() => go("how")}>
            <Network /> AI ทำงานอย่างไร
          </button>
        </div>
      </header>
      <main>{children}</main>
      <BottomNav screen={screen} go={go} />
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
  const [selected, setSelected] = useState<Observation[]>(anchor.observations);
  const toggle = (o: Observation) =>
    setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
  return (
    <div className="page narrow">
      <Journey step={1} />
      <div className="page-title">
        <button className="icon-btn" onClick={() => go("home")}>
          <ArrowLeft />
        </button>
        <div>
          <span>รายงานใหม่</span>
          <h1>คุณพบอะไรผิดปกติ?</h1>
          <p className="page-intro">
            ส่งสิ่งที่คุณพบมาให้ Eco-Alert AI เราจะช่วยตรวจสอบบริบท
            เชื่อมโยงรายงาน และเตรียมข้อมูลสำหรับเจ้าหน้าที่
          </p>
        </div>
      </div>
      <div className="report-grid">
        <section className="upload-card">
          <img src="/assets/canal-evidence.png" />
          <div className="photo-label">
            <Check /> เพิ่มภาพตัวอย่างแล้ว
          </div>
          <button>
            <Upload /> เปลี่ยนภาพ
          </button>
        </section>
        <section className="form-card">
          <Concierge />
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
          <label>รายละเอียดที่พบ</label>
          <textarea defaultValue={anchor.description} />
          <label>
            สิ่งที่สังเกตเห็น <small>เลือกได้หลายข้อ</small>
          </label>
          <div className="chips">
            {Object.entries(observationLabels).map(([o, l]) => (
              <button
                key={o}
                className={
                  selected.includes(o as Observation) ? "selected" : ""
                }
                onClick={() => toggle(o as Observation)}
              >
                {selected.includes(o as Observation) && <Check />}
                {l}
              </button>
            ))}
          </div>
          <div className="privacy">
            <Info /> ตำแหน่งและหลักฐานใช้สำหรับเหตุการณ์สาธิตนี้เท่านั้น
          </div>
          <button className="primary full" onClick={() => go("analysis")}>
            <Sparkles /> ให้ Eco-Alert AI ตรวจสอบเหตุนี้ <ArrowRight />
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
        </div>
      </section>
      <SafetyNote />
      <div className="incident-cta prepared">
        <div>
          <Badge>
            <Check /> ดำเนินการแล้ว
          </Badge>
          <b>Eco-Alert AI เตรียมรายงานสำหรับเจ้าหน้าที่แล้ว</b>
          <span>
            จัดรูปหลักฐาน พิกัด เวลา รายงานที่เกี่ยวข้อง บริบท คะแนน
            และเหตุผลไว้ครบ
          </span>
        </div>
        <button className="primary big" onClick={() => go("structured")}>
          <FileText /> ตรวจสอบและส่งรายงาน <ArrowRight />
        </button>
      </div>
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
      <div className="page-title">
        <button className="icon-btn" onClick={() => go("incident")}>
          <ArrowLeft />
        </button>
        <div>
          <span>Eco-Alert AI ดำเนินการให้แล้ว</span>
          <h1>เตรียมรายงานสำหรับเจ้าหน้าที่เรียบร้อย</h1>
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
        <SafetyNote />
        <div className="doc-source">
          <Database /> แหล่งข้อมูล: รายงานประชาชน · GPS · เวลา · Mock factory
          registry · Mock flood layer · ฐานความรู้ความปลอดภัย (Mock/RAG)
        </div>
      </article>
      <div className="submit-bar">
        <div>
          <Badge tone="blue">ระบบเชื่อมต่อจำลอง</Badge>
          <p>Eco-Alert AI → ระบบรับเรื่องเดิม</p>
        </div>
        <button className="primary big" onClick={() => go("tracking")}>
          <Send /> ยืนยันและส่งรายงาน <ArrowRight />
        </button>
      </div>
    </div>
  );
}

function TrackingPage({ go }: { go: (s: Screen) => void }) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  useEffect(() => {
    reportingIntegration
      .createIssue({ incident: "PB-024" })
      .then(setSubmission);
  }, []);
  const submitted = Boolean(submission);
  const timeline = [
    ["รับรายงานแล้ว", true],
    ["AI ตรวจสอบเบื้องต้นแล้ว", true],
    ["พบเหตุการณ์ที่เกี่ยวข้อง", true],
    ["เตรียมรายงานแล้ว", submitted],
    ["รอการตรวจสอบจากเจ้าหน้าที่", false],
  ];
  return (
    <div className="page success-page">
      <div className={`success-icon ${submitted ? "done" : ""}`}>
        {submitted ? <Check /> : <Send />}
      </div>
      <Badge tone="blue">การส่งข้อมูลจำลองสำหรับ Prototype</Badge>
      <h1>
        {submitted ? "เตรียมการส่งรายงานสำเร็จ" : "กำลังเตรียมการส่งรายงาน…"}
      </h1>
      <p>
        {submitted
          ? "ระบบจำลองได้รับรายงานแล้ว ยังไม่มีการส่งข้อมูลไปยังหน่วยงานจริง"
          : "กำลังส่งผ่านตัวเชื่อมต่อระบบจำลอง"}
      </p>
      {submission && (
        <div className="tracking-id">
          <span>หมายเลขติดตาม</span>
          <b>{submission.trackingId}</b>
          <small>
            {submission.statusLabelTh || "สถานะจำลองสำหรับ Prototype"}
          </small>
        </div>
      )}
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
      <SafetyNote />
      <div className="success-actions">
        <button className="primary" onClick={() => go("incident")}>
          ดูเหตุการณ์ <ChevronRight />
        </button>
        <button className="secondary" onClick={() => go("home")}>
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

function HowPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="page how-page">
      <div className="page-title">
        <button className="icon-btn" onClick={() => go("home")}>
          <X />
        </button>
        <div>
          <span>สถาปัตยกรรมระบบ</span>
          <h1>AI Concierge ทำงานอย่างไร?</h1>
        </div>
      </div>
      <p className="how-lead">
        ระบบเชื่อมการทำความเข้าใจข้อมูล การค้นคืนบริบท การจัดกลุ่ม การให้คะแนน
        และการเชื่อมต่อระบบเดิมเข้าด้วยกัน
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
      <button className="primary" onClick={() => go("report")}>
        ทดลองแจ้งเหตุ <ArrowRight />
      </button>
    </div>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const view = useMemo(
    () =>
      ({
        home: <HomePage go={setScreen} />,
        report: <ReportPage go={setScreen} />,
        analysis: <AnalysisPage go={setScreen} />,
        incident: <IncidentPage go={setScreen} />,
        structured: <StructuredPage go={setScreen} />,
        tracking: <TrackingPage go={setScreen} />,
        how: <HowPage go={setScreen} />,
      })[screen],
    [screen],
  );
  return (
    <Shell screen={screen} go={setScreen}>
      {view}
    </Shell>
  );
}
