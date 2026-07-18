#!/usr/bin/env python3
"""Update workspace CSS and JS per personal space spec."""

with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ===== 1. Add new banner CSS (replace old welcome CSS) =====
old_welcome_css = """.ws-welcome{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,var(--brand),var(--brand-mid));border-radius:16px;padding:20px 24px;margin-bottom:24px;color:#fff;position:relative;overflow:hidden}
.ws-welcome::after{content:\"\";position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.08)}
.ws-welcome::before{content:\"\";position:absolute;right:60px;bottom:-60px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.05)}
.ws-welcome-text{position:relative;z-index:1}
.ws-welcome-greet{font-family:var(--serif);font-size:20px;font-weight:700;letter-spacing:-0.01em}
.ws-welcome-quote{font-size:13px;opacity:.85;margin-top:4px}
.ws-zip-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:#fff;color:var(--brand);border:none;border-radius:100px;font-size:13px;font-weight:600;cursor:pointer;position:relative;z-index:1;transition:all .2s ease;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.ws-zip-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,.15)}
.ws-zip-text{font-size:13px}
.ws-zip-size{font-size:10px;padding:2px 6px;background:var(--brand-soft);color:var(--brand);border-radius:100px;font-weight:500}"""

new_banner_css = """.ws-banner{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,var(--brand),var(--brand-mid));border-radius:14px;padding:18px 24px;margin-bottom:20px;color:#fff;position:relative;overflow:hidden;gap:16px}
.ws-banner-text{flex:1;min-width:0}
.ws-banner-title{font-family:var(--serif);font-size:16px;font-weight:700;line-height:1.3}
.ws-banner-desc{font-size:12px;opacity:.85;margin-top:4px;line-height:1.5}
.ws-banner-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.ws-banner-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s ease;white-space:nowrap;border:none;text-decoration:none}
.ws-banner-btn.primary{background:#fff;color:var(--brand);box-shadow:0 4px 12px rgba(0,0,0,.12)}
.ws-banner-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.18)}
.ws-banner-btn.secondary{background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(4px)}
.ws-banner-btn.secondary:hover{background:rgba(255,255,255,.3)}"""

html = html.replace(old_welcome_css, new_banner_css)

# ===== 2. Update goal card CSS - remove quote =====
old_goal_css = """.ws-goal-quote{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--brand);padding:10px 16px;background:#fff;border:1.5px dashed var(--brand);border-radius:100px;white-space:nowrap;position:relative;z-index:1;letter-spacing:.02em}
.ws-goal-switch{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--bg-card);border:1px solid var(--border-strong);border-radius:100px;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .2s ease;position:relative;z-index:1;white-space:nowrap}
.ws-goal-switch:hover{background:var(--brand-soft);border-color:var(--brand);color:var(--brand)}"""

new_goal_css = """.ws-goal-switch{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--bg-card);border:1px solid var(--border-strong);border-radius:100px;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .2s ease;position:relative;z-index:1;white-space:nowrap}
.ws-goal-switch:hover{background:var(--brand-soft);border-color:var(--brand);color:var(--brand)}"""

html = html.replace(old_goal_css, new_goal_css)

# ===== 3. Remove day card CSS =====
old_day_css = """.ws-day-card{background:linear-gradient(135deg,var(--brand),var(--brand-mid));border-radius:14px;padding:14px;color:#fff;position:relative;overflow:hidden;flex-shrink:0}
.ws-day-card::after{content:\"\";position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.1)}
.ws-day-header{display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:11px;opacity:.85}
.ws-day-icon{font-size:13px}
.ws-day-num-wrap{display:flex;align-items:baseline;gap:4px;margin-bottom:10px}
.ws-day-num{font-family:var(--serif);font-size:32px;font-weight:900;line-height:1;letter-spacing:-0.02em}
.ws-day-unit{font-size:12px;opacity:.85}
.ws-day-bar{height:5px;background:rgba(255,255,255,.2);border-radius:100px;overflow:hidden;margin-bottom:8px}
.ws-day-bar-fill{height:100%;background:#fff;border-radius:100px;width:0%;transition:width .6s ease}
.ws-day-target{font-size:10px;opacity:.85;line-height:1.4}
.ws-day-target strong{font-size:13px;font-weight:700;margin:0 2px}"""

html = html.replace(old_day_css, '')

