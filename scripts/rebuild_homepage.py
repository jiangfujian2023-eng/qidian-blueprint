#!/usr/bin/env python3
"""Rebuild homepage per the spec document."""

import re

with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ========== 1. Page title & description ==========
html = html.replace(
    '<title>启点蓝图 · 目标启动引擎</title>\n<meta name="description" content="启点蓝图 — Start · Build · Future · 目标启动引擎">',
    '<title>启点蓝图｜把重要目标变成可以开始的行动路径</title>\n<meta name="description" content="启点蓝图将经过筛选的真实经验与个人现实条件结合，帮助用户找到适合自己的启动路径和下一步行动。">'
)

# ========== 2. CSS variables ==========
old_css = """  --brand-dark:#1a3a5c;
  --brand:#2563eb;
  --brand-mid:#3b82f6;
  --brand-light:#7eb3e8;
  --brand-soft:#dbeafe;
  --brand-fade:#eff6ff;
  --brand-mist:#f5f9ff;
  /* Theme */
  --bg:#ffffff;
  --bg-soft:#f5f9ff;
  --bg-card:#ffffff;
  --bg-elevated:#ffffff;
  --text:#0a1929;
  --text-secondary:#4a5568;
  --text-tertiary:#94a3b8;
  --border:rgba(37,99,235,0.08);
  --border-strong:rgba(37,99,235,0.18);
  --accent:var(--brand);
  --accent-light:var(--brand-soft);
  --accent-dark:var(--brand-dark);
  --accent-text:#ffffff;
  --hero-from:#f0f7ff;
  --hero-to:#dbeafe;
  --tag-bg:rgba(37,99,235,0.06);"""

new_css = """  --brand-dark:#0B2A4A;--brand:#2F6BFF;--brand-mid:#4A82FF;--brand-light:#7BA1FF;
  --brand-soft:#EBF0FF;--brand-fade:#F3F7FF;--brand-mist:#F8FAFF;
  --bg:#ffffff;--bg-soft:#F3F7FF;--bg-card:#ffffff;
  --text:#0B2A4A;--text-secondary:#45607A;--text-tertiary:#8FA6BD;
  --border:rgba(47,107,255,0.08);--border-strong:rgba(47,107,255,0.18);
  --shadow-sm:0 1px 3px rgba(11,42,74,0.06);--shadow-md:0 4px 16px rgba(11,42,74,0.08);
  --shadow-lg:0 12px 40px rgba(11,42,74,0.1);"""

html = html.replace(old_css, new_css)

# ========== 3. Replace nav links ==========
old_nav = """      <div class="nav-links">
        <a href="#products">启动包</a>
        <div class="scene-select" id="sceneSelect">
          <a href="javascript:void(0)" class="scene-trigger" onclick="toggleSceneMenu(event)">
            场景
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="scene-arrow"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="scene-menu" id="sceneMenu">
            <a href="kaoyan.html" class="scene-item" onclick="closeSceneMenu()">
              <div class="scene-item-icon" style="background:linear-gradient(135deg,#5b21b6,#a78bfa)">🎓</div>
              <div class="scene-item-info">
                <div class="scene-item-name">考研择校启动包 <span class="scene-item-tag active">已上线</span></div>
                <div class="scene-item-desc">从自我定位到报考决策</div>
              </div>
            </a>
            <a href="zhaopin.html" class="scene-item" onclick="closeSceneMenu()">
              <div class="scene-item-icon" style="background:linear-gradient(135deg,#1e40af,#60a5fa)">🏢</div>
              <div class="scene-item-info">
                <div class="scene-item-name">央企求职启动包 <span class="scene-item-tag active">已上线</span></div>
                <div class="scene-item-desc">招聘信息 + 笔试面试全攻略</div>
              </div>
            </a>
          </div>
        </div>
        <div class="version-select" id="versionSelect">
          <a href="javascript:void(0)" class="version-trigger" onclick="toggleVersionMenu(event)">
            版本
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="version-arrow"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="version-menu" id="versionMenu">
            <div class="version-item active" data-version="student" onclick="selectVersion('student',event)">
              <div class="version-item-icon">🎓</div>
              <div class="version-item-info">
                <div class="version-item-name">大学生版 <span class="version-item-current">当前</span></div>
                <div class="version-item-desc">面向在校生的关键节点启动引擎</div>
              </div>
            </div>
            <div class="version-item disabled" data-version="startup" onclick="selectVersion('startup',event)">
              <div class="version-item-icon">🚀</div>
              <div class="version-item-info">
                <div class="version-item-name">创业板 <span class="version-item-soon">即将上线</span></div>
                <div class="version-item-desc">面向创业者的资源对接平台</div>
              </div>
            </div>
          </div>
        </div>
        <a href="#value">关于我们</a>
        <a href="javascript:void(0)" onclick="isLoggedIn()?openWorkspace():showLoginModal()" id="navAuth">登录</a>
      </div>
      <div class="region-select" id="regionSelect">
        <button class="region-btn" onclick="toggleRegionMenu(event)">
          <span class="region-flag" id="regionFlag">🇨🇳</span>
          <span class="region-name" id="regionName">中国</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="region-menu" id="regionMenu">
          <div class="region-item active" data-region="china" onclick="selectRegion('china',event)">
            <span class="region-flag">🇨🇳</span>
            <span class="region-item-name">中国</span>
            <span class="region-item-status current">当前</span>
          </div>
          <div class="region-item" data-region="thailand" onclick="selectRegion('thailand',event)">
            <span class="region-flag">🇹🇭</span>
            <span class="region-item-name">泰国</span>
            <span class="region-item-status beta">内测中</span>
          </div>
          <div class="region-item disabled" data-region="usa" onclick="selectRegion('usa',event)">
            <span class="region-flag">🇺🇸</span>
            <span class="region-item-name">美国</span>
            <span class="region-item-status soon">敬请期待</span>
          </div>
          <div class="region-item disabled" data-region="japan" onclick="selectRegion('japan',event)">
            <span class="region-flag">🇯🇵</span>
            <span class="region-item-name">日本</span>
            <span class="region-item-status soon">敬请期待</span>
          </div>
          <div class="region-item disabled" data-region="korea" onclick="selectRegion('korea',event)">
            <span class="region-flag">🇰🇷</span>
            <span class="region-item-name">韩国</span>
            <span class="region-item-status soon">敬请期待</span>
          </div>
        </div>
      </div>"""

