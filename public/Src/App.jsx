import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   HOMEWARD CONTENT STUDIO
   Production console for Dominique Tagliaferro / Homeward Care
   Record -> Edit -> Post pipeline with AI assistance
   Palette: deep pine, sage, ivory, brass, signal red
   ============================================================ */

const C = {
  pine: "#14312A",
  pineDeep: "#0C211C",
  sage: "#DCE5DA",
  sageDim: "#C4D2C2",
  ivory: "#F7F6F0",
  brass: "#B98A2F",
  brassLight: "#D9B461",
  red: "#C24D3F",
  inkSoft: "#3E5049",
};

const FONT_LINK = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
body { margin: 0; }
::selection { background: ${C.brassLight}; color: ${C.pineDeep}; }
button { font-family: 'Public Sans', sans-serif; cursor: pointer; }
textarea, input, select { font-family: 'Public Sans', sans-serif; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

/* ---------------- STRATEGY DATA ---------------- */

const PILLARS = [
  {
    id: "authority",
    name: "Ask Dominique",
    tag: "AUTHORITY",
    share: "40%",
    desc: "Dominique answers the questions families actually type into Google. Clinical and agency ownership expertise on home care, community living supports, assisted living transitions, and navigating Michigan systems. This pillar builds the subject matter expert position.",
    proof: "Positions Dominique as the trusted voice families and referral sources call first.",
  },
  {
    id: "family",
    name: "Family Playbook",
    tag: "EDUCATION",
    share: "25%",
    desc: "Step by step guidance for adult children and spouses making care decisions: how to choose a provider, what things cost, what to ask on a tour, warning signs, and what happens after a hospital discharge.",
    proof: "Educated families convert faster and refer more. This is the top of the funnel.",
  },
  {
    id: "partners",
    name: "Partner Spotlights",
    tag: "PROMOTION",
    share: "20%",
    desc: "Primera Haven assisted living features, MI Building Partners housing work, and the story of how the partner network hands families off smoothly between levels of care. Promotion wrapped in genuine value.",
    proof: "Drives tours, placements, and referrals to Primera Haven and the wider network.",
  },
  {
    id: "inside",
    name: "Inside Homeward",
    tag: "TRUST",
    share: "15%",
    desc: "Behind the scenes, staff highlights, caregiver hiring standards, training moments, and HIPAA safe client wins. Shows the humans behind the brand and supports recruiting.",
    proof: "Trust content closes the deal that authority content opened.",
  },
];

const FUNNEL = [
  { step: "01", name: "Record", detail: "One long form session (20 to 40 min) plus two medium explainers (5 to 12 min) per week. Batch on one or two recording days." },
  { step: "02", name: "Chop", detail: "Each long form yields 6 to 10 vertical clips of 30 to 90 seconds. Each medium yields 2 to 4. Target 12 to 20 clips per week from 3 recordings." },
  { step: "03", name: "Package", detail: "Every clip gets a hook line in the first 3 seconds, burned in captions, a title, and a thumbnail for YouTube placements." },
  { step: "04", name: "Distribute", detail: "Long form to YouTube and the websites. Clips to Reels, TikTok, Facebook, YouTube Shorts, LinkedIn. Quote cards to Facebook and Google Business Profile." },
  { step: "05", name: "Recycle", detail: "Top performing clips become blog posts, email content, and paid boosts. Winners get re-recorded as improved versions after 90 days." },
];

const CADENCE = [
  { day: "MON", label: "Record day", items: ["Long form session (1 topic, 20 to 40 min)", "Medium explainer #1", "Capture 10 min of b-roll (facility, hands, whiteboard, walking shots)"] },
  { day: "TUE", label: "Edit session", items: ["Chop long form into clips using the Edit tab run sheet", "Caption and hook pass on first 4 clips", "Build 2 thumbnails in the Thumbnail Lab"] },
  { day: "WED", label: "Post + record", items: ["Publish long form to YouTube and website", "Post 2 clips (Reels + TikTok + FB)", "Record medium explainer #2"] },
  { day: "THU", label: "Edit session", items: ["Chop both medium explainers", "Write captions for the rest of the week in the Post tab", "Schedule everything in Meta Business Suite / TikTok"] },
  { day: "FRI", label: "Post + partner", items: ["Post 2 clips + 1 partner spotlight", "LinkedIn post aimed at discharge planners and case managers", "Log what performed in the notes"] },
  { day: "SAT", label: "Light touch", items: ["1 clip + 1 quote card", "Reply to every comment and DM"] },
  { day: "SUN", label: "Plan", items: ["Pick next week's 3 topics from the Record tab", "Review analytics: watch time, saves, shares, profile visits"] },
];

/* ---------------- RECORDING PROMPTS ---------------- */

const PROMPTS = [
  {
    pillar: "authority",
    title: "The 5 questions every family should ask before choosing a care provider",
    format: "Long form anchor",
    subs: [
      "Open with the story of a family who asked none of them and what it cost.",
      "Question by question: staffing ratios, pricing transparency, care plan review cadence, staff screening, what happens when needs change.",
      "For each question, state what a good answer sounds like and what a red flag sounds like.",
      "Close: how Homeward Care and Primera Haven answer each of the five. Soft CTA to book a consult.",
    ],
  },
  {
    pillar: "authority",
    title: "Community Living Supports explained: what CLS actually covers and how approval works",
    format: "Medium explainer",
    subs: [
      "Define CLS in one plain sentence a daughter in a hospital hallway would understand.",
      "Walk the approval path: CMH intake, assessment, person centered plan, authorization.",
      "The 3 mistakes that delay approvals and how to avoid each.",
      "CTA: Homeward Care walks families through this at no cost. Call or DM.",
    ],
  },
  {
    pillar: "authority",
    title: "Home care vs assisted living vs nursing care: how to know which level is right",
    format: "Long form anchor",
    subs: [
      "The dinner table test: 6 daily living questions that reveal the level of care needed.",
      "Cost ranges for each level in Michigan and who pays (private, Medicaid, waiver, VA).",
      "When staying home stops being the safe choice: falls, medication errors, isolation.",
      "The bridge story: how a Homeward Care client transitioned into Primera Haven and what the family said after.",
    ],
  },
  {
    pillar: "authority",
    title: "Medicaid waiver myths that keep families from getting help",
    format: "Medium explainer",
    subs: [
      "Myth 1: You have to be broke. Explain spend down and asset rules at a headline level.",
      "Myth 2: The waitlist means never. What actually moves people up.",
      "Myth 3: Waiver care is lower quality. What the waiver actually pays for.",
      "CTA: comment WAIVER and the team sends the starter checklist.",
    ],
  },
  {
    pillar: "authority",
    title: "What happens after hospital discharge: the 72 hour window",
    format: "Medium explainer",
    subs: [
      "Why the first 72 hours decide whether a patient bounces back to the ER.",
      "The discharge checklist: meds reconciled, follow ups booked, home safety check, care schedule confirmed.",
      "Who to call and in what order. Position Homeward Care as the coordinator.",
      "Aimed at both families and discharge planners. Record a LinkedIn friendly version of the close.",
    ],
  },
  {
    pillar: "family",
    title: "Touring an assisted living community: what to look at that nobody tells you",
    format: "Medium explainer, film at Primera Haven",
    subs: [
      "Look past the chandelier: smell, sound, and how staff greet residents by name.",
      "Ask to see a weekday activity calendar and the actual lunch being served.",
      "Watch the call light response in real time.",
      "Walking tour format at Primera Haven, pointing at each item live. Doubles as a partner spotlight.",
    ],
  },
  {
    pillar: "family",
    title: "3 signs of family caregiver burnout and what to do this week",
    format: "Short native + medium",
    subs: [
      "Sign 1: sleep. Sign 2: resentment. Sign 3: skipping your own appointments.",
      "The respite options most families do not know exist and what they cost.",
      "Script for the hard conversation with siblings who are not helping.",
      "CTA: Homeward Care offers respite scheduling. One call takes a shift off your plate.",
    ],
  },
  {
    pillar: "family",
    title: "What in-home care actually costs in Michigan and how families pay for it",
    format: "Long form anchor",
    subs: [
      "Hourly ranges, minimum visit lengths, and what changes the price.",
      "Payment stack: private pay, long term care insurance, Medicaid, waivers, VA Aid and Attendance.",
      "The cheapest option is rarely the cheapest: the cost of turnover and no-shows.",
      "Transparent walkthrough of how Homeward Care quotes a care plan.",
    ],
  },
  {
    pillar: "partners",
    title: "Inside Primera Haven: a real day in assisted living",
    format: "Long form, filmed on site",
    subs: [
      "Follow the day: morning routine, activities, meals, medication pass, evening wind down.",
      "Interview a staff member on why they do this work.",
      "Family testimonial if release is signed. Otherwise Dominique narrates a composite story.",
      "CTA: book a tour. Pin the phone number and link in every cut of this session.",
    ],
  },
  {
    pillar: "partners",
    title: "How Homeward Care and Primera Haven work together so families never start over",
    format: "Medium explainer",
    subs: [
      "The handoff problem: families repeat their story 5 times across providers.",
      "How shared assessments and warm handoffs work in the partner network.",
      "A transition story from home care to assisted living with zero gaps in service.",
      "Frame the network (Homeward Care, Primera Haven, MI Building Partners) as one continuum of care.",
    ],
  },
  {
    pillar: "partners",
    title: "Ask the owner: Dominique and the Primera Haven team answer live questions",
    format: "Long form, monthly recurring",
    subs: [
      "Collect questions from comments and DMs during the prior month.",
      "Answer 8 to 12 questions rapid fire. Each answer is a self contained clip.",
      "Invite a Primera Haven leader as the recurring guest chair.",
      "This one session can fill an entire week of clips.",
    ],
  },
  {
    pillar: "inside",
    title: "How we screen caregivers: our hiring bar",
    format: "Medium explainer",
    subs: [
      "The screening funnel: background, references, competency check, shadow shifts.",
      "One question Dominique asks every candidate and why.",
      "What gets a candidate rejected that other agencies let through.",
      "Dual CTA: families gain trust, caregivers apply. Recruiting content and marketing in one.",
    ],
  },
  {
    pillar: "inside",
    title: "A win we are proud of (HIPAA safe client story)",
    format: "Short native",
    subs: [
      "Composite or fully de-identified story with details changed. State that on screen.",
      "Structure: where the family started, the turning point, where they are now.",
      "Keep it under 90 seconds. Emotion carries this format.",
      "Rotate monthly. These are the highest share rate posts in care marketing.",
    ],
  },
  {
    pillar: "inside",
    title: "What I wish every family knew before calling an agency",
    format: "Short native series",
    subs: [
      "One tip per video, straight to camera, no b-roll needed.",
      "Record 5 to 8 of these in a single 30 minute sitting at the end of a record day.",
      "Each opens with the words: What I wish every family knew, number X.",
      "This is the series that makes Dominique's face familiar in the feed.",
    ],
  },
];

/* ---------------- EDIT SESSION DATA ---------------- */

const EDIT_STEPS = [
  { n: "1", name: "Log the recording", body: "Watch back at 1.5x with the transcript open. Timestamp every moment that made you feel something: a strong claim, a story beat, a number, a myth busted. Aim for 10 to 15 marks per long form." },
  { n: "2", name: "Select the clips", body: "From your marks, choose 6 to 10 that stand alone with zero context. Each clip needs one idea, one payoff. If it needs setup, it is not a clip, it is a chapter." },
  { n: "3", name: "Cut vertical", body: "9:16 crop, speaker centered, safe zones respected (top 15% and bottom 20% clear of text). Trim silence and every um. First frame must show a face or motion, never a black frame." },
  { n: "4", name: "Hook pass", body: "First 3 seconds decide everything. Either re-order the clip so the boldest line comes first, or add a hook text card. Use the AI hook generator below on any clip that opens slow." },
  { n: "5", name: "Captions and brand", body: "Burned in captions, 3 to 5 words per line, brand colors. Add the Homeward Care mark small in a corner. Partner clips carry the Primera Haven mark too." },
  { n: "6", name: "Title, thumb, export", body: "Name the file with date, pillar, and hook (0707-authority-5questions). Build thumbnails for YouTube in the Thumbnail Lab. Export 1080x1920 for vertical, 1920x1080 for long form." },
];

/* ---------------- POSTING DATA ---------------- */

const PLATFORMS = [
  { name: "Facebook", who: "Adult children 45 to 65 making care decisions. The primary buyer audience.", what: "Clips, quote cards, client wins, event posts. Boost the top clip each week with $20 to $50 targeted 25 miles around service areas.", cadence: "1 to 2 per day", notes: "Join and post value in local caregiver and senior resource groups. Answer questions without pitching. Profile does the selling." },
  { name: "Instagram", who: "Younger family members, referral professionals, caregiver recruits.", what: "Reels from the clip stack, Stories for behind the scenes, carousel versions of the educational lists.", cadence: "1 Reel per day, Stories daily", notes: "Reels get discovery. Carousels get saves. Saves signal the algorithm that this account is a resource." },
  { name: "TikTok", who: "Fast growing 40+ caregiver audience searching care questions like a search engine.", what: "Same clip stack, native captions, reply-to-comment videos. The What I wish every family knew series lives here.", cadence: "1 to 2 per day", notes: "Reply to every question with a video reply when possible. Comment replies are free content prompts." },
  { name: "YouTube", who: "High intent searchers: assisted living cost Michigan, CLS services, how to choose home care.", what: "Long form is the home base. Shorts from the clip stack. Titles written for search, not cleverness.", cadence: "1 long form per week, 3 to 5 Shorts", notes: "This is the SME library. Every video description links Homeward Care and Primera Haven sites with UTM tags." },
  { name: "LinkedIn", who: "Discharge planners, case managers, CMH staff, attorneys, referral partners.", what: "The professional cut: discharge window content, partnership announcements, hiring standards, outcomes.", cadence: "2 to 3 per week", notes: "This channel fills the referral pipeline. Dominique posts as herself, company page reshares." },
  { name: "Google Business", who: "Families searching home care near me at the moment of need.", what: "Weekly photo or clip post, every FAQ answered, review requests after every positive family interaction.", cadence: "1 to 2 per week", notes: "Reviews plus fresh posts move local ranking. This is the quiet conversion engine." },
];

/* ---------------- AI HELPER ---------------- */

async function askClaude(system, user) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: `${system}\n\n${user}` }],
    }),
  });
  const data = await response.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

