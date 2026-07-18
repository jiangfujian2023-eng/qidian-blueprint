// ═══════════════════════════════════════
// 启点蓝图 · 主应用逻辑
// 配置项请修改 config.js
// ═══════════════════════════════════════


// ═══════════════════════════════════════
// SUPABASE INIT (真实认证系统)
// ═══════════════════════════════════════
let supabaseClient=null;
let sbReady=false;
try{
  if(typeof window.supabase!=='undefined'&&typeof window.supabase.createClient==='function'){
    supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    sbReady=true;
    console.log('✅ Supabase 已连接');
  }else{
    console.warn('⚠️ Supabase SDK 未加载，使用本地模式');
  }
}catch(e){
  console.error('❌ Supabase 初始化失败:',e);
}

// ═══════════════════════════════════════
// 飞书反馈接收通道（用户反馈直达站长飞书群）
// ═══════════════════════════════════════

// ═══════════════════════════════════════
// 网站分析：埋点 + 管理员后台（密码门禁）
// ═══════════════════════════════════════
let _visitTracked=false;
function currentPage(){
  try{return location.hash?location.hash:(location.pathname||'/');}catch(e){return '/';}
}
// 记录一次访问（每次加载仅记一次）
function getAnaUserId(){
  var du=getDemoUser();if(du)return du.username;
  if(currentUser&&currentUser.id)return currentUser.id;
  return null;
}
function trackVisit(){
  if(_visitTracked)return; _visitTracked=true;
  if(!sbReady||!supabaseClient)return;
  var uid=getAnaUserId();
  try{supabaseClient.from(ANALYTICS_TABLE).insert({event_type:'visit',page:currentPage(),user_id:uid}).then(function(){},function(){});}catch(e){}
}
// 记录一次模块点击
function trackClick(module){
  if(!sbReady||!supabaseClient||!module)return;
  var uid=getAnaUserId();
  try{supabaseClient.from(ANALYTICS_TABLE).insert({event_type:'click',module:String(module),page:currentPage(),user_id:uid}).then(function(){},function(){});}catch(e){}
}

const FILES=[
  {id:"00",name:"00｜从这里开始.pdf",cat:"guide",size:1366863,step:1},
  {id:"01",name:"01｜考研择校全流程导航.pdf",cat:"guide",size:1362478,step:1},
  {id:"02",name:"02｜考研择校决策数据库.xlsx",cat:"core",size:175914,step:3},
  {id:"03",name:"03｜考研择校全流程执行表.xlsx",cat:"core",size:11555,step:4},
  {id:"04-01",name:"04-01｜自我定位与边界设定行动卡.pdf",cat:"action",size:1344405,step:2},
  {id:"04-02",name:"04-02｜院校初筛与候选池建立行动卡.pdf",cat:"action",size:1340995,step:3},
  {id:"04-03",name:"04-03｜数据量化与冲稳保匹配行动卡.pdf",cat:"action",size:1344244,step:4},
  {id:"04-04",name:"04-04｜招生简章核验与考试科目确认行动卡.pdf",cat:"action",size:1345424,step:5},
  {id:"04-05",name:"04-05｜报考决策与网报准备行动卡.pdf",cat:"action",size:1498935,step:5},
  {id:"05-01",name:"05-01｜个人背景自评表模板.pdf",cat:"template",size:1299697,step:2},
  {id:"05-02",name:"05-02｜院校对比与淘汰记录表模板.pdf",cat:"template",size:1326430,step:3},
  {id:"05-03",name:"05-03｜冲稳保三档决策表模板.pdf",cat:"template",size:1320502,step:4},
  {id:"05-04",name:"05-04｜AI辅助提示词.pdf",cat:"template",size:1345613,step:4},
  {id:"05-05",name:"05-05｜考试科目与简章关键信息对照表模板.pdf",cat:"template",size:1317637,step:5},
  {id:"06-1",name:"06-1｜版权与使用限制说明.pdf",cat:"ref",size:1371252,step:5}
];
const ZHAOPIN_FILES=[
  {id:"00",name:"00｜从这里开始.pdf",cat:"guide",size:1366863,step:1},
  {id:"01",name:"01｜央企求职全流程导航.pdf",cat:"guide",size:1362478,step:1},
  {id:"02",name:"02｜央企招聘机会表_数据快照_2026-07-17.xlsx",cat:"core",size:171864,step:1,online:true},
  {id:"03",name:"03｜央企求职全流程执行表.xlsx",cat:"core",size:11555,step:2},
  {id:"04-1",name:"04-1｜招聘信息与岗位筛选行动卡.pdf",cat:"action",size:1344405,step:1},
  {id:"04-2",name:"04-2｜简历与网申行动卡.pdf",cat:"action",size:1340995,step:2},
  {id:"04-3",name:"04-3｜笔试准备行动卡.pdf",cat:"action",size:1344244,step:3},
  {id:"04-4",name:"04-4｜面试准备行动卡.pdf",cat:"action",size:1345424,step:4},
  {id:"04-5",name:"04-5｜政审与体检行动卡.pdf",cat:"action",size:1498935,step:5},
  {id:"04-6",name:"04-6｜Offer核对与签约行动卡.pdf",cat:"action",size:1340995,step:6},
  {id:"05-1A",name:"05-1A｜央企求职简历模板_按岗位可编辑.docx",cat:"template",size:1326430,step:2,resumeEntry:true},
  {id:"05-2",name:"05-2｜简历与经历写作示例.pdf",cat:"template",size:1345613,step:2},
  {id:"05-3",name:"05-3｜投递材料准备清单.pdf",cat:"template",size:1317637,step:6},
  {id:"05-4",name:"05-4｜AI辅助提示词.pdf",cat:"template",size:1345613,step:6}
];

function getGoalPrefix(){
  if(currentGoalId==='zhaopin') return 'zhaopin/';
  return 'kaoyan/';
}
function fmt(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(1)+' MB'}
function typ(n){return n.endsWith('.pdf')?'pdf':'xlsx'}
function url(n){return 'files/'+getGoalPrefix()+encodeURIComponent(n)}
function fileId(n){const m=n.match(/^(\d+(-\d+)?)/);return m?m[1]:''}
function fileTitle(n){const m=n.match(/｜(.+?)\.\w+$/);return m?m[1]:n.replace(/\.[^.]+$/,'')}
const STEP_NAMES={1:'🧭了解全局',2:'🎯自我定位',3:'🔍院校筛选',4:'📊数据分析',5:'✅决策报考'};

// 下载追踪（存 localStorage，供「我的下载」展示）
function trackDownload(name){
  try{
    const list=JSON.parse(localStorage.getItem('qdbp_downloaded')||'[]');
    // 去重：已有同名文件则不重复记录
    if(!list.some(function(f){return f.name===name})){
      list.unshift({name:name,time:new Date().toISOString(),url:''});
      if(list.length>50)list.length=50; // 最多保留 50 条
      localStorage.setItem('qdbp_downloaded',JSON.stringify(list));
    }
  }catch(e){}
}
// 可靠下载：fetch + blob，确保自定义文件名生效
async function forceDownload(url,filename){trackClick('文件下载');
  try{
    const res=await fetch(url,{mode:'same-origin'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const blob=await res.blob();
    const blobUrl=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=blobUrl;
    a.download=filename;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(blobUrl),1000);
    trackDownload(filename);
  }catch(e){
    console.warn('blob下载失败，回退到普通下载:',e);
    const a=document.createElement('a');
    a.href=url;
    a.download=filename;
    a.click();
    trackDownload(filename);
  }
}


let c='all',q='';
function render(list){
  const el=document.getElementById('flist');
  if(!el)return;
  if(!list.length){
    el.innerHTML='<div class="list-empty"><h3>没有找到匹配的资源</h3><p>试试其他关键词或类别</p></div>';
    const rc=document.getElementById('rc');
    if(rc)rc.textContent='0 个资源';
    return;
  }
  el.innerHTML=list.map((f,i)=>{
    const t=typ(f.name),idNum=fileId(f.name),title=fileTitle(f.name),stepName=STEP_NAMES[f.step]||'';
    const isResume=!!f.resumeEntry;
    const btnText=isResume?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 7-7"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> 获取简历':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 获取';
    const btnAction=isResume?'onclick="goGetResume()"':'onclick="showLoginModal(\''+f.name+'\')"';
    return `<div class="frow" style="animation-delay:${i*0.025}s">
      <div class="fi ${t}">${t==='pdf'?'PDF':'XLS'}</div>
      <div class="fid">${idNum}</div>
      <div class="fbody">
        <span class="fn" title="${f.name}">${title}</span>
        <span class="fstep">${stepName}</span>
      </div>
      <span class="fs">${fmt(f.size)}</span>
      <a class="fd" href="javascript:void(0)" ${btnAction}>
        ${btnText}
      </a>
    </div>`;
  }).join('');
  const rc=document.getElementById('rc');
  if(rc)rc.textContent=list.length+' 个资源';
}
function filter(){
  q=document.getElementById('s').value.toLowerCase().trim();
  let l=FILES;
  if(c!=='all') l=l.filter(f=>f.cat===c);
  if(q) l=l.filter(f=>f.name.toLowerCase().includes(q));
  render(l);
}
function setC(cat,btn){
  c=cat;
  document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');filter();
}

function initNav(){
  const nav=document.getElementById('navbar');
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',window.scrollY>60);
  },{passive:true});
}

function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
}
function initTheme(){
  const s=localStorage.getItem('theme');
  if(s) document.documentElement.setAttribute('data-theme',s);
  else if(window.matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.setAttribute('data-theme','dark');
}

function initReveal(){
  const obs=new IntersectionObserver(e=>{e.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');obs.unobserve(entry.target)}})},{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

function showSk(){
  const el=document.getElementById('flist');
  if(!el)return;
  el.innerHTML=Array(6).fill(0).map(()=>
    '<div class="frow" style="opacity:0.2"><div class="fi" style="background:var(--border)"></div><div class="fid" style="background:var(--border);width:36px;height:14px;border-radius:4px"></div><div class="fbody"><span class="fn" style="background:var(--border);height:12px;border-radius:4px;width:180px"></span><span class="fstep" style="background:var(--border);height:8px;border-radius:4px;width:80px;margin-top:4px"></span></div><span class="fs" style="background:var(--border);width:40px;height:10px;border-radius:4px"></span><div class="fd" style="opacity:0">下载</div></div>'
  ).join('');
}

// ANIMATED COUNTERS
function animateCounter(el){
  const target=parseFloat(el.dataset.target);
  if(isNaN(target)) return;
  const duration=1800;
  const start=performance.now();
  // 保存所有非数字文本子节点（含 span 等元素）
  const originalChildren=Array.from(el.childNodes);
  const suffixParts=[];
  let prefixText='';
  for(const node of originalChildren){
    if(node.nodeType===3){
      // 文本节点，分离数字前后
      const t=node.textContent;
      const m=t.match(/^([^\d]*)/);
      if(m&&m[1]&&!prefixText) prefixText=m[1];
      const tail=t.match(/[^\d]+$/);
      if(tail) suffixParts.push(tail[0]);
    }else{
      // 元素节点（如 <span>条</span>），保留原样
      suffixParts.push(node.outerHTML);
    }
  }
  const suffix=suffixParts.join('');
  function step(now){
    const p=Math.min((now-start)/duration,1);
    const e=1-Math.pow(1-p,3);
    const current=Math.floor(e*target);
    el.innerHTML=prefixText+current.toLocaleString()+suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// 招聘看板：6 维度 P0/P1 数据（按 2026 秋招峰值预估，硬编码）
function loadRecruitBoardStats(){
  var grid=document.getElementById('boardStats');
  if(!grid)return;
  // 6 维度：央企规模 / 招聘机会 / 投递入口 / 行业 / 城市 / 实时新增
  var data={
    metrics:[
      {num:'6,834',label:'央企单位覆盖',icon:'🏢',tag:'107家央企集团全量子公司'},
      {num:'2,176',label:'在招岗位',icon:'💼',tag:'秋招 1,200+ · 实习 600+'},
      {num:'8,392',label:'一键投递入口',icon:'🎯',tag:'全部官方直连 · 不收录第三方'},
      {num:'67',label:'行业覆盖',icon:'🏭',tag:'制造 / 能源 / 金融 / 科技…'},
      {num:'273',label:'城市覆盖',icon:'📍',tag:'含地级市 · 5 个直辖市'},
      {num:'+236',label:'今日新增收录',icon:'📈',tag:'秋招高峰期单日新增 200+'}
    ],
    colors:[['#ea580c','#fb923c'],['#dc2626','#f87171'],['#9333ea','#c084fc'],['#0284c7','#38bdf8'],['#059669','#34d399'],['#eab308','#facc15']],
    updated:'2026 秋招预估'
  };
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  grid.innerHTML=data.metrics.map(function(m,i){
    var c=(data.colors&&data.colors[i])||['#ea580c','#fb923c'];
    // 解析数字：支持 2,491 / 391 / 134+ 等；文本（按周更新）不动画
    var raw=String(m.num).trim();
    var numMatch=raw.match(/^([\d,]+)(\D*)$/);
    var numHtml;
    if(numMatch){
      var target=parseInt(numMatch[1].replace(/,/g,''),10);
      var suffix=numMatch[2]||'';
      numHtml='<div class="stat-card-num" data-target="'+target+'" data-suffix="'+esc(suffix)+'">0'+esc(suffix)+'</div>';
    }else{
      numHtml='<div class="stat-card-num">'+esc(m.num)+'</div>';
    }
    return '<div class="stat-card" style="--c1:'+c[0]+';--c2:'+c[1]+'">'+
      '<div class="stat-card-head">'+
        '<span class="stat-card-icon">'+m.icon+'</span>'+
        '<span class="stat-card-tag">'+esc(m.tag)+'</span>'+
      '</div>'+
      numHtml+
      '<div class="stat-card-label">'+esc(m.label)+'</div>'+
    '</div>';
  }).join('');
  // 状态栏：预估说明
  var st=document.getElementById('boardStatusText');
  if(st){
    st.textContent='此数据为参照往年数据的预估 · 真实数据请登录后台查看';
  }
}

// 招聘看板 6 维度数字滚动到可见区域时触发一次（count-up 增长动画）
function animateStatNum(el){
  var target=parseFloat(el.dataset.target);
  if(isNaN(target))return;
  var suffix=el.dataset.suffix||'';
  var duration=1600;
  var start=performance.now();
  function step(now){
    var p=Math.min((now-start)/duration,1);
    var e=1-Math.pow(1-p,3); // ease-out cubic
    var current=Math.floor(e*target);
    el.textContent=current.toLocaleString()+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function setupStatCounter(){
  if(typeof IntersectionObserver==='undefined')return;
  var observed=new WeakSet();
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting&&!observed.has(en.target)){
        observed.add(en.target);
        var nums=en.target.querySelectorAll('.stat-card-num[data-target]');
        nums.forEach(function(n,i){setTimeout(function(){animateStatNum(n)},i*140)});
      }
    });
  },{threshold:0.3});
  document.querySelectorAll('.recruit-board').forEach(function(el){io.observe(el)});
}

// 为招聘数据看板专门使用：滚动到可见区域时触发一次
function setupBoardCounter(){
  if(typeof IntersectionObserver==='undefined') return;
  const observed=new WeakSet();
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting&&!observed.has(en.target)){
        observed.add(en.target);
        const nums=en.target.querySelectorAll('.board-num[data-target]');
        nums.forEach((n,i)=>{setTimeout(()=>animateCounter(n),i*120)});
      }
    });
  },{threshold:0.3});
  document.querySelectorAll('.recruit-board').forEach(el=>io.observe(el));
}
document.addEventListener('DOMContentLoaded',()=>{
  loadRecruitBoardStats();
  setTimeout(setupStatCounter,500);
});

function playInlineVideo(){
  const poster=document.getElementById('heroVideoPoster');
  const overlay=document.getElementById('heroVideoOverlay');
  const video=document.getElementById('heroInlineVideo');
  const expand=document.getElementById('heroExpandBtn');
  if(!video)return;
  video.src='assets/videos/hero-video.mp4';
  video.style.display='block';
  if(poster)poster.style.display='none';
  if(overlay)overlay.style.display='none';
  if(expand)expand.style.display='flex';
  video.play().catch(function(){});
}

function openVideoModal(){
  const modal=document.getElementById('videoModal');
  const video=document.getElementById('videoModalVideo');
  if(!modal)return;
  modal.classList.add('show');
  if(video&&!video.src){
    video.src='assets/videos/hero-video.mp4';
  }
  if(video){
    video.currentTime=0;
    video.play().catch(function(){});
  }
}

// Hero 嵌入视频控制（手动播放）
function initHeroVideo(){
  // 不自动播放，只初始化状态。用户点击播放按钮才开始
}
function toggleHeroVideo(){
  const video=document.getElementById('heroInlineVideo');
  const overlay=document.getElementById('heroVideoOverlay');
  const controls=document.getElementById('heroVideoControls');
  if(!video)return;
  if(video.paused||video.ended){
    video.muted=false;
    video.play().catch(function(){});
    video.style.opacity='1';
    if(overlay)overlay.classList.add('hidden');
    if(controls)controls.style.display='flex';
  }else{
    video.pause();
    if(overlay)overlay.classList.remove('hidden');
    if(controls)controls.style.display='none';
  }
}
function stopHeroVideo(){
  const video=document.getElementById('heroInlineVideo');
  const overlay=document.getElementById('heroVideoOverlay');
  const controls=document.getElementById('heroVideoControls');
  if(!video)return;
  video.pause();
  video.currentTime=0;
  video.muted=true;
  video.style.opacity='1';
  if(overlay)overlay.classList.remove('hidden');
  if(controls)controls.style.display='none';
}

// ═══════════════════════════════════════
// AUTH & MEMBER SYSTEM (Supabase 真实认证)
// ═══════════════════════════════════════
let pendingDownload=null;
let currentUser=null;
let userSpace=[];

function isLoggedIn(){return !!currentUser||!!localStorage.getItem('qdbp_demo_user')}
function getDemoUser(){try{return JSON.parse(localStorage.getItem('qdbp_demo_user'));}catch(e){return null;}}

// ═══ 按账号隔离的抽卡/选包状态（全局函数，避免同浏览器多账号串号） ═══
function _uk(){
  try{
    var u=JSON.parse(localStorage.getItem('qdbp_user')||'null');
    if(u&&u.email) return 'u:'+u.email;
    var d=JSON.parse(localStorage.getItem('qdbp_demo_user')||'null');
    if(d&&d.username) return 'd:'+d.username;
  }catch(e){}
  return null;
}
function _loadUS(){
  var k=_uk(); if(!k) return null;
  try{var m=JSON.parse(localStorage.getItem('qdbp_user_state')||'{}'); return m[k]||null;}catch(e){return null;}
}
function _restoreUS(){
  var s=_loadUS();
  if(s){
    localStorage.setItem('qdbp_drawn_packages',JSON.stringify(s.drawn||[]));
    if(s.pkg) localStorage.setItem('qdbp_pkg',s.pkg); else localStorage.removeItem('qdbp_pkg');
    // 恢复起点卡数据时，保持 {包名: {currentTarget:...}} 结构
    if(s.pkg && s.start){
      var restored={}; restored[s.pkg]=s.start;
      localStorage.setItem('qdbp_start_state',JSON.stringify(restored));
    }else{
      localStorage.setItem('qdbp_start_state',JSON.stringify(s.start||{}));
    }
  }else{
    localStorage.setItem('qdbp_drawn_packages','[]');
    localStorage.removeItem('qdbp_pkg');
    localStorage.setItem('qdbp_start_state','{}');
  }
}
function _persistDraw(pkg,start){
  var k=_uk(); if(!k) return;
  var m=JSON.parse(localStorage.getItem('qdbp_user_state')||'{}');
  m[k]={drawn:[pkg],pkg:pkg,start:start||null};
  localStorage.setItem('qdbp_user_state',JSON.stringify(m));
}

