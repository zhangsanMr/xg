#!/bin/bash

echo "🚀 启动 CICC 中金公司网站..."
echo ""
echo "📦 检查依赖..."

if [ ! -d "node_modules" ]; then
    echo "⚠️  未找到 node_modules，正在安装依赖..."
    npm install
fi

echo ""
echo "✅ 依赖检查完成"
echo ""
echo "🌐 启动开发服务器..."
echo "   访问地址: http://localhost:5173/"
echo ""
echo "💡 提示："
echo "   - 默认语言：繁體中文"
echo "   - 可在页面右上角切换语言（繁體中文/简体中文/英文/日语/韩语/越南语）"
echo "   - 首页会自动进行安全检测动画"
echo ""

npm run dev