const BRAND_VOICE = `You are the content strategist for Homeward Care LLC (Michigan home care and community living supports agency owned by Dominique Tagliaferro) and its partner Primera Haven Assisted Living. Voice: warm, plainspoken, authoritative, direct. Speak to adult children making care decisions for a parent, and to referral professionals. Never use em dashes. Never use hyphenated compound descriptors. No corporate filler. Concrete, specific, human. Dominique is the on-camera subject matter expert.`;

/* ---------------- SMALL UI PIECES ---------------- */

function Tag({ children, color = C.brass }) {
  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color, border: `1px solid ${color}55`, padding: "3px 8px", borderRadius: 2 }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, disabled, kind = "solid", small }) {
  const base = {
    border: "none", borderRadius: 3, fontWeight: 600,
    padding: small ? "8px 14px" : "12px 20px",
    fontSize: small ? 12 : 14,
    opacity: disabled ? 0.5 : 1,
    transition: "transform .12s ease",
  };
  const styles = kind === "solid"
    ? { ...base, background: C.brass, color: C.pineDeep }
    : kind === "ghost"
    ? { ...base, background: "transparent", color: C.sage, border: `1px solid ${C.sage}44` }
    : { ...base, background: C.red, color: C.ivory };
  return (
    <button style={styles} onClick={onClick} disabled={disabled}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      {children}
    </button>
  );
}

