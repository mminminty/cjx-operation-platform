
    const { BottomNav, IconButton, Badge } = window.CJExpressCJxDesignSystem_d61aba;
    const { TaskTimelineScreen, OverviewScreen, SubmitScreen, HandoverScreen, SpinWheelScreen, RewardsScreen, MonthlySummaryScreen, NotificationsScreen } = window;
    const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;

    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "corners": "rounded",
      "depth": "flat",
      "mascots": true
    }/*EDITMODE-END*/;

    // Map expressive tweaks → CSS-variable overrides on the phone shell
    function tweakVars(t) {
      const v = {};
      if (t.corners === "sharp") {
        v["--radius-lg"] = "5px"; v["--radius-md"] = "4px"; v["--radius-sm"] = "2px";
      }
      if (t.depth === "flat") {
        v["--shadow-sm"] = "none"; v["--shadow-md"] = "none"; v["--shadow-lg"] = "none";
        v["--shadow-xl"] = "none"; v["--shadow-yellow"] = "none";
        v["--border-subtle"] = "var(--border-default)";
      }
      return v;
    }

    function App() {
      const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
      const [tab, setTab] = React.useState("tasks");
      const [overlay, setOverlay] = React.useState(null); // {type, title}
      const scroller = React.useRef(null);

      const go = (id) => { setOverlay(null); setTab(id); if (scroller.current) scroller.current.scrollTop = 0; };

      return (
        <div className="phone" data-mascots={t.mascots ? "on" : "off"} style={tweakVars(t)}>
          <div className="statusbar">
            <span>9:41</span>
            <span className="dots">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>signal_cellular_alt</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>wifi</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>battery_full</span>
            </span>
          </div>

          <div className="screen" ref={scroller}>
            {tab === "tasks" && <TaskTimelineScreen
              onOpenTask={(t, c) => setOverlay({ type: "submit", title: t, coins: c })}
              onHandover={() => setOverlay({ type: "handover" })}
              onMenu={() => setOverlay({ type: "menu" })}
              onAvatar={() => setOverlay({ type: "account" })}
            />}
            {tab === "overview" && <OverviewScreen onMonthly={() => setOverlay({ type: "monthly" })} onMenu={() => setOverlay({ type: "menu" })} onAvatar={() => setOverlay({ type: "account" })} />}
            {tab === "rewards" && <RewardsScreen onMenu={() => setOverlay({ type: "menu" })} onAvatar={() => setOverlay({ type: "account" })} />}
          </div>

          {!overlay && (
            <button onClick={() => setOverlay({ type: "notifications" })} aria-label="การแจ้งเตือน" style={{
              position: "absolute", top: 44, right: 60, width: 40, height: 40, zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>notifications</span>
              <span style={{ position: "absolute", top: 4, right: 4 }}><Badge dot tone="danger" /></span>
            </button>
          )}

          <div className="navwrap">
            <BottomNav active={tab} onChange={go} items={[
              { id: "overview", label: "ภาพรวม", icon: "dashboard" },
              { id: "tasks", label: "งานวันนี้", icon: "assignment", badge: 3 },
              { id: "rewards", label: "เหรียญ", icon: "monetization_on" },
            ]} />
          </div>

          {overlay && overlay.type === "submit" && (
            <div className="overlay"><SubmitScreen taskTitle={overlay.title} coins={overlay.coins} onBack={() => setOverlay(null)} /></div>
          )}
          {overlay && overlay.type === "handover" && (
            <div className="overlay"><HandoverScreen onMenu={() => setOverlay(null)} onSpin={() => setOverlay({ type: "spin" })} /></div>
          )}
          {overlay && overlay.type === "spin" && (
            <div className="overlay"><SpinWheelScreen eligible={true} spinsLeft={1} onClose={() => setOverlay(null)} /></div>
          )}
          {overlay && overlay.type === "monthly" && (
            <div className="overlay"><MonthlySummaryScreen onMenu={() => setOverlay(null)} /></div>
          )}
          {overlay && overlay.type === "menu" && (
            <div onClick={() => setOverlay(null)} style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(11,28,48,.45)", display: "flex", animation: "fadeIn .2s var(--ease-out)" }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 286, maxWidth: "84%", height: "100%", background: "var(--surface-card)", display: "flex", flexDirection: "column", animation: "slideInLeft .26s var(--ease-out)", overflowY: "auto" }}>
                {/* Drawer header */}
                <div style={{ background: "var(--cjx-yellow)", padding: "22px 18px 18px" }}>
                  <img src="./assets/logo/cjx-logo-transparent.png" alt="CJ Express" style={{ height: 30, display: "block", marginBottom: 14 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <img src="https://i.pravatar.cc/100?img=32" alt="" style={{ width: 42, height: 42, borderRadius: "var(--radius-full)", border: "2px solid rgba(255,255,255,.6)" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--cjx-brown)" }}>นางสาววรณี สุขสว่าง</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cjx-brown)", opacity: .75 }}>CJX00072 · ศรีด่าน 22</div>
                    </div>
                  </div>
                </div>
                {/* Placeholder — future menu links go here */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "32px 24px", color: "var(--text-tertiary)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--border-strong)" }}>menu_open</span>
                  <div style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>เมนูเพิ่มเติมจะเพิ่มที่นี่</div>
                </div>
              </div>
            </div>
          )}
          {overlay && overlay.type === "notifications" && (
            <div className="overlay"><NotificationsScreen onBack={() => setOverlay(null)} /></div>
          )}
          {overlay && overlay.type === "account" && (
            <div onClick={() => setOverlay(null)} style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(11,28,48,.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", animation: "fadeIn .2s var(--ease-out)" }}>
              <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-card)", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "20px 20px calc(20px + env(safe-area-inset-bottom))", animation: "slideUp .26s var(--ease-out)" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)", margin: "0 auto 18px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
                  <img src="https://i.pravatar.cc/100?img=32" alt="" style={{ width: 52, height: 52, borderRadius: "var(--radius-full)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>นางสาววรณี สุขสว่าง</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>ผู้จัดการร้าน · CJX00072 ศรีด่าน 22</div>
                  </div>
                </div>
                <button type="button" onClick={() => setOverlay(null)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--text-secondary)" }}>person</span>ข้อมูลบัญชี
                </button>
                <button type="button" onClick={() => setOverlay(null)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--text-secondary)" }}>settings</span>ตั้งค่า
                </button>
                <button type="button" onClick={() => { window.__cjxGo && window.__cjxGo("login"); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 4px", marginTop: 4, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--cjx-red)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--cjx-red)" }}>logout</span>ออกจากระบบ
                </button>
              </div>
            </div>
          )}

          <TweaksPanel title="Tweaks">
            <TweakSection label="รูปลักษณ์" />
            <TweakRadio label="มุมการ์ด" value={t.corners}
              options={[{ value: "rounded", label: "มน" }, { value: "sharp", label: "เหลี่ยม" }]}
              onChange={(v) => setTweak("corners", v)} />
            <TweakRadio label="น้ำหนักเงา" value={t.depth}
              options={[{ value: "elevated", label: "ลอยเด่น" }, { value: "flat", label: "แบนเรียบ" }]}
              onChange={(v) => setTweak("depth", v)} />
            <TweakSection label="บุคลิก" />
            <TweakToggle label="น้องมุมิ" value={t.mascots}
              onChange={(v) => setTweak("mascots", v)} />
          </TweaksPanel>
        </div>
      );
    }
    window.AppRoot = App;
  