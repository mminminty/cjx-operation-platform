
/* CJx Operation Platform — Task Submission, photo-verified Pass/Fail (ปิดงาน)
   Flow: attach photos → verification → PASS (coins) | FAIL (feedback +
   redo countdown). Repeated fail escalates up the chain; redo still required. */
(function () {
  const NS = window.CJExpressCJxDesignSystem_d61aba;
  const { IconButton, Button, Input, StatusChip, PointsPill, Card } = NS;

  const REDO_SECONDS = 20 * 60; // resubmit window
  const CHAIN = ["AM", "RM", "สำนักงานใหญ่"];
  const FEEDBACK = [
    "แสงในภาพไม่เพียงพอ ถ่ายให้สว่างขึ้น",
    "ไม่พบป้ายราคาในภาพอย่างชัดเจน",
    "มุมถ่ายไม่ครอบคลุมทั้งชั้นวาง",
  ];

  function PhotoSlot({ src }) {
    return (
      <div style={{
        aspectRatio: "1 / 1", borderRadius: "var(--radius-md)",
        border: src ? "1px solid var(--border-subtle)" : "2px dashed var(--border-default)",
        background: src ? "var(--surface-sunken)" : "var(--surface-card)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 4, color: "var(--text-tertiary)", cursor: "pointer", overflow: "hidden",
      }}>
        {src
          ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <><span className="material-symbols-outlined" style={{ fontSize: 28 }}>add_a_photo</span><span style={{ fontSize: 11 }}>แนบรูป</span></>}
      </div>
    );
  }

  function Countdown({ seconds }) {
    const [t, setT] = React.useState(seconds);
    React.useEffect(() => {
      if (t <= 0) return;
      const id = setInterval(() => setT((x) => Math.max(0, x - 1)), 1000);
      return () => clearInterval(id);
    }, []);
    const mm = String(Math.floor(t / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    return <span style={{ fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums", fontWeight: 800 }}>{mm}:{ss}</span>;
  }

  /* 22 brand coins dropping from the top, bouncing, and settling below the button */
  function CoinRain() {
    const ref = React.useRef(null);
    const [h, setH] = React.useState(0);
    const [floor, setFloor] = React.useState(0); // y below which coins may rest (just under the button)
    const [drop, setDrop] = React.useState(false);
    React.useLayoutEffect(() => {
      const layer = ref.current;
      if (!layer) return;
      setH(layer.offsetHeight);
      const root = layer.parentElement;
      const btn = root && root.querySelector("button");
      if (btn) {
        const lr = layer.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        setFloor(Math.round(br.bottom - lr.top + 16)); // 16px gap under the button
      } else {
        setFloor(Math.round(layer.offsetHeight * 0.72));
      }
    }, []);
    React.useEffect(() => {
      if (!h) return;
      const id = setTimeout(() => setDrop(true), 30);
      return () => clearTimeout(id);
    }, [h]);
    const coins = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 88,              // % across the screen
      delay: Math.random() * 0.5,            // s
      dur: 1.0 + Math.random() * 0.7,        // s
      size: 46 + Math.round(Math.random() * 26),   // bigger coins (46–72px)
      spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.round(Math.random() * 360)),
      r: Math.random(),                      // 0..1 position within the resting band
    })), []);
    return (
      <div ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 9999 }}>
        {h > 0 && coins.map((c) => {
          const maxLand = h - c.size - 8;
          const minLand = Math.min(floor, maxLand);
          const land = Math.round(minLand + c.r * (maxLand - minLand));
          return (
            <div key={c.id} style={{
              position: "absolute", top: 0, left: c.left + "%", width: c.size, height: c.size,
              transform: drop ? `translateY(${land}px) rotate(${c.spin}deg)` : "translateY(-64px) rotate(0deg)",
              opacity: drop ? 1 : 0,
              transition: `transform ${c.dur}s cubic-bezier(.34,1.32,.64,1) ${c.delay}s, opacity .25s ${c.delay}s`,
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "var(--radius-full)", background: "radial-gradient(circle at 35% 30%, #ffe766, var(--cjx-yellow) 60%, #e6b800)", border: "2.5px solid #e0a900", boxShadow: "inset 0 -3px 4px rgba(160,110,0,.4), 0 3px 6px rgba(48,25,18,.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-numeric)", fontWeight: 800, color: "var(--cjx-brown)", fontSize: c.size * 0.5, lineHeight: 1 }}>฿</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---- Verification processing step ---- */
  function Processing() {
    return (
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px", background: "var(--surface-page)" }}>
        <style>{`@keyframes cjxSpin{to{transform:rotate(360deg)}}@keyframes cjxBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
        <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-full)", border: "4px solid var(--yellow-100)", borderTopColor: "var(--cjx-yellow)", animation: "cjxSpin 0.9s linear infinite" }} />
          <img src={window.RES('mumiPoint','./assets/mascot/mumi-point.png')} alt="" style={{ height: 80, animation: "cjxBob 1.4s ease-in-out infinite" }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "22px 0 6px" }}>กำลังตรวจสอบรูปถ่าย…</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 280 }}>ระบบกำลังประมวลผลภาพเพื่อตรวจมาตรฐานงาน</p>
      </div>
    );
  }

  /* ---- Result step ---- */
  function ResultView({ verdict, attempt, coins, taskTitle, onRedo, onDone }) {
    const [coinsOn, setCoinsOn] = React.useState(false);
    const collect = () => {
      if (coinsOn) return;
      setCoinsOn(true);
      setTimeout(() => onDone && onDone(), 2400);
    };
    if (verdict === "pass") {
      return (
        <div style={{ position: "relative", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px", background: "var(--surface-wash)", overflow: "hidden" }}>
          <style>{`@keyframes cjxPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`}</style>
          <img src={window.RES('mumiYeah','./assets/mascot/mumi-yeah.png')} alt="" style={{ height: 150, animation: "cjxPop .45s var(--ease-spring)" }} />
          <div style={{ marginTop: 18 }}><StatusChip status="passed" icon="check_circle">ผ่านการตรวจสอบ</StatusChip></div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: "14px 0 6px" }}>เยี่ยมมาก! ปิดงานสำเร็จ</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 300 }}>{taskTitle}</p>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600 }}>ได้รับเหรียญรางวัล</div>
            <PointsPill points={coins} prefix="+" icon="monetization_on" label="เหรียญ" size="lg" />
          </div>
          <div style={{ marginTop: 28, width: "100%", maxWidth: 320, position: "relative", zIndex: 31 }}>
            <Button variant="primary" size="lg" fullWidth onClick={collect}>เก็บเหรียญ</Button>
          </div>
          {coinsOn && <CoinRain />}
        </div>
      );
    }

    // FAIL — attempt 1 is the store's own chance to fix; missing it escalates to AM → RM → HQ
    const escalated = attempt >= 2;
    const chainIdx = Math.min(attempt - 2, CHAIN.length - 1); // who it's been escalated to (AM on first escalation)
    return (
      <div style={{ minHeight: "100%", background: "var(--surface-page)", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <style>{`@keyframes cjxPop{0%{transform:scale(.7);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        <img src={window.RES('mumiMega','./assets/mascot/mumi-megaphone.png')} alt="" style={{ height: 120, animation: "cjxPop .4s var(--ease-out)" }} />
        <div style={{ marginTop: 14 }}><StatusChip status="fix" icon="cancel">ไม่ผ่านการตรวจสอบ</StatusChip></div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "12px 0 4px" }}>แก้ไขงานและส่งอีกครั้ง</h2>

        {/* Redo countdown */}
        <Card accent="fix" style={{ width: "100%", maxWidth: 340, marginTop: 18, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="material-symbols-outlined" style={{ color: "var(--cjx-red)" }}>timer</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>แก้ไขภายใน</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{attempt === 1 ? "หากเลยกำหนดจะมีการส่งเรื่องไปยัง AM" : `ครั้งที่ ${attempt} · หากเลยกำหนดจะยกระดับต่อไป`}</div>
            </div>
            <div style={{ fontSize: 22, color: "var(--cjx-red)" }}><Countdown seconds={REDO_SECONDS} /> <span style={{ fontSize: 12, fontWeight: 600 }}>นาที</span></div>
          </div>
        </Card>

        {/* Escalation chain (shown once escalated) */}
        {escalated && (
          <Card accent="fix" style={{ width: "100%", maxWidth: 340, marginTop: 12, textAlign: "left", background: "var(--red-50)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined fill" style={{ color: "var(--cjx-red)" }}>warning</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>ยกระดับการแจ้งเตือนแล้ว</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              {CHAIN.map((c, i) => (
                <React.Fragment key={i}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: "var(--radius-pill)",
                    background: i <= chainIdx ? "var(--cjx-red)" : "var(--surface-sunken)",
                    color: i <= chainIdx ? "#fff" : "var(--text-tertiary)",
                  }}>{c}</span>
                  {i < CHAIN.length - 1 && <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--text-tertiary)" }}>arrow_forward</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 10 }}>คุณยังต้องแก้ไขและส่งงานนี้ให้ผ่าน</div>
          </Card>
        )}

        <div style={{ marginTop: 22, width: "100%", maxWidth: 340, display: "flex", gap: 10 }}>
          <Button variant="ghost" style={{ flex: 1 }} onClick={onDone}>ภายหลัง</Button>
          <Button variant="danger" icon="add_a_photo" style={{ flex: 1 }} onClick={onRedo}>ถ่ายใหม่ & ส่งอีกครั้ง</Button>
        </div>
      </div>
    );
  }

  function SubmitScreen({ taskTitle, coins = 5, onBack }) {
    const [step, setStep] = React.useState("form"); // form | processing | result
    const [attempt, setAttempt] = React.useState(1);
    const [verdict, setVerdict] = React.useState("fail");

    // Simulated verdict: fail on first two attempts (to show redo + escalation), pass on the 3rd.
    const runCheck = () => {
      setStep("processing");
      setTimeout(() => {
        setVerdict(attempt >= 3 ? "pass" : "fail");
        setStep("result");
      }, 1700);
    };

    if (step === "processing") return <Processing />;
    if (step === "result") {
      return (
        <ResultView
          verdict={verdict}
          attempt={attempt}
          coins={coins}
          taskTitle={taskTitle}
          onDone={onBack}
          onRedo={() => { setAttempt((a) => a + 1); setStep("form"); }}
        />
      );
    }

    return (
      <div style={{ minHeight: "100%", background: "var(--surface-page)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 8, height: 56, padding: "0 8px", background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, zIndex: 5 }}>
          <IconButton icon="arrow_back" onClick={onBack} aria-label="ย้อนกลับ" />
          <div style={{ fontWeight: 700, fontSize: 16, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{taskTitle || "ปิดงาน"}</div>
          <PointsPill points={coins} icon="monetization_on" size="sm" />
        </header>

        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface-wash)", border: "1px solid var(--yellow-200)", borderRadius: "var(--radius-md)", padding: 12 }}>
            <span className="material-symbols-outlined" style={{ color: "var(--yellow-700)" }}>fact_check</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>แนบรูปถ่ายให้ครบถ้วน ระบบจะตรวจสอบผลให้อัตโนมัติ</span>
          </div>

          {attempt > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cjx-red)", fontSize: 13, fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>history</span>
              ส่งใหม่ครั้งที่ {attempt} — แก้ตามคำแนะนำก่อนส่ง
            </div>
          )}

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>หลักฐานรูปถ่าย</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              <PhotoSlot src={window.RES('photo1','https://images.unsplash.com/photo-1556767576-5ec41e3239ea?w=300&q=60')} />
              <PhotoSlot src={window.RES('photo2','https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=60')} />
              <PhotoSlot />
            </div>
          </div>

          <Input label="หมายเหตุ (ถ้ามี)" placeholder="ระบุรายละเอียดเพิ่มเติม" icon="edit_note" />

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button variant="ghost" style={{ flex: 1 }} onClick={onBack}>ยกเลิก</Button>
            <Button variant="primary" icon="fact_check" style={{ flex: 1 }} onClick={runCheck}>ส่งตรวจสอบ</Button>
          </div>
        </div>
      </div>
    );
  }

  window.SubmitScreen = SubmitScreen;
})();