function AIOutput({ text, loading, label }) {
  if (loading) return (
    <div style={{ marginTop: 14, padding: 18, background: C.pineDeep, borderRadius: 4, border: `1px solid ${C.brass}33` }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.brassLight }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: C.red, marginRight: 8, animation: "pulse 1s infinite" }} />
        Writing{label ? ` ${label}` : ""}...
      </span>
    </div>
  );
  if (!text) return null;
  return (
    <div style={{ marginTop: 14, padding: 20, background: C.pineDeep, borderRadius: 4, border: `1px solid ${C.brass}33`, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.65, color: C.ivory }}>
      {text}
      <div style={{ marginTop: 14 }}>
        <Btn small kind="ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(text)}>Copy</Btn>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: C.sageDim, marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", background: C.pineDeep, border: `1px solid ${C.sage}33`, borderRadius: 3,
  color: C.ivory, padding: "10px 12px", fontSize: 14, outline: "none",
};

/* ---------------- TABS ---------------- */

function Overview() {
  return (
    <div>
      <SectionTitle kicker="THE PLAN" title="Record once. Publish everywhere." />
      <p style={{ maxWidth: 720, fontSize: 15, lineHeight: 1.7, color: C.sage }}>
        Dominique records medium and long form value content on a fixed weekly cadence. Every recording is
        chopped into short clips, packaged with hooks and captions, and distributed across every Homeward Care
        and partner channel. Two outcomes: Dominique becomes the recognized subject matter expert in Michigan
        home and community care, and the partner network, led by Primera Haven Assisted Living, gets a steady
        stream of qualified families and referral professionals.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, margin: "28px 0 40px" }}>
        {PILLARS.map((p) => (
          <div key={p.id} style={{ background: C.pineDeep, border: `1px solid ${C.sage}22`, borderTop: `3px solid ${C.brass}`, borderRadius: 4, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Tag>{p.tag}</Tag>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.brassLight }}>{p.share}</span>
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: C.ivory, marginBottom: 8 }}>{p.name}</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: C.sage, margin: "0 0 10px" }}>{p.desc}</p>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: C.brassLight, margin: 0, fontStyle: "italic" }}>{p.proof}</p>
          </div>
        ))}
      </div>

      <SectionTitle kicker="THE PIPELINE" title="One recording becomes twenty assets" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, margin: "20px 0 40px", borderLeft: `1px solid ${C.sage}22` }}>
        {FUNNEL.map((f) => (
          <div key={f.step} style={{ flex: "1 1 180px", padding: "16px 18px", borderRight: `1px solid ${C.sage}22`, borderTop: `1px solid ${C.sage}22`, borderBottom: `1px solid ${C.sage}22` }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.brass, marginBottom: 6 }}>{f.step}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.ivory, marginBottom: 6 }}>{f.name}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: C.sage }}>{f.detail}</div>
          </div>
        ))}
      </div>

      <SectionTitle kicker="THE WEEK" title="Weekly operating rhythm" />
      <div style={{ marginTop: 18 }}>
        {CADENCE.map((d) => (
          <div key={d.day} style={{ display: "flex", gap: 18, padding: "14px 0", borderBottom: `1px solid ${C.sage}18`, alignItems: "flex-start" }}>
            <div style={{ minWidth: 52, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.brassLight, paddingTop: 2 }}>{d.day}</div>
            <div style={{ minWidth: 120, fontWeight: 600, fontSize: 14, color: C.ivory, paddingTop: 1 }}>{d.label}</div>
            <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.7, color: C.sage }}>
              {d.items.join("  ·  ")}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, padding: 22, background: C.pineDeep, borderRadius: 4, border: `1px solid ${C.brass}44`, maxWidth: 780 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: C.brassLight, marginBottom: 8 }}>The 90 day targets</div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: C.sage }}>
          12 long form videos published · 150+ clips distributed · Dominique appearing in local feeds daily ·
          Measurable lift in Primera Haven tour requests, Homeward Care consults, and inbound referral partner
          contacts. Track weekly: watch time, saves, profile visits, DMs, tour bookings, consult calls.
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title }) {
  return (
    <div style={{ margin: "8px 0 16px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: C.brass, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, color: C.ivory, margin: 0, lineHeight: 1.15 }}>{title}</h2>
    </div>
  );
}

/* ---------------- RECORD TAB ---------------- */

function RecordTab() {
  const [filter, setFilter] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);

  // Script writer state
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("Medium explainer, 5 to 8 minutes");
  const [partner, setPartner] = useState("Mention Primera Haven naturally where relevant");
  const [cta, setCta] = useState("Book a free consultation with Homeward Care");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const shown = PROMPTS.filter((p) => filter === "all" || p.pillar === filter);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setScript("");
    try {
      const out = await askClaude(
        BRAND_VOICE,
        `Write a recording script for Dominique. Topic: ${topic}. Format: ${length}. Partner instruction: ${partner}. Call to action: ${cta}.
Structure the output exactly as:
HOOK OPTIONS (3 one-line openers, boldest first)
TALKING SCRIPT (conversational beats Dominique speaks from, not word for word reading, with [PAUSE] and [STORY] markers)
CLIP MOMENTS (3 lines in the script most likely to work as standalone short clips)
CLOSE + CTA (exact closing lines)`
      );
      setScript(out);
    } catch (e) {
      setScript("Something went wrong reaching the writing engine. Try again.");
    }
    setLoading(false);
  }

  async function saveScript() {
    if (!script) return;
    try {
      const key = "script:" + Date.now();
      await window.storage.set(key, JSON.stringify({ topic, length, script, date: new Date().toISOString() }));
      setSaveMsg("Saved to your script library.");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (e) {
      setSaveMsg("Save failed. Copy the text instead.");
      setTimeout(() => setSaveMsg(""), 2500);
    }
  }

  return (
    <div>
      <SectionTitle kicker="DAILY RECORDING" title="Prompt bank" />
      <p style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.65, color: C.sage }}>
        Pick a master prompt, open it, and shoot the sub prompts in order. Each master prompt is one recording
        session. Each sub prompt is a beat that can survive on its own as a clip.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}>
        {[{ id: "all", n: "All" }, ...PILLARS.map((p) => ({ id: p.id, n: p.name }))].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, border: `1px solid ${filter === f.id ? C.brass : C.sage + "33"}`, background: filter === f.id ? C.brass : "transparent", color: filter === f.id ? C.pineDeep : C.sage }}>
            {f.n}
          </button>
        ))}
      </div>

      {shown.map((p, i) => {
        const open = openIdx === p.title;
        const pillar = PILLARS.find((x) => x.id === p.pillar);
        return (
          <div key={p.title} style={{ border: `1px solid ${C.sage}22`, borderLeft: open ? `3px solid ${C.red}` : `3px solid ${C.brass}66`, borderRadius: 3, marginBottom: 10, background: open ? C.pineDeep : "transparent" }}>
            <button onClick={() => setOpenIdx(open ? null : p.title)}
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.ivory, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.sageDim }}>{pillar.name.toUpperCase()} · {p.format.toUpperCase()}</div>
              </div>
              <span style={{ color: C.brassLight, fontSize: 18 }}>{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div style={{ padding: "0 18px 18px" }}>
                {p.subs.map((s, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, padding: "9px 0", borderTop: `1px solid ${C.sage}14` }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.red, minWidth: 24 }}>{"REC"}</span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.6, color: C.sage }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <Btn small kind="ghost" onClick={() => { setTopic(p.title); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }}>
                    Send to script writer ↓
                  </Btn>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 44, padding: 24, background: C.pineDeep, borderRadius: 5, border: `1px solid ${C.brass}44` }}>
        <SectionTitle kicker="AI SCRIPT WRITER" title="Turn a prompt into a talking script" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <Field label="Topic">
            <input style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Pick from the prompt bank or type your own" />
          </Field>
          <Field label="Format">
            <select style={inputStyle} value={length} onChange={(e) => setLength(e.target.value)}>
              <option>Short native, under 90 seconds</option>
              <option>Medium explainer, 5 to 8 minutes</option>
              <option>Long form anchor, 20 to 40 minutes</option>
            </select>
          </Field>
          <Field label="Partner promotion">
            <select style={inputStyle} value={partner} onChange={(e) => setPartner(e.target.value)}>
              <option>Mention Primera Haven naturally where relevant</option>
              <option>This is a dedicated Primera Haven spotlight</option>
              <option>Mention the full partner network (Primera Haven, MI Building Partners)</option>
              <option>No partner mention, pure value</option>
            </select>
          </Field>
          <Field label="Call to action">
            <input style={inputStyle} value={cta} onChange={(e) => setCta(e.target.value)} />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn onClick={generate} disabled={loading || !topic.trim()}>Write the script</Btn>
          {script && <Btn kind="ghost" onClick={saveScript}>Save to library</Btn>}
          {saveMsg && <span style={{ fontSize: 12.5, color: C.brassLight }}>{saveMsg}</span>}
        </div>
        <AIOutput text={script} loading={loading} label="script" />
      </div>

      <ScriptLibrary />
    </div>
  );
}