# ===== 4. Remove overview foot stats CSS =====
html = html.replace(
    '.ws-overview-foot{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:1px dashed var(--border);font-size:12px;color:var(--text-secondary);flex-wrap:wrap;gap:8px}\n.ws-ov-foot-r{color:var(--text-tertiary)}',
    ''
)

html = html.replace(
    '.ws-ov-stat{text-align:center}\n.ws-ov-num{display:block;font-family:var(--serif);font-size:22px;font-weight:900;color:var(--brand);line-height:1}\n.ws-ov-lbl{font-size:10px;color:var(--text-tertiary);margin-top:2px;display:block}',
    ''
)

# Also remove the overview-stats grid CSS reference
html = html.replace(
    '.ws-overview-stats{display:flex;align-items:center;gap:18px;flex-shrink:0}',
    ''
)

# ===== 5. Remove sidebar stats CSS =====
html = html.replace(
    '.ws-sidebar-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding-top:14px;border-top:1px solid var(--border)}\n.ws-stat{background:var(--bg-soft);border-radius:8px;padding:10px;text-align:center}\n.ws-stat-num{font-family:var(--serif);font-size:18px;font-weight:900;color:var(--brand);line-height:1}\n.ws-stat-label{font-size:10px;color:var(--text-tertiary);margin-top:3px}',
    ''
)

# ===== 6. Update responsive: remove day-card hide =====
html = html.replace(
    '.ws-progress,.ws-sidebar-stats,.ws-day-card{display:none}',
    '.ws-progress{display:none}'
)

# ===== 7. Add AI FAB + popup CSS =====
ai_fab_css = """.ai-fab{position:fixed;bottom:28px;right:28px;z-index:800;display:flex;align-items:center;gap:8px;padding:12px 18px;background:var(--brand);color:#fff;border:none;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(47,107,255,.35);transition:all .2s ease}
.ai-fab:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(47,107,255,.45)}
.ai-fab-icon{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:14px}
.ai-chat-popup{position:fixed;bottom:80px;right:28px;width:340px;max-height:440px;background:var(--bg-card);border:1px solid var(--border);border-radius:16px;box-shadow:0 12px 40px rgba(11,42,74,.15);z-index:801;display:flex;flex-direction:column;overflow:hidden}
.ai-popup-head{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;color:var(--text)}
.ai-popup-close{width:28px;height:28px;border-radius:50%;border:none;background:var(--tag-bg);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:all .2s ease}
.ai-popup-close:hover{background:var(--brand-soft);color:var(--brand)}
.ai-popup-body{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:8px;min-height:160px;max-height:280px}
.ai-popup-msg{font-size:12px;line-height:1.6;padding:10px 12px;border-radius:12px;max-width:85%}
.ai-popup-msg.bot{background:var(--bg-soft);color:var(--text);align-self:flex-start;border-bottom-left-radius:4px}
.ai-popup-msg.user{background:var(--brand);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.ai-popup-foot{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--border)}
.ai-popup-input{flex:1;border:none;outline:none;background:var(--bg-soft);padding:8px 12px;border-radius:100px;font-size:12px;color:var(--text);font-family:inherit}
.ai-popup-input::placeholder{color:var(--text-tertiary)}
.ai-popup-send{width:30px;height:30px;border-radius:50%;background:var(--brand);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s ease}
.ai-popup-send:hover{background:var(--brand-mid)}"""

# Insert after the AI chat bar CSS block
old_ai_css = """.ai-chat-note{text-align:center;font-size:11px;color:var(--text-tertiary);margin-top:8px;letter-spacing:.02em}
.ai-chat-suggestions{display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;max-width:680px;margin-left:auto;margin-right:auto}
.ai-chat-sug{padding:4px 12px;background:rgba(255,255,255,.6);border:1px solid var(--border);border-radius:100px;font-size:11px;color:var(--text-secondary);cursor:pointer;transition:all .2s ease;backdrop-filter:blur(4px)}
.ai-chat-sug:hover{background:var(--brand-soft);border-color:var(--brand);color:var(--brand)}"""

new_ai_css = """.ai-chat-note{text-align:center;font-size:11px;color:var(--text-tertiary);margin-top:8px;letter-spacing:.02em}
""" + ai_fab_css

html = html.replace(old_ai_css, new_ai_css)

# ===== 8. Remove old AI chat bar responsive =====
html = html.replace(
    '  .ai-chat-bar{padding:10px 14px 14px}\n  .ai-chat-inner{padding:4px 4px 4px 12px}\n  .ai-chat-input{font-size:13px}\n  .ai-chat-send{width:32px;height:32px}\n  .ai-chat-suggestions{display:none}',
    '  .ai-fab{bottom:16px;right:16px;padding:10px 14px;font-size:12px}\n  .ai-chat-popup{right:12px;width:300px;bottom:68px}'
)

