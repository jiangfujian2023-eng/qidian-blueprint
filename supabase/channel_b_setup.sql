-- ============================================================
-- Channel B 隐性案例库（仅供 Edge Function 用 service_role 读取）
-- 前端使用 anon key，因已开启 RLS 且无 public policy，无法读取这些表
-- ============================================================

create table if not exists public.success_stories (
  id uuid primary key default gen_random_uuid(),
  target text not null,          -- 央企 / 考研
  city text,                      -- 城市，如 西安
  industry text,                  -- 行业，如 石油
  school_type text,               -- 学校类型，如 西安某高校
  level text,                     -- 资历档位，如 普通资历
  grad_year text,                 -- 届别，如 2023届
  major text,                     -- 专业
  outcome text,                   -- 结果，如 成功上岸西安某石油央企
  content text,                   -- 脱敏案例正文（markdown）
  created_at timestamptz default now()
);

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  target text,
  city text,
  industry text,
  company text,                   -- 已脱敏，如 某石油央企（西安）
  position text,
  deadline text,
  source text,
  created_at timestamptz default now()
);

create table if not exists public.resume_templates (
  id uuid primary key default gen_random_uuid(),
  target text,
  title text,
  content text,                   -- 简历模板正文（markdown）
  created_at timestamptz default now()
);

-- 开启 RLS：默认拒绝所有访问；service_role 在 Edge Function 中绕过 RLS 读取
alter table public.success_stories enable row level security;
alter table public.job_postings enable row level security;
alter table public.resume_templates enable row level security;

-- ============================================================
-- 演示数据：西安 · 石油 · 央企 · 普通资历 · 成功（已脱敏）
-- 后续用真实学员案例逐步替换即可
-- ============================================================

insert into public.success_stories
  (target, city, industry, school_type, level, grad_year, major, outcome, content)
values
('央企','西安','石油','西安某高校','普通资历','2023届','过程装备与控制工程','成功上岸西安某石油央企',
 '小李（化名）就读于西安某高校，专业过程装备与控制工程，成绩中等、无突出实习。大三才决定冲央企，用启点蓝图央企包做了三件事：1）按包里清单逐条补齐简历硬指标（英语、证书）；2）盯紧西安某石油央企秋招时间线，提前两个月练行测与半结构化面试；3）找同校已上岸学长做模拟面试。最终通过校招笔试+面试成功上岸。可借鉴点：普通资历也能行，关键是早规划、按时间线死磕、多模拟。'),

('央企','西安','石油','西安某高校','普通资历','2022届','石油工程','成功上岸西安某石油央企',
 '小张（化名）西安某高校石油工程专业，绩点平平。大二加入启点蓝图，先用央企包做自我盘点，发现短板后补了相关竞赛与证书；秋招时精准投递西安本地石油系统岗位，面试前用包内模板准备了10个行为面试题，顺利拿到 offer。可借鉴点：补短板要有清单，面试准备要具体到题。'),

('央企','西安','石油','西安某高校','普通资历','2024届','油气储运','成功上岸西安某石油央企',
 '小王（化名）西安某高校油气储运专业，非学生干部。按央企包的时间轴从大三上开始准备：刷行测、跟直播、改简历三轮；面试前用包内话术模板练表达，秋招斩获西安石油央企 offer。可借鉴点：普通背景靠时间轴和重复练习逆袭。');

insert into public.job_postings
  (target, city, industry, company, position, deadline, source)
values
('央企','西安','石油','某石油央企（西安）','工艺技术岗','以官方公告为准','启点蓝图整理'),
('央企','西安','石油','某石油央企（西安）','设备管理岗','以官方公告为准','启点蓝图整理');

insert into public.resume_templates
  (target, title, content)
values
('央企','央企简历通用模板',
 '# 央企简历模板\n\n## 基本信息\n- 姓名（脱敏）：\n- 学校 / 专业：\n- 求职意向：\n\n## 教育背景\n- 时间 / 学校 / 专业 / 绩点\n\n## 证书与硬指标\n- 英语、计算机、相关职业资格\n\n## 校园与实践\n- 用 STAR 法则写 2-3 段\n\n## 自我评价\n- 结合岗位关键词');
