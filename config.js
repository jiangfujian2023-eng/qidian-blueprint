// ═══════════════════════════════════════
// 启点蓝图 · 安全配置（前端公开版）
// 此文件仅包含设计上允许前端的公开配置。
// 敏感配置：见 .env.example（仅服务端）
// ═══════════════════════════════════════

// ── Supabase（公钥，设计上可公开）──
window.SUPABASE_URL='https://qprucplfqurxkqrxcgpp.supabase.co';
window.SUPABASE_KEY='sb_publishable_q4sCMrRxa47T6WeKKTs0ig_5ORKCrud';

// ── 埋点（公开）──
window.BEACON_APPKEY='0WEB06U85YBSLJNL';
window.SANDBOX_ID='bb320abbd7e444729e0451e3ef00ce0b';
window.ANALYTICS_TABLE='qdbp_analytics';

// ── 管理后台（已关闭——R1 安全处置）──
// ADMIN_PASSWORD 已移除。管理功能已在前端关闭。
// 如需恢复，须改为服务端验证方式。
