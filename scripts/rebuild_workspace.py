#!/usr/bin/env python3
"""Rebuild workspace per personal space spec."""

with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ===== 1. Header title & subtitle =====
html = html.replace(
    '<div class="ws-title">启点蓝图 · 工作空间</div>\n        <div class="ws-subtitle">考研择校全流程</div>',
    '<div class="ws-title">启点蓝图 · 我的启动包</div>\n        <div class="ws-subtitle">查看完整路径并下载所需文件</div>'
)

# ===== 2. Top nav: keep 返回首页 + 更多启动包, delete 更多场景, add 我的下载 =====
old_nav = """    <nav class="ws-nav">
      <a class="ws-nav-item" onclick="goHome()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        返回首页
      </a>
      <a class="ws-nav-item" onclick="showMorePackages()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        更多启动包
        <span class="ws-nav-badge">新</span>
      </a>
      <a class="ws-nav-item" onclick="showScenes()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        更多场景
      </a>
    </nav>"""

new_nav = """    <nav class="ws-nav">
      <a class="ws-nav-item" onclick="goHome()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        返回首页
      </a>
      <a class="ws-nav-item" onclick="showMorePackages()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        更多启动包
      </a>
      <a class="ws-nav-item" onclick="showDownloads()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        我的下载
      </a>
    </nav>"""

html = html.replace(old_nav, new_nav)

# ===== 3. Welcome banner - new design =====
old_welcome = """      <div class="ws-welcome">
        <div class="ws-welcome-text">
          <div class="ws-welcome-greet" id="wsGreet">欢迎你</div>
          <div class="ws-welcome-quote">从这里开始你的人生，启动吧！</div>
        </div>
        <button class="ws-zip-btn" onclick="downloadZip()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span class="ws-zip-text">一键下载启动包</span>
          <span class="ws-zip-size">PDF+XLS · ZIP</span>
        </button>
      </div>"""

new_welcome = """      <div class="ws-banner">
        <div class="ws-banner-text">
          <div class="ws-banner-title" id="wsBannerTitle">你的考研择校启动包已经准备好</div>
          <div class="ws-banner-desc">你可以下载完整启动包，也可以按照五个阶段逐步获取文件。</div>
        </div>
        <div class="ws-banner-actions">
          <button class="ws-banner-btn primary" onclick="downloadZip()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            下载完整启动包
          </button>
          <a href="#ws-stage-1" class="ws-banner-btn secondary">按阶段查看文件</a>
        </div>
      </div>"""

html = html.replace(old_welcome, new_welcome)

# ===== 4. Goal card: change to "当前启动包" =====
old_goal = """      <div class="ws-goal-card" id="wsGoalCard">
        <div class="ws-goal-icon" id="wsGoalIcon">🎓</div>
        <div class="ws-goal-info">
          <div class="ws-goal-label">你当前的目标</div>
          <div class="ws-goal-name" id="wsGoalName">考研择校</div>
          <div class="ws-goal-desc" id="wsGoalDesc">从迷茫到上岸的完整路径</div>
        </div>
        <div class="ws-goal-quote" id="wsGoalQuote">祝你一战成硕！</div>
        <button class="ws-goal-switch" onclick="showGoalSwitcher()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          切换目标
        </button>
      </div>"""

new_goal = """      <div class="ws-goal-card" id="wsGoalCard">
        <div class="ws-goal-icon" id="wsGoalIcon">🎓</div>
        <div class="ws-goal-info">
          <div class="ws-goal-label">当前启动包</div>
          <div class="ws-goal-name" id="wsGoalName">大学生考研择校启动包</div>
          <div class="ws-goal-desc" id="wsGoalDesc">从自我定位到最终报考的五阶段使用路径</div>
        </div>
        <button class="ws-goal-switch" onclick="showGoalSwitcher()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          切换启动包
        </button>
      </div>"""

html = html.replace(old_goal, new_goal)

# ===== 5. Progress: "0/5 已完成步骤" → "文件下载进度 0/15" =====
html = html.replace(
    '<div class="ws-progress-label">已完成步骤</div>',
    '<div class="ws-progress-label">文件下载进度</div>'
)

# ===== 6. Sidebar: delete stats + day counter =====
old_sidebar_bottom = """      <div class="ws-sidebar-stats">
        <div class="ws-stat">
          <div class="ws-stat-num" id="wsAcquiredCount">0</div>
          <div class="ws-stat-label">已获取</div>
        </div>
        <div class="ws-stat">
          <div class="ws-stat-num" id="wsTotalCount">15</div>
          <div class="ws-stat-label">总文件</div>
        </div>
      </div>
      <div class="ws-day-card" id="wsDayCard">
        <div class="ws-day-header">
          <span class="ws-day-icon">⏱️</span>
          <span class="ws-day-label" id="wsDayLabel">备考天数</span>
        </div>
        <div class="ws-day-num-wrap">
          <span class="ws-day-num" id="wsDayNum">0</span>
          <span class="ws-day-unit">天</span>
        </div>
        <div class="ws-day-bar"><div class="ws-day-bar-fill" id="wsDayBarFill"></div></div>
        <div class="ws-day-target" id="wsDayTarget">距离 2026 考研还有 <strong id="wsDayTargetNum">0</strong> 天</div>
      </div>"""