function ScriptLibrary() {
  const [items, setItems] = useState([]);
  const [openKey, setOpenKey] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    try {
      const res = await window.storage.list("script:");
      const keys = (res && res.keys) || [];
      const out = [];
      for (const k of keys.slice(-20)) {
        try {
          const r = await window.storage.get(k);
          if (r && r.value) out.push({ key: k, ...JSON.parse(r.value) });
        } catch (e) { /* skip */ }
      }
      out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setItems(out);
    } catch (e) { setItems([]); }
    setLoaded(true);
  }
  useEffect(() => { load(); }, []);

  async function remove(key) {
    try { await window.storage.delete(key); } catch (e) { /* ignore */ }
    load();
  }

  if (!loaded) return null;
  return (
    <div style={{ marginTop: 30 }}>
      <SectionTitle kicker="SAVED" title="Script library" />
      {items.length === 0 && <p style={{ fontSize: 13.5, color: C.sageDim }}>Saved scripts will appear here. Write one above and press Save to library.</p>}
      {items.map((it) => (
        <div key={it.key} style={{ border: `1px solid ${C.sage}22`, borderRadius: 3, marginBottom: 8 }}>
          <button onClick={() => setOpenKey(openKey === it.key ? null : it.key)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "12px 16px", color: C.ivory, fontSize: 14, display: "flex", justifyContent: "space-between" }}>
            <span>{it.topic}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.sageDim }}>{(it.date || "").slice(0, 10)}</span>
          </button>
          {openKey === it.key && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6, color: C.sage, marginBottom: 10 }}>{it.script}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small kind="ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(it.script)}>Copy</Btn>
                <Btn small kind="danger" onClick={() => remove(it.key)}>Delete</Btn>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- EDIT TAB ---------------- */