# ===== 9. Update JS: sendAiChat, toggleAiChat, renderWorkspaceSteps, etc =====
# Remove old renderWorkspaceSteps and related functions; replace with scroll-based versions

old_switch_step = """function switchStep(stepId,scrollTop){
  currentStep=stepId;
  const steps=getCurrentSteps();
  const step=steps.find(s=>s.id===stepId);
  // 标题/描述
  const titleEl=document.getElementById('wsStepTitle');
  const descEl=document.getElementById('wsStepDesc');
  if(step){
    if(titleEl) titleEl.textContent=step.icon+' '+step.name;
    if(descEl) descEl.textContent=step.desc;
  }else{
    const goal=getCurrentGoal();
    if(titleEl) titleEl.textContent=goal.icon+' '+goal.name;
    if(descEl) descEl.textContent=goal.desc;
  }
  // 重新渲染步骤（高亮）
  renderWorkspaceSteps();
  renderOverview();
  // 渲染文件
  renderWorkspaceFiles(stepId);
  // 滚动到顶部
  if(scrollTop!==false){
    const main=document.querySelector('.ws-main');
    if(main) main.scrollTop=0;
  }
}"""

new_switch_step = """function switchStep(stepId,scrollTop){
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
}"""

html = html.replace(old_switch_step, new_switch_step)

# ===== 10. Update renderWorkspaceSteps for scroll =====
old_render_steps = """function renderWorkspaceSteps(){
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
    const active=s.id===currentStep;
    return `<div class="ws-step ${active?'active':''} ${completed?'completed':''}" onclick="switchStep(${s.id})">
      <div class="ws-step-icon">${completed?'✓':s.id}</div>
      <div class="ws-step-info">
        <div class="ws-step-name">${s.name}</div>
        <div class="ws-step-progress">${acquired}/${total} 已获取</div>
      </div>
    </div>`;
  }).join('');
}"""

new_render_steps = """function renderWorkspaceSteps(){
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
}"""

html = html.replace(old_render_steps, new_render_steps)

# ===== 11. Update renderWorkspaceFiles → renderAllStages =====
old_render_files = """function renderWorkspaceFiles(stepId){
  const el=document.getElementById('wsFiles');
  if(!el)return;
  const files=getStepFiles(stepId);
  document.getElementById('wsStepFileCount').textContent=files.length;
  document.getElementById('wsStepAcquiredCount').textContent=getStepAcquiredCount(stepId);
  if(!files.length){
    const goal=getCurrentGoal();
    el.innerHTML='<div class="ws-file-empty">「'+goal.name+'」的资源正在准备中，敬请期待</div>';
    return;
  }
  el.innerHTML=files.map(f=>{
    const t=typ(f.name);
    const idNum=fileId(f.name);
    const title=fileTitle(f.name);
    const acquired=isFileAcquired(f.name);
    const safeName=f.name.replace(/'/g,"\\\\'");
    const meta=getCurrentFileMeta(idNum)||{desc:'',points:[],freq:'持续更新',realtime:false};
    const sizeInfo=fmt(f.size);
    const sizeMatch=sizeInfo.match(/^([\\d.]+)\\s*(\\D+)$/);
    const sizeNum=sizeMatch?sizeMatch[1]:sizeInfo;
    const sizeUnit=sizeMatch?sizeMatch[2]:'';
    const pointsHtml=(meta.points||[]).map((p,i)=>'<div class="ws-file-point"><span class="ws-file-point-num">'+(i+1)+'</span><span>'+p+'</span></div>').join('');
    return `<div class="ws-file ${acquired?'acquired':''}">
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
        <span class="ws-file-freq ${meta.realtime?'realtime':''}">${meta.realtime?'🔴':''}${meta.freq}</span>
        <button class="ws-file-btn ${acquired?'success':'primary'}" onclick="${acquired?`downloadFile('${safeName}')`:`acquireFile('${safeName}')`}">
          ${acquired?
            '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>已获取'
            :'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>已获取'
          }
        </button>
      </div>
    </div>`;
  }).join('');
}"""