html = html.replace(old_sidebar_bottom, '')  # remove both stats and day counter

# ===== 7. Overview: remove stats line, compress =====
old_overview_stats = """          <div class="ws-overview-stats">
            <div class="ws-ov-stat"><span class="ws-ov-num">15</span><span class="ws-ov-lbl">个文件</span></div>
            <div class="ws-ov-stat"><span class="ws-ov-num">5</span><span class="ws-ov-lbl">个步骤</span></div>
            <div class="ws-ov-stat"><span class="ws-ov-num">1</span><span class="ws-ov-lbl">套闭环</span></div>
          </div>"""
html = html.replace(old_overview_stats, '')

old_overview_foot = """        <div class="ws-overview-foot">
          <span>📌 解决「考研择校信息过载、决策困难、流程混乱」三大痛点</span>
          <span class="ws-ov-foot-r">从认知 → 定位 → 筛选 → 分析 → 决策，一条龙闭环</span>
        </div>"""
html = html.replace(old_overview_foot, '')

# ===== 8. Main area: change from switch-view to all-stages-visible =====
# Replace step-header + ws-files with all-stages container
old_main_area = """      <div class="ws-step-header">
        <div>
          <h2 class="ws-step-title" id="wsStepTitle">🧭 了解全局</h2>
          <p class="ws-step-desc" id="wsStepDesc">—</p>
        </div>
        <div class="ws-step-stats">
          <span><strong id="wsStepFileCount">0</strong> 个文件</span>
          <span class="ws-dot">·</span>
          <span><strong id="wsStepAcquiredCount">0</strong> 已获取</span>
        </div>
      </div>
      <div class="ws-files" id="wsFiles"></div>"""

new_main_area = """      <div class="ws-stages" id="wsStages"></div>"""

html = html.replace(old_main_area, new_main_area)

# ===== 9. AI chat bar → floating button =====
old_ai_bar = """  <div class="ai-chat-bar">
    <div class="ai-chat-inner">
      <div class="ai-chat-icon">🤖</div>
      <input class="ai-chat-input" id="aiChatInput" placeholder="有问题问起点..." onkeydown="if(event.key==='Enter'){sendAiChat()}" />
      <button class="ai-chat-send" onclick="sendAiChat()" title="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      </button>
    </div>
    <div class="ai-chat-suggestions">
      <span class="ai-chat-sug" onclick="document.getElementById('aiChatInput').value='我适合考哪个学校？';sendAiChat()">我适合考哪个学校？</span>
      <span class="ai-chat-sug" onclick="document.getElementById('aiChatInput').value='如何评估自己实力？';sendAiChat()">如何评估自己实力？</span>
      <span class="ai-chat-sug" onclick="document.getElementById('aiChatInput').value='冲稳保怎么分配？';sendAiChat()">冲稳保怎么分配？</span>
      <span class="ai-chat-sug" onclick="document.getElementById('aiChatInput').value='目标院校的分数线？';sendAiChat()">目标院校的分数线？</span>
    </div>
    <div class="ai-chat-note">✨ 起点已接入市场上标准的大模型</div>
  </div>"""

new_ai_button = """  <div class="ai-fab" id="aiFab" onclick="toggleAiChat()">
    <div class="ai-fab-icon">💬</div>
    <span class="ai-fab-label">问启点</span>
  </div>
  <div class="ai-chat-popup" id="aiChatPopup" style="display:none">
    <div class="ai-popup-head">
      <span>问启点</span>
      <button class="ai-popup-close" onclick="toggleAiChat()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="ai-popup-body">
      <div class="ai-popup-msg bot">你好！我是启点助手。我可以帮你了解启动包的使用方法，比如先下载什么、文件如何配合使用、当前应进入哪个阶段。</div>
    </div>
    <div class="ai-popup-foot">
      <input class="ai-popup-input" id="aiChatInput" placeholder="输入问题..." onkeydown="if(event.key==='Enter'){sendAiChat()}" />
      <button class="ai-popup-send" onclick="sendAiChat()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      </button>
    </div>
  </div>"""

html = html.replace(old_ai_bar, new_ai_button)

# ===== 10. Write =====
with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Workspace HTML rebuilt")
print(f"Final size: {len(html)} chars")