function EditTab() {
  const [transcript, setTranscript] = useState("");
  const [clips, setClips] = useState("");
  const [loading, setLoading] = useState(false);
  const [hookLine, setHookLine] = useState("");
  const [hooks, setHooks] = useState("");
  const [hookLoading, setHookLoading] = useState(false);

  async function findClips() {
    if (!transcript.trim()) return;
    setLoading(true); setClips("");
    try {
      const out = await askClaude(
        BRAND_VOICE,
        `Here is a transcript (or rough notes) from a recording session:\n"""${transcript.slice(0, 6000)}"""\nIdentify the 6 strongest standalone short clip moments. For each, output:
CLIP #: [2 to 6 word working title]
HOOK: [the opening line, reworded to be punchy if needed]
WHY IT WORKS: [one sentence]
CUT: [where to start and end, quoting the first and last few words]
Rank strongest first.`
      );
      setClips(out);
    } catch (e) { setClips("Could not reach the engine. Try again."); }
    setLoading(false);
  }

  async function punchHook() {
    if (!hookLine.trim()) return;
    setHookLoading(true); setHooks("");
    try {
      const out = await askClaude(
        BRAND_VOICE,
        `This short clip currently opens with: "${hookLine}". Write 5 stronger 3-second hook lines for the same clip. Mix styles: a bold claim, a question, a number, a myth flip, and a direct address to the viewer (talking to an adult child caring for a parent). One line each, no numbering commentary.`
      );
      setHooks(out);
    } catch (e) { setHooks("Could not reach the engine. Try again."); }
    setHookLoading(false);
  }

  return (
    <div>
      <SectionTitle kicker="EDIT SESSION" title="The chop run sheet" />
      <p style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.65, color: C.sage }}>
        Run this sequence every edit session, in order. It works in CapCut, Descript, or Premiere. The goal is
        volume with a quality floor: every clip ships with a hook, captions, and brand marks.
      </p>

      <div style={{ margin: "22px 0 36px" }}>
        {EDIT_STEPS.map((s) => (
          <div key={s.n} style={{ display: "flex", gap: 18, padding: "16px 0", borderBottom: `1px solid ${C.sage}18` }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: C.brass, minWidth: 34, lineHeight: 1 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.ivory, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.65, color: C.sage, maxWidth: 680 }}>{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 24, background: C.pineDeep, borderRadius: 5, border: `1px solid ${C.brass}44`, marginBottom: 24 }}>
        <SectionTitle kicker="AI CLIP FINDER" title="Paste a transcript, get the cuts" />
        <p style={{ fontSize: 13.5, color: C.sage, maxWidth: 640, lineHeight: 1.6 }}>
          Export the auto transcript from your editor (or paste rough notes) and the finder returns the six
          strongest clip moments ranked, each with a hook line and cut points.
        </p>
        <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste the transcript or session notes here..." />
        <div style={{ marginTop: 12 }}>
          <Btn onClick={findClips} disabled={loading || !transcript.trim()}>Find the clips</Btn>
        </div>
        <AIOutput text={clips} loading={loading} label="clip plan" />
      </div>

      <div style={{ padding: 24, background: C.pineDeep, borderRadius: 5, border: `1px solid ${C.brass}44` }}>
        <SectionTitle kicker="AI HOOK DOCTOR" title="Fix a slow opener" />
        <Field label="Current opening line of the clip">
          <input style={inputStyle} value={hookLine} onChange={(e) => setHookLine(e.target.value)} placeholder="e.g. So today I want to talk a little bit about assisted living costs" />
        </Field>
        <Btn onClick={punchHook} disabled={hookLoading || !hookLine.trim()}>Rewrite the hook</Btn>
        <AIOutput text={hooks} loading={hookLoading} label="hooks" />
      </div>
    </div>
  );
}

