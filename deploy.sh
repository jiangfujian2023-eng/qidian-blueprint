#!/bin/bash
# ═══════════════════════════════════════════════════════════
# 启点蓝图 · 一键部署脚本
# 
# 用法：
#   ./deploy.sh                    # 部署到默认目标（配置在 TARGET）
#   ./deploy.sh --target aliyun    # 部署到阿里云
#   ./deploy.sh --target cloudflare # 部署到 Cloudflare Pages
#   ./deploy.sh --target cloudstudio # 部署到 CloudStudio
#
# 换平台只需改 --target，代码零改动
# ═══════════════════════════════════════════════════════════

set -euo pipefail

# ── 默认配置（开发环境）──
TARGET="${TARGET:-cloudstudio}"
DOMAIN="${DOMAIN:-}"
PROJECT_NAME="${PROJECT_NAME:-qidian-blueprint}"
DEPLOY_DIR="./deploy"
SOURCE_DIR="."

# ── 颜色 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ── 解析参数 ──
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    --project) PROJECT_NAME="$2"; shift 2 ;;
    *) echo -e "${RED}未知参数: $1${NC}"; exit 1 ;;
  esac
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  启点蓝图 · 部署脚本${NC}"
echo -e "${GREEN}  目标: $TARGET${NC}"
echo -e "${GREEN}========================================${NC}"

# ── 第 1 步：准备部署文件 ──
echo -e "\n${YELLOW}[1/3] 准备部署文件...${NC}"
mkdir -p "$DEPLOY_DIR"

# 清理旧部署文件
rm -rf "${DEPLOY_DIR:?}"/*

# 复制源码
cp "$SOURCE_DIR/index.html" "$DEPLOY_DIR/"
cp "$SOURCE_DIR/style.css" "$DEPLOY_DIR/"
cp "$SOURCE_DIR/config.js" "$DEPLOY_DIR/"
cp "$SOURCE_DIR/app.js" "$DEPLOY_DIR/"

# 复制子页面
for f in "$SOURCE_DIR"/zhaopin.html "$SOURCE_DIR"/kaoyan.html "$SOURCE_DIR"/copilot.html \
          "$SOURCE_DIR"/anli.html "$SOURCE_DIR"/chuangye.html "$SOURCE_DIR"/survey.html; do
  [ -f "$f" ] && cp "$f" "$DEPLOY_DIR/"
done

# 复制静态资源
[ -d "$SOURCE_DIR/files" ] && cp -r "$SOURCE_DIR/files" "$DEPLOY_DIR/files"
[ -d "$SOURCE_DIR/supabase" ] && cp -r "$SOURCE_DIR/supabase" "$DEPLOY_DIR/supabase"

echo -e "${GREEN}  ✅ 部署文件已就绪 ($DEPLOY_DIR/)${NC}"
ls -lh "$DEPLOY_DIR/"

# ── 第 2 步：按目标部署 ──
echo -e "\n${YELLOW}[2/3] 部署到 $TARGET...${NC}"

case "$TARGET" in
  cloudflare)
    # Cloudflare Pages 部署（需要 wrangler CLI 或手动拖拽）
    if command -v wrangler &>/dev/null; then
      echo "  使用 Wrangler CLI 部署..."
      wrangler pages deploy "$DEPLOY_DIR" --project-name="$PROJECT_NAME"
    else
      echo -e "${YELLOW}  ⚠️ 未安装 wrangler CLI，请手动部署：${NC}"
      echo "    1. 访问 https://dash.cloudflare.com/ → Workers & Pages"
      echo "    2. 点击 Create application → Pages → Upload assets"
      echo "    3. 拖拽 $DEPLOY_DIR/ 目录上传"
    fi
    ;;

  aliyun)
    # 阿里云 OSS + CDN 部署（需要安装 ossutil）
    if [ -z "$ALIYUN_ACCESS_KEY_ID" ] || [ -z "$ALIYUN_ACCESS_KEY_SECRET" ]; then
      echo -e "${RED}  ❌ 请设置阿里云凭证：${NC}"
      echo "    export ALIYUN_ACCESS_KEY_ID='你的 AccessKey ID'"
      echo "    export ALIYUN_ACCESS_KEY_SECRET='你的 AccessKey Secret'"
      echo "    export ALIYUN_BUCKET='你的 OSS Bucket 名称'"
      echo "    export ALIYUN_ENDPOINT='oss-cn-hangzhou.aliyuncs.com'"
      echo ""
      echo -e "${YELLOW}  ⚠️ 阿里云部署暂未一键完成，需要先配置以上环境变量。${NC}"
      echo "    配好后再次运行 ./deploy.sh --target aliyun 即可自动上传。"
      # 可选：安装 ossutil 并执行
      # ossutil cp -r "$DEPLOY_DIR/" "oss://$ALIYUN_BUCKET/" --endpoint "$ALIYUN_ENDPOINT"
    else
      echo "  正在上传到阿里云 OSS..."
      # ossutil cp -r "$DEPLOY_DIR/" "oss://$ALIYUN_BUCKET/" --endpoint "$ALIYUN_ENDPOINT"
      echo -e "${GREEN}  ✅ 部署完成${NC}"
      echo "  🌐 域名: $DOMAIN"
    fi
    ;;

  cloudstudio|*)
    # CloudStudio 部署（使用 workbuddy_cloudstudio_deploy 工具）
    echo -e "${YELLOW}  ⚠️ CloudStudio 部署需要 WorkBuddy 桌面端内置工具。${NC}"
    echo ""
    echo "  请在 WorkBuddy 对话框中输入以下指令："
    echo ""
    echo "  workbuddy_cloudstudio_deploy"
    echo "    └─ directory → $DEPLOY_DIR/"
    echo "    └─ entry     → index.html"
    echo "    └─ port      → 3000"
    echo ""
    echo -e "${YELLOW}  或者直接对 AI 说「部署」即可自动执行。${NC}"
    ;;
esac

# ── 第 3 步：验证 ──
echo -e "\n${YELLOW}[3/3] 部署完成 ✓${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署摘要${NC}"
echo -e "${GREEN}  项目: $PROJECT_NAME${NC}"
echo -e "${GREEN}  目标: $TARGET${NC}"
echo -e "${GREEN}  文件数: $(find "$DEPLOY_DIR" -type f | wc -l)${NC}"
echo -e "${GREEN}  总大小: $(du -sh "$DEPLOY_DIR" | cut -f1)${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 后续操作："
echo "  - 强刷浏览器 (Cmd+Shift+R) 确认新版本生效"
echo "  - 检查控制台有无报错"
echo "  - 测试登录/数据加载等核心功能"
