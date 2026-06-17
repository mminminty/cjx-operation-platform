

    const { Input, Button, Select } = window.CJExpressCJxDesignSystem_d61aba;
    const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;

    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "heroTone": "festive",
      "mascot": "songkran",
      "corners": "sharp"
    }/*EDITMODE-END*/;

    const THEMES = {
      festive: { heroBg: "var(--cjx-yellow)", statusFg: "var(--cjx-brown)" },
      cream:   { heroBg: "var(--yellow-100)", statusFg: "var(--cjx-brown)" },
      sky:     { heroBg: "var(--blue-50)",    statusFg: "var(--cjx-blue)" },
    };
    const MASCOTS = {
      songkran: "./assets/mascot/mumi-songkran.png",
      hero: "./assets/mascot/mumi-hero.png",
      heart: "./assets/mascot/mumi-heart.png",
    };

    // Employee directory for this store (would come from the backend)
    const STORE = "สาขาศรีด่าน 22";
    const NAMES = [
      "นางสาววรณี สุขสว่าง",
      "นายสมชาย ใจดี",
      "นางสาวสมหญิง รักงาน",
      "นายวิชัย พากเพียร",
      "นางสาวอรุณ แสงทอง",
    ];
    const NAME_OPTS = [...NAMES.map((n) => ({ value: n, label: n })), { value: "__other", label: "— ไม่พบชื่อของฉันในรายการ —" }];
    const POS_OPTS = [
      { value: "mgr", label: "ผู้จัดการร้าน" },
      { value: "am", label: "ผู้ช่วยเช้า" },
      { value: "pm", label: "ผู้ช่วยบ่าย" },
    ];

    function LoginScreen() {
      const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
      const [empId, setEmpId] = React.useState("");
      const [step, setStep] = React.useState("login"); // login | profile
      const [empName, setEmpName] = React.useState("");
      const [empNo, setEmpNo] = React.useState("");
      const [position, setPosition] = React.useState("");

      const submit = () => { setStep("profile"); const s = document.querySelector(".screen"); if (s) s.scrollTop = 0; };
      const nameOk = empName && (empName !== "__other" || empNo.trim().length >= 4);
      const profileValid = nameOk && position;
      const enter = () => { if (profileValid) { window.__cjxGo("app"); } };

      const theme = THEMES[t.heroTone] || THEMES.festive;
      const sharp = t.corners === "sharp";
      const heroCorner = sharp ? 12 : 36;
      const phoneVars = sharp ? { "--radius-lg": "6px", "--radius-md": "5px", "--radius-sm": "3px" } : {};

      return (
        <div className="phone" style={phoneVars}>
          <div className="statusbar" style={{ background: theme.heroBg, color: theme.statusFg }}>
            <span>9:41</span>
            <span className="dots">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>signal_cellular_alt</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>wifi</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>battery_full</span>
            </span>
          </div>

          <div className="screen">
            {step === "login" && (<React.Fragment>
            {/* Brand hero */}
            <div style={{
              position: "relative", background: theme.heroBg,
              borderBottomLeftRadius: heroCorner, borderBottomRightRadius: heroCorner,
              padding: "20px 24px 0", textAlign: "center", overflow: "hidden",
            }}>
              {/* soft decorative dots */}
              <div style={{ position: "absolute", top: 70, left: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.14)" }} />

              <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.18)" }} />
                  <img src="./assets/logo/cjx-logo-transparent.png" alt="CJ Express" style={{ position: "relative", height: 92 }} />
                </div>
              </div>

              <img src={MASCOTS[t.mascot] || MASCOTS.songkran} alt="" style={{ position: "relative", height: 224, width: "auto", marginTop: 2, marginBottom: -6 }} />
            </div>

            {/* Form */}
            <div style={{ padding: "26px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>เข้าสู่ระบบ</h1>
                <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>ระบบปฏิบัติการหน้าร้าน CJx</p>
              </div>

              <Input label="อีเมลร้าน" icon="mail" placeholder="เช่น CJX0000@cjmart.co.th"
                value={empId} onChange={(e) => setEmpId(e.target.value)} type="email" />

              <Button variant="primary" size="lg" fullWidth icon="login" onClick={submit} style={{ marginTop: 4 }}>เข้าสู่ระบบ</Button>

              <div style={{ textAlign: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>ต้องการความช่วยเหลือ? <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--text-secondary)", fontWeight: 700, textDecoration: "none" }}>ติดต่อ admin</a></div>
                <div style={{ fontSize: 11, color: "var(--text-disabled)", marginTop: 12 }}>CJ Express · เวอร์ชัน 1.0.0</div>
              </div>
            </div>
            </React.Fragment>)}

            {step === "profile" && (
            <div>
              {/* Brand hero — matches login scale & logo placement */}
              <div style={{ position: "relative", background: theme.heroBg, borderBottomLeftRadius: heroCorner, borderBottomRightRadius: heroCorner, padding: "20px 24px 28px", textAlign: "center", overflow: "hidden" }}>
                {/* soft decorative dot — same as login */}
                <div style={{ position: "absolute", top: 70, left: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.14)" }} />
                {/* logo top-right in glow circle — same as login */}
                <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.18)" }} />
                    <img src="./assets/logo/cjx-logo-transparent.png" alt="CJ Express" style={{ position: "relative", height: 72 }} />
                  </div>
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 4 }}>
                  <img src="./assets/mascot/mumi-hero.png" alt="" style={{ height: 96, width: "auto" }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--cjx-brown)", lineHeight: 1.15 }}>ยินดีต้อนรับ</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--cjx-brown)", opacity: .8, marginTop: 2 }}>{STORE}</div>
                  </div>
                </div>
              </div>

              {/* Profile form */}
              <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>เลือกโปรไฟล์ของคุณ</h1>
                  <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>ระบุชื่อและตำแหน่งก่อนเริ่มกะ</p>
                </div>

                <Select label="ชื่อพนักงาน" placeholder="เลือกชื่อของคุณ" options={NAME_OPTS}
                  value={empName} onChange={(e) => setEmpName(e.target.value)} />

                {empName === "__other" && (
                  <Input label="รหัสพนักงาน" icon="badge" placeholder="เช่น 8001234" inputMode="numeric"
                    value={empNo} onChange={(e) => setEmpNo(e.target.value.replace(/[^0-9]/g, ""))}
                    helper="กรอกรหัสพนักงานหากไม่พบชื่อในรายการ" />
                )}

                <Select label="หน้าที่วันนี้" placeholder="เลือกหน้าที่" options={POS_OPTS}
                  value={position} onChange={(e) => setPosition(e.target.value)} />

                <Button variant="primary" size="lg" fullWidth icon="login" disabled={!profileValid} onClick={enter} style={{ marginTop: 4 }}>เข้าสู่ระบบ</Button>

                <button type="button" onClick={() => setStep("login")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "2px auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>ย้อนกลับ
                </button>
              </div>
            </div>
            )}
          </div>

          <TweaksPanel title="Tweaks">
            <TweakSection label="รูปลักษณ์" />
            <TweakRadio label="โทนหน้าจอ" value={t.heroTone}
              options={[{ value: "festive", label: "ฉลอง" }, { value: "cream", label: "ละมุน" }, { value: "sky", label: "สดชื่น" }]}
              onChange={(v) => setTweak("heroTone", v)} />
            <TweakRadio label="มุมการ์ด" value={t.corners}
              options={[{ value: "rounded", label: "มน" }, { value: "sharp", label: "เหลี่ยม" }]}
              onChange={(v) => setTweak("corners", v)} />
            <TweakSection label="บุคลิก" />
            <TweakRadio label="น้องมุมิ" value={t.mascot}
              options={[{ value: "songkran", label: "สงกรานต์" }, { value: "hero", label: "ยกนิ้ว" }, { value: "heart", label: "หัวใจ" }]}
              onChange={(v) => setTweak("mascot", v)} />
          </TweaksPanel>
        </div>
      );
    }
    window.LoginScreen = LoginScreen;
  
  