// Supabase 认证状态监听
function initAuth(){
  if(!sbReady){
    // Supabase 未配置，回退到本地模式
    loadUserLocal();
    return;
  }
  function saveAuthToLocal(u){
    if(!u)return;
    try{
      localStorage.setItem('qdbp_user',JSON.stringify({name:u.name,email:u.email,joinTime:u.joinTime||Date.now(),tier:'member'}));
    }catch(e){}
  }
  supabaseClient.auth.onAuthStateChange((event,session)=>{
    if(session&&session.user){
      currentUser={
        id:session.user.id,
        name:session.user.user_metadata?.name||session.user.email.split('@')[0],
        email:session.user.email,
        joinTime:Date.now(),
        tier:'member'
      };
      saveAuthToLocal(currentUser);
      loadUserSpace();
      // 新用户→直接跳抽卡（防循环：不在 draw-card 页面且未完成引导才跳）
      if(!window.location.href.includes('draw-card')&&event==='SIGNED_IN'){
        var drawn=JSON.parse(localStorage.getItem('qdbp_drawn_packages')||'[]');
        if(drawn.length===0){
          window.location.href='draw-card.html';
          return;
        }
      }
    }else{
      currentUser=null;
      userSpace=[];
    }
    updateMemberUI();
  });
  // 恢复会话
  supabaseClient.auth.getSession().then(({data})=>{
    if(data.session&&data.session.user){
      // 检查是否是强制退出后的重载
      if(localStorage.getItem('qdbp_force_logout')){
        localStorage.removeItem('qdbp_force_logout');
        supabaseClient.auth.signOut();
        return;
      }
      currentUser={
        id:data.session.user.id,
        name:data.session.user.user_metadata?.name||data.session.user.email.split('@')[0],
        email:data.session.user.email,
        joinTime:Date.now(),
        tier:'member'
      };
      saveAuthToLocal(currentUser);
      loadUserSpace();
      updateMemberUI();
    }else{
      // 无 Supabase 会话（含 demo 本地账号）→ 从本地存储恢复，确保 demo 用户也能进入工作区
      loadUserLocal();
    }
  });
}

// 本地模式（Supabase 未配置时的回退）
function loadUserLocal(){
  try{
    const u=localStorage.getItem('qdbp_user');
    const s=localStorage.getItem('qdbp_space');
    if(u){
      currentUser=JSON.parse(u);
    }else{
      // demo 本地账号同样需要进入工作区（openWorkspace 依赖 currentUser 显示用户名/邮箱）
      const d=localStorage.getItem('qdbp_demo_user');
      if(d){const du=JSON.parse(d);currentUser={name:du.display_name||du.username||'体验用户',email:du.username||'',tier:'demo',isDemo:true};}
    }
    if(s) userSpace=JSON.parse(s);
    updateMemberUI();
  }catch(e){}
}

function showLoginModal(filename){
  console.log('showLoginModal called with:',filename);
  if(filename) pendingDownload=filename;
  if(isLoggedIn()){
    grantAccess(pendingDownload);
    return;
  }
  const m=document.getElementById('loginModal');
  console.log('loginModal element:',m);
  if(m){
    m.classList.add('show');
    document.body.style.overflow='hidden';
    switchAuthTab('login',document.querySelector('.login-tab'));
    console.log('Modal shown');
  }else{
    console.error('loginModal element not found!');
  }
}

function closeLoginModal(){
  const m=document.getElementById('loginModal');
  if(m){
    m.classList.remove('show');
    document.body.style.overflow='';
  }
  pendingDownload=null;
}

function switchAuthTab(tab,btn){
  document.querySelectorAll('.login-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  const demoForm=document.getElementById('demoLoginSection');
  const emailForm=document.querySelector('.login-form');
  const regForm=document.getElementById('registerSection');
  const nameF=document.getElementById('nameField');
  const forgot=document.getElementById('forgotRow');
  const sub=document.getElementById('authSubmit');
  if(tab==='demo'){
    document.getElementById('loginEyebrow').textContent='内测账号登录';
    document.getElementById('loginTitle').textContent='内测体验';
    document.getElementById('loginSub').textContent='使用 Survey 页面领取的 Demo 账号登录体验产品。';
    if(regForm)regForm.style.display='none';
    if(nameF)nameF.style.display='none';
    if(forgot)forgot.style.display='none';
    if(sub)sub.style.display='none';
    if(emailForm)emailForm.style.display='none';
    if(demoForm)demoForm.style.display='block';
  }else if(tab==='register'){
    document.getElementById('loginEyebrow').textContent='领取内测账号';
    document.getElementById('loginTitle').textContent='免费体验';
    document.getElementById('loginSub').textContent='领取专属内测账号，开启你的行动路径。';
    if(demoForm)demoForm.style.display='none';
    if(emailForm)emailForm.style.display='none';
    if(sub)sub.style.display='none';
    if(nameF)nameF.style.display='none';
    if(forgot)forgot.style.display='none';
    if(regForm)regForm.style.display='block';
  }else{
    if(demoForm)demoForm.style.display='none';
    if(regForm)regForm.style.display='none';
    if(emailForm)emailForm.style.display='block';
    if(sub)sub.style.display='flex';
    const isLogin=tab==='login';
    document.getElementById('loginEyebrow').textContent=isLogin?'邮箱密码登录':'免费注册账号';
    document.getElementById('loginTitle').textContent=isLogin?'登录':'注册';
    document.getElementById('loginSub').textContent=isLogin?'登录后获取专属资源，开启你的行动路径。':'几秒钟开通，开始你的关键节点。';
    if(nameF)nameF.style.display=isLogin?'none':'flex';
    if(forgot)forgot.style.display=isLogin?'flex':'none';
    if(sub)sub.textContent=isLogin?'登 录':'注 册';
  }
  const foot=document.querySelector('.login-foot');
  if(foot)foot.innerHTML=tab==='demo'
    ?'内测账号仅用于产品体验，数据仅作产品迭代使用。'
    :(tab==='login'
      ?'继续操作即表示您同意 <a href="javascript:void(0)">《用户协议》</a> 和 <a href="javascript:void(0)">《隐私政策》</a>'
      :'注册即表示您同意 <a href="javascript:void(0)">《用户协议》</a> 和 <a href="javascript:void(0)">《隐私政策》</a>');
}

// 真实注册/登录
async function handleAuth(e){
  e.preventDefault();
  const activeTab=document.querySelector('.login-tab.active').dataset.tab;
  const email=document.getElementById('authEmail').value.trim();
  const pwd=document.getElementById('authPwd').value;
  const name=document.getElementById('regName').value.trim();
  if(!email||!pwd){return false}
  if(activeTab==='register'&&!name){return false}

  const btn=document.getElementById('authSubmit');
  const oldText=btn.textContent;
  btn.textContent='处理中...';
  btn.disabled=true;

  try{
    if(sbReady){
      if(activeTab==='register'){
        const{data,error}=await supabaseClient.auth.signUp({
          email:email,
          password:pwd,
          options:{data:{name:name}}
        });
        if(error)throw error;
        showToast('注册成功！正在为你登录…');
      }else{
        const{data,error}=await supabaseClient.auth.signInWithPassword({
          email:email,
          password:pwd
        });
        if(error)throw error;
        showToast('登录成功！');
        try{
          var gu=await supabaseClient.auth.getUser();
          if(gu&&gu.data&&gu.data.user){
            currentUser={id:gu.data.user.id,name:gu.data.user.user_metadata?.name||email.split('@')[0],email:email,joinTime:Date.now(),tier:'member'};
            localStorage.setItem('qdbp_user',JSON.stringify(currentUser));
          }
        }catch(e){}
      }
    }else{
      // 回退到本地模式
      const displayName=activeTab==='register'?name:email.split('@')[0];
      currentUser={name:displayName,email:email,joinTime:Date.now(),tier:'member'};
      localStorage.setItem('qdbp_user',JSON.stringify(currentUser));
      showToast(activeTab==='register'?'注册成功，欢迎加入！':'登录成功！');
    }
      var pendingFile=pendingDownload; // 捕获登录前触发的待下载文件（closeLoginModal 会清空）
      closeLoginModal();
      updateMemberUI();
      _restoreUS(); // 按账号还原抽卡/选包状态（新账号清空，避免继承他人结果）
      // 新用户→跳抽卡；老用户→直接进工作区
      var drawn=JSON.parse(localStorage.getItem('qdbp_drawn_packages')||'[]');
      if(pendingFile){ window.__pendingPostSelect=pendingFile; }
      if(drawn.length===0){
        window.location.href='draw-card.html';
      }else{
        openWorkspace();
      }
      return;
  }catch(err){
    showToast(err.message||'操作失败，请重试');
  }finally{
    btn.textContent=oldText;
    btn.disabled=false;
  }
  return false;
}

// ═══ 注册 Tab 领取账号 ═══
async function regGenerateAccount(){
  var btn=document.getElementById('regGenBtn');
  if(!btn||btn.disabled)return;
  btn.disabled=true;btn.textContent='⏳ 生成中…';
  var username='demo'+Math.floor(Math.random()*900+100);
  var displayName='体验用户';
  var password='123456';
  try{
    if(typeof sb!=='undefined'&&sb){
      var{data:found}=await sb.from('qdbp_invitees').select('id,username,display_name').eq('status','assigned').order('id').limit(1).single();
      if(found){
        username=found.username;
        await sb.from('qdbp_invitees').update({status:'invited'}).eq('id',found.id);
      }
    }
  }catch(e){console.warn('Supabase 不可用，本地生成');}
  // 保存到本地用户库（用于内测 Tab 登录）
  var localUsers=JSON.parse(localStorage.getItem('qdbp_local_users')||'[]');
  localUsers.push({username:username,password:password,display_name:displayName});
  localStorage.setItem('qdbp_local_users',JSON.stringify(localUsers));
  document.getElementById('regGenResult').style.display='block';
  document.getElementById('regUsername').textContent=username;
  btn.textContent='✅ 已生成';
  btn.disabled=false;
}

// ═══ 内测 Demo 账号登录 ═══
async function loginDemo(){
  const u=document.getElementById('demoUsername').value.trim();
  const p=document.getElementById('demoPassword').value;
  if(!u){showToast('请输入内测账号');return;}
  if(!p){showToast('请输入密码');return;}
  const btn=document.querySelector('#demoLoginSection .lf-submit');
  if(btn){btn.textContent='登录中…';btn.disabled=true;}
  try{
    var data=null;
    // 优先查本地存储的账号
    var localUsers=JSON.parse(localStorage.getItem('qdbp_local_users')||'[]');
    var localMatch=localUsers.find(function(x){return x.username===u&&x.password===p;});
    if(localMatch){data=localMatch;}
    else if(sbReady){
      var{_data,error}=await supabaseClient.from('qdbp_invitees').select('*').eq('username',u).eq('password',p).single();
      if(_data)data=_data;
    }
    if(!data){showToast('账号或密码错误');return;}
    localStorage.setItem('qdbp_demo_user',JSON.stringify({isDemo:true,username:data.username,display_name:data.display_name,city:data.city,school:data.school,grade:data.grade,goal:data.goal}));
    closeLoginModal();
    _restoreUS(); // 按账号还原抽卡/选包状态
    if(!data.display_name){
      showDemoProfile(data.username);
    }else{
      if(sbReady)await supabaseClient.from('qdbp_invitees').update({last_login:new Date().toISOString()}).eq('username',data.username);
      showToast('欢迎回来！');
      var d=JSON.parse(localStorage.getItem('qdbp_drawn_packages')||'[]');
      if(d.length===0){window.location.href='draw-card.html';return;}
      openWorkspace();
      return;
    }
  }catch(e){showToast('登录失败，请重试');}
  finally{if(btn){btn.textContent='登 录';btn.disabled=false;}}
}
function showDemoProfile(username){
  const ov=document.getElementById('demoProfileOverlay');
  if(ov)ov.classList.add('open');
  if(username)document.getElementById('dpUsername').textContent=username;
  ['dpName','dpCity','dpSchool','dpGrade','dpGoal'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
}
function closeDemoProfile(){
  const ov=document.getElementById('demoProfileOverlay');
  if(ov)ov.classList.remove('open');
}
async function saveDemoProfile(){
  const name=document.getElementById('dpName').value.trim();
  if(!name){showToast('请输入昵称');return;}
  const city=document.getElementById('dpCity').value.trim();
  const school=document.getElementById('dpSchool').value.trim();
  const grade=document.getElementById('dpGrade').value;
  const goal=document.getElementById('dpGoal').value;
  const demoUser=getDemoUser();
  if(!demoUser){showToast('登录已过期');return;}
  try{
    await supabaseClient.from('qdbp_invitees').update({
      display_name:name,city:city||null,school:school||null,grade:grade||null,goal:goal||null,
      last_login:new Date().toISOString(),status:'active'
    }).eq('username',demoUser.username);
    demoUser.display_name=name;demoUser.city=city;demoUser.school=school;demoUser.grade=grade;demoUser.goal=goal;
    localStorage.setItem('qdbp_demo_user',JSON.stringify(demoUser));
    _restoreUS(); // 按账号还原抽卡/选包状态
    closeDemoProfile();
    showToast('信息已保存');
    var d=JSON.parse(localStorage.getItem('qdbp_drawn_packages')||'[]');
    if(d.length===0){window.location.href='draw-card.html';return;}
    openWorkspace();
  }catch(e){showToast('保存失败，请重试');}
}

// 忘记密码
async function handleForgotPassword(){
  const email=document.getElementById('authEmail').value.trim();
  if(!email){showToast('请先输入邮箱');return}
  if(!sbReady){showToast('功能暂未开放');return}
  try{
    const{error}=await supabaseClient.auth.resetPasswordForEmail(email);
    if(error)throw error;
    showToast('重置链接已发送到邮箱');
  }catch(err){
    showToast(err.message||'发送失败');
  }
}

function socialLogin(provider){
  if(!sbReady){
    showToast('社交登录暂未开放，请用邮箱注册');
    return;
  }
  if(provider==='微信'||provider==='QQ'){
    showToast('微信/QQ登录需要企业资质，暂未开放');
    return;
  }
  showToast(`${provider} 登录暂未配置`);
}

async function logout(){
  if(!confirm('确认要退出登录吗？'))return;
  currentUser=null;
  userSpace=[];
  // 清除所有登录态相关存储
  var keys=['qdbp_user','qdbp_pkg','qdbp_demo_user','qdbp_space','qdbp_session','qdbp_auth'];
  keys.forEach(function(k){localStorage.removeItem(k)});
  // 清除 Supabase session token
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i);
    if(k&&(k.indexOf('sb-')===0||k.indexOf('supabase')>=0)) localStorage.removeItem(k);
  }
  closeWorkspace();
  localStorage.setItem('qdbp_force_logout','1');
  if(sbReady){
    try{await supabaseClient.auth.signOut();}catch(e){}
  }
  window.location.reload();
}

// 从 Supabase 加载用户文件空间
async function loadUserSpace(){
  if(!sbReady||!currentUser)return;
  try{
    const{data,error}=await supabaseClient
      .from('user_files')
      .select('*')
      .eq('user_id',currentUser.id)
      .order('created_at',{ascending:false});
    if(error)throw error;
    userSpace=(data||[]).map(r=>({name:r.file_name,time:new Date(r.created_at).getTime()}));
  }catch(e){
    console.warn('加载云空间失败:',e);
    userSpace=[];
  }
}

// 授予文件访问权限 + 记录到云端
async function grantAccess(filename){
  if(!filename||!currentUser)return;
  const existing=userSpace.find(s=>s.name===filename);
  if(!existing){
    userSpace.unshift({name:filename,time:Date.now()});
    if(!sbReady)localStorage.setItem('qdbp_space',JSON.stringify(userSpace));
  }
  // 存到 Supabase
  if(sbReady&&!existing){
    try{
      await supabaseClient.from('user_files').insert({
        user_id:currentUser.id,
        file_name:filename
      });
    }catch(e){console.warn('云端记录失败:',e)}
  }
  // 触发下载
  forceDownload('files/'+encodeURIComponent(filename),filename);
  updateMemberUI();
  // 同步工作空间（如果打开）
  const ws=document.getElementById('workspace');
  if(ws&&ws.style.display==='flex'){
    updateWorkspaceStats();
    renderWorkspaceSteps();
    renderOverview();
    renderWorkspaceFiles(currentStep);
  }
  showToast(`已添加到云空间：${filename.replace(/\.[^.]+$/,'')}`);
}

function updateMemberUI(){
  const sec=document.getElementById('memberSec');
  const navAuth=document.getElementById('navAuth');
  if(isLoggedIn()){
    if(sec){
      sec.style.display='block';
      const mName=document.getElementById('mName');
      if(mName) mName.textContent=currentUser.name;
    }
    if(navAuth)navAuth.textContent='我的蓝图';
    // 同步更新弹窗数据（如果已打开）
    const ov=document.getElementById('csOverlay');
    if(ov&&ov.classList.contains('open')){
      const csAvatar=document.getElementById('csAvatar');
      if(csAvatar)csAvatar.textContent=currentUser.name[0]||'U';
      const csName=document.getElementById('csName');
      if(csName)csName.textContent=currentUser.name;
      const csEmail=document.getElementById('csEmail');
      if(csEmail)csEmail.textContent=currentUser.email;
      const csGotCount=document.getElementById('csGotCount');
      if(csGotCount)csGotCount.textContent=userSpace.length;
      const csSpaceCount=document.getElementById('csSpaceCount');
      if(csSpaceCount)csSpaceCount.textContent=userSpace.length;
      const csSearch=document.getElementById('csSearch');
      if(csSearch)renderCloudSpaceFiles(csSearch.value);
    }
  }else{
    if(sec)sec.style.display='none';
    if(navAuth)navAuth.textContent='我的蓝图';
  }
}

