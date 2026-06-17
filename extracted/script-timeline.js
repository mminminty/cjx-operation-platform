
/* CJx Operation Platform — Task Timeline screen (งานวันนี้)
   To-do tasks (current → must-fix → upcoming) shown first; completed
   tasks are hidden behind a collapsible section. */
(function () {
  const NS = window.CJExpressCJxDesignSystem_d61aba;
  const { TopAppBar, SummaryStat, TimeBlock, TaskCard, StatusChip, Button, Card } = NS;

  // state: "current" | "fix" | "pending" | "done"
  const TASKS = [
    { time: "09:00", note: "ตอนนี้", state: "current", active: true, title: "เช็คลิสต์มาตรฐาน", desc: "หัวชั้น ตั้งกอง 3-Step, สื่อหน้าร้าน, สินค้าหลุดแกรม, อุณหภูมิตู้แช่, ถาดรองน้ำ", coins: 20, req: ["photo"] },
    { time: "07:00", state: "fix", title: "ยืนยันหา RTC / หมดอายุ ของสด", coins: 15, req: ["photo"], chipText: "แก้ภายใน 07:20" },
    { time: "09:00", state: "pending", title: "ยืนยันการใส่ป้ายโปร / ปรับราคา", desc: "ปรับราคาป้ายขาว, ป้ายโปร", coins: 10, req: ["photo"] },
    { time: "10:15 / 14:15", state: "pending", title: "ส่งยอดขาย", desc: "ส่งรูปแดชบอร์ด MVP", coins: 10, req: ["photo"] },
    { time: "14:00", state: "pending", title: "ส่งรูปปิดกะ", desc: "รูปเบย์ทั้งร้าน, ห้องสต็อกเรียบร้อย", coins: 10, req: ["photo"] },
    { time: "14:45", state: "pending", title: "พนักงานเลิกงานตรงเวลา", desc: "ส่งรูปพนักงานก่อนกลับบ้าน", coins: 5, req: ["photo"] },
    { time: "06:00", note: "เปิดร้าน", state: "done", title: "ตรวจสอบกำลังคน", desc: "มากี่คน / ใครลา", coins: 10, req: ["photo", "form"] },
    { time: "06:30", state: "done", title: "เปิดไฟ–เครื่องปรับอากาศ", desc: "ตรวจระบบหน้าร้าน", coins: 5, req: ["photo"] },
  ];

  const ORDER = { fix: 0, current: 1, pending: 2 };

  // --- Previous-shift summary detail (mirrors the ส่งต่อกะ result lists) ---
  function ResultRow({ state, label, detail, warn, last }) {
    const cfg = {
      pass: { icon: "check_circle", color: "var(--cjx-green)" },
      fail: { icon: "cancel", color: "var(--cjx-red)" },
      pending: { icon: "radio_button_unchecked", color: "var(--text-tertiary)" },
    }[state] || { icon: "cancel", color: "var(--cjx-red)" };
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: last ? "none" : "1px solid var(--border-subtle)" }}>
        <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: cfg.color, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{label}</div>
          {detail && <div style={{ fontSize: 12, color: warn ? "var(--cjx-red)" : "var(--text-tertiary)", marginTop: 2, lineHeight: 1.35 }}>{detail}</div>}
        </div>
      </div>
    );
  }
  function ResultGroup({ title, rows }) {
    return (
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", color: "var(--text-tertiary)", marginBottom: 8 }}>{title}</div>
        <Card>
          {rows.map((r, i) => <ResultRow key={i} {...r} last={i === rows.length - 1} />)}
        </Card>
      </div>
    );
  }
  const PREV_WORK = [
    { state: "pass", label: "ยอดขาย 12,180 / 11,500 บาท", detail: "ถึงเป้ากะดึกแล้ว" },
    { state: "pass", label: "ยอดขายคาเฟ่ 1,240 / 1,100 บาท", detail: "เกินเป้า 140 บาท" },
    { state: "pass", label: "สมาชิก 2 / 2" },
    { state: "fail", label: "งานมาตรฐาน", detail: "เหลือ 1 งานส่งต่อ", warn: true },
  ];
  const PREV_SALES = [
    { state: "pass", label: "สินค้าโฟกัส 1,020 / 1,000 บาท", detail: "เกินเป้า 20 บาท" },
    { state: "fail", label: "แลกซื้อ 720 / 1,000 บาท", detail: "ทำเพิ่ม 280 บาท", warn: true },
  ];
  const PREV_STANDARD = [
    { state: "pending", label: "เคลียร์พื้นที่จัดรายการ", detail: "ส่งต่อให้กะเช้า" },
    { state: "fail", label: "ป้ายโปรรอพิมพ์ที่ต้องติด", detail: "128 ป้าย" },
    { state: "fail", label: "สินค้าขาดเชลฟ์", detail: "18 รายการ" },
  ];

  function TaskTimelineScreen({ onOpenTask, onMenu, onHandover, onAvatar }) {
    const open = (title, coins) => onOpenTask(title, coins);
    const [showDone, setShowDone] = React.useState(false);
    const [showUpcoming, setShowUpcoming] = React.useState(false);
    const [showPrevSummary, setShowPrevSummary] = React.useState(false);
    const [showHandover, setShowHandover] = React.useState(true);
    const [ackHandover, setAckHandover] = React.useState(false);
    const [annOpen, setAnnOpen] = React.useState(true);
    const [filter, setFilter] = React.useState(null);
    const STAT = {
      fix:     { tasks: ["fix"],     label: "งานที่ต้องแก้ไข" },
      current: { tasks: ["current"], label: "งานที่ต้องทำตอนนี้" },
      passed:  { tasks: ["done"],    label: "งานที่ผ่านแล้ว" },
    };
    const filtered = filter ? TASKS.filter((t) => STAT[filter].tasks.includes(t.state)) : null;
    const toggleFilter = (key) => setFilter((cur) => (cur === key ? null : key));

    // Priority (current + must-fix) shown first; upcoming (pending) collapsed.
    const priority = TASKS.filter((t) => t.state === "current" || t.state === "fix").sort((a, b) => ORDER[a.state] - ORDER[b.state]);
    const upcoming = TASKS.filter((t) => t.state === "pending");
    const done = TASKS.filter((t) => t.state === "done");

    const renderBlock = (t, i) => (
      <TimeBlock key={i} time={t.time} note={t.note} state={t.state} active={t.active}>
        <TaskCard
          title={t.title}
          desc={t.desc}
          status={t.state === "done" ? "passed" : t.state}
          requirements={t.req}
          coins={t.coins}
          chip={
            t.state === "current" ? <StatusChip status="current" size="sm" />
            : t.state === "fix" ? <StatusChip status="fix" icon="cancel" size="sm">{t.chipText || "ต้องแก้ไข"}</StatusChip>
            : t.state === "done" ? <StatusChip status="passed" icon="check_circle" size="sm">ผ่าน</StatusChip>
            : undefined
          }
          action={undefined}
          onClick={() => open(t.title, t.coins)}
        />
      </TimeBlock>
    );

    const handoverBlock = (
          <div style={{ background: "var(--blue-50)", border: "1px solid rgba(25,71,147,.22)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginTop: 20, overflow: "hidden" }}>
            <button type="button" onClick={() => setShowHandover((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--cjx-blue)", marginBottom: showHandover ? 12 : 0 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: "var(--cjx-blue)", flexShrink: 0 }}>swap_horiz</span>
              งานส่งต่อจากกะที่แล้ว
              <span className="material-symbols-outlined" style={{ marginLeft: "auto", fontSize: 22, color: "var(--cjx-blue)", transform: showHandover ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
            </button>

            {showHandover && (<div>

            {/* Full previous-shift summary (collapsible) */}
            <button
              onClick={() => setShowPrevSummary((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginTop: 12, padding: "11px 14px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--text-tertiary)" }}>summarize</span>
              สรุปผลกะที่แล้ว
              <span className="material-symbols-outlined" style={{ marginLeft: "auto", fontSize: 22, transform: showPrevSummary ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
            </button>
            {showPrevSummary && (
              <div>
                <ResultGroup title="สรุปผลการทำงาน" rows={PREV_WORK} />
                <ResultGroup title="สรุปยอดขายประจำกะ" rows={PREV_SALES} />
                <ResultGroup title="งานมาตรฐานที่ยังทำไม่สำเร็จ" rows={PREV_STANDARD} />
              </div>
            )}
            {/* Note carried over from last shift */}
            <div style={{ marginTop: 12, display: "flex", gap: 10, padding: "12px 14px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--text-tertiary)", flexShrink: 0, marginTop: 1 }}>sticky_note_2</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".02em", color: "var(--text-tertiary)", marginBottom: 3 }}>บันทึกจากกะที่แล้ว</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--text-primary)", textWrap: "pretty" }}>อุณหภูมิตู้แช่สูงกว่ามาตรฐาน เปิดเคสแล้ว CS-00975</p>
              </div>
            </div>

            {/* Acknowledge handover */}
            {ackHandover ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", color: "var(--cjx-green)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>check_circle</span>
                รับทราบงานส่งต่อแล้ว
              </div>
            ) : (
              <button type="button" onClick={() => { setAckHandover(true); setShowHandover(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 14, paddingTop: 12, background: "transparent", border: "none", borderTop: "1px solid var(--border-subtle)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>รับทราบ
              </button>
            )}
            </div>)}
          </div>
    );

    return (
      <div style={{ paddingBottom: 24 }}>
        <TopAppBar align="left" onMenu={onMenu} title="จันทร์ 28 พ.ค. 2569" right={<button type="button" onClick={onAvatar} aria-label="บัญชีผู้ใช้" style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", overflow: "hidden", border: "1px solid var(--border-default)", padding: 0, cursor: "pointer", background: "var(--ink-200)" }}><img src={window.RES('avatar32','https://i.pravatar.cc/100?img=32')} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></button>} />
        <div style={{ padding: "14px 16px" }}>
          {/* Important announcement from HQ — red minimal wash, dismissible */}
          {annOpen && (
          <div style={{ background: "var(--red-50)", border: "1px solid rgba(238,46,60,.22)", borderRadius: "var(--radius-lg)", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px 11px" }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 22, color: "var(--cjx-red)", flexShrink: 0, marginTop: -1 }}>campaign</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".02em", color: "var(--cjx-red)", marginBottom: 2 }}>ประกาศจากสำนักงานใหญ่ · ด่วน</div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.45, color: "var(--text-primary)", textWrap: "pretty" }}>งดจำหน่ายสินค้าล็อต ABC-204 ทุกสาขา เก็บออกจากเชลฟ์ภายใน 12:00 วันนี้ และยืนยันผ่านระบบ</p>
              </div>
            </div>
            <button type="button" onClick={() => setAnnOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "11px 15px", background: "transparent", border: "none", borderTop: "1px solid rgba(238,46,60,.22)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--cjx-red)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>รับทราบ
            </button>
          </div>
          )}

          {/* Two separate blocks side by side: shift lead (grows, one line) + store coins */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {/* Block 1 — shift lead on duty (grows so the name stays on one line) */}
            <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <img src={window.RES('avatar32','https://i.pravatar.cc/100?img=32')} alt="" style={{ width: 38, height: 38, borderRadius: "var(--radius-full)", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".02em", color: "var(--text-tertiary)" }}>ผู้รับผิดชอบกะ</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 1, whiteSpace: "nowrap" }}>คุณ สมหญิง ใจดี</div>
              </div>
            </div>
            {/* Block 2 — store coins (shared store-level pool) with the same coin pill as the tasks */}
            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 6, padding: "10px 12px", background: "var(--yellow-100)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".02em", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>เหรียญร้านวันนี้</div>
              <span style={{ alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 4, background: "var(--cjx-yellow)", color: "var(--cjx-brown)", fontFamily: "var(--font-numeric)", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: "var(--radius-pill)" }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 14 }}>monetization_on</span>+15
              </span>
            </div>
          </div>

          {/* Summary grid — tap a tile to filter the task list by status */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            <SummaryStat value="09" label="งานทั้งหมด" status="total" onClick={() => setFilter(null)} style={{ cursor: "pointer", outline: filter === null ? "2.5px solid var(--cjx-brown)" : "2.5px solid transparent", outlineOffset: 1 }} />
            <SummaryStat value="02" label="ต้องทำตอนนี้" status="current" onClick={() => toggleFilter("current")} style={{ cursor: "pointer", outline: filter === "current" ? "2.5px solid var(--cjx-brown)" : "2.5px solid transparent", outlineOffset: 1 }} />
            <SummaryStat value="01" label="ต้องแก้ไข" status="fix" onClick={() => toggleFilter("fix")} style={{ cursor: "pointer", outline: filter === "fix" ? "2.5px solid var(--cjx-brown)" : "2.5px solid transparent", outlineOffset: 1 }} />
            <SummaryStat value="02" label="ผ่านแล้ว" status="passed" onClick={() => toggleFilter("passed")} style={{ cursor: "pointer", outline: filter === "passed" ? "2.5px solid var(--cjx-brown)" : "2.5px solid transparent", outlineOffset: 1 }} />
          </div>

          {/* Handover — shown here until acknowledged, then moves to the bottom */}
          {!ackHandover && handoverBlock}
          {/* Filtered view — active when a summary tile is tapped */}
          {filter && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "22px 0 14px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{STAT[filter].label}</h2>
                <span style={{ fontFamily: "var(--font-numeric)", fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 9px", borderRadius: "var(--radius-pill)" }}>{filtered.length}</span>
                <button type="button" onClick={() => setFilter(null)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, padding: "5px 11px 5px 8px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-pill)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-secondary)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>ดูทั้งหมด
                </button>
              </div>
              {filtered.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: filter === "passed" ? 0.85 : 1 }}>
                  {filtered.map(renderBlock)}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-tertiary)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, opacity: 0.5 }}>inbox</span>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>ไม่มีงานในสถานะนี้</div>
                </div>
              )}
            </div>
          )}

          {/* Default grouped view */}
          {!filter && (<React.Fragment>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "22px 0 14px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>งานที่ต้องทำตอนนี้ / แก้ไข</h2>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 9px", borderRadius: "var(--radius-pill)" }}>{priority.length}</span>
            <img src={window.RES('mumiMega','./assets/mascot/mumi-megaphone.png')} alt="" style={{ height: 52, width: "auto", marginLeft: "auto", marginRight: 4, transform: "scaleX(-1)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {priority.map(renderBlock)}
          </div>

          {/* Upcoming (collapsible) */}
          <button
            onClick={() => setShowUpcoming((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginTop: 20, padding: "12px 14px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--text-tertiary)" }}>schedule</span>
            งานที่กำลังจะถึง
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: 12, color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 9px", borderRadius: "var(--radius-pill)" }}>{upcoming.length}</span>
            <span className="material-symbols-outlined" style={{ marginLeft: "auto", fontSize: 22, transform: showUpcoming ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
          </button>
          {showUpcoming && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
              {upcoming.map(renderBlock)}
            </div>
          )}

          {/* Completed (collapsible) */}
          <button
            onClick={() => setShowDone((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginTop: 20, padding: "12px 14px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)" }}
          >
            <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: "var(--cjx-green)" }}>check_circle</span>
            งานที่เสร็จแล้ว
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: 12, color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 9px", borderRadius: "var(--radius-pill)" }}>{done.length}</span>
            <span className="material-symbols-outlined" style={{ marginLeft: "auto", fontSize: 22, transform: showDone ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
          </button>
          {showDone && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16, opacity: 0.85 }}>
              {done.map(renderBlock)}
            </div>
          )}
          </React.Fragment>)}

          {/* Handover relocates here once acknowledged */}
          {ackHandover && handoverBlock}

          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="lg" fullWidth icon="swap_horiz" onClick={onHandover}>ส่งงานปิดกะ</Button>
          </div>
        </div>
      </div>
    );
  }

  window.TaskTimelineScreen = TaskTimelineScreen;
})();