/* ---------------- POST TAB ---------------- */

function PostTab() {
  const [desc, setDesc] = useState("");
  const [platform, setPlatform] = useState("All platforms");
  const [captions, setCaptions] = useState("");
  const [loading, setLoading] = useState(false);

  async function writeCaptions() {
    if (!desc.trim()) return;
    setLoading(true); setCaptions("");
    try {
      const out = await askClaude(
        BRAND_VOICE,
        `Write posting captions for this clip: "${desc}". Target: ${platform}.
If All platforms, produce one caption each for Facebook (2 to 4 sentences, warm, ends with a question or CTA), Instagram/TikTok (short, punchy, line breaks, 5 to 8 relevant hashtags for Michigan senior care/caregiving), LinkedIn (professional angle for discharge planners and case managers, no hashtags spam, max 3), and YouTube (search-first title under 60 characters plus a 2 sentence description with a Homeward Care and Primera Haven link placeholder).
Label each section clearly. Never use em dashes.`
      );
      setCaptions(out);
    } catch (e) { setCaptions("Could not reach the engine. Try again."); }
    setLoading(false);
  }

  return (
    <div>
      <SectionTitle kicker="DISTRIBUTION" title="Where everything goes" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, margin: "20px 0 36px" }}>
        {PLATFORMS.map((p) => (
          <div key={p.name} style={{ background: C.pineDeep, border: `1px solid ${C.sage}22`, borderRadius: 4, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: C.ivory }}>{p.name}</div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.brassLight }}>{p.cadence}</span>
            </div>
            <Row k="Who" v={p.who} />
            <Row k="What" v={p.what} />
            <Row k="Edge" v={p.notes} />
          </div>
        ))}
      </div>

      <div style={{ padding: 24, background: C.pineDeep, borderRadius: 5, border: `1px solid ${C.brass}44` }}>
        <SectionTitle kicker="AI CAPTION WRITER" title="One clip, every caption" />
        <Field label="Describe the clip (topic, the key line, any partner mention)">
          <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. 60 second clip, Dominique busts the myth that you must spend all your savings before Medicaid helps, mentions Homeward Care free consult" />
        </Field>
        <Field label="Platform">
          <select style={inputStyle} value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option>All platforms</option>
            <option>Facebook</option>
            <option>Instagram / TikTok</option>
            <option>LinkedIn</option>
            <option>YouTube</option>
          </select>
        </Field>
        <Btn onClick={writeCaptions} disabled={loading || !desc.trim()}>Write captions</Btn>
        <AIOutput text={captions} loading={loading} label="captions" />
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.brass, minWidth: 34, paddingTop: 3, letterSpacing: "0.1em" }}>{k.toUpperCase()}</span>
      <span style={{ fontSize: 12.5, lineHeight: 1.55, color: C.sage }}>{v}</span>
    </div>
  );
}