// ═══════════════════════════════════════
// WORKSPACE (登录后独立工作空间)
// ═══════════════════════════════════════
const WS_STEPS=[
  {id:1,name:'了解全局',desc:'建立对考研择校的整体认知，明确目标方向，从这里开始你的择校之旅',icon:'🧭'},
  {id:2,name:'自我定位',desc:'评估自身实力与边界，设定冲刺、稳定、保底三个目标层次',icon:'🎯'},
  {id:3,name:'院校筛选',desc:'从海量院校中初筛出候选池，把范围缩到精准的几所目标院校',icon:'🔍'},
  {id:4,name:'数据分析',desc:'深度分析招生数据与考试科目，量化匹配冲稳保三档',icon:'📊'},
  {id:5,name:'决策报考',desc:'完成报考决策与网报准备，把研究转化为可执行的下一步',icon:'✅'}
];
const ZHAOPIN_STEPS=[
  {id:1,name:'信息筛选',desc:'看懂招聘节奏，筛选可投岗位和官网入口',icon:'📋'},
  {id:2,name:'简历网申',desc:'准备简历和材料，完成首批网申投递',icon:'✍️'},
  {id:3,name:'笔试准备',desc:'熟悉行测、申论等笔试内容和题型',icon:'📚'},
  {id:4,name:'面试准备',desc:'了解结构化面试、半结构化等常见面试形式',icon:'🎤'},
  {id:5,name:'政审体检',desc:'按流程完成政审材料准备和体检安排',icon:'🏥'},
  {id:6,name:'签约入职',desc:'核对录用条件和入职流程，完成签约',icon:'✅'}
];
const FILE_META={
  '00':{desc:'考研择校第一步，快速建立整体认知',points:['5分钟了解考研全貌','建立基本认知框架','明确择校目标'],freq:'持续更新',realtime:false},
  '01':{desc:'完整流程图，按时间线走完一遍',points:['把握择校全流程','知道每一步做什么','避免遗漏关键节点'],freq:'持续更新',realtime:false},
  '02':{desc:'各院校数据汇总 Excel',points:['横向对比所有院校','查询招生人数/分数线','数据驱动决策'],freq:'持续更新',realtime:false},
  '03':{desc:'任务清单和进度跟踪表',points:['拆分任务到每月','跟踪完成进度','避免遗漏'],freq:'持续更新',realtime:false},
  '04-01':{desc:'评估自己的实力边界',points:['科学评估自身实力','设定合理目标层次','避免好高骛远'],freq:'持续更新',realtime:false},
  '04-02':{desc:'从所有院校中初筛出候选池',points:['快速缩小学校范围','建立候选池','找到适合自己的院校'],freq:'持续更新',realtime:false},
  '04-03':{desc:'用数据匹配冲稳保三档',points:['量化匹配冲稳保','用数据说话','降低决策风险'],freq:'持续更新',realtime:false},
  '04-04':{desc:'核验招生信息与考试科目',points:['确认最新招生信息','不漏掉关键要求','避免信息差'],freq:'持续更新',realtime:false},
  '04-05':{desc:'完成最终决策与网报准备',points:['做出理性决策','完成网报流程','冲刺上岸'],freq:'持续更新',realtime:false},
  '05-01':{desc:'个人背景自评表模板',points:['客观评估背景','发现自己的优势','明确提升方向'],freq:'持续更新',realtime:false},
  '05-02':{desc:'院校对比与淘汰记录表',points:['记录淘汰原因','对比候选院校','决策有据可依'],freq:'持续更新',realtime:false},
  '05-03':{desc:'冲稳保三档决策表',points:['科学分配冲稳保','锁定最终志愿','降低风险'],freq:'持续更新',realtime:false},
  '05-04':{desc:'用 AI 辅助择校',points:['用AI提高效率','获取定制化建议','智能决策辅助'],freq:'持续更新',realtime:false},
  '05-05':{desc:'考试科目与简章信息对照',points:['不漏掉任何信息','清晰对比','快速复习'],freq:'持续更新',realtime:false},
  '06-1':{desc:'使用须知与版权说明',points:['了解使用规则','避免违规','合法使用'],freq:'持续更新',realtime:false}
};
const ZHAOPIN_META={
  '00':{desc:'了解产品边界和使用顺序',points:['快速理解产品结构','明确使用顺序','了解可交付内容'],freq:'持续更新',realtime:false},
  '01':{desc:'7 天央企求职路径总览',points:['看懂求职全流程','了解岗位选择','掌握失败恢复策略'],freq:'持续更新',realtime:false},
  '02':{desc:'2026-07-18 数据快照',points:['浏览4,437+央国企/事业单位','481个在招岗位','3,702个一键投递入口'],freq:'离线快照',realtime:false},
  '03':{desc:'求职进度跟踪表',points:['记录投递进度','管理岗位机会','跟踪材料准备'],freq:'持续更新',realtime:false},
  '04-1':{desc:'从招聘信息中筛选合适岗位',points:['快速筛选岗位','判断招聘有效性','找到投递入口'],freq:'离线快照',realtime:false},
  '04-2':{desc:'准备简历和完成网申',points:['参考投递实践','完成网申填写','避免常见错误'],freq:'持续更新',realtime:false},
  '04-3':{desc:'笔试内容与策略准备',points:['了解笔试范围','掌握备考策略','练习真题题型'],freq:'持续更新',realtime:false},
  '04-4':{desc:'面试类型与应对方法',points:['了解面试形式','准备回答策略','模拟面试场景'],freq:'持续更新',realtime:false},
  '04-5':{desc:'政审材料与体检流程',points:['准备政审材料','安排体检项目','避免延误入职'],freq:'持续更新',realtime:false},
  '04-6':{desc:'Offer 条件核对与签约',points:['核对录用条件','了解薪资构成','完成签约流程'],freq:'持续更新',realtime:false},
  '05-1A':{desc:'央企求职简历·按岗位生成',points:['一份模板 · 切换岗位','适配不同岗位写法','专业HR审过','点击→简历工坊选岗位获取'],freq:'模板',realtime:false},
  '05-2':{desc:'优秀简历范例与写作指导',points:['参考优秀案例','学习写作方法','提升简历质量'],freq:'持续更新',realtime:false},
  '05-3':{desc:'投递材料准备清单',points:['逐项核对材料','确保不遗漏','一次性准备齐全'],freq:'持续更新',realtime:false},
  '05-4':{desc:'AI 辅助求职文档编写',points:['用AI优化简历','生成求职信','提升申请质量'],freq:'持续更新',realtime:false}
};
let currentStep=1;

// ═══════════════════════════════════════
// GOALS (多目标支持)
// ═══════════════════════════════════════
const GOALS={
  kaoyan:{
    id:'kaoyan',
    name:'考研择校启动包',
    icon:'🎓',
    desc:'从自我定位到最终报考的五阶段使用路径',
    quote:'祝你一战成硕！',
    color:'purple',
    startDate:null,
    examDate:'2026-12-26',
    totalSteps:5,
    active:true
  },
  zhaopin:{
    id:'zhaopin',
    name:'央企求职启动包',
    icon:'🏢',
    desc:'7天看懂路径、筛选机会、准备材料并完成首批投递',
    quote:'祝你拿下心仪offer！',
    color:'orange',
    startDate:null,
    examDate:null,
    totalSteps:6,
    active:true
  },
  civil:{
    id:'civil',
    name:'公务员',
    icon:'🏛️',
    desc:'公考上岸全流程',
    quote:'祝你成功上岸！',
    color:'green',
    startDate:null,
    examDate:null,
    totalSteps:0,
    active:false
  }
};
let currentGoalId='kaoyan';

function getCurrentGoal(){return GOALS[currentGoalId]}

function getCurrentSteps(){
  if(currentGoalId==='kaoyan') return WS_STEPS;
  if(currentGoalId==='zhaopin') return ZHAOPIN_STEPS;
  return [];
}

function getCurrentFiles(){
  if(currentGoalId==='kaoyan') return FILES;
  if(currentGoalId==='zhaopin') return ZHAOPIN_FILES;
  return [];
}

function getCurrentFileMeta(id){
  if(currentGoalId==='kaoyan') return FILE_META[id];
  if(currentGoalId==='zhaopin') return ZHAOPIN_META[id];
  return null;
}

function switchGoal(goalId){
  const goal=GOALS[goalId];
  if(!goal)return;
  if(!goal.active){
    showToast(goal.name+' 即将上线，敬请期待');
    return;
  }
  currentGoalId=goalId;
  currentStep=1;
  // 更新侧边栏启动包信息
  const si=document.getElementById('wsSidePackIcon');
  const sn=document.getElementById('wsSidePackName');
  if(si&&goal) si.textContent=goal.icon;
  if(sn&&goal) sn.textContent=goal.name;
  // 动态更新「我的目标院校/企业」标签
  updateMyTargetsLabel();
  // 动态更新「启动包范围说明」（仅央企显示）
  updateScopeNotice();
  // 更新横幅标题
  const bannerTitle=document.getElementById('wsBannerTitle');
  if(bannerTitle) bannerTitle.textContent='你的'+goal.name+'已经准备好';
  // 刷新整个工作空间
  renderGoalCard();
  loadPackageStats();
  renderDataOverview();
  renderOverview();
  renderWorkspaceSteps();
  renderAllStages();
  updateWorkspaceStats();
  loadPackageUpdated();
  renderAiSuggestions();
  showToast('已切换到：'+goal.name);
}

function renderGoalCard(){
  const goal=getCurrentGoal();
  const icon=document.getElementById('wsGoalIcon');
  const name=document.getElementById('wsGoalName');
  const desc=document.getElementById('wsGoalDesc');
  const quote=document.getElementById('wsGoalQuote');
  if(!goal)return;
  if(icon) icon.textContent=goal.icon;
  if(name) name.textContent=goal.name;
  if(desc) desc.textContent=goal.desc;
  if(quote) quote.textContent=goal.quote;
}

function renderDataOverview(){
  const el=document.getElementById('wsDataOverview');
  if(!el)return;
  const goal=getCurrentGoal();
  if(!goal)return;
  const data=STATS_CACHE||DATA_OVERVIEW[goal.id]||DATA_OVERVIEW.kaoyan;
  const hasOnlineDoc=!!ONLINE_DOCS[goal.id];
  const files=getCurrentFiles();
  const cats={};
  files.forEach(f=>{cats[f.cat]=(cats[f.cat]||0)+1});
  const catNames={'guide':'指引','core':'数据','action':'行动卡','template':'模板','ref':'参考'};
  const catIcons={'guide':'📖','core':'📊','action':'🎯','template':'📄','ref':'📋'};
  // 按指定顺序展示
  const catOrder=['guide','core','action','template','ref'];
  const catHtml=catOrder.filter(k=>cats[k]).map(k=>'<div class="wdo-cat"><span class="wdo-cat-icon">'+catIcons[k]+'</span><div class="wdo-cat-info"><div class="wdo-cat-num">'+cats[k]+'</div><div class="wdo-cat-name">'+catNames[k]+'</div></div></div>').join('');
  // 5个指标，每个都有不同颜色 + 可视化条
  const colors=data.colors;
  const metricsHtml=data.metrics.map((m,i)=>{
    const c=colors[i%colors.length];
    const pct=m.pct||0;
    return '<div class="wdo-metric" style="--c1:'+c[0]+';--c2:'+c[1]+'">'+
      '<div class="wdo-metric-head"><span class="wdo-metric-emoji">'+m.icon+'</span><span class="wdo-metric-tag">'+m.tag+'</span></div>'+
      '<div class="wdo-metric-num">'+m.num+'</div>'+
      '<div class="wdo-metric-label">'+m.label+'</div>'+
      '<div class="wdo-metric-bar"><div class="wdo-metric-bar-fill" data-pct="'+pct+'" style="background:linear-gradient(90deg,'+c[0]+','+c[1]+')"></div></div>'+
    '</div>';
  }).join('');
  // 数据概览区主按钮（左侧）：始终是「下载全部」（zip 已排除 xlsx，下载完整启动包）
  const dlBtnHtml='<button class="wdo-dl-btn" onclick="downloadZip()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载全部</button>';
  const dlSmallHtml=hasOnlineDoc
    ? (isNewPackageDoc(goal.id)?newBadge('<button class="wdo-dl-btn-small" onclick="openPackageOnlineView()" title="在线查看"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>在线查看</button>'):'<button class="wdo-dl-btn-small" onclick="openPackageOnlineView()" title="在线查看"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>在线查看</button>')
    : '<button class="wdo-dl-btn-small" onclick="downloadZip()" title="下载数据"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载数据</button>';
  el.innerHTML='<div class="wdo-card wdo-theme-'+goal.id+'">'+
    '<div class="wdo-left">'+
      '<div class="wdo-left-eyebrow">数据文件汇总入口</div>'+
      '<div class="wdo-left-headline">本启动包<br>资源库</div>'+
      '<div class="wdo-left-count">'+files.length+' <span>个文件</span></div>'+
      '<div class="wdo-left-cats">'+catHtml+'</div>'+
      dlBtnHtml+
    '</div>'+
    '<div class="wdo-right">'+
      '<div class="wdo-right-head">'+
        '<div>'+
          '<div class="wdo-right-eyebrow">核心数据资产</div>'+
          '<div class="wdo-right-title">实时数据<br>规模与覆盖</div>'+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">'+
          '<div class="wdo-status"><span class="wdo-status-dot"></span>'+data.status+'</div>'+
          dlSmallHtml+
        '</div>'+
      '</div>'+
      '<div class="wdo-metrics">'+metricsHtml+'</div>'+
    '</div>'+
  '</div>';
  // 入场动画：条形填充
  setTimeout(()=>{
    el.querySelectorAll('.wdo-metric-bar-fill').forEach(b=>{
      const pct=parseInt(b.dataset.pct||0,10);
      b.style.width=pct+'%';
    });
  },50);
}

const DATA_OVERVIEW={
  kaoyan:{
    metrics:[
      {num:'1,308',label:'院校总覆盖',icon:'🎓',tag:'985:38·211:112·双一流:144',pct:100},
      {num:'20',label:'已核报录比',icon:'📊',tag:'985:7/39·211:6/112',pct:25},
      {num:'+1',label:'今日新增',icon:'📈',tag:'上财 5.1:1',pct:5},
      {num:'77',label:'可直达入口',icon:'🔗',tag:'各校研招网/官方',pct:6},
      {num:'≈4.1:1',label:'竞争热度(985)',icon:'🔥',tag:'兰大2.1:1 · 东大5.9:1',pct:40},
      {num:'6',label:'可筛选维度',icon:'🔍',tag:'层次/省份/性质/标签…',pct:60}
    ],
    status:'数据持续更新 · 2026 最新招生信息已收录',
    colors:[['#7c3aed','#a78bfa'],['#6366f1','#818cf8'],['#0891b2','#22d3ee'],['#10b981','#34d399'],['#f59e0b','#fbbf24'],['#ec4899','#f472b6']]
  },
  zhaopin:{
    metrics:[
      {num:'513',label:'央国企/事业单位覆盖',icon:'🏢',tag:'含央企总部及子公司',pct:85},
      {num:'5,000+',label:'招聘岗位信息量',icon:'💼',tag:'校招+社招',pct:78},
      {num:'7',label:'行业覆盖门类',icon:'🏭',tag:'能源/通信/金融/科技',pct:70},
      {num:'82',label:'官方招聘系统接入',icon:'🔗',tag:'集团+子公司官网',pct:90},
      {num:'28',label:'当前可投岗位',icon:'🚀',tag:'2026 校招进行中',pct:55},
      {num:'1,582',label:'可点击投递入口',icon:'🎯',tag:'一键直达官网',pct:95}
    ],
    status:'数据持续更新 · 2026-07-14 最新招聘快照已收录',
    colors:[['#ea580c','#fb923c'],['#dc2626','#f87171'],['#9333ea','#c084fc'],['#0284c7','#38bdf8'],['#059669','#34d399'],['#eab308','#facc15']]
  }
};
var STATS_CACHE=null;
function loadPackageStats(){
  var el=document.getElementById('wsDataOverview');
  if(!el)return;
  var goal=getCurrentGoal();
  if(!goal)return;
  if(goal.id!=='zhaopin'){STATS_CACHE=null;renderDataOverview();return}
  fetch(url('stats.json'),{cache:'no-cache'})
    .then(function(r){if(!r.ok)throw new Error('no stats');return r.json()})
    .then(function(d){
      STATS_CACHE=d;
      renderDataOverview();
    })
    .catch(function(){STATS_CACHE=null;renderDataOverview()});
}

function renderDayCounter(){
  const goal=getCurrentGoal();
  const dayLabel=document.getElementById('wsDayLabel');
  const dayNum=document.getElementById('wsDayNum');
  const bar=document.getElementById('wsDayBarFill');
  const target=document.getElementById('wsDayTarget');
  const targetNum=document.getElementById('wsDayTargetNum');
  if(!goal)return;
  // 备考天数 = 距 joinTime 的天数
  const startMs=currentUser?.joinTime||Date.now();
  const dayMs=86400000;
  const daysPassed=Math.max(0,Math.floor((Date.now()-startMs)/dayMs));
  if(dayLabel) dayLabel.textContent=goal.id==='kaoyan'?'备考天数':(goal.id==='interview'?'准备天数':'进行天数');
  if(dayNum) dayNum.textContent=daysPassed;
  // 进度条
  let percent=0;
  if(goal.examDate){
    const examMs=new Date(goal.examDate).getTime();
    const totalDays=Math.floor((examMs-startMs)/dayMs);
    if(totalDays>0){
      percent=Math.min(100,Math.max(0,daysPassed/totalDays*100));
    }
  }
  if(bar) bar.style.width=percent+'%';
  // 目标日期
  if(target){
    if(goal.examDate){
      const examMs=new Date(goal.examDate).getTime();
      const daysToExam=Math.max(0,Math.ceil((examMs-Date.now())/dayMs));
      const year=new Date(goal.examDate).getFullYear();
      if(targetNum) targetNum.textContent=daysToExam;
      target.innerHTML='距离 '+year+' '+goal.name+'还有 <strong id="wsDayTargetNum">'+daysToExam+'</strong> 天';
    }else{
      target.innerHTML='<span style="opacity:.85">⏳ 持续进行中</span>';
    }
  }
}

function showGoalSwitcher(){
  const ov=document.getElementById('gsOverlay');
  if(!ov)return;
  renderGoalList();
  requestAnimationFrame(()=>ov.classList.add('open'));
}

function closeGoalSwitcher(e){
  if(e&&e.target!==e.currentTarget)return;
  const ov=document.getElementById('gsOverlay');
  if(ov)ov.classList.remove('open');
}

function renderGoalList(){
  const el=document.getElementById('gsList');
  if(!el)return;
  el.innerHTML=Object.values(GOALS).map(g=>{
    const isCurrent=g.id===currentGoalId;
    const disabled=!g.active;
    return `<div class="gs-item ${isCurrent?'active':''} ${disabled?'disabled':''}" onclick="${disabled?'':'switchGoal(\''+g.id+'\');closeGoalSwitcher();'}">
      <div class="gs-icon">${g.icon}</div>
      <div class="gs-item-info">
        <div class="gs-item-name">${g.name} ${isCurrent?'<span class="gs-item-badge">当前</span>':(disabled?'<span class="gs-item-badge soon">即将上线</span>':'')}</div>
        <div class="gs-item-desc">${g.desc}</div>
        <div class="gs-item-quote">${g.quote}</div>
      </div>
      <div class="gs-item-action">${isCurrent?'✓ 已选中':'切换 →'}</div>
    </div>`;
  }).join('');
}

function getStepFiles(stepId){
  const files=getCurrentFiles();
  return files.filter(f=>f.step===stepId);
}

function getStepAcquiredCount(stepId){
  const files=getStepFiles(stepId);
  return files.filter(f=>userSpace.some(u=>u.name===f.name)).length;
}

function openMyTargetsLabel(){
  var id=currentGoalId;
  if(id==='zhaopin') return '收藏我的目标企业';
  if(id==='kaoyan') return '收藏我的目标院校';
  return '收藏我的目标';
}
function updateMyTargetsLabel(){
  var el=document.getElementById('wsSideMyTargets');
  var ic=document.getElementById('wsSideMyTargetsIcon');
  if(!el)return;
  var id=currentGoalId;
  if(id==='zhaopin'){el.textContent='收藏我的目标企业';if(ic)ic.textContent='🏢';}
  else if(id==='kaoyan'){el.textContent='收藏我的目标院校';if(ic)ic.textContent='🎓';}
  else{el.textContent='收藏我的目标';if(ic)ic.textContent='📄';}
}
function updateScopeNotice(){
  var el=document.getElementById('wsScopeNotice');
  if(!el)return;
  var id=currentGoalId;
  if(id==='zhaopin'){
    el.classList.remove('hidden');
    el.innerHTML='<span class="ws-scope-notice-icon">🎯</span><div class="ws-scope-notice-text"><strong>本启动包仅限纯央企</strong>（含其下属分子公司），<strong>不含地方性央企和国企</strong>。地方性版本将独立推出。</div>';
  }else{
    el.classList.add('hidden');
  }
}

