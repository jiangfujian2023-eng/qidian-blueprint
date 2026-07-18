#!/usr/bin/env python3
"""Clean up old sections from homepage per spec."""

with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find section boundaries to delete
# We need to keep: NAV, HERO, HOW, PRINCIPLES, CASES, PRODUCTS(2cards), FINAL, VIDEO MODAL, FOOTER
# We need to DELETE:
# 1. Old matrix section (3 cards with numbers) - lines ~992-1035
# 2. Old HIGHLIGHTS CARD section
# 3. Old CORE VALUE / value-section content
# 4. Old 5 PROBLEMS section
# 5. Old highlights-sec section
# 6. Old journey-section
# 7. Old files section
# 8. Old member dashboard section

import re

content = ''.join(lines)

# 1. Delete old matrix section content (the 3 cards with numbers)
# This is between </section> of principles and the HIGHLIGHTS comment
old_matrix = """</section>
  <div class="matrix-inner">
    <div class="matrix-header reveal">
      <div class="section-tag">为什么选择启点蓝图</div>
      <h2 style="margin-bottom:10px">经验 · 路径 · 行动<br>让目标真正开始</h2>
      <p class="sec-sub" style="color:var(--text-secondary);font-size:15px">
        不是提供更多信息，而是把已验证经验转化为适合你的行动路径。
      </p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-card reveal" onclick="window.location.href='zhaopin.html'">
        <div class="mc-icon mc-icon-blue">💡</div>
        <h3 class="mc-title">真实经验</h3>
        <p class="mc-desc">汇聚已验证的方法和案例，站在成功者肩膀上出发</p>
        <div class="mc-data">
          <div class="mc-num">1000<span class="mc-num-plus">+</span></div>
          <div class="mc-num-label">所院校 · 24h 实时更新</div>
        </div>
        <button class="mc-cta">开始我的蓝图 →</button>
      </div>
      <div class="matrix-card reveal matrix-card-featured" onclick="window.location.href='kaoyan.html'">
        <div class="mc-featured-badge">⭐ 推荐</div>
        <div class="mc-icon mc-icon-purple">🧭</div>
        <h3 class="mc-title">行动路径</h3>
        <p class="mc-desc">从目标定位到下一步执行，拆解成可操作的行动清单</p>
        <div class="mc-data">
          <div class="mc-num">70<span class="mc-num-plus">%</span></div>
          <div class="mc-num-label">节省盲目试错时间</div>
        </div>
        <button class="mc-cta mc-cta-primary">开始我的蓝图 →</button>
      </div>
      <div class="matrix-card reveal" onclick="showLoginModal()">
        <div class="mc-icon mc-icon-green">📋</div>
        <h3 class="mc-title">决策支持</h3>
        <p class="mc-desc">帮你减少试错，做出更适合自己的选择，每一步都有依据</p>
        <div class="mc-data">
          <div class="mc-num">3<span class="mc-num-plus">×</span></div>
          <div class="mc-num-label">成功率提升倍数</div>
        </div>
        <button class="mc-cta">开始我的蓝图 →</button>
      </div>
    </div>
    <p class="matrix-foot">📌 14 天免费体验 · 一次注册，所有资源永久可访问</p>
  </div>
</section>"""

content = content.replace(old_matrix, '</section>')

# 2. Delete old HIGHLIGHTS CARD comments + old CORE VALUE section content
# Find from "<!-- HIGHLIGHTS CARD" to the cases-section
old_highlights = re.search(r'(<!-- ═+\n     HIGHLIGHTS CARD\n     ═+ -->\n<!-- ═+\n     CORE VALUE\n     ═+ -->\n)(.*?)(<!-- ═+\n     CASES)', content, re.DOTALL)
if old_highlights:
    content = content.replace(old_highlights.group(0), old_highlights.group(1) + old_highlights.group(3))

# 3. Delete old 5 PROBLEMS section
old_problems = re.search(r'(<!-- ═+\n     5 PROBLEMS\n     ═+ -->\n)<section class="section" id="products">(.*?)</section>', content, re.DOTALL)
# Actually let's find the exact pattern
problems_match = re.search(r'<!-- ═+\n     5 PROBLEMS\n.*?</section>\s*', content, re.DOTALL)
if problems_match:
    content = content.replace(problems_match.group(0), '')

# Also check for old value-section content between cases and products
old_value_content = re.search(r'(<section class="cases-section".*?</section>\s*)(.*?)(<!-- ═+\n.*?PRODUCTS)', content, re.DOTALL)
if old_value_content:
    # Check if there's old value-section content in between
    between = old_value_content.group(2)
    if 'value-card' in between or 'vc-num' in between:
        content = content.replace(old_value_content.group(0), old_value_content.group(1) + old_value_content.group(3))

# 4. Delete old highlights-sec section
highlights_match = re.search(r'<!-- ═+\n.*?HIGHLIGHTS.*?-->\s*<section class="highlights-sec".*?</section>\s*', content, re.DOTALL)
if highlights_match:
    content = content.replace(highlights_match.group(0), '')

# 5. Delete old journey-section
journey_match = re.search(r'<!-- ═+\n.*?JOURNEY.*?-->\s*<section class="journey-section".*?</section>\s*', content, re.DOTALL)
if journey_match:
    content = content.replace(journey_match.group(0), '')

# 6. Delete old files section
files_match = re.search(r'<!-- ═+\n.*?FILES.*?-->\s*<section class="section" id="files">.*?</section>\s*', content, re.DOTALL)
if files_match:
    content = content.replace(files_match.group(0), '')

# 7. Delete old member dashboard section
member_match = re.search(r'<!-- ═+\n.*?MEMBER DASHBOARD.*?-->\s*<section class="member-sec".*?</section>\s*', content, re.DOTALL)
if member_match:
    content = content.replace(member_match.group(0), '')

# 8. Check if final-section exists, if not add it before video modal
if 'final-section' not in content:
    # Add final section before the video modal
    final_html = """
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

"""
    content = content.replace('<!-- ════ VIDEO MODAL ════ -->', final_html + '<!-- ════ VIDEO MODAL ════ -->')

# Write output
with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Report what sections remain
import re
sections = re.findall(r'<section[^>]*>', content)
print(f"Remaining sections: {len(sections)}")
for s in sections:
    print(f"  {s}")
print(f"\nFinal length: {len(content)} chars")
