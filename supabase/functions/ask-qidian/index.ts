import { createClient } from "jsr:@supabase/supabase-js@2";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "请先登录后再使用问启点" }, 401);

    const bodyData = await req.json();
    const message: string = bodyData.message;
    const context: any = bodyData.context || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return json({ error: "消息不能为空" }, 400);
    }

    const pkgName = context && context.package ? context.package : "";
    const isKaoyan = pkgName.indexOf("考研") >= 0;
    const target = isKaoyan ? "考研" : "央企";

    // 用 service_role 查询 Channel B 隐性案例库（绕过 RLS，前端不可见）
    let caseBlock = "";
    let aiShouldInvent = false;
    try {
      const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
      );
      const { data: cases, error } = await admin
        .from("success_stories")
        .select("*")
        .eq("target", target)
        .limit(50);
      if (!error && cases && cases.length > 0) {
        const matched = cases.filter(function (c: any) {
          return (
            message.indexOf(c.city) >= 0 ||
            message.indexOf(c.industry) >= 0 ||
            message.indexOf(c.school_type) >= 0 ||
            message.indexOf(c.major) >= 0
          );
        });
        const use = matched.length > 0 ? matched : cases;
        caseBlock = use
          .slice(0, 3)
          .map(function (c: any, i: number) {
            return (
              "案例" +
              (i + 1) +
              "（" +
              (c.city || "") +
              " · " +
              (c.industry || "") +
              " · " +
              (c.level || "") +
              "）：\n" +
              (c.content || "")
            );
          })
          .join("\n\n");
        if (matched.length === 0) aiShouldInvent = true;
      } else {
        aiShouldInvent = true;
      }
    } catch (e) {
      aiShouldInvent = true;
    }

    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      return json({ error: "服务端未配置 DEEPSEEK_API_KEY" }, 500);
    }

    const system = buildSystemPrompt(context, caseBlock, aiShouldInvent);

    const resp = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return json({ error: "DeepSeek 调用失败: " + resp.status + " " + txt }, 502);
    }

    const data = await resp.json();
    const reply =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content.trim()
        : "(未获取到回答)";
    return json({ reply });
  } catch (e: any) {
    return json({ error: "服务异常: " + String(e.message || e) }, 500);
  }
});

function buildSystemPrompt(ctx: any, caseBlock: string, aiShouldInvent: boolean): string {
  var pkgName = ctx && ctx.package ? ctx.package : "未知启动包";
  var steps = Array.isArray(ctx && ctx.steps) ? ctx.steps : [];
  var files = Array.isArray(ctx && ctx.files) ? ctx.files : [];

  var stepText = steps.length > 0
    ? steps.map(function (s: any, i: number) {
        return (i + 1) + ". " + (s.name || "") + ":" + (s.desc || "");
      }).join("\n")
    : "(无步骤信息)";

  var fileText = files.length > 0
    ? files.map(function (f: any) {
        return "- " + (f.name || "") + "(" + (f.cat || "资料") + "):" + (f.desc || "");
      }).join("\n")
    : "(无资料信息)";

  var caseText = caseBlock && caseBlock.trim()
    ? caseBlock
    : (aiShouldInvent
        ? "(库里暂无精确匹配的脱敏案例，请基于用户情况合理生成一个真实可信的同构脱敏案例)"
        : "(无案例)");

  return [
    "你是启点蓝图AI助手「问启点」，服务正在准备升学或求职的大学生。",
    "当前学生使用的启动包是：【" + pkgName + "】。",
    "",
    "阶段路径：",
    stepText,
    "",
    "资料清单：",
    fileText,
    "",
    "可用的脱敏成功案例（来自隐性案例库，已隐去实名，可直接引用，不要重复编造）：",
    caseText,
    "",
    "你的能力：",
    "1. 指导学生按顺序使用启动包，解释每份文件的用途和衔接关系。",
    "2. 帮学生整理资料、归类、列清单、制定使用计划。",
    "3. 针对具体资料给出可用的AI提示词，或基于资料生成笔记大纲。",
    "4. 结合模板指导学生填写简历草稿或求职信（务必用真实经历，不得编造数据）。",
    "5. 回答升学求职通用问题，给出可执行建议。",
    "",
    "正向激励原则（非常重要）：",
    "- 面对“我这种水平有没有机会”类问题，必须先给信心，明确“当然有机会”。",
    "- 优先引用上面提供的脱敏案例：挑 1 个与学生情况（城市/行业/资历）最接近的案例，说明“和你同校同届、资历相近的学长也成功了”。",
    "- 只推 1 个案例，不堆卡片，用自然语言讲清楚可借鉴的路径与动作。",
    "- 若上面没有可引用案例且标记为需生成，则基于用户城市/行业/资历生成一个真实可信的同构脱敏案例，隐去姓名/校名/年份，只保留路径。",
    "",
    "约束：",
    "- 引用案例时保持脱敏，不还原真实姓名、具体校名、入学年份、公司具体部门。",
    "- 只基于上面提供的资料与案例作答，不编造不存在的文件名或数据。",
    "- 语气亲切鼓励，条理清晰多用分点，始终用中文回答。",
  ].join("\n");
}