function isFileAcquired(name){
  return userSpace.some(u=>u.name===name);
}
// 渲染当前起点小卡
function renderStartCard(){
  var card=document.getElementById('wsStartCard');
  var icon=document.getElementById('wsStartIcon');
  var nameEl=document.getElementById('wsStartName');
  var sub=document.getElementById('wsStartSub');
  if(!card||!nameEl)return;
  var state=JSON.parse(localStorage.getItem('qdbp_start_state')||'{}');
  var goal=getCurrentGoal();
  var pkgData=goal?state[goal.id]:null;
  if(pkgData&&pkgData.currentTarget){
    card.classList.add('show');
    var ct=pkgData.currentTarget;
    var cn=ct.name||'',role=ct.role||'';
    if(icon)icon.textContent=cn.charAt(0)||'企';
    nameEl.textContent=cn+(role?' · '+role:'');
    sub.textContent='今天先完成：核验一个当前招聘机会';
  }else{
    card.classList.remove('show');
  }
}

function openWorkspace(){trackClick('进入工作区');
  if(!isLoggedIn()){showLoginModal();return}
  _restoreUS(); // 确保浏览器级变量反映当前账号（防止串号）
  const ws=document.getElementById('workspace');
  if(!ws)return;
  // 从 localStorage 读取已选包（优先 qdbp_pkg，缺失时回退到已抽中的包，保证进工作区显示用户所选包）
  var storedPkg=localStorage.getItem('qdbp_pkg');
  if(!storedPkg||!GOALS[storedPkg]||!GOALS[storedPkg].active){
    try{
      var drawnPkgs=JSON.parse(localStorage.getItem('qdbp_drawn_packages')||'[]');
      for(var _i=0;_i<drawnPkgs.length;_i++){
        if(GOALS[drawnPkgs[_i]]&&GOALS[drawnPkgs[_i]].active){storedPkg=drawnPkgs[_i];break;}
      }
    }catch(e){}
  }
  if(storedPkg&&GOALS[storedPkg]&&GOALS[storedPkg].active){
    switchGoal(storedPkg);
  }
  // 同步用户信息
  document.getElementById('wsAvatar').textContent=(currentUser?.name?.[0]||'U').toUpperCase();
  document.getElementById('wsUserName').textContent=currentUser?.name||'—';
  document.getElementById('wsUserEmail').textContent=currentUser?.email||'—';
  // 更新侧边栏启动包信息
  const goal=getCurrentGoal();
  const si=document.getElementById('wsSidePackIcon');
  const sn=document.getElementById('wsSidePackName');
  if(si&&goal) si.textContent=goal.icon;
  if(sn&&goal) sn.textContent=goal.name;
  // 动态更新「我的目标院校/企业」标签
  updateMyTargetsLabel();
  // 动态更新「启动包范围说明」（仅央企显示）
  updateScopeNotice();
  // 渲染数据总览
  renderDataOverview();
  // 渲染当前起点小卡
  renderStartCard();
  loadPackageStats();
  // 渲染个人区域
  renderGoalCard();
  // 更新横幅标题
  const bannerTitle=document.getElementById('wsBannerTitle');
  if(bannerTitle&&goal) bannerTitle.textContent='你的'+goal.name+'已经准备好';
  // 渲染总览
  renderOverview();
  // 渲染步骤
  renderWorkspaceSteps();
  updateWorkspaceStats();
  // 渲染所有阶段
  renderAllStages();
  // 展示本包最近更新时间
  loadPackageUpdated();
  // 显示
  ws.style.display='flex';
  document.body.style.overflow='hidden';
  // 将导航栏提到工作区之上，确保导航可点击
  const navBar=document.getElementById('navbar');
  if(navBar) navBar.classList.add('nav-top');
  // 工作区下移到导航栏下方，避免导航遮挡工作区头部（含退出按钮）
  ws.style.top='52px';
}

function renderOverview(){
  const el=document.getElementById('wsOverviewFlow');
  if(!el)return;
  const steps=getCurrentSteps();
  if(!steps.length){
    el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px 20px;color:var(--text-tertiary);font-size:13px;">该目标暂未配置步骤</div>';
    return;
  }
  el.innerHTML=steps.map(s=>{
    const files=getStepFiles(s.id);
    const acquired=getStepAcquiredCount(s.id);
    const total=files.length;
    const completed=total>0&&acquired===total;
    const active=s.id===currentStep;
    return `<div class="ws-ov-step ${active?'active':''} ${completed?'completed':''}" onclick="switchStep(${s.id})">
      <div class="ws-ov-circle">${completed?'✓':s.icon}</div>
      <div class="ws-ov-name">${s.name}</div>
      <div class="ws-ov-desc">${total} 个文件</div>
      <div class="ws-ov-count">${acquired}/${total} 已获取</div>
    </div>`;
  }).join('');
  // 同步标题和统计
  const goal=getCurrentGoal();
  const tEl=document.querySelector('.ws-overview-title h3');
  if(tEl) tEl.textContent=goal.name+'全流程总览';
  const sEl=document.querySelector('.ws-overview-sub');
  if(sEl) sEl.textContent=goal.desc;
}

function closeWorkspace(){
  const ws=document.getElementById('workspace');
  if(ws){
    ws.style.display='none';
    ws.style.top='';  // 恢复 inset:0
  }
  document.body.style.overflow='';
  // 恢复导航栏层级
  const navBar=document.getElementById('navbar');
  if(navBar) navBar.classList.remove('nav-top');
}
function toggleSidebar(){
  var b=document.getElementById('wsBody');
  if(!b)return;
  var collapsed=b.classList.toggle('sidebar-collapsed');
  var t=document.getElementById('wsSideToggle');
  if(t)t.textContent=collapsed?'›':'‹';
}

function goHome(){
  closeWorkspace();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderWorkspaceSteps(){
  const el=document.getElementById('wsSteps');
  if(!el)return;
  const steps=getCurrentSteps();
  if(!steps.length){
    el.innerHTML='<div style="padding:20px 10px;font-size:12px;color:var(--text-tertiary);text-align:center;">该目标暂未配置步骤</div>';
    return;
  }
  el.innerHTML=steps.map(s=>{
    const files=getStepFiles(s.id);
    const acquired=getStepAcquiredCount(s.id);
    const total=files.length;
    const completed=total>0&&acquired===total;
    return `<div class="ws-step ${completed?'completed':''}" data-step="${s.id}" onclick="scrollToStage(${s.id})">
      <div class="ws-step-icon">${completed?'✓':s.id}</div>
      <div class="ws-step-info">
        <div class="ws-step-name">${s.name}</div>
        <div class="ws-step-progress">${acquired}/${total} 已下载</div>
      </div>
    </div>`;
  }).join('');
}

function switchStep(stepId,scrollTop){
  // Scroll to the stage section instead of switching view
  scrollToStage(stepId);
}
function scrollToStage(stepId){
  const el=document.getElementById('ws-stage-'+stepId);
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'});
    // Highlight the sidebar step
    document.querySelectorAll('.ws-step').forEach(s=>s.classList.remove('active'));
    const stepEl=document.querySelector('.ws-step[data-step="'+stepId+'"]');
    if(stepEl) stepEl.classList.add('active');
  }
  // Close AI popup if open
  const popup=document.getElementById('aiChatPopup');
  if(popup&&popup.style.display==='block') toggleAiChat();
}