new_render_stages = """function renderAllStages(){
  const el=document.getElementById('wsStages');
  if(!el)return;
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
      const safeName=f.name.replace(/'/g,"\\\\'");
      const meta=getCurrentFileMeta(idNum)||{desc:'',points:[],freq:'持续更新',realtime:false};
      const sizeInfo=fmt(f.size);
      const sizeMatch=sizeInfo.match(/^([\\d.]+)\\s*(\\D+)$/);
      const sizeNum=sizeMatch?sizeMatch[1]:sizeInfo;
      const sizeUnit=sizeMatch?sizeMatch[2]:'';
      const pointsHtml=(meta.points||[]).map((p,i)=>'<div class="ws-file-point"><span class="ws-file-point-num">'+(i+1)+'</span><span>'+p+'</span></div>').join('');
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
          <button class="ws-file-btn ${downloaded?'success':'primary'}" onclick="downloadSingleFile('${safeName}')">
            ${downloaded?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>重新下载'
            :'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载文件'}
          </button>
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
}"""

html = html.replace(old_render_files, new_render_stages)

# ===== 12. Update openWorkspace and related functions =====
old_open_ws = """function openWorkspace(){
  if(!isLoggedIn()){showLoginModal();return}
  const ws=document.getElementById('workspace');
  if(!ws)return;
  // 同步用户信息
  document.getElementById('wsAvatar').textContent=(currentUser?.name?.[0]||'U').toUpperCase();
  document.getElementById('wsUserName').textContent=currentUser?.name||'—';
  document.getElementById('wsUserEmail').textContent=currentUser?.email||'—';
  document.getElementById('wsGreet').textContent='欢迎你，'+(currentUser?.name||'朋友');
  // 渲染个人区域
  renderGoalCard();
  renderDayCounter();
  // 渲染总览
  renderOverview();
  // 渲染步骤
  renderWorkspaceSteps();
  updateWorkspaceStats();
  // 默认进入当前步骤
  currentStep=1;
  switchStep(1,false);
  // 显示
  ws.style.display='flex';
  document.body.style.overflow='hidden';
}"""

new_open_ws = """function openWorkspace(){
  if(!isLoggedIn()){showLoginModal();return}
  const ws=document.getElementById('workspace');
  if(!ws)return;
  // 同步用户信息
  document.getElementById('wsAvatar').textContent=(currentUser?.name?.[0]||'U').toUpperCase();
  document.getElementById('wsUserName').textContent=currentUser?.name||'—';
  document.getElementById('wsUserEmail').textContent=currentUser?.email||'—';
  // 渲染个人区域
  renderGoalCard();
  // 渲染总览
  renderOverview();
  // 渲染步骤
  renderWorkspaceSteps();
  updateWorkspaceStats();
  // 渲染所有阶段
  renderAllStages();
  // 显示
  ws.style.display='flex';
  document.body.style.overflow='hidden';
}"""

html = html.replace(old_open_ws, new_open_ws)

# ===== 13. Update acquireFile → downloadSingleFile =====
old_acquire = """async function acquireFile(name){
  if(!isLoggedIn()){showLoginModal();return}
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
  forceDownload('files/'+encodeURIComponent(name),name);
  showToast('已获取：'+name.replace(/\\.[^.]+$/,'').replace(/^\\d+(-\\d+)?｜/,''));
  // 更新 UI
  updateWorkspaceStats();
  renderWorkspaceSteps();
  renderOverview();
  renderWorkspaceFiles(currentStep);
  updateMemberUI();
}"""

new_download = """async function downloadSingleFile(name){
  if(!isLoggedIn()){showLoginModal();return}
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
    forceDownload('files/'+encodeURIComponent(name),name);
    showToast('文件已开始下载');
  }catch(e){
    showToast('下载失败，请重试');
  }
  // 更新 UI
  updateWorkspaceStats();
  renderWorkspaceSteps();
  renderAllStages();
  updateMemberUI();
}"""

html = html.replace(old_acquire, new_download)

# ===== 14. Add downloadStageFiles function =====
old_download_zip = """function downloadZip(){
  const goal=getCurrentGoal();
  const url='files/'+goal.name+'-启动包.zip';
  forceDownload(url,goal.name+'-启动包.zip');
  showToast('正在下载'+goal.name+'启动包…');
}"""