new_nav = """      <div class="nav-links">
        <a href="#how">如何工作</a>
        <a href="#cases">案例</a>
        <a href="#products">启动包</a>
        <a href="javascript:void(0)" onclick="isLoggedIn()?openWorkspace():showLoginModal()" id="navAuth">我的空间</a>
      </div>"""

html = html.replace(old_nav, new_nav)

# ========== 4. Replace hero left content ==========
old_hero_text = """      <div class="hero-badge">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--brand)"></span>
        AI驱动的个人启动系统
      </div>
      <h1>
        把目标变成<br>
        可以开始的行动路径
      </h1>
      <p class="hero-sub">
        启点蓝图，将已验证经验转化为<br>
        适合你的下一步行动。
      </p>
      <a href="#products" class="hero-cta">
        开始我的蓝图
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a href="#products" class="hero-cta-ghost">
        查看启动包
      </a>

      <div class="hero-values">
        <div class="hv-item">
          <div class="hv-icon">✓</div>
          <div class="hv-text">
            <div class="hv-title">已验证经验</div>
            <div class="hv-desc">来自真实成功者</div>
          </div>
        </div>
        <div class="hv-item">
          <div class="hv-icon">→</div>
          <div class="hv-text">
            <div class="hv-title">个性化路径</div>
            <div class="hv-desc">基于你的目标定制</div>
          </div>
        </div>
        <div class="hv-item">
          <div class="hv-icon">▸</div>
          <div class="hv-text">
            <div class="hv-title">分步行动</div>
            <div class="hv-desc">拆解到可执行的下一步</div>
          </div>
        </div>
        <div class="hv-item">
          <div class="hv-icon">⟳</div>
          <div class="hv-text">
            <div class="hv-title">持续陪伴</div>
            <div class="hv-desc">从开始到达成一路同行</div>
          </div>
        </div>
      </div>"""

new_hero_text = """      <div class="hero-badge">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--brand)"></span>
        AI 驱动的个人启动系统
      </div>
      <h1>
        把重要目标，<br>
        变成可以开始的<em>行动路径</em>。
      </h1>
      <p class="hero-sub">
        启点蓝图将经过筛选的真实经验与个人现实条件结合，<br>
        帮助你找到适合自己的下一步。
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:0">
        <a href="#products" class="hero-cta">
          选择我的启动方向
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="javascript:void(0)" class="hero-cta-ghost" onclick="document.getElementById('videoModal').classList.add('show')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          观看完整介绍
        </a>
      </div>"""

html = html.replace(old_hero_text, new_hero_text)