function renderAllStages(){
  const el=document.getElementById('wsStages');
  if(!el)return;
  var goal=getCurrentGoal();
  if(!goal)return;
  const steps=getCurrentSteps();
  if(!steps.length){
    el.innerHTML='<div style="text-align:center;padding:60px 20px;color:var(--text-tertiary);font-size:13px">暂无可用资源</div>';
    return;
  }
  el.innerHTML=steps.map(s=>{
    const files=getStepFiles(s.id);
    const acquired=getStepAcquiredCount(s.id);
    const total=files.length;
    if(!total) return '';
    const filesHtml=files.map(f=>{
      const t=typ(f.name);
      const idNum=fileId(f.name);
      const title=fileTitle(f.name);
      const downloaded=isFileAcquired(f.name);
      const safeName=f.name.replace(/'/g,"\\'");
      const meta=getCurrentFileMeta(idNum)||{desc:'',points:[],freq:'持续更新',realtime:false};
      const sizeInfo=fmt(f.size);
      const sizeMatch=sizeInfo.match(/^([\d.]+)\s*(\D+)$/);
      const sizeNum=sizeMatch?sizeMatch[1]:sizeInfo;
      const sizeUnit=sizeMatch?sizeMatch[2]:'';
      const pointsHtml=(meta.points||[]).map((p,i)=>'<div class="ws-file-point"><span class="ws-file-point-num">'+(i+1)+'</span><span>'+p+'</span></div>').join('');
      var isXlsx=!!f.online;
      var isPdf=typ(f.name)==='pdf';
      var isNew=isNewPackageFile(goal.id,f.name);
      var btnHtml;
      var xlsxBtn='<button class="ws-file-btn online" onclick="openOnlineView(\''+safeName+'\')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>在线查看</button>';
      var resumeBtn='<button class="ws-file-btn online" onclick="goGetResume()"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 7-7"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>在线查看</button>';
      var pdfPreview='<button class="ws-file-btn preview" onclick="previewFile(\''+safeName+'\')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>预览</button>';
      var pdfDown='<button class="ws-file-btn primary" onclick="downloadSingleFile(\''+safeName+'\')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载</button>';
      var otherDown='<button class="ws-file-btn '+(downloaded?'success':'primary')+'" onclick="downloadSingleFile(\''+safeName+'\')">'+
        (downloaded?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>重新下载'
        :'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载文件')+
      '</button>';
      if(isXlsx){
        btnHtml=isNew?newBadge(xlsxBtn):xlsxBtn;
      }else if(isPdf){
        btnHtml=pdfPreview+(isNew?newBadge(pdfDown):pdfDown);
      }else if(f.resumeEntry){
        btnHtml=isNew?newBadge(resumeBtn):resumeBtn;
      }else{
        btnHtml=isNew?newBadge(otherDown):otherDown;
      }
      return `<div class="ws-file ${downloaded?'downloaded':''}">
        <div class="ws-file-head">
          <div class="ws-file-icon ${t}">${t==='pdf'?'PDF':'XLS'}</div>
          <div class="ws-file-meta">
            <div class="ws-file-id">${idNum}</div>
            <div class="ws-file-title">${title}</div>
          </div>
          <div class="ws-file-size">${sizeNum}<span class="ws-file-size-unit">${sizeUnit}</span></div>
        </div>
        ${meta.desc?'<div class="ws-file-desc">'+meta.desc+'</div>':''}
        ${pointsHtml?'<div class="ws-file-points">'+pointsHtml+'</div>':''}
        <div class="ws-file-foot">
          <span class="ws-file-freq ${meta.realtime?'realtime':''}">${meta.realtime?'●':''}${meta.freq}</span>
          ${btnHtml}
        </div>
      </div>`;
    }).join('');
    return `<div class="ws-stage" id="ws-stage-${s.id}">
      <div class="ws-stage-head">
        <div class="ws-stage-left">
          <div class="ws-stage-num">${s.icon} ${s.name}</div>
          <div class="ws-stage-desc">${s.desc}</div>
          <div class="ws-stage-order">推荐使用顺序：第 1—${total} 个文件</div>
        </div>
        <div class="ws-stage-right">
          <div class="ws-stage-count">${total} 个文件 · ${acquired} 已下载</div>
          <button class="ws-stage-btn" onclick="downloadStageFiles(${s.id})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            下载本阶段全部文件
          </button>
        </div>
      </div>
      <div class="ws-files">${filesHtml}</div>
    </div>`;
  }).join('');
}

function updateWorkspaceStats(){
  const totalFiles=getCurrentFiles().length;
  const downloadedCount=userSpace.length;
  // 文件下载进度
  document.getElementById('wsProgressNum').textContent=downloadedCount+'/'+totalFiles;
  document.getElementById('wsProgressBar').style.width=totalFiles?(downloadedCount/totalFiles*100)+'%':'0%';
}

// PDF 在线预览（浏览器新标签页打开）
function previewFile(name){
  window.open(url(name),'_blank');
}

async function downloadSingleFile(name){
  if(!isLoggedIn()){showLoginModal();return}
  if(!requireDownloadAccess(function(){downloadSingleFile(name)}))return;
  if(!isFileAcquired(name)){
    const existing=userSpace.find(s=>s.name===name);
    if(!existing){
      userSpace.unshift({name:name,time:Date.now()});
      if(!sbReady) localStorage.setItem('qdbp_space',JSON.stringify(userSpace));
    }
    if(sbReady&&currentUser?.id){
      try{
        await supabaseClient.from('user_files').insert({user_id:currentUser.id,file_name:name});
      }catch(e){console.warn('云端记录失败:',e)}
    }
  }
  try{
    forceDownload(url(name),name);
    showToast('文件已开始下载');
  }catch(e){
    showToast('下载失败，请重试');
  }
  // 更新 UI
  updateWorkspaceStats();
  renderWorkspaceSteps();
  renderAllStages();
  updateMemberUI();
}

function downloadFile(name){
  forceDownload(url(name),name);
  showToast('正在下载：'+name.replace(/\.[^.]+$/,'').replace(/^\d+(-\d+)?｜/,''));
}

function downloadZip(){trackClick('全部下载');
  if(!requireDownloadAccess(downloadZip))return;
  const goal=getCurrentGoal();
  let zipName,label;
  if(currentGoalId==='kaoyan'){
    zipName='启点蓝图-考研择校启动包.zip';
    label='考研择校启动包';
  }else if(currentGoalId==='zhaopin'){
    zipName='启点蓝图-央企求职启动包.zip';
    label='央企求职启动包';
  }else{
    showToast('该启动包暂未提供打包下载');
    return;
  }
  forceDownload('files/'+getGoalPrefix()+encodeURIComponent(zipName),zipName);
  showToast('正在下载完整'+label+'…');
}
// 展示当前启动包最近更新时间（读取 files/<pkg>/updated.json）
function loadPackageUpdated(){
  const el=document.getElementById('pkgUpdated');
  if(!el)return;
  fetch(url('updated.json'),{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(d=>{
      if(d&&d.updated){
        el.textContent='本包最近更新：'+d.updated+'（共 '+d.total+' 个文件）';
        el.style.display='block';
      }else{
        el.style.display='none';
      }
    })
    .catch(()=>{el.style.display='none';});
}
function downloadStageFiles(stepId){
  if(!requireDownloadAccess(function(){downloadStageFiles(stepId)}))return;
  const goal=getCurrentGoal();
  const files=getStepFiles(stepId);
  if(!files.length){showToast('该阶段暂无文件');return}
  // 在线查看类文件（xlsx 且当前包已配置腾讯文档）不随批量下载，改为跳在线查看
  const isOnlineOnly=f=>!!f.online&&ONLINE_DOCS[goal.id];
  const onlineFiles=files.filter(isOnlineOnly);
  const dlFiles=files.filter(f=>!isOnlineOnly(f));
  // Batch trigger downloads one by one
  dlFiles.forEach(f=>{
    if(!isFileAcquired(f.name)){
      userSpace.unshift({name:f.name,time:Date.now()});
      if(!sbReady) localStorage.setItem('qdbp_space',JSON.stringify(userSpace));
    }
    if(sbReady&&currentUser?.id){
      supabaseClient.from('user_files').insert({user_id:currentUser.id,file_name:f.name}).catch(()=>{});
    }
    forceDownload(url(f.name),f.name);
  });
  if(onlineFiles.length){
    const docUrl=ONLINE_DOCS[goal.id];
    if(docUrl) window.open(docUrl,'_blank');
  }
  let msg='正在下载'+dlFiles.length+' 个文件…';
  if(onlineFiles.length) msg+='（在线查看文件已在浏览器新标签打开）';
  showToast(msg);
  updateWorkspaceStats();
  renderWorkspaceSteps();
  renderAllStages();
}


function showDownloads(){
  showToast('查看我的下载记录（功能开发中）');
  // Scroll to stages
  const stages=document.getElementById('wsStages');
  if(stages) stages.scrollIntoView({behavior:'smooth'});
}

// ════ 下载口令 / 选包 / 在线查看 权限控制 ════
const PACKAGE_CODES={
  kaoyan:'888888',
  zhaopin:'888888'
};
const ONLINE_DOCS={
  zhaopin:'https://docs.qq.com/sheet/DT2thWGdUS3pzTXJP',
  kaoyan:'https://docs.qq.com/sheet/DT0N6RmZXREpJWGJG'
};
// 文件/文档更新版本戳（NEW 标签依据，7 天内显示「NEW」）
// 我每次更新文件时手动更新这里的时间戳
const FILE_VERSIONS={
  zhaopin:{
    onlineDoc:'2026-07-18T08:47',
    files:{
      '02｜央企招聘机会表_数据快照_2026-07-18.xlsx':'2026-07-18T08:47'
    }
  },
  kaoyan:{
    onlineDoc:'2026-07-18T16:13',
    files:{
      '01｜考研择校全流程导航.pdf':'2026-07-18T16:13'
    }
  }
};
function isNewPackageDoc(pkgId,days){
  if(!days)days=7;
  var pkg=FILE_VERSIONS[pkgId];
  if(!pkg||!pkg.onlineDoc)return false;
  var ts=new Date(pkg.onlineDoc).getTime();
  if(isNaN(ts))return false;
  return Date.now()-ts<days*864e5;
}
function isNewPackageFile(pkgId,name,days){
  if(!days)days=7;
  var pkg=FILE_VERSIONS[pkgId];
  if(!pkg||!pkg.files||!pkg.files[name])return false;
  var ts=new Date(pkg.files[name]).getTime();
  if(isNaN(ts))return false;
  return Date.now()-ts<days*864e5;
}
function newBadge(inner){return '<div class="btn-new-wrap"><span class="new-badge">NEW</span>'+inner+'</div>'}
function isOnlineFile(name){return name.toLowerCase().endsWith('.xlsx')}
function openOnlineView(name){
  if(!isLoggedIn()){showLoginModal();return}
  var goal=getCurrentGoal();
  if(!goal){showToast('请先选择启动包');return}
  if(!requireDownloadAccess(function(){openOnlineView(name)}))return;
  var url=ONLINE_DOCS[goal.id];
  if(url){window.open(url,'_blank')}else{showToast('该包暂未开放在线查看')}
}
// 数据概览区「在线查看」按钮：跳当前包的腾讯文档（复用口令校验）
function openPackageOnlineView(){
  if(!isLoggedIn()){showLoginModal();return}
  var goal=getCurrentGoal();
  if(!goal){showToast('请先选择启动包');return}
  if(!requireDownloadAccess(function(){openPackageOnlineView()}))return;
  var url=ONLINE_DOCS[goal.id];
  if(url){window.open(url,'_blank')}else{showToast('该包暂未开放在线查看')}
}
function getUnlocked(){
  try{return JSON.parse(localStorage.getItem('qdbp_unlocked')||'{}')}catch(e){return{}}
}
function saveUnlocked(obj){
  localStorage.setItem('qdbp_unlocked',JSON.stringify(obj));
}
function isPackageUnlocked(id){
  var u=getUnlocked();
  return u[id]===true;
}
function showDownloadCodeModal(){
  var goal=getCurrentGoal();
  if(!goal){showToast('请先选择启动包');return;}
  var title=document.querySelector('.dc-title');
  var sub=document.querySelector('.dc-sub');
  var input=document.getElementById('dcInput');
  var err=document.getElementById('dcError');
  if(title)title.textContent='输入「'+goal.name+'」下载口令';
  if(sub)sub.textContent='该启动包需要口令验证后才能下载文件，请输入正确口令';
  if(input){input.value='';input.focus()}
  if(err)err.style.display='none';
  document.getElementById('dcOverlay').classList.add('open');
}
function closeDownloadCode(){
  document.getElementById('dcOverlay').classList.remove('open');
}
function verifyDownloadCode(){
  var goal=getCurrentGoal();
  var input=document.getElementById('dcInput');
  var err=document.getElementById('dcError');
  var code=(input?input.value.trim():'').toLowerCase();
  // 1. 添加新启动包流程（带 pkgId 参数的回调）
  if(window.__pendingPkgVerify){
    var cb=window.__pendingPkgVerify;
    window.__pendingPkgVerify=null;
    cb(code);
    return;
  }
  // 2. 下载校验流程
  if(!goal){closeDownloadCode();return;}
  var expected=PACKAGE_CODES[goal.id];
  if(!expected){if(err){err.textContent='该包暂未设置口令';err.style.display='block'}return;}
  if(code===expected){
    var u=getUnlocked();
    u[goal.id]=true;
    saveUnlocked(u);
    closeDownloadCode();
    if(retryDownload){
      var fn=retryDownload;
      retryDownload=null;
      setTimeout(fn,100);
    }else{
      showToast('口令正确，已解锁下载！');
    }
  }else{
    if(err){err.textContent='口令错误，请重试';err.style.display='block'}
  }
}
var retryDownload=null;
function requireDownloadAccess(downloadFn){
  if(!isLoggedIn()){showLoginModal();return false;}
  var goal=getCurrentGoal();
  if(!goal){showToast('请先选择启动包');return false;}
  if(isPackageUnlocked(goal.id))return true;
  retryDownload=downloadFn;
  showDownloadCodeModal();
  return false;
}

// ════ 选包弹窗 ════
function showPackageSelector(){
  var overlay=document.getElementById('psOverlay');
  var lastPkg=localStorage.getItem('qdbp_pkg');
  var hasSelection=lastPkg&&GOALS[lastPkg]&&GOALS[lastPkg].active&&isPackageUnlocked(lastPkg);
  // 新用户（无已选包）必须选一个才能进入，禁止关闭弹窗
  if(hasSelection){
    overlay.classList.remove('ps-force');
  }else{
    overlay.classList.add('ps-force');
  }
  overlay.classList.add('open');
  renderPackageGrid();
}
function closePackageSelector(bypass){
  var overlay=document.getElementById('psOverlay');
  // 新用户强制模式下，只有程序内部（选包后）可关闭；手动关闭被拦截
  if(!bypass && overlay.classList.contains('ps-force')){
    showToast('请先选择一个启动包进入');
    return;
  }
  overlay.classList.remove('open');
  // 老会员主动关闭弹窗 → 直接进入上次选的包
  if(!bypass){
    var lastPkg=localStorage.getItem('qdbp_pkg');
    if(lastPkg&&GOALS[lastPkg]&&GOALS[lastPkg].active){
      openWorkspace();
    }
  }
}
function renderPackageGrid(){
  var grid=document.getElementById('psGrid');
  if(!grid)return;
  grid.innerHTML='';
  var lastPkg=localStorage.getItem('qdbp_pkg'); // 上次登录/选择的包（老会员标签）
  var activeCount=0, total=0;
  for(var k in GOALS){
    (function(id){
      var g=GOALS[id];
      total++;
      if(g.active) activeCount++;
      var card=document.createElement('div');
      card.className='ps-card'+(g.active?'':' disabled');
      var unlocked=isPackageUnlocked(id);
      var isLast=(id===lastPkg)&&g.active;
      var badgeHtml;
      if(!g.active){
        badgeHtml='<div class="ps-card-badge soon">即将推出</div>';
      }else if(isLast){
        badgeHtml='<div class="ps-card-badge last">上次登录</div>';
      }else if(unlocked){
        badgeHtml='<div class="ps-card-badge" style="background:rgba(16,185,74,.1);color:#059669">已添加</div>';
      }else{
        badgeHtml='<div class="ps-card-badge">已上线</div>';
      }
      card.innerHTML=
        '<div class="ps-card-icon">'+(g.icon||'📦')+'</div>'+
        '<div class="ps-card-name">'+(g.name||'')+'</div>'+
        '<div class="ps-card-desc">'+(g.desc||'')+'</div>'+
        badgeHtml;
      if(g.active){
        card.onclick=function(){selectPackage(id)};
      }else{
        card.onclick=function(){showToast(g.name+' 即将上线，敬请期待')};
      }
      grid.appendChild(card);
    })(k);
  }
  // 副标题：已上线包数量
  var sub=document.querySelector('.ps-sub');
  if(sub) sub.textContent='共 '+activeCount+' 个启动包已上线，请选择你当前最需要的进入。后续可切换，下载需对应口令。';
  // 超过一屏（>4 个 = 2×2）才提示向下滚动
  var hint=document.getElementById('psScrollHint');
  if(hint) hint.style.display = activeCount>4 ? 'block':'none';
}
function selectPackage(id){
  var g=GOALS[id];
  if(!g||!g.active)return;
  // 如果已经解锁，直接切换（不需要口令）
  if(isPackageUnlocked(id)){
    localStorage.setItem('qdbp_pkg',id);
    closePackageSelector(true);
    openWorkspace();
    showToast('已进入：'+g.name);
    afterSelectPackage();
    return;
  }
  // 还未解锁 → 关闭选包弹窗 → 弹口令弹窗 → 通过后加入到已解锁 + 进入
  closePackageSelector(true);
  var onVerified=function(){
    var u=getUnlocked();
    u[id]=true;
    saveUnlocked(u);
    localStorage.setItem('qdbp_pkg',id);
    openWorkspace();
    showToast('已添加：'+g.name);
    afterSelectPackage();
  };
  // 重用 verifyDownloadCode 的成功回调机制
  showDownloadCodeModalForPackage(id,onVerified);
}
// 选包完成后：若登录前触发了某文件下载（pendingDownload），在此续传
function afterSelectPackage(){
  if(window.__pendingPostSelect){
    var f=window.__pendingPostSelect;
    window.__pendingPostSelect=null;
    grantAccess(f);
  }
}
function showDownloadCodeModalForPackage(pkgId,onSuccess){
  var g=GOALS[pkgId];
  if(!g)return;
  var title=document.querySelector('.dc-title');
  var sub=document.querySelector('.dc-sub');
  var input=document.getElementById('dcInput');
  var err=document.getElementById('dcError');
  if(title)title.textContent='输入「'+g.name+'」启动口令';
  if(sub)sub.textContent='这是你第一次使用该启动包，输入正确口令后即可永久使用';
  if(input){input.value='';input.focus()}
  if(err)err.style.display='none';
  // 临时挂一次性回调
  window.__pendingPkgVerify=function(code){
    var expected=PACKAGE_CODES[pkgId];
    if(code===expected){
      closeDownloadCode();
      onSuccess();
    }else{
      if(err){err.textContent='口令错误，请重试';err.style.display='block'}
    }
  };
  document.getElementById('dcOverlay').classList.add('open');
}

// ════ 我的启动包 modal（已解锁列表） ════
function showMyPackages(){trackClick('我的启动包');
  document.getElementById('mpOverlay').classList.add('open');
  renderMyPackages();
}
function closeMyPackages(){
  document.getElementById('mpOverlay').classList.remove('open');
}
function renderMyPackages(){
  var list=document.getElementById('mpList');
  var sub=document.getElementById('mpSub');
  if(!list)return;
  var unlocked=getUnlocked();
  var ids=Object.keys(unlocked).filter(function(k){return unlocked[k]===true&&GOALS[k]&&GOALS[k].active});
  if(sub){
    sub.textContent=ids.length>0
      ?('你已添加 '+ids.length+' 个启动包，点选直接切换，'+'点加号添加新包（需要口令）。')
      :'你还没有添加任何启动包，点加号添加你的第一个启动包。';
  }
  var html='';
  ids.forEach(function(id){
    var g=GOALS[id];
    var isCurrent=id===currentGoalId;
    html+='<div class="mp-item '+(isCurrent?'current':'')+'" onclick="'+(isCurrent?'void(0)':'switchToUnlockedPackage(\''+id+'\')')+'">'+
      '<div class="mp-item-icon">'+(g.icon||'📦')+'</div>'+
      '<div class="mp-item-info">'+
        '<div class="mp-item-name">'+(g.name||'')+(isCurrent?' <span style="font-size:9px;background:var(--brand);color:#fff;padding:1px 6px;border-radius:100px;font-weight:600">当前</span>':'')+'</div>'+
        '<div class="mp-item-desc">'+(g.desc||'')+'</div>'+
      '</div>'+
      (isCurrent?'<div class="mp-item-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
        :'<div class="mp-item-action">切换 →</div>')+
    '</div>';
  });
  html+='<button class="mp-add" onclick="closeMyPackages();setTimeout(showPackageSelector,200)">'+
    '<div class="mp-add-icon">+</div>'+
    '<span>添加新启动包</span>'+
  '</button>';
  list.innerHTML=html;
}
function switchToUnlockedPackage(id){
  var g=GOALS[id];
  if(!g)return;
  closeMyPackages();
  localStorage.setItem('qdbp_pkg',id);
  switchGoal(id);
}
function showMorePackages(){
  showToast('更多启动包即将上线，敬请期待');
}
function showScenes(){
  showToast('更多场景即将上线，敬请期待');
}

/* ── 个人中心面板 ── */
function toggleProfilePanel(e){
  if(e)e.stopPropagation();
  const panel=document.getElementById('wsProfilePanel');
  if(!panel)return;
  panel.classList.toggle('open');
  if(panel.classList.contains('open')){
    setTimeout(()=>document.addEventListener('click',closeProfilePanelOutside),10);
  }
}
function closeProfilePanel(){
  const panel=document.getElementById('wsProfilePanel');
  if(panel)panel.classList.remove('open');
  document.removeEventListener('click',closeProfilePanelOutside);
}
function closeProfilePanelOutside(e){
  const btn=document.getElementById('wsUserBtn');
  if(btn&&!btn.contains(e.target))closeProfilePanel();
}
/* ── 更新日志 ── */
function showChangelog(){trackClick('更新日志');
  const ov=document.getElementById('changelogOverlay');
  if(ov)ov.classList.add('open');
}
function closeChangelog(){
  const ov=document.getElementById('changelogOverlay');
  if(ov)ov.classList.remove('open');
}
/* ── 使用帮助 ── */
function showHelp(){trackClick('使用帮助');
  const ov=document.getElementById('helpOverlay');
  if(ov)ov.classList.add('open');
}
function closeHelp(){
  const ov=document.getElementById('helpOverlay');
  if(ov)ov.classList.remove('open');
}
/* ── 个人信息 ── */
function showProfileInfo(){trackClick('个人信息');
  const ov=document.getElementById('profileOverlay');
  if(!ov)return;
  // 填充用户信息
  const name=document.getElementById('piName');
  const email=document.getElementById('piEmail');
  const avatar=document.getElementById('piAvatar');
  const downloads=document.getElementById('piDownloads');
  const since=document.getElementById('piSince');
  if(name)name.textContent=currentUser?currentUser.name||currentUser.email||'—':'—';
  if(email)email.textContent=currentUser?currentUser.email||'—':'—';
  if(avatar)avatar.textContent=(currentUser&&currentUser.email)?currentUser.email[0].toUpperCase():'D';
  // 统计已下载文件
  let dlCount=0;
  try{const stored=JSON.parse(localStorage.getItem('qdbp_downloaded')||'[]');dlCount=stored.length}catch(e){}
  if(downloads)downloads.textContent=dlCount||'0';
  if(since){
    const t=currentUser&&currentUser.created_at?new Date(currentUser.created_at):null;
    since.textContent=t?t.toLocaleDateString('zh-CN',{month:'short',day:'numeric'})||'—':'—';
  }
  ov.classList.add('open');
}
function closeProfileInfo(){
  const ov=document.getElementById('profileOverlay');
  if(ov)ov.classList.remove('open');
}
/* ── 我的下载 ── */
function showMyDownloads(){trackClick('我的下载');
  const ov=document.getElementById('downloadsOverlay');
  const list=document.getElementById('dlList');
  if(!ov||!list)return;
  let files=[];
  try{files=JSON.parse(localStorage.getItem('qdbp_downloaded')||'[]')}catch(e){}
  if(files.length===0){
    list.innerHTML='<p style="color:var(--text-tertiary);text-align:center;padding:20px 0">暂无下载记录</p>';
  }else{
    list.innerHTML=files.map(function(f,i){
      const date=f.time?new Date(f.time).toLocaleDateString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'+
        '<span style="font-size:18px">📄</span>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:12px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(f.name||'未知文件')+'</div>'+
          '<div style="font-size:10px;color:var(--text-tertiary)">'+date+'</div>'+
        '</div>'+
        '<button onclick="forceDownload(\''+(f.url||'')+'\',\''+(f.name||'')+'\')" style="padding:4px 12px;border:1px solid var(--border);border-radius:6px;background:transparent;cursor:pointer;font-size:11px;color:var(--text-secondary);flex-shrink:0">重新下载</button>'+
      '</div>';
    }).join('');
  }
  ov.classList.add('open');
}
function closeMyDownloads(){
  const ov=document.getElementById('downloadsOverlay');
  if(ov)ov.classList.remove('open');
}
/* ── 账号设置 ── */
function showAccountSettings(){trackClick('账号设置');
  const ov=document.getElementById('accountOverlay');
  if(ov)ov.classList.add('open');
}
function closeAccountSettings(){
  const ov=document.getElementById('accountOverlay');
  if(ov)ov.classList.remove('open');
}
/* ── 反馈建议 ── */
function showFeedback(){trackClick('反馈建议');
  const ov=document.getElementById('feedbackOverlay');
  const input=document.getElementById('feedbackInput');
  const contact=document.getElementById('feedbackContact');
  if(input)input.value='';
  if(contact)contact.value='';
  if(ov)ov.classList.add('open');
}
function closeFeedback(){
  const ov=document.getElementById('feedbackOverlay');
  if(ov)ov.classList.remove('open');
}
function submitFeedback(){
  const input=document.getElementById('feedbackInput');
  const contactEl=document.getElementById('feedbackContact');
  if(!input)return;
  const msg=input.value.trim();
  const contact=contactEl?contactEl.value.trim():'';
  if(!msg){showToast('请先输入反馈内容');return}
  const payload={
    message:msg,
    contact:contact,
    page:location.pathname||'/',
    user_id:(typeof currentUser!=='undefined'&&currentUser&&currentUser.id)?currentUser.id:null,
    ua:navigator.userAgent,
    ts:new Date().toISOString()
  };
  // 本地兜底：先存一份，确保不丢
  try{
    const list=JSON.parse(localStorage.getItem('qdbp_feedback')||'[]');
    list.push(payload);
    localStorage.setItem('qdbp_feedback',JSON.stringify(list.slice(-50)));
  }catch(e){}
  // 发送到飞书群（站长可见）
  if(FEISHU_FEEDBACK_WEBHOOK){
    const ts=new Date();
    const text='【启点蓝图·用户反馈】\n内容：'+msg+'\n联系方式：'+(contact||'未留')+'\n页面：'+(location.pathname||'/')+'\n时间：'+ts.toLocaleString('zh-CN');
    fetch(FEISHU_FEEDBACK_WEBHOOK,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({msg_type:'text',content:{text:text}})
    }).then(function(){
      showToast('感谢反馈，已收到！我们会认真改进 💪');
      closeFeedback();
    }).catch(function(){
      showToast('已暂存到本地，联网后会自动同步');
      closeFeedback();
    });
  }else{
    showToast('感谢反馈，已记录 💪');
    closeFeedback();
  }
}
/* ── 版本信息 ── */
function showVersionInfo(){trackClick('版本信息');
  const ov=document.getElementById('versionOverlay');
  if(ov)ov.classList.add('open');
}
function closeVersionInfo(){
  const ov=document.getElementById('versionOverlay');
  if(ov)ov.classList.remove('open');
}

/* ── 管理员后台（网站分析） ── */
function showAdminLogin(){
  const ov=document.getElementById('adminLoginOverlay');
  const inp=document.getElementById('adminPasswordInput');
  const err=document.getElementById('adminLoginError');
  if(err)err.style.display='none';
  if(inp)inp.value='';
  if(ov)ov.classList.add('open');
  setTimeout(function(){if(inp)inp.focus();},200);
}
function closeAdminLogin(){
  const ov=document.getElementById('adminLoginOverlay');
  if(ov)ov.classList.remove('open');
}
function submitAdminLogin(){
  const inp=document.getElementById('adminPasswordInput');
  const err=document.getElementById('adminLoginError');
  if(!inp)return;
  if(inp.value===ADMIN_PASSWORD){
    try{localStorage.setItem('qdbp_admin','1');}catch(e){}
    closeAdminLogin();
    showAdminDashboard();
  }else{
    if(err)err.style.display='block';
    inp.value='';
    inp.focus();
  }
}
/* ── 管理员后台（全屏独立页面） ── */
function adminLogout(){
  try{localStorage.removeItem('qdbp_admin');}catch(e){}
  closeAdminDashboard();
  showToast('已退出管理后台');
}
function closeAdminDashboard(){
  var ad=document.getElementById('adminDashboard');
  var ws=document.getElementById('workspace');
  if(ad)ad.style.display='none';
  if(ws)ws.style.display='flex';
}

// ═══ 简历工坊 ═══
var RESUME_DATA=[
  {id:'zhaopin',name:'央企求职',icon:'🏢',color:'#1B3A5C',desc:'中核/电网/中航/华润等央企针对性简历模板',unlocked:true,file:'resume-zhaopin.html'},
  {id:'kaoyan',name:'考研择校',icon:'🎓',color:'#6D28D9',desc:'985/211院校复试简历及学术简历模板',unlocked:false,file:''},
  {id:'waigi',name:'外企求职',icon:'🌏',color:'#0D9488',desc:'四大/快消等外企中英文简历模板',unlocked:false,file:''},
  {id:'bank',name:'银行求职',icon:'🏦',color:'#991B1B',desc:'国有行/股份行/政策行简历模板',unlocked:false,file:''},
  {id:'tech',name:'科技公司',icon:'💻',color:'#2563EB',desc:'BAT/字节/华为等科技大厂简历模板',unlocked:false,file:''}
];
function goGetResume(){
  if(typeof isLoggedIn==='function'&&!isLoggedIn()){
    if(typeof showLoginModal==='function')showLoginModal('');
    return;
  }
  openResumeWorkshop();
}
function openResumeWorkshop(){
  var ov=document.getElementById('resumeOverlay');
  if(!ov)return;
  ov.style.display='block';
  renderResumeCards();
}
function closeResumeWorkshop(){
  var ov=document.getElementById('resumeOverlay');
  if(ov)ov.style.display='none';
}
function renderResumeCards(){
  var grid=document.getElementById('rwGrid');
  if(!grid)return;
  grid.innerHTML=RESUME_DATA.map(function(d){
    var cls=d.unlocked?'rw-card unlocked':'rw-card locked';
    var status=d.unlocked?'<span class="badge ok">✅ 已解锁</span>':'<span class="badge lock">🔒 需购买</span>';
    var onclick=d.unlocked?'onclick="openResumeTemplate(\''+d.id+'\')"':'onclick="previewLockedResume()"';
    return '<div class="'+cls+'" '+onclick+'>'
      +'<div class="rw-card-icon">'+d.icon+'</div>'
      +'<div class="rw-card-title">'+d.name+'</div>'
      +'<div class="rw-card-desc">'+d.desc+'</div>'
      +'<div class="rw-card-status">'+status+'</div></div>';
  }).join('');
}
function openResumeTemplate(id){
  var d=RESUME_DATA.find(function(i){return i.id===id;});
  if(d&&d.file) window.open(d.file,'_blank');
  else showToast('该简历模板暂未上线');
}
function previewLockedResume(){
  showToast('购买对应启动包后即可解锁下载');
}

function showAdminDashboard(){
  var ad=document.getElementById('adminDashboard');
  var ws=document.getElementById('workspace');
  if(ws)ws.style.display='none';
  if(ad)ad.style.display='flex';
  loadAdminStats();
}
// Tab 切换
function switchAdTab(tab,el){
  document.querySelectorAll('.ad-nav-item').forEach(function(n){n.classList.remove('active');});
  if(el)el.classList.add('active');
  document.querySelectorAll('.ad-tab').forEach(function(t){t.classList.remove('active');});
  var target=document.getElementById('adTab'+tab.charAt(0).toUpperCase()+tab.slice(1));
  if(target)target.classList.add('active');
  // 营销 Tab：加载二维码
  if(tab==='marketing'){
    var qr=document.getElementById('adShareQR');
    if(qr&&!qr.src)qr.src='https://api.qrserver.com/v1/create-qr-code/?size=240x240&data='+encodeURIComponent('https://377701ffcb87465db084556a55110917.app.codebuddy.work/survey.html');
  }
}
function copyAdShareLink(){
  navigator.clipboard.writeText('https://377701ffcb87465db084556a55110917.app.codebuddy.work/survey.html').then(function(){
    showToast('链接已复制 ✅');
  }).catch(function(){showToast('复制失败');});
}
function loadAdminStats(){
  if(!sbReady||!supabaseClient){_adminShowError();return;}
  var today=new Date();today.setHours(0,0,0,0);
  var ts=today.toISOString();
  // 1. 总访问
  supabaseClient.from(ANALYTICS_TABLE).select('*',{count:'exact',head:true}).eq('event_type','visit')
    .then(function(r){var el=document.getElementById('adTotalVisits');if(el)el.textContent=(r&&r.count!=null)?String(r.count):'0';}).catch(function(){});
  // 2. 今日访问
  supabaseClient.from(ANALYTICS_TABLE).select('*',{count:'exact',head:true}).eq('event_type','visit').gte('created_at',ts)
    .then(function(r){var el=document.getElementById('adTodayVisits');if(el)el.textContent=(r&&r.count!=null)?String(r.count):'0';}).catch(function(){});
  // 3. 总点击
  supabaseClient.from(ANALYTICS_TABLE).select('*',{count:'exact',head:true}).eq('event_type','click')
    .then(function(r){var el=document.getElementById('adTotalClicks');if(el)el.textContent=(r&&r.count!=null)?String(r.count):'0';}).catch(function(){});
  // 4. 文件下载次数 + 活跃用户
  supabaseClient.from('user_files').select('user_id')
    .then(function(r){
      var dlEl=document.getElementById('adDownloads'),usEl=document.getElementById('adUsers');
      if(r&&r.data){
        if(dlEl)dlEl.textContent=String(r.data.length);
        var u={};r.data.forEach(function(d){if(d.user_id)u[d.user_id]=true;});
        var uc=Object.keys(u).length;
        if(usEl)usEl.textContent=String(uc);
        var sb=document.getElementById('adDownloadsSub');if(sb)sb.textContent='共 '+uc+' 位用户下载';
        var sb2=document.getElementById('adUsersSub');if(sb2)sb2.textContent=uc+' 位用户至少下载一次';
      }else{if(dlEl)dlEl.textContent='0';if(usEl)usEl.textContent='0';}
    }).catch(function(){});
  // 5. 模块点击排行（概览 + 数据分析 tab）
  supabaseClient.from('qdbp_analytics_stats').select('module,clicks').limit(20)
    .then(function(r){
      var rank=document.getElementById('adModuleRank'),badge=document.getElementById('adModuleBadge');
      var dRank=document.getElementById('adDataModuleRank'),dBadge=document.getElementById('adDataModuleBadge');
      var fill=function(el,b,data){
        if(!el)return;
        if(data&&data.length){if(b)b.textContent=String(data.length);el.innerHTML=data.map(function(d){return '<div class="ad-rank-item"><span class="ad-rank-name">'+escapeHtml(String(d.module||'未知'))+'</span><span class="ad-rank-count">'+String(Number(d.clicks))+'</span></div>';}).join('');}
        else{if(b)b.textContent='0';el.innerHTML='<p style="color:var(--text-tertiary);font-size:12px;text-align:center;padding:14px 0">暂无点击数据</p>';}
      };
      var data=r&&r.data?r.data:null;
      fill(rank,badge,data);
      fill(dRank,dBadge,data);
    }).catch(function(){});
  // 6. 页面访问排行（前端聚合，概览 + 数据分析 tab）
  supabaseClient.from(ANALYTICS_TABLE).select('page').eq('event_type','visit').limit(500)
    .then(function(r){
      var fill=function(el,b,data){
        if(!el)return;
        if(data&&data.length){var c={};data.forEach(function(d){var p=d.page||'/';c[p]=(c[p]||0)+1;});var s=Object.keys(c).sort(function(a,b2){return c[b2]-c[a];}).slice(0,20);if(b)b.textContent=String(s.length);el.innerHTML=s.map(function(p){return '<div class="ad-rank-item"><span class="ad-rank-name">'+escapeHtml(p)+'</span><span class="ad-rank-count">'+String(c[p])+'</span></div>';}).join('');}
        else{if(b)b.textContent='0';el.innerHTML='<p style="color:var(--text-tertiary);font-size:12px;text-align:center;padding:14px 0">暂无数据</p>';}
      };
      fill(document.getElementById('adPageRank'),document.getElementById('adPageBadge'),r&&r.data?r.data:null);
      fill(document.getElementById('adDataPageRank'),document.getElementById('adDataPageBadge'),r&&r.data?r.data:null);
    }).catch(function(){});
  // 7. 最近活动（概览 + 数据分析 tab）
  supabaseClient.from(ANALYTICS_TABLE).select('event_type,module,page,created_at').order('created_at',{ascending:false}).limit(15)
    .then(function(r){
      var fill=function(el,data){
        if(!el)return;
        if(data&&data.length){el.innerHTML=data.map(function(d){var cls=d.event_type==='visit'?'visit':'click',label=d.event_type==='visit'?'访问':'点击',mod=d.module||(d.event_type==='visit'?'页面':'—');var t=new Date(d.created_at),h=t.getHours(),m=t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes();return '<div class="ad-event"><span class="ad-event-type '+cls+'">'+label+'</span><span class="ad-event-module">'+escapeHtml(String(mod))+'</span><span class="ad-event-time">'+(t.getMonth()+1)+'/'+t.getDate()+' '+h+':'+m+'</span></div>';}).join('');}
        else{el.innerHTML='<p style="color:var(--text-tertiary);font-size:12px;text-align:center;padding:14px 0">暂无活动</p>';}
      };
      fill(document.getElementById('adRecentEvents'),r&&r.data?r.data:null);
      fill(document.getElementById('adDataEvents'),r&&r.data?r.data:null);
    }).catch(function(){});
  // 8. 内测用户列表（用户管理 tab）+ 系统 tab 数据
  supabaseClient.from('qdbp_invitees').select('username,display_name,city,school,grade,goal,status,last_login,created_at').order('id').limit(50)
    .then(function(r){
      var tb=document.getElementById('adUsersBody');
      var sinceEl=document.getElementById('adSysDataSince');
      var cntEl=document.getElementById('adSysInviteesCount');
      if(r&&r.data&&r.data.length){
        if(tb){
          tb.innerHTML=r.data.map(function(d){
            var s=d.status==='active'?'<span class="status active">已填资料</span>':(d.status==='invited'?'<span class="status invited">已领取</span>':'<span class="status assigned">未分配</span>');
            var lt=d.last_login?new Date(d.last_login):null;
            var ltStr=lt?(lt.getMonth()+1)+'/'+lt.getDate()+' '+lt.getHours()+':'+(lt.getMinutes()<10?'0':'')+lt.getMinutes():'—';
            var ct=d.created_at?new Date(d.created_at):null;
            var ctStr=ct?(ct.getMonth()+1)+'/'+ct.getDate():'—';
            return '<tr>'
              +'<td style="font-weight:600">'+escapeHtml(d.username)+'</td>'
              +'<td>'+escapeHtml(d.display_name||'—')+'</td>'
              +'<td>'+escapeHtml(d.school||'—')+'</td>'
              +'<td>'+escapeHtml(d.grade||'—')+'</td>'
              +'<td>'+escapeHtml(d.goal||'—')+'</td>'
              +'<td>'+escapeHtml(d.city||'—')+'</td>'
              +'<td>'+s+'</td>'
              +'<td style="color:var(--text-tertiary)">'+ltStr+'</td>'
              +'<td style="color:var(--text-tertiary)">'+ctStr+'</td></tr>';
          }).join('');
        }
        var activeCount=r.data.filter(function(d){return d.status==='active'||d.status==='invited';}).length;
        if(cntEl)cntEl.textContent=String(activeCount)+'/'+String(r.data.length);
      }else{
        if(tb)tb.innerHTML='<tr><td colspan="9" style="text-align:center;padding:30px 0;color:var(--text-tertiary)">暂无内测用户</td></tr>';
        if(cntEl)cntEl.textContent='0/0';
      }
      if(sinceEl)sinceEl.textContent='2026-07-18';
    }).catch(function(){});
}
function _adminShowError(){
  ['adTotalVisits','adTodayVisits','adTotalClicks','adDownloads','adUsers'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent='—';});
  ['adModuleRank','adPageRank','adRecentEvents','adDataModuleRank','adDataPageRank','adDataEvents'].forEach(function(id){var el=document.getElementById(id);if(el)el.innerHTML='<p style="color:var(--text-tertiary);font-size:12px;text-align:center">服务暂不可用</p>';});
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
}

function toggleAiChat(){trackClick('问启点');
  const popup=document.getElementById('aiChatPopup');
  if(!popup)return;
  // 如果当前是折叠状态，则展开
  if(popup.classList.contains('minimized')){
    popup.classList.remove('minimized');
    document.getElementById('aiPopupBody').classList.remove('mini-hide');
    document.getElementById('aiPopupFoot').classList.remove('mini-hide');
    return;
  }
  const wasHidden=popup.style.display!=='block';
  popup.style.display=wasHidden?'block':'none';
  if(wasHidden){
    popup.classList.remove('minimized');
    document.getElementById('aiPopupBody').classList.remove('mini-hide');
    document.getElementById('aiPopupFoot').classList.remove('mini-hide');
    renderAiSuggestions();
  }
}
// 切换到 Copilot 副驾驶模式（新标签页打开全屏对话页）
function openCopilotMode(){
  window.open('copilot.html','_blank');
}
// 最小化（只保留标题栏）
function minimizeAiChat(){
  const popup=document.getElementById('aiChatPopup');
  if(!popup||popup.style.display!=='block')return;
  popup.classList.add('minimized');
  document.getElementById('aiPopupBody').classList.add('mini-hide');
  document.getElementById('aiPopupFoot').classList.add('mini-hide');
}
// 拖拽弹窗
(function(){
  var popup=null,dragging=false,offsetX=0,offsetY=0;
  function onDown(e){
    popup=document.getElementById('aiChatPopup');
    if(!popup||popup.style.display!=='block'||popup.classList.contains('minimized'))return;
    // 只有点标题栏才触发拖拽，按钮区/内容区/输入框/Copilot Mode 按钮不拦截
    if(!e.target.closest('.ai-popup-head'))return;
    if(e.target.closest('.ai-popup-head-actions'))return;
    if(e.target.closest('.ai-popup-mode-toggle'))return;
    dragging=true;
    var rect=popup.getBoundingClientRect();
    // 首次拖拽时，从 right/bottom 定位切换到 left/top
    if(popup.style.left===''){
      popup.style.left=rect.left+'px';
      popup.style.top=rect.top+'px';
      popup.style.right='auto';
      popup.style.bottom='auto';
    }
    var cx=e.clientX||(e.touches&&e.touches[0].clientX)||0;
    var cy=e.clientY||(e.touches&&e.touches[0].clientY)||0;
    offsetX=cx-rect.left;
    offsetY=cy-rect.top;
    e.preventDefault();
  }
  function onMove(e){
    if(!dragging||!popup)return;
    var cx=e.clientX||(e.touches&&e.touches[0].clientX)||0;
    var cy=e.clientY||(e.touches&&e.touches[0].clientY)||0;
    var nx=cx-offsetX;
    var ny=cy-offsetY;
    // 限制不拖出屏幕
    nx=Math.max(0,Math.min(nx,window.innerWidth-popup.offsetWidth));
    ny=Math.max(0,Math.min(ny,window.innerHeight-popup.offsetHeight));
    popup.style.left=nx+'px';
    popup.style.top=ny+'px';
  }
  function onUp(){dragging=false;popup=null}
  document.addEventListener('mousedown',onDown);
  document.addEventListener('mousemove',onMove);
  document.addEventListener('mouseup',onUp);
  // 手机触屏支持
  document.addEventListener('touchstart',onDown,{passive:false});
  document.addEventListener('touchmove',onMove,{passive:false});
  document.addEventListener('touchend',onUp);
})();

// 根据当前启动包渲染快捷问题标签
function renderAiSuggestions(){
  const container=document.getElementById('aiSuggestions');
  if(!container)return;
  const goal=getCurrentGoal();
  const pkgName=goal?goal.name:'';
  let chips=[];
  if(pkgName.indexOf('考研')>=0||pkgName.indexOf('kaoyan')>=0){
    chips=[
      '帮我制定这周的考研复习计划',
      '这个启动包有哪些文件？怎么用？',
      '帮我根据择校资料生成择校笔记',
      '我的分数大概能报什么学校？',
      '帮我生成一份简历草稿'
    ];
  }else if(pkgName.indexOf('央企')>=0||pkgName.indexOf('求职')>=0){
    chips=[
      '央企秋招流程是怎样的？',
      '帮我优化简历中的自我介绍部分',
      '笔试主要考什么？怎么准备？',
      '面试常见问题和回答技巧',
      '帮我整理一份网申材料清单'
    ];
  }else{
    chips=[
      '这个启动包怎么用？从哪开始？',
      '帮我规划本周的学习/准备计划',
      '有哪些资料可以下载？',
      '帮我写一份简历自我评价'
    ];
  }
  container.innerHTML='';
  chips.forEach(function(t){
    var el=document.createElement('span');
    el.className='ai-sug-chip';
    el.textContent=t;
    el.addEventListener('click',function(){
      var input=document.getElementById('aiChatInput');
      if(input){input.value=t;}
      sendAiChat();
    });
    container.appendChild(el);
  });
}
// 安全地追加一条消息（用 textContent，防止 XSS）
function addAiMsg(role,text){
  const body=document.querySelector('.ai-popup-body');
  if(!body)return null;
  const d=document.createElement('div');
  d.className='ai-popup-msg '+role;
  d.textContent=text;
  body.appendChild(d);
  body.scrollTop=body.scrollHeight;
  return d;
}
// 构造当前启动包上下文（阶段 + 资料清单），让 AI 能分析「我们的数据」
function buildAiContext(){
  const goal=getCurrentGoal();
  const steps=getCurrentSteps().map(s=>({name:s.name,desc:s.desc}));
  const files=getCurrentFiles().map(f=>{
    const m=getCurrentFileMeta(fileId(f.name))||{};
    return {name:f.name,cat:f.cat,desc:m.desc||''};
  });
  return {package:goal?goal.name:'',steps:steps,files:files};
}
async function sendAiChat(){
  const input=document.getElementById('aiChatInput');
  if(!input)return;
  const q=input.value.trim();
  if(!q){
    showToast('请输入问题');
    return;
  }
  input.value='';
  // 首次交互：隐藏欢迎语 + 快捷标签
  var welcome=document.querySelector('.ai-welcome');
  var sugs=document.getElementById('aiSuggestions');
  if(welcome)welcome.style.display='none';
  if(sugs)sugs.classList.add('suggestions-hidden');
  // 回显用户消息
  addAiMsg('user',q);
  // 「思考中」占位
  const placeholder=addAiMsg('bot','启点助手正在思考…');

  // 未登录 / 服务未就绪
  if(!sbReady||!supabaseClient||!isLoggedIn()){
    if(placeholder)placeholder.textContent='请先登录后再使用问启点。';
    if(typeof showLoginModal==='function')showLoginModal();
    return;
  }

  try{
    const context=buildAiContext();
    const {data,error}=await supabaseClient.functions.invoke('ask-qidian',{
      body:{message:q,context:context}
    });
    if(error)throw error;
    if(data&&data.reply){
      if(placeholder)placeholder.textContent=data.reply;
    }else if(data&&data.error){
      if(placeholder)placeholder.textContent='⚠️ '+data.error+'（请确认站长已部署问启点服务并配置 DeepSeek key）';
    }else{
      if(placeholder)placeholder.textContent='（未获取到回答）';
    }
  }catch(e){
    let msg='调用失败：'+(e&&e.message?e.message:String(e));
    if(/Failed to fetch|network|load|404/i.test(msg)) msg='问启点服务尚未部署或网络异常，请稍后重试。';
    if(placeholder)placeholder.textContent=msg;
  }finally{
    const body=document.querySelector('.ai-popup-body');
    if(body)body.scrollTop=body.scrollHeight;
  }
}

function toggleRegionMenu(e){
  if(e)e.stopPropagation();
  document.getElementById('regionSelect').classList.toggle('open');
}

function closeRegionMenu(){
  const el=document.getElementById('regionSelect');
  if(el)el.classList.remove('open');
}

function selectRegion(region,e){
  if(e)e.stopPropagation();
  const item=document.querySelector('.region-item[data-region="'+region+'"]');
  if(!item)return;
  if(item.classList.contains('disabled')){
    showToast('该站点暂未上线，敬请期待');
    return;
  }
  // 更新选中状态
  document.querySelectorAll('.region-item').forEach(i=>{
    i.classList.remove('active');
    const st=i.querySelector('.region-item-status');
    if(st&&st.classList.contains('current')){
      st.classList.remove('current');
      st.textContent='敬请期待';
      st.classList.add('soon');
    }
  });
  item.classList.add('active');
  const newStatus=item.querySelector('.region-item-status');
  if(newStatus){
    newStatus.classList.remove('beta','soon');
    newStatus.classList.add('current');
    newStatus.textContent='当前';
  }
  // 更新顶部按钮
  const flag=item.querySelector('.region-flag').textContent;
  const name=item.querySelector('.region-item-name').textContent;
  document.getElementById('regionFlag').textContent=flag;
  document.getElementById('regionName').textContent=name;
  closeRegionMenu();
  if(region==='thailand'){
    showToast('已切换到泰国（内测版），部分功能可能不稳定');
  }else if(region==='china'){
    showToast('已切换回中国站');
  }
}

// 点击其他位置关闭下拉
document.addEventListener('click',function(e){
  const sel=document.getElementById('regionSelect');
  if(sel&&!sel.contains(e.target)){
    closeRegionMenu();
  }
  const vsel=document.getElementById('versionSelect');
  if(vsel&&!vsel.contains(e.target)){
    closeVersionMenu();
  }
  const ssel=document.getElementById('sceneSelect');
  if(ssel&&!ssel.contains(e.target)){
    closeSceneMenu();
  }
  const hpkg=document.getElementById('homePkgDropdown');
  if(hpkg&&!hpkg.contains(e.target)){
    hpkg.classList.remove('open');
  }
  const bp=document.getElementById('navBlueprint');
  if(bp&&!bp.contains(e.target)){
    bp.classList.remove('open');
  }
  const ss=document.getElementById('siteSelect');
  if(ss&&!ss.contains(e.target)){
    ss.classList.remove('open');
  }
});

function toggleHomePkg(e){
  if(e)e.stopPropagation();
  document.getElementById('homePkgDropdown').classList.toggle('open');
}
function closeHomePkg(){
  const el=document.getElementById('homePkgDropdown');
  if(el)el.classList.remove('open');
}

function toggleBlueprintMenu(e){
  if(e)e.stopPropagation();
  document.getElementById('navBlueprint').classList.toggle('open');
}
function toggleSiteMenu(e){
  if(e)e.stopPropagation();
  document.getElementById('siteSelect').classList.toggle('open');
}
function selectSite(site, e){
  if(e)e.stopPropagation();
  if(site!=='china'){
    showToast(site==='thailand'?'泰国站点暂未开放':'该站点暂未开放');
    return;
  }
  document.querySelectorAll('.site-item').forEach(i=>i.classList.remove('active'));
  const item=document.querySelector('.site-item[data-site="'+site+'"]');
  if(item)item.classList.add('active');
  document.getElementById('siteSelect').classList.remove('open');
}
function switchBlueprint(bp, e){
  if(bp!=='college'){
    showToast('创业蓝图暂未开放');
    return;
  }
  document.querySelectorAll('.nav-dropdown-item[data-blp]').forEach(i=>i.classList.remove('active'));
}

function toggleVersionMenu(e){
  if(e)e.stopPropagation();
  document.getElementById('versionSelect').classList.toggle('open');
}

function closeVersionMenu(){
  const el=document.getElementById('versionSelect');
  if(el)el.classList.remove('open');
}

function selectVersion(version,e){
  if(e)e.stopPropagation();
  const item=document.querySelector('.version-item[data-version="'+version+'"]');
  if(!item)return;
  if(item.classList.contains('disabled')){
    showToast('创业板即将上线，敬请期待');
    return;
  }
  // 更新选中状态
  document.querySelectorAll('.version-item').forEach(i=>i.classList.remove('active'));
  item.classList.add('active');
  // 更新徽章
  document.querySelectorAll('.version-item-current').forEach(c=>{
    c.textContent='即将上线';
    c.classList.remove('version-item-current');
    c.classList.add('version-item-soon');
  });
  const newBadge=item.querySelector('.version-item-name span');
  if(newBadge){
    newBadge.textContent='当前';
    newBadge.classList.remove('version-item-soon');
    newBadge.classList.add('version-item-current');
  }
  closeVersionMenu();
  if(version==='student'){
    showToast('当前已是大学生版');
  }else if(version==='startup'){
    showToast('已切换到创业板');
  }
}

function toggleSceneMenu(e){
  if(e)e.stopPropagation();
  document.getElementById('sceneSelect').classList.toggle('open');
}

function closeSceneMenu(){
  const el=document.getElementById('sceneSelect');
  if(el)el.classList.remove('open');
}


function openCloudSpace(){
  const ov=document.getElementById('csOverlay');
  if(!ov)return;
  // 更新用户信息
  document.getElementById('csAvatar').textContent=currentUser?.name?.[0]||'U';
  document.getElementById('csName').textContent=currentUser?.name||'—';
  document.getElementById('csEmail').textContent=currentUser?.email||'—';
  document.getElementById('csGotCount').textContent=userSpace.length;
  document.getElementById('csSpaceCount').textContent=userSpace.length;
  // 清空搜索
  document.getElementById('csSearch').value='';
  renderCloudSpaceFiles();
  // 打开弹窗
  requestAnimationFrame(()=>ov.classList.add('open'));
  document.body.style.overflow='hidden';
}

function closeCloudSpace(e){
  if(e&&e.target!==e.currentTarget)return; // 只处理遮罩点击
  const ov=document.getElementById('csOverlay');
  if(!ov)return;
  ov.classList.remove('open');
  document.body.style.overflow='';
}

function renderCloudSpaceFiles(filter){
  const list=document.getElementById('csList');
  const empty=document.getElementById('csEmpty');
  if(!userSpace.length){
    empty.style.display='flex';
    list.querySelectorAll('.cs-file').forEach(el=>el.remove());
    return;
  }
  empty.style.display='none';
  // 移除旧文件
  list.querySelectorAll('.cs-file').forEach(el=>el.remove());
  // 过滤
  const q=(filter||'').trim().toLowerCase();
  const items=q?userSpace.filter(s=>s.name.toLowerCase().includes(q)):userSpace;
  if(!items.length){
    const msg=document.createElement('div');
    msg.className='cs-empty';
    msg.innerHTML='<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><span>没有找到匹配的文件</span>';
    list.insertBefore(msg,empty.nextSibling);
    return;
  }
  items.forEach(s=>{
    const t=s.name.endsWith('.pdf')?'pdf':'xlsx';
    const timeAgo=Math.floor((Date.now()-s.time)/60000);
    const timeText=timeAgo<1?'刚刚':timeAgo<60?timeAgo+'分钟前':timeAgo<1440?Math.floor(timeAgo/60)+'小时前':Math.floor(timeAgo/1440)+'天前';
    const idNum=(s.name.match(/^(\d+(-\d+)?)/)||[''])[0];
    const title=s.name.replace(/\.[^.]+$/,'').replace(/^\d+(-\d+)?｜/,'');
    const displayHtml=(idNum?'<span class="cs-file-id-inline">'+idNum+'｜</span>':'')+title;
    const el=document.createElement('div');
    el.className='cs-file';
    el.innerHTML='<div class="cs-file-icon '+t+'">'+(t==='pdf'?'PDF':'XLS')+'</div><div class="cs-file-name">'+displayHtml+'</div><div class="cs-file-time">'+timeText+'</div><button class="cs-file-dl" onclick="downloadCloudFile(\''+s.name.replace(/'/g,"\\'")+'\')" title="下载"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>';
    list.insertBefore(el,empty.nextSibling);
  });
}

function filterCloudSpace(){
  const q=document.getElementById('csSearch').value;
  renderCloudSpaceFiles(q);
}

function downloadCloudFile(name){
  forceDownload('files/'+encodeURIComponent(name),name);
  showToast('正在下载：'+name.replace(/\.[^.]+$/,''));
}

function renderSpaceList(){
  const el=document.getElementById('mSpaceList');
  if(!userSpace.length){
    el.innerHTML='<div class="ms-empty">还没有获取任何文件<br><br>去上方"全部资源一览"中点击「获取」试试</div>';
    return;
  }
  el.innerHTML=userSpace.map(s=>{
    const t=s.name.endsWith('.pdf')?'pdf':'xlsx';
    const timeAgo=Math.floor((Date.now()-s.time)/60000);
    const timeText=timeAgo<1?'刚刚':timeAgo<60?timeAgo+'分钟前':timeAgo<1440?Math.floor(timeAgo/60)+'小时前':Math.floor(timeAgo/1440)+'天前';
    const idNum=(s.name.match(/^(\d+(-\d+)?)/)||[''])[0];
    const title=s.name.replace(/\.[^.]+$/,'').replace(/^\d+(-\d+)?｜/,'');
    const displayHtml=(idNum?'<span class="cs-file-id-inline">'+idNum+'｜</span>':'')+title;
    return `<div class="ms-row">
      <div class="ms-icon ${t}">${t==='pdf'?'PDF':'XLS'}</div>
      <div class="ms-name">${displayHtml}</div>
      <div class="ms-time">${timeText}</div>
      <button class="fd" style="padding:4px 10px;font-size:11px;border:none" onclick="downloadCloudFile('${s.name.replace(/'/g,"\\'")}')">下载</button>
    </div>`;
  }).join('');
}

function showToast(msg){
  let t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div');
    t.id='toast';
    t.className='toast';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
}

document.addEventListener('DOMContentLoaded',()=>{
  console.log('DOMContentLoaded fired');
  try{initTheme()}catch(e){console.error('initTheme:',e)}
  try{initNav()}catch(e){console.error('initNav:',e)}
  try{showSk()}catch(e){console.error('showSk:',e)}
  try{initReveal()}catch(e){console.error('initReveal:',e)}
  try{initAuth()}catch(e){console.error('initAuth:',e)}
  try{initStartupCarousel()}catch(e){console.error('initStartupCarousel:',e)}
  try{initHeroCarousel()}catch(e){console.error('initHeroCarousel:',e)}
  try{initHeroVideo()}catch(e){console.error('initHeroVideo:',e)}
  try{initDropdownGuard()}catch(e){console.error('initDropdownGuard:',e)}
  setTimeout(()=>{try{render(FILES)}catch(e){console.error('render:',e)}},300);
});

// Hero 轮播初始化
function initHeroCarousel(){
  const track=document.getElementById('hcTrack');
  const dots=document.querySelectorAll('#hcDots span');
  const prev=document.getElementById('hcPrev');
  const next=document.getElementById('hcNext');
  if(!track||!dots.length)return;
  // 注入 SVG 场景
  track.querySelectorAll('.hc-slide[data-scene]').forEach(s=>{
    const key=s.dataset.scene;
    const sceneEl=s.querySelector('.hc-scene');
    if(sceneEl&&SCENE_SVG[key])sceneEl.innerHTML=SCENE_SVG[key]();
  });
  let idx=0,total=dots.length,timer=null,userInteracted=false;
  function go(i){
    if(i<0)i=total-1;if(i>=total)i=0;
    idx=i;
    track.style.transform='translateX(-'+(i*100)+'%)';
    dots.forEach((d,j)=>d.classList.toggle('active',j===i));
  }
  function reset(){clearTimeout(timer);timer=setTimeout(()=>{go(idx+1);reset()},4200)}
  dots.forEach(d=>d.addEventListener('click',()=>{userInteracted=true;go(parseInt(d.dataset.i,10));reset()}));
  if(prev)prev.addEventListener('click',()=>{userInteracted=true;go(idx-1);reset()});
  if(next)next.addEventListener('click',()=>{userInteracted=true;go(idx+1);reset()});
  const el=document.getElementById('heroSlider');
  if(el){el.addEventListener('mouseenter',()=>clearTimeout(timer));el.addEventListener('mouseleave',()=>{if(userInteracted)reset()})}
  // 用户首次交互后才开始自动轮播（避免页面刚加载就自动切）
  function onFirstInteract(){userInteracted=true;window.removeEventListener('scroll',onFirstInteract);window.removeEventListener('mousemove',onFirstInteract);window.removeEventListener('touchstart',onFirstInteract);reset()}
  window.addEventListener('scroll',onFirstInteract,{passive:true,once:true});
  window.addEventListener('mousemove',onFirstInteract,{passive:true,once:true});
  window.addEventListener('touchstart',onFirstInteract,{passive:true,once:true});
}

// 下拉菜单互斥：打开一个时自动关闭另一个
function initDropdownGuard(){
  const bp=document.getElementById('navBlueprint');
  const bpTrigger=bp.querySelector('.nav-dropdown-trigger');
  const pkg=document.getElementById('homePkgDropdown');
  const pkgTrigger=pkg.querySelector('.nav-dropdown-trigger');
  if(!bpTrigger||!pkgTrigger)return;
  bpTrigger.addEventListener('click',()=>pkg.classList.remove('open'));
  pkgTrigger.addEventListener('click',()=>bp.classList.remove('open'));
}

// ═══════════════════════════════════════════════
// STARTUP PACK CAROUSEL (交互式启动包堆叠卡片)
// ═══════════════════════════════════════════════
const STARTUP_PACKS=[
  {
    name:'央企求职',tag:'央企',tagColor:'#2F6BFF',theme:'theme-blue',
    person:{name:'陈同学',age:24,school:'对外经济贸易大学 · 金融'},
    quote:'启点把招聘动态、机会筛选、7 天启动路径放进一个包里，按节奏走完一遍心里就有底了。',
    pack:'大学生央企求职启动包',sub:'7 天路径 · 央企国央企机会',href:'zhaopin.html',
    portraitBg:'#1e3a8a',scene:'finance'
  },
  {
    name:'考研择校',tag:'考研',tagColor:'#10b981',theme:'theme-emerald',
    person:{name:'林同学',age:23,school:'北京大学 · 计算机'},
    quote:'从自我定位到院校筛选，把模糊的择校焦虑拆成可执行的下一步。',
    pack:'大学生考研择校启动包',sub:'自我定位 · 院校筛选',href:'kaoyan.html',
    portraitBg:'#065f46',scene:'study'
  },
  {
    name:'大厂求职',tag:'互联网',tagColor:'#7c3aed',theme:'theme-purple',
    person:{name:'王同学',age:22,school:'华南理工大学 · 本科'},
    quote:'从实习到 offer 投递，每一步要准备什么、什么时候做，启点都列得很清楚。',
    pack:'大厂求职启动包',sub:'简历 · 笔试 · 面试 · Offer',href:'javascript:void(0)',
    portraitBg:'#5b21b6',scene:'office',soon:true
  },
  {
    name:'公务员',tag:'公考',tagColor:'#dc2626',theme:'theme-rose',
    person:{name:'刘同学',age:25,school:'国家税务总局 · 科员'},
    quote:'把国考、省考、选调的资料和时间线整理成一条主线，备考不再东拼西凑。',
    pack:'公务员备考启动包',sub:'国考省考 · 选调生',href:'javascript:void(0)',
    portraitBg:'#9f1239',scene:'gov',soon:true
  },
  {
    name:'银行求职',tag:'银行',tagColor:'#f59e0b',theme:'theme-amber',
    person:{name:'赵同学',age:21,school:'清华大学 · 电子工程'},
    quote:'从网申到笔试面试，国有行、股份行全流程覆盖，按节奏推进即可。',
    pack:'银行求职启动包',sub:'六大行 · 股份行',href:'javascript:void(0)',
    portraitBg:'#92400e',scene:'finance',soon:true
  },
  {
    name:'保研',tag:'保研',tagColor:'#0891b2',theme:'theme-indigo',
    person:{name:'孙同学',age:22,school:'中山大学 · 市场营销'},
    quote:'保研关键节点全拆解，绩点、科研、面试，从大一到大三都能对应上。',
    pack:'保研启动包',sub:'绩点 · 科研 · 面试',href:'javascript:void(0)',
    portraitBg:'#312e81',scene:'study',soon:true
  },
  {
    name:'留学申请',tag:'留学',tagColor:'#0d9488',theme:'theme-teal',
    person:{name:'周同学',age:23,school:'知识付费 · 团队创业'},
    quote:'从背景提升到网申投递，目标院校申请全流程路径，按国家分线整理。',
    pack:'留学申请启动包',sub:'英美港新 · 背景提升',href:'javascript:void(0)',
    portraitBg:'#115e59',scene:'global',soon:true
  },
  {
    name:'创业入门',tag:'创业',tagColor:'#475569',theme:'theme-slate',
    person:{name:'徐同学',age:24,school:'复旦大学 · 经济学'},
    quote:'把从 0 到 1 的创业路径拆成可执行阶段，第一次做也能按步骤推进。',
    pack:'创业入门启动包',sub:'项目 · 团队 · 融资',href:'javascript:void(0)',
    portraitBg:'#1e293b',scene:'startup',soon:true
  }
];

// 人物剪影 SVG（按场景）
const SCENE_SVG={
  finance:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky-finance" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#dbeafe" stop-opacity=".4"/>
          <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="120" width="300" height="120" fill="rgba(255,255,255,.08)"/>
      <rect x="20" y="140" width="40" height="80" fill="rgba(255,255,255,.18)"/>
      <rect x="70" y="120" width="50" height="100" fill="rgba(255,255,255,.22)"/>
      <rect x="130" y="155" width="35" height="65" fill="rgba(255,255,255,.15)"/>
      <rect x="175" y="100" width="55" height="120" fill="rgba(255,255,255,.25)"/>
      <rect x="240" y="135" width="40" height="85" fill="rgba(255,255,255,.18)"/>
      <circle cx="60" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="60" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 38 110 Q 38 80 60 80 Q 82 80 82 110 L 82 240 L 38 240 Z" fill="#1e40af"/>
      <rect x="50" y="100" width="20" height="6" fill="#fff" opacity=".7"/>
      <path d="M 250 70 L 250 130 L 270 130 L 270 70 Z" fill="rgba(255,255,255,.4)"/>
      <rect x="246" y="66" width="28" height="6" fill="rgba(255,255,255,.4)"/>
    </svg>`,
  study:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="300" height="240" fill="url(#sky-finance)"/>
      <defs>
        <linearGradient id="book-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity=".6"/>
          <stop offset="100%" stop-color="#065f46" stop-opacity=".9"/>
        </linearGradient>
      </defs>
      <rect x="30" y="170" width="80" height="14" fill="rgba(0,0,0,.15)"/>
      <rect x="40" y="120" width="70" height="55" fill="url(#book-grad)"/>
      <rect x="50" y="130" width="50" height="3" fill="rgba(255,255,255,.5)"/>
      <rect x="50" y="138" width="40" height="2" fill="rgba(255,255,255,.4)"/>
      <rect x="50" y="145" width="45" height="2" fill="rgba(255,255,255,.4)"/>
      <circle cx="170" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="170" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 148 110 Q 148 80 170 80 Q 192 80 192 110 L 192 240 L 148 240 Z" fill="#065f46"/>
      <rect x="160" y="100" width="20" height="6" fill="#fff" opacity=".7"/>
      <rect x="220" y="180" width="50" height="40" fill="rgba(255,255,255,.15)"/>
      <line x1="220" y1="190" x2="270" y2="190" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
      <line x1="220" y1="200" x2="270" y2="200" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
      <line x1="220" y1="210" x2="265" y2="210" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
    </svg>`,
  office:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="140" width="300" height="100" fill="rgba(0,0,0,.18)"/>
      <rect x="20" y="170" width="80" height="50" fill="rgba(255,255,255,.2)"/>
      <rect x="30" y="178" width="60" height="34" fill="#1a1a2e"/>
      <rect x="35" y="183" width="50" height="3" fill="#7c3aed"/>
      <rect x="35" y="190" width="40" height="2" fill="rgba(255,255,255,.5)"/>
      <rect x="35" y="196" width="45" height="2" fill="rgba(255,255,255,.4)"/>
      <rect x="35" y="202" width="35" height="2" fill="rgba(255,255,255,.4)"/>
      <circle cx="160" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="160" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 138 110 Q 138 80 160 80 Q 182 80 182 110 L 182 240 L 138 240 Z" fill="#5b21b6"/>
      <rect x="150" y="100" width="20" height="6" fill="#fff" opacity=".7"/>
      <rect x="220" y="180" width="50" height="40" fill="rgba(255,255,255,.18)"/>
      <rect x="225" y="185" width="40" height="30" fill="#fff" opacity=".3"/>
    </svg>`,
  gov:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="130" width="260" height="20" fill="rgba(255,255,255,.4)"/>
      <rect x="30" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="60" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="90" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="120" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="150" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="180" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="210" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <rect x="240" y="80" width="20" height="60" fill="rgba(255,255,255,.5)"/>
      <polygon points="135,55 165,55 175,75 125,75" fill="rgba(255,255,255,.5)"/>
      <circle cx="150" cy="65" r="6" fill="#dc2626"/>
      <circle cx="160" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="160" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 138 110 Q 138 80 160 80 Q 182 80 182 110 L 182 240 L 138 240 Z" fill="#9f1239"/>
      <rect x="150" y="100" width="20" height="6" fill="#fff" opacity=".7"/>
    </svg>`,
  global:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="130" r="100" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.3)" stroke-width="1"/>
      <ellipse cx="150" cy="130" rx="100" ry="40" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/>
      <ellipse cx="150" cy="130" rx="40" ry="100" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/>
      <line x1="50" y1="130" x2="250" y2="130" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
      <line x1="150" y1="30" x2="150" y2="230" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
      <circle cx="220" cy="100" r="3" fill="#fff"/>
      <circle cx="80" cy="80" r="3" fill="#fff"/>
      <circle cx="200" cy="180" r="3" fill="#fff"/>
      <circle cx="60" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="60" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 38 110 Q 38 80 60 80 Q 82 80 82 110 L 82 240 L 38 240 Z" fill="#115e59"/>
      <rect x="50" y="100" width="20" height="6" fill="#fff" opacity=".7"/>
    </svg>`,
  startup:()=>`
    <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="180" width="80" height="40" fill="rgba(255,255,255,.2)"/>
      <rect x="30" y="190" width="60" height="30" fill="#0f172a"/>
      <rect x="35" y="195" width="50" height="3" fill="#f59e0b"/>
      <rect x="200" y="160" width="80" height="60" fill="rgba(255,255,255,.18)"/>
      <path d="M 205 160 L 240 130 L 275 160 Z" fill="rgba(255,255,255,.3)"/>
      <circle cx="160" cy="60" r="22" fill="rgba(255,255,255,.3)"/>
      <circle cx="160" cy="50" r="14" fill="#fde6c8"/>
      <path d="M 138 110 Q 138 80 160 80 Q 182 80 182 110 L 182 240 L 138 240 Z" fill="#1e293b"/>
      <rect x="150" y="100" width="20" height="6" fill="#f59e0b" opacity=".9"/>
    </svg>`
};

let scState={index:0,total:0,isAnimating:false,dragStartX:0,dragLastX:0,isDragging:false,dragMoved:0,longPressTimer:null,autoTimer:null};

function initStartupCarousel(){
  const track=document.getElementById('scTrack');
  const dots=document.getElementById('scDots');
  if(!track)return;
  scState.total=STARTUP_PACKS.length;

  // Build dots
  dots.innerHTML=STARTUP_PACKS.map((_,i)=>`<span class="dot ${i===0?'active':''}" data-i="${i}"></span>`).join('');

  // Build cards
  track.innerHTML=STARTUP_PACKS.map((p,i)=>{
    const sceneSvg=(SCENE_SVG[p.scene]||SCENE_SVG.finance)();
    const soonTag=p.soon?'<span style="margin-left:auto;background:rgba(245,158,11,.92);color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px">即将开放</span>':'';
    return `
    <div class="scc ${p.theme} ${p.href!=='javascript:void(0)'?'clickable':''}" data-index="${i}" data-href="${p.href}" data-soon="${p.soon?'1':'0'}">
      <div class="scc-portrait" style="background-color:${p.portraitBg}">
        <div class="scc-svg">${sceneSvg}</div>
        <div class="scc-tag"><span class="tg" style="background:${p.tagColor}"></span>${p.tag}${soonTag}</div>
        <div class="scc-name">
          <div class="nm">${p.person.name}</div>
          <div class="meta">
            <span class="age">${p.person.age}岁</span>
            <span class="dot">·</span>
            <span>${p.person.school}</span>
          </div>
        </div>
      </div>
      <div class="scc-body">
        <div>
          <div class="scc-pack">${p.pack}</div>
          <div class="scc-pack-sub">${p.sub}</div>
          <div class="scc-quote">"${p.quote}"</div>
        </div>
        <div class="scc-cta">${p.soon?'查看详情':'进入启动包'}<span class="arr">→</span></div>
      </div>
    </div>`;
  }).join('');

  // Wire up card clicks
  track.querySelectorAll('.scc').forEach(card=>{
    card.addEventListener('click',(e)=>{
      // Allow click only on center card
      if(!card.classList.contains('center')){
        e.preventDefault();
        const i=parseInt(card.dataset.index,10);
        scrollToIndex(i);
        return;
      }
      const href=card.dataset.href;
      if(href&&href!=='javascript:void(0)'&&!card.dataset.soon){
        window.location.href=href;
      } else {
        // For non-ready packs, scroll to products section
        const target=document.getElementById('products');
        if(target)target.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // Wire up dots
  dots.querySelectorAll('.dot').forEach(dot=>{
    dot.addEventListener('click',()=>{
      const i=parseInt(dot.dataset.i,10);
      scrollToIndex(i);
    });
  });

  // Wire up nav buttons — click 切换一次，长按连续切换
  const prevBtn=document.getElementById('scPrev');
  const nextBtn=document.getElementById('scNext');
  function startHold(dir){
    // 立即切换一次
    scrollToIndex(scState.index+dir,false,true);
    // 长按每 280ms 切换一次（fast 模式，过渡 250ms）
    scState.longPressTimer=setInterval(()=>scrollToIndex(scState.index+dir,false,true),300);
  }
  function stopHold(){
    if(scState.longPressTimer){clearInterval(scState.longPressTimer);scState.longPressTimer=null}
  }
  prevBtn.addEventListener('mousedown',()=>startHold(-1));
  nextBtn.addEventListener('mousedown',()=>startHold(1));
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=>{
    prevBtn.addEventListener(ev,stopHold);
    nextBtn.addEventListener(ev,stopHold);
  });
  // 防止按钮被拖动时选中
  [prevBtn,nextBtn].forEach(b=>b.addEventListener('dragstart',e=>e.preventDefault()));

  // 鼠标拖拽 + 触摸滑动
  const stage=document.getElementById('scStage');
  if(stage){
    let stageRect=null;
    function refreshRect(){stageRect=stage.getBoundingClientRect()}
    refreshRect();
    window.addEventListener('resize',refreshRect);

    const DRAG_THRESHOLD=80; // 每拖动 80px 切换一张

    function onDragStart(clientX){
      if(scState.isAnimating)return;
      scState.isDragging=true;
      scState.dragStartX=clientX;
      scState.dragLastX=clientX;
      scState.dragMoved=0;
      stage.classList.add('dragging');
    }
    function onDragMove(clientX){
      if(!scState.isDragging)return;
      const dx=clientX-scState.dragLastX;
      scState.dragMoved+=dx;
      scState.dragLastX=clientX;
      // 累积位移超过阈值就切换一张
      if(Math.abs(scState.dragMoved)>=DRAG_THRESHOLD){
        const steps=Math.trunc(scState.dragMoved/DRAG_THRESHOLD);
        scrollToIndex(scState.index-steps);
        scState.dragMoved-=steps*DRAG_THRESHOLD;
      }
    }
    function onDragEnd(){
      if(!scState.isDragging)return;
      scState.isDragging=false;
      scState.dragMoved=0;
      stage.classList.remove('dragging');
    }

    // 鼠标
    stage.addEventListener('mousedown',(e)=>{
      // 不要拦截按钮和卡片的点击
      if(e.target.closest('.sc-nav'))return;
      onDragStart(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('mousemove',(e)=>{
      if(scState.isDragging)onDragMove(e.clientX);
    });
    window.addEventListener('mouseup',onDragEnd);

    // 触摸
    stage.addEventListener('touchstart',(e)=>{
      if(e.target.closest('.sc-nav'))return;
      onDragStart(e.touches[0].clientX);
    },{passive:true});
    stage.addEventListener('touchmove',(e)=>{
      if(scState.isDragging)onDragMove(e.touches[0].clientX);
    },{passive:true});
    stage.addEventListener('touchend',onDragEnd);
    stage.addEventListener('touchcancel',onDragEnd);

    // 滚轮横向（可选，鼠标滚轮也能切换）
    let wheelTimer=null;
    stage.addEventListener('wheel',(e)=>{
      if(Math.abs(e.deltaX)<10&&Math.abs(e.deltaY)<30)return;
      const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
      if(wheelTimer)return;
      wheelTimer=setTimeout(()=>{wheelTimer=null},350);
      if(delta>0)scrollToIndex(scState.index+1);
      else scrollToIndex(scState.index-1);
      e.preventDefault();
    },{passive:false});
  }

  // Initial layout
  scrollToIndex(0,true);
}

function scrollToIndex(targetIndex,immediate,fast){
  if(scState.isAnimating&&!immediate)return;
  const total=scState.total;
  // Wrap around
  if(targetIndex<0)targetIndex=total-1;
  if(targetIndex>=total)targetIndex=0;
  if(targetIndex===scState.index&&!immediate)return;
  if(!immediate)scState.isAnimating=true;
  scState.index=targetIndex;

  const cards=document.querySelectorAll('#scTrack .scc');
  cards.forEach((card,i)=>{
    let offset=i-targetIndex;
    // Wrap offset so that half of cards go to the left and half to the right
    const total=scState.total;
    if(offset>total/2)offset-=total;
    if(offset<-total/2)offset+=total;
    const stage=document.querySelector('.sc-stage');
    const stageH=stage?stage.clientHeight:560;
    const cardH=460;
    const top=(stageH-cardH)/2;
    let transform='',zIndex=1,opacity=1,filter='',pointer='auto';

    if(offset===0){
      // Center: large
      transform=`translate(-50%, ${top}px) translateX(0) scale(1)`;
      zIndex=10;opacity=1;filter='';
      card.classList.add('center');card.classList.remove('dim','peek');
    } else if(Math.abs(offset)===1){
      // Adjacent: medium
      const xDir=offset>0?1:-1;
      transform=`translate(-50%, ${top+24}px) translateX(${xDir*270}px) scale(0.84)`;
      zIndex=5;opacity=0.9;filter='';
      card.classList.remove('center','dim');card.classList.add('peek');
    } else if(Math.abs(offset)===2){
      // Far: small + blur
      const xDir=offset>0?1:-1;
      transform=`translate(-50%, ${top+50}px) translateX(${xDir*440}px) scale(0.68)`;
      zIndex=3;opacity=0.45;filter='blur(2px) saturate(0.85)';
      card.classList.remove('center','peek');card.classList.add('dim');
    } else {
      // Off-screen
      const xDir=offset>0?1:-1;
      transform=`translate(-50%, ${top+50}px) translateX(${xDir*650}px) scale(0.6)`;
      zIndex=1;opacity=0;filter='blur(3px)';
      card.classList.remove('center','peek');card.classList.add('dim');
    }
    if(immediate){
      card.style.transition='none';
    } else if(fast){
      card.style.transition='transform .25s cubic-bezier(.16,1,.3,1),opacity .25s cubic-bezier(.16,1,.3,1),filter .25s cubic-bezier(.16,1,.3,1)';
    } else {
      card.style.transition='';
    }
    card.style.transform=transform;
    card.style.zIndex=zIndex;
    card.style.opacity=opacity;
    card.style.filter=filter;
    card.style.pointerEvents=pointer;
  });

  // Update dots
  document.querySelectorAll('#scDots .dot').forEach((d,i)=>{
    d.classList.toggle('active',i===targetIndex);
  });

  setTimeout(()=>{scState.isAnimating=false},fast?250:600);
}

// 从 copilot.html 跳回时自动打开工作空间（?ws=1）
(async function(){
  try{
    if(new URLSearchParams(window.location.search).get('ws')==='1'){
      await new Promise(r=>setTimeout(r,400));
      // sbReady 但 currentUser 未就绪时，主动等一次 getSession
      if(sbReady && supabaseClient && !currentUser){
        try{
          const {data:{session}}=await supabaseClient.auth.getSession();
          if(session){
            currentUser={
              id:session.user.id,
              email:session.user.email,
              name:(session.user.user_metadata&&session.user.user_metadata.name)||session.user.email
            };
          }
        }catch(e){}
      }
      if(typeof openWorkspace==='function' && isLoggedIn && isLoggedIn()){
        openWorkspace();
      }else if(typeof showLoginModal==='function'){
        showLoginModal();
      }
    }
  }catch(e){}
  // 网站分析：记录一次访问
  trackVisit();
})();
// 首屏演示窗口动画
(function(){
  var scr=document.getElementById('qdbpDemoScreen');
  if(!scr)return;
  // 场景编排：[用户消息, AI思考, AI回答/卡片, 等待时间]
  function msg(html,cls){return '<div class="qdbp-demo-msg '+cls+'">'+html+'</div>';}
  function avatarU(){return '<div class="qdbp-demo-avatar u">你</div>';}
  function avatarA(){return '<div class="qdbp-demo-avatar a">启</div>';}
  function dots(){return '<div class="qdbp-demo-dots"><span></span><span></span><span></span></div>';}
  function progress(){return '<div class="progress"><span></span></div>';}
  var scenes=[
    // ── 场景1：双非进央企 ──
    [
      msg(avatarU()+'<div class="qdbp-demo-bubble">双非本科，想进央企，有什么推荐？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>为你匹配 47 个岗位</b><br>• 中核集团 · 技术岗 · 12k+<br>• 国家电网 · 运维岗 · 10k+<br>• 中国建筑 · 工程岗 · 9k+<br>• 招商局 · 行政岗 · 8k+</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">这些对双非友好吗？有专业限制吗？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>全部对双非开放</b><br>✔ 中核：理工科为主，不限院校<br>✔ 电网：电气/计算机均可<br>✔ 建筑：土木/工程管理优先<br>✔ 招商：经管/法学均可</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">那我该从哪里开始准备？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>你的行动清单</b><br>📄 编写中核/电网针对性简历<br>⚠️ 查看央企简历避坑指南<br>🔗 了解网申全流程（含笔试）<br>📅 网申倒计时提醒</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">先帮我生成简历模板看看</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">📥 正在生成央企专属简历模板'+progress()+'</div>','ai')
    ],
    // ── 场景2：查看新增央企 ──
    [
      msg(avatarU()+'<div class="qdbp-demo-bubble">今天新增了哪些央企招聘？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><div class="row"><span>🏢 中核集团</span><span class="badge">技术岗·12k</span></div><div class="row"><span>🏢 中航工业</span><span class="badge">研发岗·15k</span></div><div class="row"><span>🏢 中国中车</span><span class="badge">校招·10k</span></div><div class="row"><span>🏢 中国电信</span><span class="badge">实习·5k</span></div><div class="row"><span>🏢 华润集团</span><span class="badge">管培·11k</span></div></div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">华润管培在哪个城市？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>华润集团 2027 管培生</b><br>📍 深圳 / 北京 / 上海<br>📅 网申截止：2026-08-15<br>📌 不限专业，轮岗培养</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">收藏了，加到我清单</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">✅ 已添加至「我的目标清单」<br>📄 是否生成华润专属简历模板？</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">好，生成一下</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">📥 正在生成华润管培生专属简历模板'+progress()+'</div>','ai')
    ],
    // ── 场景3：报录比查询 ──
    [
      msg(avatarU()+'<div class="qdbp-demo-bubble">985 报录比 4.1:1 左右的院校有哪些？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>已为您筛选</b><br>• 清华大学 · 3.8:1<br>• 北京大学 · 4.2:1<br>• 上海交大 · 4.5:1<br>• 复旦大学 · 3.9:1<br>• 浙江大学 · 4.3:1</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">清北的报录比最近 3 年趋势？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>清华大学</b><br>2025: 3.5:1 → 2026: 3.8:1 → 2027: 4.1:1<br><b>北京大学</b><br>2025: 3.9:1 → 2026: 4.2:1 → 2027: 4.5:1<br>📈 竞争逐年加剧</div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">下载完整报告看看</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">📥 正在生成 985 院校报录比趋势报告'+progress()+'</div>','ai')
    ],
    // ── 场景4：整理清单后的准备 ──
    [
      msg(avatarU()+'<div class="qdbp-demo-bubble">帮我整理今天的目标清单</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>你的目标清单</b><br>📌 中核 · 技术岗（92%）<br>📌 电网 · 运维岗（88%）<br>📌 华润 · 管培生（86%）<br>📌 招商局 · 行政岗（85%）<br><div style="margin-top:4px;font-size:10px;color:rgba(255,255,255,.5)">匹配度基于学历+专业分析</div></div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">这些岗位截止日期是什么？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><div class="row"><span>中核 · 技术岗</span><span>⏰ 8/20</span></div><div class="row"><span>电网 · 运维岗</span><span>⏰ 7/31</span></div><div class="row"><span>华润 · 管培</span><span>⏰ 8/15</span></div><div class="row"><span>招商 · 行政</span><span>⏰ 8/10</span></div></div>','ai'),
      msg(avatarU()+'<div class="qdbp-demo-bubble">电网快截止了，接下来该做什么？</div>','user'),
      msg(avatarA()+'<div class="qdbp-demo-bubble">'+dots()+'</div>','ai'),
      msg(avatarA()+'<div class="qdbp-demo-bubble"><b>按优先级排序</b><br>1️⃣ 编写电网运维岗针对性简历<br>2️⃣ 查看央企网申避坑指南（高频被刷点）<br>3️⃣ 了解电网笔试流程与真题<br>4️⃣ 中核 8/20 前完成不改简历<br>📄 已为您准备电网简历模板 →</div>','ai')
    ]
  ];
  var sceneIdx=-1,stepIdx=0;
  // 不同场景下输入框的"打字"内容
  var inputTexts=['请描述你的目标…','双非本科，想进央企…','今天新增了哪些央企…','985 报录比 4.1:1…','整理今天的目标清单…'];
  function renderScene(){
    scr.innerHTML='';
    sceneIdx=(sceneIdx+1)%scenes.length;
    stepIdx=0;
    // 同步切换输入框文字
    var inEl=document.getElementById('qdbpDemoInputText');
    if(inEl)inEl.textContent=inputTexts[sceneIdx+1]||inputTexts[0];
    playStep();
  }
  function playStep(){
    if(stepIdx>=scenes[sceneIdx].length){
      setTimeout(renderScene,5000);
      return;
    }
    var html=scenes[sceneIdx][stepIdx];
    scr.innerHTML+=html;
    // 滚动到底部
    scr.scrollTop=scr.scrollHeight;
    // 计算延迟
    var delay=stepIdx===0?1800:3200;
    if(html.indexOf('dots')!==-1) delay=1400;
    if(html.indexOf('progress')!==-1) delay=4200;
    stepIdx++;
    setTimeout(playStep,delay);
  }
  // 首屏展示后启动
  setTimeout(renderScene,800);
})();
