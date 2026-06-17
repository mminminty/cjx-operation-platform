
/* CJx Operation Platform — Task Timeline (งานวันนี้) v2
   Tasks from ใบปิดกะ Phase 1, grouped by Time Block with collapse/expand.
   Role-based visibility: mgr=all, am=morning, pm=afternoon.
   Pass marks task done; fail shows red deadline flag. */
(function () {
  const NS = window.CJExpressCJxDesignSystem_d61aba;
  const { TopAppBar, SummaryStat, TaskCard, StatusChip, Button, Card } = NS;

  const ALL_TASKS = [
    {id:'m1', shift:'am',block:'b1', deadline:'5:45',  title:'เปิดร้านและเช็คกำลังพล',              desc:'ถ่ายรูปเซลฟี่กับทีม นับจำนวนคนในกะ',                  ev:'photo',   coins:10},
    {id:'m2', shift:'am',block:'b1', deadline:'6:00',  title:'เปิดกะให้ทันก่อน 6:00',               desc:'ถ่ายรูปใบเปิดกะที่ปริ้นจาก POS',                       ev:'photo',   coins:10},
    {id:'m3', shift:'am',block:'b1', deadline:'6:00',  title:'ทำความสะอาดและถ่ายรูป',               desc:'หน้าร้าน + ในร้าน + ห้องสต็อก + บ่อดัก',               ev:'photo',   coins:5},
    {id:'m4', shift:'am',block:'b2', deadline:'8:00',  title:'หาสินค้าใกล้หมดอายุ – RTC',           desc:'รูปสินค้า RTC หรือยืนยันว่าไม่พบ',                      ev:'photo',   coins:15},
    {id:'m5', shift:'am',block:'b2', deadline:'8:00',  title:'เติมหัวชั้น ตั้งกอง ให้เต็ม',          desc:'รูปหัวชั้น ตั้งกอง ไม่มีรูโล่ง',                        ev:'photo',   coins:20},
    {id:'m6', shift:'am',block:'b2', deadline:'8:00',  title:'ติดสื่อใหม่',                          desc:'ถ่ายรูปสื่อกระจกหน้าร้าน',                              ev:'photo',   coins:5},
    {id:'m7', shift:'am',block:'b2', deadline:'8:00',  title:'ตรวจสอบประกาศด่วน',                   desc:'รับทราบและดำเนินการตามประกาศจากสำนักงาน',               ev:'confirm', coins:5},
    {id:'m8', shift:'am',block:'b2', deadline:'8:00',  title:'ตรวจสอบอุณหภูมิตู้แช่',               desc:'ถ่ายรูปอุณหภูมิตามตู้แช่ที่กำหนด',                       ev:'photo',   coins:10},
    {id:'m9', shift:'am',block:'b3', deadline:'10:00', title:'ติดป้ายสินค้าใหม่',                   desc:'ใส่ป้ายโปรใหม่ ถ่ายรูปยืนยัน เฉพาะโปร 1 วัน',         ev:'photo',   coins:10},
    {id:'m10',shift:'am',block:'b3', deadline:'10:00', title:'ปิดรูโล่ง',                            desc:'เติมสินค้ารูโล่ง ถ่ายรูป dashboard OOB',                ev:'photo',   coins:15},
    {id:'m11',shift:'am',block:'b4', deadline:'12:00', title:'เคลียร์ Tote',                         desc:'รูปห้องสต็อก ไม่มี tote ค้าง',                          ev:'photo',   coins:10},
    {id:'m12',shift:'am',block:'b4', deadline:'12:00', title:'เติมสินค้าตามรอบ',                     desc:'ปิดงานในเมนูเติมตามรอบ ถ่ายรูปเบย์',                   ev:'confirm', coins:10},
    {id:'m13',shift:'am',block:'b5', deadline:'14:00', title:'ลงล็อก POG / FEFO / สินค้าหลุดแกรม',  desc:'รูปเบย์ + รูปกองสินค้าหลุดแกรม',                        ev:'photo',   coins:10},
    {id:'m14',shift:'am',block:'b6', deadline:'14:00', title:'ตรวจสอบยอดขาย',                       desc:'ถ่ายรูป dashboard MVP',                                  ev:'photo',   coins:10},
    {id:'m15',shift:'am',block:'b6', deadline:'14:30', title:'ปิดกะ',                               desc:'ถ่ายรูปใบปิดกะที่ปริ้นจาก POS ส่งเงิน',                ev:'photo',   coins:15},
    {id:'m16',shift:'am',block:'b6', deadline:null,    title:'สรุปใบปิดกะเช้า',                     desc:'ระบบส่งรายงานผลกลับอัตโนมัติ',                          ev:'system',  coins:0},
    {id:'m17',shift:'am',block:'b7', deadline:'14:45', title:'เลิกงานตรงเวลา',                      desc:'ถ่ายรูปเซลฟี่กลับบ้าน',                                 ev:'photo',   coins:5},
    {id:'a1', shift:'pm',block:'b8', deadline:'13:45',       title:'เปิดร้านและเช็คกำลังพล',         desc:'ถ่ายรูปเซลฟี่กับทีมกะบ่าย นับจำนวนคน',                ev:'photo',   coins:10},
    {id:'a2', shift:'pm',block:'b8', deadline:'14:00',       title:'เปิดกะให้ทันก่อน 14:30',          desc:'ถ่ายรูปใบเปิดกะที่ปริ้นจาก POS',                       ev:'photo',   coins:10},
    {id:'a3', shift:'pm',block:'b9', deadline:'16:00',       title:'เติมสินค้าตามรอบ',                desc:'ปิดงานเมนูเติมตามรอบ สินค้า 5 หมวดขายดี',              ev:'confirm', coins:10},
    {id:'a4', shift:'pm',block:'b9', deadline:'16:00',       title:'เติมหัวชั้น ตั้งกอง ให้เต็ม',     desc:'รูปหัวชั้น ตั้งกอง ไม่มีรูโล่ง',                        ev:'photo',   coins:20},
    {id:'a5', shift:'pm',block:'b9', deadline:null,          title:'แจ้งเตือน: จัดกำลังคนช่วงขายดี',  desc:'ระบบส่งแจ้งเตือนให้ผู้ช่วยอัตโนมัติ',                  ev:'system',  coins:0},
    {id:'a6', shift:'pm',block:'b10',deadline:'16:00',       title:'จัดกำลังคนตามมาตรฐานบริการ',      desc:'เปิด POS ตามจำนวนมาตรฐาน',                              ev:'confirm', coins:5},
    {id:'a7', shift:'pm',block:'b11',deadline:'18:00',       title:'ติดตามยอดขาย รอบ 18:00',           desc:'ถ่ายรูป dashboard MVP เพื่อแก้เกมส์',                   ev:'photo',   coins:10},
    {id:'a8', shift:'pm',block:'b12',deadline:'21:00',       title:'หาสินค้าใกล้หมดอายุ – RTC',       desc:'รูปสินค้า RTC หรือยืนยันว่าไม่พบ',                      ev:'photo',   coins:15},
    {id:'a9', shift:'pm',block:'b12',deadline:'22:00',       title:'เก็บป้ายโปรเก่า',                  desc:'ถ่ายรูปกองป้ายที่เก็บแล้ว ระบุจำนวน',                   ev:'photo',   coins:10},
    {id:'a10',shift:'pm',block:'b12',deadline:'22:00',       title:'เติมหัวชั้น ตั้งกอง ให้เต็ม',     desc:'รูปหัวชั้น ตั้งกอง ตู้แช่เบียร์คาราบาว',                ev:'photo',   coins:20},
    {id:'a11',shift:'pm',block:'b12',deadline:'22:00',       title:'ตรวจสอบยอดขาย',                   desc:'ถ่ายรูป dashboard MVP',                                  ev:'photo',   coins:10},
    {id:'a12',shift:'pm',block:'b12',deadline:'22:00',       title:'ปิดกะ',                           desc:'ถ่ายรูปใบปิดกะที่ปริ้นจาก POS ส่งเงิน',                ev:'photo',   coins:15},
    {id:'a13',shift:'pm',block:'b12',deadline:'22:30',       title:'เลิกงานตรงเวลา',                  desc:'ถ่ายรูปเซลฟี่กลับบ้าน',                                 ev:'photo',   coins:5},
    {id:'a14',shift:'pm',block:'b13',deadline:'22:30/23:30', title:'สรุปใบปิดกะบ่าย',                 desc:'ระบบส่งรายงานผลกลับอัตโนมัติ',                          ev:'system',  coins:0},
  ];

  const BLOCKS_DEF = [
    {id:'b1', label:'5:45 – 6:00'},    {id:'b2', label:'6:00 – 8:00'},
    {id:'b3', label:'8:00 – 10:00'},   {id:'b4', label:'10:00 – 12:00'},
    {id:'b5', label:'12:00 – 14:00'},  {id:'b6', label:'14:00 – 14:45'},
    {id:'b7', label:'14:45'},          {id:'b8', label:'13:30 – 13:45'},
    {id:'b9', label:'13:30 – 16:00'},  {id:'b10',label:'16:00 – 18:00'},
    {id:'b11',label:'18:00 – 20:00'},  {id:'b12',label:'20:00 – ปิดร้าน'},
    {id:'b13',label:'ปิดร้าน'},
  ];

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

  function ResultRow({ state, label, detail, warn, last }) {
    const cfg = { pass:{icon:"check_circle",color:"var(--cjx-green)"}, fail:{icon:"cancel",color:"var(--cjx-red)"}, pending:{icon:"radio_button_unchecked",color:"var(--text-tertiary)"} }[state] || {icon:"cancel",color:"var(--cjx-red)"};
    return (
      <div style={{ display:"flex",gap:10,alignItems:"flex-start",padding:"9px 0",borderBottom:last?"none":"1px solid var(--border-subtle)" }}>
        <span className="material-symbols-outlined fill" style={{ fontSize:20,color:cfg.color,flexShrink:0,marginTop:1 }}>{cfg.icon}</span>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:14,fontWeight:600,lineHeight:1.35 }}>{label}</div>
          {detail && <div style={{ fontSize:12,color:warn?"var(--cjx-red)":"var(--text-tertiary)",marginTop:2,lineHeight:1.35 }}>{detail}</div>}
        </div>
      </div>
    );
  }
  function ResultGroup({ title, rows }) {
    return (
      <div style={{ marginTop:14 }}>
        <div style={{ fontSize:12,fontWeight:700,letterSpacing:".04em",color:"var(--text-tertiary)",marginBottom:8 }}>{title}</div>
        <Card>{rows.map((r,i) => <ResultRow key={i} {...r} last={i===rows.length-1} />)}</Card>
      </div>
    );
  }

  function TaskTimelineScreen({ onOpenTask, onMenu, onHandover, onAvatar, role }) {
    const [taskStatuses,   setTaskStatuses]   = React.useState({});
    const [expandedBlocks, setExpandedBlocks] = React.useState({});
    const [showDone,       setShowDone]       = React.useState(false);
    const [showHandover,   setShowHandover]   = React.useState(true);
    const [ackHandover,    setAckHandover]    = React.useState(false);
    const [showPrevSummary,setShowPrevSummary]= React.useState(false);
    const [annOpen,        setAnnOpen]        = React.useState(true);

    const effectiveRole = role || "mgr";
    const isVisible = (t) => effectiveRole === "mgr" || t.shift === effectiveRole;
    const getStatus = (id) => taskStatuses[id] || "pending";

    const openTask = (task) => {
      if (task.ev === "system") return;
      onOpenTask(task.id, task.title, task.coins, (verdict) => {
        setTaskStatuses((s) => ({ ...s, [task.id]: verdict }));
      });
    };

    const toggleBlock = (id) => {
      setExpandedBlocks((s) => ({ ...s, [id]: s[id] !== false ? false : true }));
    };

    const visibleTasks = ALL_TASKS.filter(isVisible);
    const passedTasks  = visibleTasks.filter((t) => getStatus(t.id) === "pass");
    const failCount    = visibleTasks.filter((t) => getStatus(t.id) === "fail").length;
    const passCount    = passedTasks.length;
    const total        = visibleTasks.length;
    const pendingCount = total - passCount - failCount;

    const activeBlocks = [];
    for (const b of BLOCKS_DEF) {
      const bTasks = ALL_TASKS.filter((t) => t.block === b.id && isVisible(t) && getStatus(t.id) !== "pass");
      if (!bTasks.length) continue;
      const bFail = bTasks.filter((t) => getStatus(t.id) === "fail").length;
      activeBlocks.push({ ...b, tasks: bTasks, failCount: bFail, expanded: expandedBlocks[b.id] !== false });
    }

    const ROLE_LABEL = { mgr:"ผู้จัดการร้าน", am:"ผู้ช่วยเช้า", pm:"ผู้ช่วยบ่าย" };
    const roleColors = { mgr:{bg:"var(--blue-50)",fg:"var(--cjx-blue)"}, am:{bg:"var(--green-50)",fg:"var(--cjx-green)"}, pm:{bg:"var(--red-50)",fg:"var(--cjx-red)"} };
    const rc = roleColors[effectiveRole] || roleColors.mgr;

    const handoverBlock = (
      <div style={{ background:"var(--blue-50)",border:"1px solid rgba(25,71,147,.22)",borderRadius:"var(--radius-md)",padding:"12px 14px",marginTop:20,overflow:"hidden" }}>
        <button type="button" onClick={() => setShowHandover((v) => !v)} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:0,background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--cjx-blue)",marginBottom:showHandover?12:0 }}>
          <span className="material-symbols-outlined fill" style={{ fontSize:20,color:"var(--cjx-blue)",flexShrink:0 }}>swap_horiz</span>
          งานส่งต่อจากกะที่แล้ว
          <span className="material-symbols-outlined" style={{ marginLeft:"auto",fontSize:22,color:"var(--cjx-blue)",transform:showHandover?"rotate(180deg)":"none",transition:"transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
        </button>
        {showHandover && (
          <div>
            <button onClick={() => setShowPrevSummary((v) => !v)} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",marginTop:12,padding:"11px 14px",background:"var(--surface-card)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-md)",cursor:"pointer",fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text-secondary)" }}>
              <span className="material-symbols-outlined" style={{ fontSize:20,color:"var(--text-tertiary)" }}>summarize</span>
              สรุปผลกะที่แล้ว
              <span className="material-symbols-outlined" style={{ marginLeft:"auto",fontSize:22,transform:showPrevSummary?"rotate(180deg)":"none",transition:"transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
            </button>
            {showPrevSummary && (
              <div>
                <ResultGroup title="สรุปผลการทำงาน" rows={PREV_WORK} />
                <ResultGroup title="สรุปยอดขายประจำกะ" rows={PREV_SALES} />
                <ResultGroup title="งานมาตรฐานที่ยังทำไม่สำเร็จ" rows={PREV_STANDARD} />
              </div>
            )}
            <div style={{ marginTop:12,display:"flex",gap:10,padding:"12px 14px",background:"var(--surface-card)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-md)" }}>
              <span className="material-symbols-outlined" style={{ fontSize:20,color:"var(--text-tertiary)",flexShrink:0,marginTop:1 }}>sticky_note_2</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:".02em",color:"var(--text-tertiary)",marginBottom:3 }}>บันทึกจากกะที่แล้ว</div>
                <p style={{ margin:0,fontSize:13,lineHeight:1.5,color:"var(--text-primary)",textWrap:"pretty" }}>อุณหภูมิตู้แช่สูงกว่ามาตรฐาน เปิดเคสแล้ว CS-00975</p>
              </div>
            </div>
            {ackHandover ? (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:14,paddingTop:12,borderTop:"1px solid var(--border-subtle)",color:"var(--cjx-green)",fontFamily:"var(--font-display)",fontWeight:700,fontSize:13 }}>
                <span className="material-symbols-outlined fill" style={{ fontSize:18 }}>check_circle</span>รับทราบงานส่งต่อแล้ว
              </div>
            ) : (
              <button type="button" onClick={() => { setAckHandover(true); setShowHandover(false); }} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginTop:14,paddingTop:12,background:"transparent",border:"none",borderTop:"1px solid var(--border-subtle)",cursor:"pointer",fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:"var(--text-secondary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>check</span>รับทราบ
              </button>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div style={{ paddingBottom:24 }}>
        <TopAppBar align="left" onMenu={onMenu} title="จันทร์ 28 พ.ค. 2569" right={<button type="button" onClick={onAvatar} aria-label="บัญชีผู้ใช้" style={{ width:36,height:36,borderRadius:"var(--radius-full)",overflow:"hidden",border:"1px solid var(--border-default)",padding:0,cursor:"pointer",background:"var(--ink-200)" }}><img src={window.RES('avatar32','https://i.pravatar.cc/100?img=32')} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} /></button>} />
        <div style={{ padding:"14px 16px" }}>

          {annOpen && (
            <div style={{ background:"var(--red-50)",border:"1px solid rgba(238,46,60,.22)",borderRadius:"var(--radius-lg)",marginBottom:16,overflow:"hidden" }}>
              <div style={{ display:"flex",gap:11,alignItems:"flex-start",padding:"13px 15px 11px" }}>
                <span className="material-symbols-outlined fill" style={{ fontSize:22,color:"var(--cjx-red)",flexShrink:0,marginTop:-1 }}>campaign</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:11,fontWeight:800,letterSpacing:".02em",color:"var(--cjx-red)",marginBottom:2 }}>ประกาศจากสำนักงานใหญ่ · ด่วน</div>
                  <p style={{ margin:0,fontSize:13,fontWeight:600,lineHeight:1.45,color:"var(--text-primary)",textWrap:"pretty" }}>งดจำหน่ายสินค้าล็อต ABC-204 ทุกสาขา เก็บออกจากเชลฟ์ภายใน 12:00 วันนี้</p>
                </div>
              </div>
              <button type="button" onClick={() => setAnnOpen(false)} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"11px 15px",background:"transparent",border:"none",borderTop:"1px solid rgba(238,46,60,.22)",cursor:"pointer",fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:"var(--cjx-red)" }}>
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>check</span>รับทราบ
              </button>
            </div>
          )}

          <div style={{ display:"flex",gap:10,marginBottom:16 }}>
            <div style={{ flex:"1 1 auto",minWidth:0,display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:"var(--surface-card)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)" }}>
              <img src={window.RES('avatar32','https://i.pravatar.cc/100?img=32')} alt="" style={{ width:38,height:38,borderRadius:"var(--radius-full)",flexShrink:0 }} />
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:".02em",color:"var(--text-tertiary)" }}>ผู้รับผิดชอบกะ</div>
                <div style={{ fontWeight:700,fontSize:14,marginTop:1,whiteSpace:"nowrap" }}>คุณ สมหญิง ใจดี</div>
              </div>
            </div>
            <div style={{ flex:"0 0 auto",display:"flex",flexDirection:"column",justifyContent:"flex-start",gap:6,padding:"10px 12px",background:"var(--yellow-100)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-lg)" }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:".02em",color:"var(--text-tertiary)",whiteSpace:"nowrap" }}>เหรียญร้านวันนี้</div>
              <span style={{ alignSelf:"center",display:"inline-flex",alignItems:"center",gap:4,background:"var(--cjx-yellow)",color:"var(--cjx-brown)",fontFamily:"var(--font-numeric)",fontSize:11,fontWeight:800,padding:"3px 8px",borderRadius:"var(--radius-pill)" }}>
                <span className="material-symbols-outlined fill" style={{ fontSize:14 }}>monetization_on</span>+15
              </span>
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
            <SummaryStat value={String(total).padStart(2,'0')} label="งานทั้งหมด" status="total" />
            <SummaryStat value={String(pendingCount).padStart(2,'0')} label="รอดำเนินการ" status="current" />
            <SummaryStat value={String(failCount).padStart(2,'0')} label="ต้องแก้ไข" status="fix" />
            <SummaryStat value={String(passCount).padStart(2,'0')} label="ผ่านแล้ว" status="passed" />
          </div>

          {!ackHandover && handoverBlock}

          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",margin:"22px 0 12px" }}>
            <h2 style={{ fontSize:15,fontWeight:700,margin:0 }}>งานที่ต้องทำวันนี้</h2>
            <div style={{ fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:"var(--radius-pill)",background:rc.bg,color:rc.fg }}>{ROLE_LABEL[effectiveRole]}</div>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {activeBlocks.map((block) => (
              <div key={block.id}>
                <button type="button" onClick={() => toggleBlock(block.id)} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 14px",background:block.failCount>0?"#370c10":"var(--navy-800)",borderRadius:block.expanded?"var(--radius-lg) var(--radius-lg) 0 0":"var(--radius-lg)",border:block.failCount>0?"1px solid rgba(238,46,60,.4)":"1px solid transparent",cursor:"pointer",fontFamily:"var(--font-display)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:18,color:"rgba(255,255,255,.5)" }}>schedule</span>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontSize:14,fontWeight:700,color:"#fff" }}>{block.label}</div>
                      <div style={{ fontSize:11,color:"rgba(255,255,255,.55)",marginTop:1 }}>{block.tasks.length} งาน</div>
                    </div>
                    {block.failCount > 0 && (
                      <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:"var(--radius-pill)",background:"var(--cjx-red)",color:"#fff",display:"inline-flex",alignItems:"center",gap:3 }}>
                        <span className="material-symbols-outlined fill" style={{ fontSize:11 }}>cancel</span>
                        {block.failCount} ต้องแก้
                      </span>
                    )}
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize:22,color:"rgba(255,255,255,.65)",transform:block.expanded?"rotate(180deg)":"none",transition:"transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
                </button>
                {block.expanded && (
                  <div style={{ background:"var(--surface-sunken)",borderRadius:"0 0 var(--radius-lg) var(--radius-lg)",border:"1px solid var(--border-subtle)",borderTop:"none",padding:"8px",display:"flex",flexDirection:"column",gap:8 }}>
                    {block.tasks.map((task) => {
                      const s = getStatus(task.id);
                      const reqArr = task.ev==="photo" ? ["photo"] : task.ev==="confirm" ? ["form"] : [];
                      const chipEl = s==="fail"
                        ? <StatusChip status="fix" icon="cancel" size="sm">{task.deadline ? "แก้ไขภายใน " + task.deadline : "ต้องแก้ไข"}</StatusChip>
                        : undefined;
                      return (
                        <TaskCard key={task.id} title={task.title} desc={task.desc}
                          status={s==="fail" ? "fix" : "pending"}
                          requirements={reqArr} coins={task.coins||undefined} chip={chipEl}
                          onClick={task.ev==="system" ? undefined : () => openTask(task)} />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {passedTasks.length > 0 && (
            <div style={{ marginTop:16 }}>
              <button type="button" onClick={() => setShowDone((v) => !v)} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"12px 14px",background:"var(--surface-card)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-md)",cursor:"pointer",fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text-secondary)" }}>
                <span className="material-symbols-outlined fill" style={{ fontSize:20,color:"var(--cjx-green)" }}>check_circle</span>
                งานที่เสร็จแล้ว
                <span style={{ fontFamily:"var(--font-numeric)",fontSize:12,color:"var(--cjx-green)",background:"var(--green-50)",padding:"2px 9px",borderRadius:"var(--radius-pill)" }}>{passedTasks.length}</span>
                <span className="material-symbols-outlined" style={{ marginLeft:"auto",fontSize:22,transform:showDone?"rotate(180deg)":"none",transition:"transform var(--dur-base) var(--ease-out)" }}>expand_more</span>
              </button>
              {showDone && (
                <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:8,opacity:0.85 }}>
                  {passedTasks.map((task) => (
                    <TaskCard key={task.id} title={task.title} desc={task.desc} status="passed"
                      requirements={task.ev==="photo"?["photo"]:task.ev==="confirm"?["form"]:[]}
                      coins={task.coins||undefined}
                      chip={<StatusChip status="passed" icon="check_circle" size="sm">ผ่าน</StatusChip>} />
                  ))}
                </div>
              )}
            </div>
          )}

          {ackHandover && handoverBlock}

          <div style={{ marginTop:28 }}>
            <Button variant="primary" size="lg" fullWidth icon="swap_horiz" onClick={onHandover}>ส่งงานปิดกะ</Button>
          </div>
        </div>
      </div>
    );
  }

  window.TaskTimelineScreen = TaskTimelineScreen;
})();