# ========== 5. Replace hero right visual ==========
old_hero_visual = """    <div class="hero-visual" style="animation:fadeUp 0.8s 0.35s both;position:relative;max-height:520px">
      <!-- Decorative blob behind -->
      <div style="position:absolute;top:-20px;right:-20px;width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#7eb3e8,#2563eb);opacity:0.18;filter:blur(30px);z-index:0"></div>
      <div style="position:absolute;bottom:10%;left:-30px;width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1e6b5e);opacity:0.15;filter:blur(30px);z-index:0"></div>

      <!-- Main image card with 3D tilt -->
      <div class="hv-main" style="position:relative;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px -10px rgba(10,25,41,0.35);transform:perspective(1000px) rotateY(-3deg) rotateX(2deg);transition:transform 0.6s cubic-bezier(0.16,1,0.3,1);z-index:2">
        <img src="assets/images/kaoyan/kaoyan-cover.png" alt="" style="display:block;width:100%;height:100%;object-fit:cover;aspect-ratio:4/5">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,25,41,0.0) 30%,rgba(10,25,41,0.5) 100%);pointer-events:none"></div>

        <!-- Top brand badge -->
        <div style="position:absolute;top:20px;left:20px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;background:rgba(255,255,255,0.18);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);font-size:11px;color:#fff;font-weight:500;z-index:3">
          <span style="width:6px;height:6px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981"></span>
          启点蓝图 · 考研择校
        </div>
      </div>

      <!-- Floating mini card 1: 明确目标 -->
      <div style="position:absolute;top:16%;left:-30px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px 16px;box-shadow:0 8px 24px rgba(10,25,41,0.12);z-index:4;backdrop-filter:blur(8px)">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#2563eb,#7eb3e8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;flex-shrink:0">🎯</div>
          <div style="font-size:12px;font-weight:600;color:var(--text)">明确目标</div>
        </div>
      </div>

      <!-- Floating mini card 2: 生成路径 -->
      <div style="position:absolute;top:40%;right:-25px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px 16px;box-shadow:0 8px 24px rgba(10,25,41,0.12);z-index:4;backdrop-filter:blur(8px)">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;flex-shrink:0">→</div>
          <div style="font-size:12px;font-weight:600;color:var(--text)">生成路径</div>
        </div>
      </div>

      <!-- Floating mini card 3: 开始行动 -->
      <div style="position:absolute;bottom:18%;left:-25px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px 16px;box-shadow:0 8px 24px rgba(10,25,41,0.12);z-index:4;backdrop-filter:blur(8px)">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;flex-shrink:0">🚀</div>
          <div style="font-size:12px;font-weight:600;color:var(--text)">开始行动</div>
        </div>
      </div>"""

new_hero_visual = """    <div class="hero-visual" style="animation:fadeUp 0.8s 0.35s both;position:relative">
      <div class="video-placeholder" id="heroVideo" onclick="document.getElementById('videoModal').classList.add('show')">
        <img src="assets/images/kaoyan/kaoyan-cover.png" alt="启点蓝图品牌视频" style="display:block;width:100%;object-fit:cover;border-radius:16px;box-shadow:0 20px 50px -10px rgba(11,42,74,0.3)">
        <div class="video-placeholder-overlay">
          <div class="video-play-btn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>"""

html = html.replace(old_hero_visual, new_hero_visual)

# ========== 6. Remove hero-values CSS since we deleted the HTML ==========
html = html.replace(
    ".hero-values{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:36px;animation:fadeUp 0.7s 0.3s both}\n.hv-item{display:flex;align-items:center;gap:10px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px 14px;transition:all 0.2s ease}\n.hv-item:hover{border-color:var(--border-strong)}\n.hv-icon{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--brand-soft),var(--brand-fade));display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--brand);font-weight:700;flex-shrink:0}\n.hv-title{font-size:13px;font-weight:600;color:var(--text)}\n.hv-desc{font-size:11px;color:var(--text-tertiary);margin-top:1px}",
    "/* hero-values removed per redesign */"
)

html = html.replace(
    "  .hero-values{grid-template-columns:1fr 1fr;gap:8px}",
    "  /* hero-values removed per redesign */"
)

# ========== 7. Add video modal HTML ==========
video_modal = """
<!-- ════ VIDEO MODAL ════ -->
<div class="video-overlay" id="videoModal" onclick="if(event.target===this)this.classList.remove('show')">
  <div class="video-modal">
    <button class="video-close" onclick="document.getElementById('videoModal').classList.remove('show')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <div class="video-frame">
      <p style="text-align:center;color:var(--text-secondary);padding:60px 20px">视频即将上线</p>
    </div>
  </div>
</div>

<!-- ════ FOOTER ════ -->
"""
html = html.replace("<!-- ════ FOOTER ════ -->", video_modal)

