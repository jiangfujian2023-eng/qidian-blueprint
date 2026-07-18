#!/usr/bin/env python3
"""Add 央企 files to workspace, update GOALS, make url goal-aware."""

with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ===== 1. Add ZHAOPIN_FILES =====
old_files_end = """const FILES=[
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

function fmt(b){"""

new_data = """const FILES=[
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
  {id:"02",name:"02｜央企招聘机会表_数据快照_2026-07-14.xlsx",cat:"core",size:175914,step:1},
  {id:"03",name:"03｜央企求职全流程执行表.xlsx",cat:"core",size:11555,step:2},
  {id:"04-1",name:"04-1｜招聘信息与岗位筛选行动卡.pdf",cat:"action",size:1344405,step:1},
  {id:"04-2",name:"04-2｜简历与网申行动卡.pdf",cat:"action",size:1340995,step:2},
  {id:"04-3",name:"04-3｜笔试准备行动卡.pdf",cat:"action",size:1344244,step:3},
  {id:"04-4",name:"04-4｜面试准备行动卡.pdf",cat:"action",size:1345424,step:4},
  {id:"04-5",name:"04-5｜政审与体检行动卡.pdf",cat:"action",size:1498935,step:5},
  {id:"04-6",name:"04-6｜Offer核对与签约行动卡.pdf",cat:"action",size:1340995,step:6},
  {id:"05-1",name:"05-1｜通用简历母版_可编辑.docx",cat:"template",size:1299697,step:2},
  {id:"05-1A",name:"05-1A｜央企求职简历模板_稳重蓝_可编辑.docx",cat:"template",size:1326430,step:2},
  {id:"05-1B",name:"05-1B｜央企求职简历模板_墨绿_可编辑.docx",cat:"template",size:1326430,step:2},
  {id:"05-1C",name:"05-1C｜央企求职简历模板_暖灰_可编辑.docx",cat:"template",size:1326430,step:2},
  {id:"05-2",name:"05-2｜简历与经历写作示例.pdf",cat:"template",size:1345613,step:2},
  {id:"05-3",name:"05-3｜投递材料准备清单.pdf",cat:"template",size:1317637,step:6},
  {id:"05-4",name:"05-4｜AI辅助提示词.pdf",cat:"template",size:1345613,step:6}
];

function getGoalPrefix(){
  if(currentGoalId==='zhaopin') return 'zhaopin/';
  return 'kaoyan/';
}
function fmt(b){"""

html = html.replace(old_files_end, new_data)

# ===== 2. Update url() function to be goal-aware =====
html = html.replace(
    "function url(n){return 'files/'+encodeURIComponent(n)}",
    "function url(n){return 'files/'+getGoalPrefix()+encodeURIComponent(n)}"
)

# ===== 3. Add ZHAOPIN_STEPS =====
old_steps = """const WS_STEPS=[
  {id:1,name:'了解全局',desc:'建立对考研择校的整体认知，明确目标方向，从这里开始你的择校之旅',icon:'🧭'},
  {id:2,name:'自我定位',desc:'评估自身实力与边界，设定冲刺、稳定、保底三个目标层次',icon:'🎯'},
  {id:3,name:'院校筛选',desc:'从海量院校中初筛出候选池，把范围缩到精准的几所目标院校',icon:'🔍'},
  {id:4,name:'数据分析',desc:'深度分析招生数据与考试科目，量化匹配冲稳保三档',icon:'📊'},
  {id:5,name:'决策报考',desc:'完成报考决策与网报准备，把研究转化为可执行的下一步',icon:'✅'}
];"""

new_steps = """const WS_STEPS=[
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
];"""

html = html.replace(old_steps, new_steps)

# ===== 4. Add ZHAOPIN_META =====
old_meta_end = """const FILE_META={
  '00':{desc:'考研择校第一步，快速建立整体认知',points:['5分钟了解考研全貌','建立基本认知框架','明确择校目标'],freq:'持续更新',realtime:false},
  '01':{desc:'完整流程图，按时间线走完一遍',points:['把握择校全流程','知道每一步做什么','避免遗漏关键节点'],freq:'持续更新',realtime:false},
  '02':{desc:'各院校数据汇总 Excel',points:['横向对比所有院校','查询招生人数/分数线','数据驱动决策'],freq:'24小时更新',realtime:true},
  '03':{desc:'任务清单和进度跟踪表',points:['拆分任务到每月','跟踪完成进度','避免遗漏'],freq:'持续更新',realtime:false},
  '04-01':{desc:'评估自己的实力边界',points:['科学评估自身实力','设定合理目标层次','避免好高骛远'],freq:'持续更新',realtime:false},
  '04-02':{desc:'从所有院校中初筛出候选池',points:['快速缩小学校范围','建立候选池','找到适合自己的院校'],freq:'持续更新',realtime:false},
  '04-03':{desc:'用数据匹配冲稳保三档',points:['量化匹配冲稳保','用数据说话','降低决策风险'],freq:'24小时更新',realtime:true},
  '04-04':{desc:'核验招生信息与考试科目',points:['确认最新招生信息','不漏掉关键要求','避免信息差'],freq:'24小时更新',realtime:true},
  '04-05':{desc:'完成最终决策与网报准备',points:['做出理性决策','完成网报流程','冲刺上岸'],freq:'持续更新',realtime:false},
  '05-01':{desc:'个人背景自评表模板',points:['客观评估背景','发现自己的优势','明确提升方向'],freq:'持续更新',realtime:false},
  '05-02':{desc:'院校对比与淘汰记录表',points:['记录淘汰原因','对比候选院校','决策有据可依'],freq:'持续更新',realtime:false},
  '05-03':{desc:'冲稳保三档决策表',points:['科学分配冲稳保','锁定最终志愿','降低风险'],freq:'持续更新',realtime:false},
  '05-04':{desc:'用 AI 辅助择校',points:['用AI提高效率','获取定制化建议','智能决策辅助'],freq:'持续更新',realtime:false},
  '05-05':{desc:'考试科目与简章信息对照',points:['不漏掉任何信息','清晰对比','快速复习'],freq:'24小时更新',realtime:true},
  '06-1':{desc:'使用须知与版权说明',points:['了解使用规则','避免违规','合法使用'],freq:'持续更新',realtime:false}
};"""