new_download_zip = """function downloadZip(){
  const goal=getCurrentGoal();
  const url='files/启点蓝图启动包.zip';
  forceDownload(url,'启点蓝图启动包.zip');
  showToast('正在下载完整启动包…');
}
function downloadStageFiles(stepId){
  const files=getStepFiles(stepId);
  if(!files.length){showToast('该阶段暂无文件');return}
  // Batch trigger downloads one by one
  files.forEach(f=>{
    if(!isFileAcquired(f.name)){
      userSpace.unshift({name:f.name,time:Date.now()});
      if(!sbReady) localStorage.setItem('qdbp_space',JSON.stringify(userSpace));
    }
    if(sbReady&&currentUser?.id){
      supabaseClient.from('user_files').insert({user_id:currentUser.id,file_name:f.name}).catch(()=>{});
    }
    forceDownload('files/'+encodeURIComponent(f.name),f.name);
  });
  showToast('正在下载'+files.length+' 个文件…');
  updateWorkspaceStats();
  renderWorkspaceSteps();
  renderAllStages();
}"""

html = html.replace(old_download_zip, new_download_zip)

# ===== 15. Update sendAiChat for popup mode =====
old_chat = """function sendAiChat(){
  const input=document.getElementById('aiChatInput');
  if(!input)return;
  const q=input.value.trim();
  if(!q){
    showToast('请输入问题');
    return;
  }
  showToast('起点已收到：'+q+' （AI 对话功能开发中）');
  input.value='';
}"""

new_chat = """function toggleAiChat(){
  const popup=document.getElementById('aiChatPopup');
  if(!popup)return;
  popup.style.display=popup.style.display==='block'?'none':'block';
}
function sendAiChat(){
  const input=document.getElementById('aiChatInput');
  if(!input)return;
  const q=input.value.trim();
  if(!q){
    showToast('请输入问题');
    return;
  }
  // Add user message to chat
  const body=document.querySelector('.ai-popup-body');
  if(body){
    body.innerHTML+='<div class="ai-popup-msg user">'+q+'</div>';
    body.scrollTop=body.scrollHeight;
  }
  // Simulate bot response
  setTimeout(()=>{
    if(body){
      body.innerHTML+='<div class="ai-popup-msg bot">收到你的问题。我是专为启动包使用设计的助手，可以帮你了解文件下载顺序、各阶段如何配合使用等。更多智能回答正在开发中。</div>';
      body.scrollTop=body.scrollHeight;
    }
  },500);
  input.value='';
}"""

html = html.replace(old_chat, new_chat)

# ===== 16. Remove renderDayCounter calls =====
html = html.replace('  renderDayCounter();\n', '')

# ===== 17. Show downloads =====
show_downloads_js = """
function showDownloads(){
  showToast('查看我的下载记录（功能开发中）');
  // Scroll to stages
  const stages=document.getElementById('wsStages');
  if(stages) stages.scrollIntoView({behavior:'smooth'});
}"""
html = html.replace("function showMorePackages", show_downloads_js + "\nfunction showMorePackages")

# ===== 18. Update updateWorkspaceStats =====
old_stats = """function updateWorkspaceStats(){
  document.getElementById('wsAcquiredCount').textContent=userSpace.length;
  const totalFiles=getCurrentFiles().length;
  document.getElementById('wsTotalCount').textContent=totalFiles;
  // 进度
  const steps=getCurrentSteps();
  const completedSteps=steps.filter(s=>{
    const total=getStepFiles(s.id).length;
    return total>0&&getStepAcquiredCount(s.id)===total;
  }).length;
  document.getElementById('wsProgressNum').textContent=completedSteps+'/'+steps.length;
  document.getElementById('wsProgressBar').style.width=steps.length?(completedSteps/steps.length*100)+'%':'0%';
}"""

new_stats = """function updateWorkspaceStats(){
  const totalFiles=getCurrentFiles().length;
  const downloadedCount=userSpace.length;
  // 文件下载进度
  document.getElementById('wsProgressNum').textContent=downloadedCount+'/'+totalFiles;
  document.getElementById('wsProgressBar').style.width=totalFiles?(downloadedCount/totalFiles*100)+'%':'0%';
}"""

html = html.replace(old_stats, new_stats)

# ===== 19. Clean up old ws-welcome responsive references =====
html = html.replace(
    "  .ws-welcome{flex-direction:column;align-items:flex-start;gap:14px}\n  .ws-welcome-greet{font-size:17px}",
    "  .ws-banner{flex-direction:column;align-items:flex-start;gap:12px}"
)

html = html.replace(
    "  .ws-goal-quote{font-size:12px;padding:6px 10px}",
    ""
)

# ===== 20. Write =====
with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Workspace CSS and JS rebuilt")
print(f"Final size: {len(html)} chars")