# ========== 8. Replace matrix section with "启点如何工作" ==========
old_matrix_start = '<!-- ════════════════════════════════════════\n     PRODUCT MATRIX (Claude 风格 3 卡片)\n     ════════════════════════════════════════ -->\n<section class="matrix-section" id="matrix">'
new_how = '''<!-- ════════════════════════════════════════
     HOW IT WORKS
     ════════════════════════════════════════ -->
<section class="how-section" id="how">
  <div class="how-inner">
    <div class="how-header reveal">
      <h2>从真实经验，到你的下一步。</h2>
    </div>
    <div class="how-steps">
      <div class="how-step reveal">
        <div class="how-step-num">01</div>
        <h3 class="how-step-title">筛选真实经验</h3>
        <p class="how-step-desc">从大量成功案例中提取可复用的关键要素。</p>
      </div>
      <div class="how-step reveal">
        <div class="how-step-num">02</div>
        <h3 class="how-step-title">识别适用条件</h3>
        <p class="how-step-desc">匹配你的具体背景、资源和时间节点。</p>
      </div>
      <div class="how-step reveal">
        <div class="how-step-num">03</div>
        <h3 class="how-step-title">生成启动路径</h3>
        <p class="how-step-desc">形成从当前状态到目标的分步路线图。</p>
      </div>
      <div class="how-step reveal">
        <div class="how-step-num">04</div>
        <h3 class="how-step-title">提供行动工具</h3>
        <p class="how-step-desc">每步配套可直接使用的工具和模板。</p>
      </div>
    </div>
  </div>
</section>

<section class="principles-section" id="principles">
  <div class="principles-inner">
    <div class="principles-header reveal">
      <h2>启点只留下真正有用的部分。</h2>
    </div>
    <div class="principles-grid">
      <div class="principle-card reveal">
        <div class="principle-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <p>不堆资料，只保留对当前目标真正有用的内容。</p>
      </div>
      <div class="principle-card reveal">
        <div class="principle-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <p>不照搬经验，只选择符合用户现实条件的方法。</p>
      </div>
      <div class="principle-card reveal">
        <div class="principle-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <p>不止给建议，只交付可以开始的下一步。</p>
      </div>
    </div>
  </div>
</section>'''

html = html.replace(old_matrix_start, new_how)

# ========== 9. Replace CORE VALUE section with "真实案例流" ==========
# Find the section and replace it
old_core_value_start = '<!-- ════════════════════════════════════════\n     CORE VALUE\n     ════════════════════════════════════════ -->\n<section class="value-section" id="value">'
new_cases = '''<!-- ════════════════════════════════════════
     CASES (真实案例流)
     ════════════════════════════════════════ -->
<section class="cases-section" id="cases" style="display:none">
  <div class="cases-inner">
    <div class="cases-header reveal">
      <h2>别人走过的路，如何变成你的起点。</h2>
      <p class="sec-sub">我们从真实经历中提炼条件、选择、风险和第一步，而不是只展示成功结果。</p>
    </div>
  </div>
</section>'''

html = html.replace(old_core_value_start, new_cases)

# ========== 10. Replace prod-section with only 2 cards ==========
# Find the prod-section start and replace content
old_prod_header = '''    <div class="prod-header reveal">
      <div class="section-tag">更多场景 · 持续上线</div>
      <h2 style="margin-bottom:10px">目标启动引擎</h2>
      <p class="sec-sub" style="color:var(--text-secondary);font-size:15px">
        8 大场景覆盖关键人生节点，持续更新中
      </p>
    </div>

    <div class="prod-grid">'''

new_prod_header = '''    <div class="prod-header reveal">
      <h2>选择你准备开始的重要目标。</h2>
    </div>

    <div class="prod-grid">'''

html = html.replace(old_prod_header, new_prod_header)

# Replace the 8 product cards with just 2
old_prod_end = '''    </div>
  </div>
</section>

<!-- ════════════════════════════════════════
     HIGHLIGHTS CARD
     ════════════════════════════════════════ -->'''

