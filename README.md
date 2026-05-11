# 游迹智述 - 旅行AI助手

一个基于DeepSeek AI的旅行助手网站应用。

## 云端部署（Vercel）- 推荐方案

### 1. 准备工作

- 确保代码已推送到GitHub
- 注册一个 [Vercel账号](https://vercel.com)

### 2. 部署步骤

#### 步骤1：连接GitHub仓库

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 用GitHub账号登录
3. 导入你的 `youjizhishu` 仓库

#### 步骤2：配置环境变量

在Vercel项目设置中添加环境变量：

```
DEEPSEEK_API_KEY = 你的DeepSeek API密钥
```

⚠️ **重要**：去DeepSeek控制台重新生成新的API密钥！

#### 步骤3：部署

点击 "Deploy" 按钮，等待部署完成！

### 3. 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量模板
cp .env.example .env
# 编辑 .env 文件，填入你的API密钥

# 启动开发服务器
npm run dev
```

访问：`http://localhost:3000`

## 安全说明

✅ API密钥已安全存储在服务端
✅ 前端不再暴露API密钥
✅ 通过 `/api/chat` 代理调用DeepSeek API