new_meta_end = """const FILE_META={
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
  '02':{desc:'2026-07-14 数据快照',points:['浏览200+央企岗位','查看行业分布','筛选可投机会'],freq:'离线快照',realtime:false},
  '03':{desc:'求职进度跟踪表',points:['记录投递进度','管理岗位机会','跟踪材料准备'],freq:'持续更新',realtime:false},
  '04-1':{desc:'从招聘信息中筛选合适岗位',points:['快速筛选岗位','判断招聘有效性','找到投递入口'],freq:'离线快照',realtime:false},
  '04-2':{desc:'准备简历和完成网申',points:['参考投递实践','完成网申填写','避免常见错误'],freq:'持续更新',realtime:false},
  '04-3':{desc:'笔试内容与策略准备',points:['了解笔试范围','掌握备考策略','练习真题题型'],freq:'持续更新',realtime:false},
  '04-4':{desc:'面试类型与应对方法',points:['了解面试形式','准备回答策略','模拟面试场景'],freq:'持续更新',realtime:false},
  '04-5':{desc:'政审材料与体检流程',points:['准备政审材料','安排体检项目','避免延误入职'],freq:'持续更新',realtime:false},
  '04-6':{desc:'Offer 条件核对与签约',points:['核对录用条件','了解薪资构成','完成签约流程'],freq:'持续更新',realtime:false},
  '05-1':{desc:'通用简历母版',points:['可编辑DOCX','适配不同岗位','免费修改使用'],freq:'模板',realtime:false},
  '05-1A':{desc:'央企求职简历模板_稳重蓝',points:['稳重蓝配色','央企HR偏好','可编辑DOCX'],freq:'模板',realtime:false},
  '05-1B':{desc:'央企求职简历模板_墨绿',points:['墨绿配色','正式专业','可编辑DOCX'],freq:'模板',realtime:false},
  '05-1C':{desc:'央企求职简历模板_暖灰',points:['暖灰配色','低调质感','可编辑DOCX'],freq:'模板',realtime:false},
  '05-2':{desc:'优秀简历范例与写作指导',points:['参考优秀案例','学习写作方法','提升简历质量'],freq:'持续更新',realtime:false},
  '05-3':{desc:'投递材料准备清单',points:['逐项核对材料','确保不遗漏','一次性准备齐全'],freq:'持续更新',realtime:false},
  '05-4':{desc:'AI 辅助求职文档编写',points:['用AI优化简历','生成求职信','提升申请质量'],freq:'持续更新',realtime:false}
};"""

html = html.replace(old_meta_end, new_meta_end)

# ===== 5. Update GOALS =====
old_goals = """const GOALS={
  kaoyan:{
    id:'kaoyan',
    name:'考研择校',
    icon:'🎓',
    desc:'从迷茫到上岸的完整路径',
    quote:'祝你一战成硕！',
    color:'blue',
    startDate:null,  // 用用户注册时间
    examDate:'2026-12-26',
    totalSteps:5,
    active:true
  },
  interview:{
    id:'interview',
    name:'央企面试',
    icon:'💼',
    desc:'拿下心仪央企的 offer',
    quote:'祝你拿下心仪 offer！',
    color:'amber',
    startDate:null,
    examDate:null,  // 持续进行
    totalSteps:0,
    active:false
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
};"""

new_goals = """const GOALS={
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
};"""

html = html.replace(old_goals, new_goals)

# ===== 6. Update getCurrentSteps/getCurrentFiles/getCurrentFileMeta =====
old_helpers = """function getCurrentSteps(){
  if(currentGoalId==='kaoyan') return WS_STEPS;
  return [];  // 其他目标暂无步骤
}

function getCurrentFiles(){
  if(currentGoalId==='kaoyan') return FILES;
  return [];  // 其他目标暂无文件
}

function getCurrentFileMeta(id){
  if(currentGoalId==='kaoyan') return FILE_META[id];
  return null;
}"""

new_helpers = """function getCurrentSteps(){
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
}"""

html = html.replace(old_helpers, new_helpers)

# ===== 7. Write =====
with open('/Users/jesson/WorkBuddy/2026-07-16-13-40-21/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ 央企求职数据已接入个人空间")