# Find the end of the prod-grid (after 8 cards) and before HIGHLIGHTS
new_prod_cards = '''      <div class="prod-card active" onclick="window.location.href='zhaopin.html'">
        <div class="pc-bg gradient-blue"></div>
        <div class="pc-over"></div>
        <div class="pc-body">
          <div class="pc-icon">🏢</div>
          <div>
            <h4>大学生央企求职启动包</h4>
            <p class="pc-sub">7 天看懂求职路径、筛选真实机会、准备材料并完成首批投递。</p>
          </div>
          <div class="pc-meta-tag">可售测试版</div>
        </div>
      </div>
      <div class="prod-card">
        <div class="pc-bg gradient-purple"></div>
        <div class="pc-over"></div>
        <div class="pc-body">
          <div class="pc-badge soon" style="position:absolute;top:14px;right:14px;z-index:3;background:rgba(245,158,11,.92);color:#fff;border-radius:100px;font-size:10px;font-weight:600;padding:4px 12px">即将开放</div>
          <div class="pc-icon">🎓</div>
          <div>
            <h4>大学生考研择校启动包</h4>
            <p class="pc-sub">从自我定位到院校筛选，建立清晰的择校决策路径。</p>
          </div>
          <div class="pc-meta-tag">修订内测中</div>
        </div>
      </div>
      <p class="prod-footnote">更多方向将在真实需求验证后逐步开放。</p>'''

# Find the 8 cards and replace with 2
# Use a regex to find the 8 cards pattern
cards_start = html.find('      <div class="prod-card active" onclick="window.location.href')
cards_end = html.find('    </div>\n  </div>\n</section>\n\n<!-- ════════════════════════════════════════\n     HIGHLIGHTS CARD', cards_start)
if cards_start > 0 and cards_end > 0:
    html = html[:cards_start] + new_prod_cards + html[cards_end:]

# ========== 11. Replace footer ==========
old_footer = '''<!-- ════ FOOTER ════ -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="assets/images/logo.png" alt="启点蓝图" style="width:32px;height:32px;border-radius:8px">
      <div class="footer-name">启点蓝图</div>
      <div class="footer-sub">Start · Build · Future</div>
    </div>
    <div class="footer-links">
      <div class="fl-col">
        <h5>产品</h5>
        <a href="#products">考研择校启动包</a>
        <a href="#products">央企求职启动包</a>
      </div>
      <div class="fl-col">
        <h5>公司</h5>
        <a href="#value">关于我们</a>
        <a href="#">服务协议</a>
        <a href="#">隐私政策</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 启点蓝图 BLUEPRINT · 让努力有迹可循</p>
  </div>
</footer>'''

new_footer = '''<!-- ════ FOOTER ════ -->
<footer class="footer" id="about">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="assets/images/logo.png" alt="启点蓝图" style="width:32px;height:32px;border-radius:8px">
      <div class="footer-name">启点蓝图</div>
      <div class="footer-sub">把重要目标变成可以开始的行动路径</div>
    </div>
    <div class="footer-links">
      <div class="fl-col">
        <h5>启动包</h5>
        <a href="zhaopin.html">央企求职启动包</a>
        <a href="kaoyan.html">考研择校启动包</a>
      </div>
      <div class="fl-col">
        <h5>关于启点</h5>
        <a href="#how">如何工作</a>
        <a href="#cases">案例</a>
      </div>
      <div class="fl-col">
        <h5>使用</h5>
        <a href="#">使用协议</a>
        <a href="#">隐私政策</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 启点蓝图 BLUEPRINT · 把重要目标变成可以开始的行动路径</p>
  </div>
</footer>'''

html = html.replace(old_footer, new_footer)

# ========== 12. Add 结尾行动区 section ==========
# Add after the prod-section and before the video modal
end_act = '''</section>

<!-- ════════════════════════════════════════
     FINAL ACTION
     ════════════════════════════════════════ -->
<section class="final-section" id="final">
  <div class="final-inner">
    <h2 class="final-title">每一个重要目标，<br>都值得一个清晰的开始。</h2>
    <p class="final-sub">选择一个启动方向，从适合你的第一步开始。</p>
    <div class="final-actions">
      <a href="#products" class="final-btn primary">查看启动包</a>
      <a href="javascript:void(0)" class="final-btn secondary" onclick="isLoggedIn()?openWorkspace():showLoginModal()">进入我的空间</a>
    </div>
  </div>
</section>

<!-- ════ VIDEO MODAL ════>'''

# Insert after prod-section
html = html.replace(
    '</section>\n\n<!-- ════ VIDEO MODAL ════ -->',
    end_act
)

# ========== 13. Write output ==========
with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done! File has been rewritten.")
print(f"Final length: {len(html)} chars")