/* ---------------- THUMBNAIL LAB ---------------- */

const THUMB_STYLES = [
  { id: "pine", bg: C.pine, accent: C.brassLight, text: C.ivory, name: "Pine + Brass" },
  { id: "ivory", bg: C.ivory, accent: C.red, text: C.pineDeep, name: "Ivory + Signal" },
  { id: "split", bg: `linear-gradient(105deg, ${C.pineDeep} 55%, ${C.brass} 55%)`, accent: C.ivory, text: C.ivory, name: "Split" },
  { id: "red", bg: C.red, accent: C.ivory, text: C.ivory, name: "Alert" },
];

function ThumbTab() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState("");
  const [loading, setLoading] = useState(false);
  const [line1, setLine1] = useState("DON'T PICK A");
  const [line2, setLine2] = useState("CARE HOME");
  const [line3, setLine3] = useState("before you watch this");
  const [style, setStyle] = useState(THUMB_STYLES[0]);
  const thumbRef = useRef(null);

  async function generateIdeas() {
    if (!topic.trim()) return;
    setLoading(true); setIdeas("");
    try {
      const out = await askClaude(
        BRAND_VOICE,
        `Video topic: "${topic}". Generate viral packaging:
TITLES: 5 YouTube titles under 60 characters, curiosity or stakes driven, search terms included where natural.
THUMBNAIL TEXT: 5 options of 2 to 5 words max, ALL CAPS style, designed to be read at a glance next to Dominique's face.
VISUAL CONCEPT: for the best option, one sentence describing the photo (Dominique's expression, prop, background) and where the text sits.
Never use em dashes.`
      );
      setIdeas(out);
    } catch (e) { setIdeas("Could not reach the engine. Try again."); }
    setLoading(false);
  }

  return (
    <div>
      <SectionTitle kicker="PACKAGING" title="Thumbnail lab" />
      <p style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.65, color: C.sage }}>
        Generate title and thumbnail text options with AI, then compose the text layout live below. Screenshot
        the preview or rebuild it in Canva with Dominique's photo dropped behind the text. Rule of the lab:
        five words max, one emotion, readable at postage stamp size.
      </p>

      <div style={{ padding: 24, background: C.pineDeep, borderRadius: 5, border: `1px solid ${C.brass}44`, margin: "20px 0 28px" }}>
        <Field label="Video topic">
          <input style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. What assisted living really costs in Michigan" />
        </Field>
        <Btn onClick={generateIdeas} disabled={loading || !topic.trim()}>Generate titles + thumb text</Btn>
        <AIOutput text={ideas} loading={loading} label="packaging" />
      </div>

      <SectionTitle kicker="COMPOSER" title="Live thumbnail preview" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start", marginTop: 16 }}>
        <div>
          <Field label="Top line (small kicker)"><input style={inputStyle} value={line1} onChange={(e) => setLine1(e.target.value)} /></Field>
          <Field label="Main line (the punch)"><input style={inputStyle} value={line2} onChange={(e) => setLine2(e.target.value)} /></Field>
          <Field label="Bottom line (payoff)"><input style={inputStyle} value={line3} onChange={(e) => setLine3(e.target.value)} /></Field>
          <Field label="Style">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {THUMB_STYLES.map((s) => (
                <button key={s.id} onClick={() => setStyle(s)} style={{ padding: "7px 12px", borderRadius: 3, fontSize: 12, fontWeight: 600, border: `1px solid ${style.id === s.id ? C.brassLight : C.sage + "33"}`, background: style.id === s.id ? C.brass : "transparent", color: style.id === s.id ? C.pineDeep : C.sage }}>
                  {s.name}
                </button>
              ))}
            </div>
          </Field>
          <p style={{ fontSize: 12.5, color: C.sageDim, lineHeight: 1.6 }}>
            The dashed zone on the right marks where Dominique's photo goes: face large, expression matching the
            emotion of the text (concern for warnings, warmth for stories, surprise for myths).
          </p>
        </div>

        <div ref={thumbRef} style={{ aspectRatio: "16/9", background: style.bg, borderRadius: 6, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "6%", boxShadow: "0 12px 40px rgba(0,0,0,.45)" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "38%", height: "100%", border: `2px dashed ${style.text}44`, borderRadius: "0 6px 6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: style.text + "88", textAlign: "center", padding: 8 }}>DOMINIQUE<br />PHOTO<br />ZONE</span>
          </div>
          <div style={{ width: "58%" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(9px, 1.6vw, 14px)", letterSpacing: "0.14em", color: style.accent, fontWeight: 500, marginBottom: 6 }}>{line1}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 5vw, 52px)", fontWeight: 700, color: style.text, lineHeight: 0.98, textTransform: "uppercase", marginBottom: 8 }}>{line2}</div>
            <div style={{ fontSize: "clamp(10px, 1.8vw, 16px)", color: style.text, opacity: 0.85, fontWeight: 600, borderLeft: `3px solid ${style.accent}`, paddingLeft: 10 }}>{line3}</div>
          </div>
          <div style={{ position: "absolute", bottom: "5%", left: "6%", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color: style.accent }}>HOMEWARD CARE</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- APP SHELL ---------------- */

const TABS = [
  { id: "overview", name: "Overview" },
  { id: "record", name: "Record" },
  { id: "edit", name: "Edit" },
  { id: "post", name: "Post" },
  { id: "thumbs", name: "Thumbnail Lab" },
];

export default function App() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ minHeight: "100vh", background: C.pine, fontFamily: "'Public Sans', sans-serif", color: C.ivory }}>
      <style>{FONT_LINK}</style>

      <header style={{ borderBottom: `1px solid ${C.sage}22`, padding: "26px 5% 0", background: C.pineDeep }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 10, background: C.red, animation: "pulse 1.6s infinite" }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: C.brassLight }}>HOMEWARD CONTENT STUDIO</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: 0, lineHeight: 1.05 }}>
              Dominique on record.
            </h1>
            <p style={{ fontSize: 13.5, color: C.sage, margin: "8px 0 0", maxWidth: 520 }}>
              The subject matter expert engine for Homeward Care and the partner network.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color={C.brassLight}>HOMEWARD CARE</Tag>{" "}
            <Tag color={C.sageDim}>PRIMERA HAVEN</Tag>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, marginTop: 24, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "12px 20px", fontSize: 13.5, fontWeight: 600, border: "none",
                borderBottom: tab === t.id ? `3px solid ${C.brass}` : "3px solid transparent",
                background: "transparent", color: tab === t.id ? C.brassLight : C.sage,
              }}>
              {t.name}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: "36px 5% 80px", maxWidth: 1160, margin: "0 auto" }}>
        {tab === "overview" && <Overview />}
        {tab === "record" && <RecordTab />}
        {tab === "edit" && <EditTab />}
        {tab === "post" && <PostTab />}
        {tab === "thumbs" && <ThumbTab />}
      </main>
    </div>
  );
}

