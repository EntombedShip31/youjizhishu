# 游迹智述 - 旅行AI助手

一个基于DeepSeek AI的旅行助手网站应用。

## 云端部署（Render）- 推荐方案

### 1. 准备工作

- 确保代码已推送到GitHub
- 注册一个 [Render账号](https://render.com)

### 2. 部署步骤

#### 步骤1：创建新Web服务

1. 访问 [dashboard.render.com](https://dashboard.render.com)
2. 点击 "New" → "Web Service"
3. 连接并选择你的 `youjizhishu` GitHub仓库

#### 步骤2：配置服务

填写以下配置：
- **Name**: `youjizhishu` (或你喜欢的名字)
- **Runtime**: `Node`
- **Region**: 选择离你近的区域
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: 选择 `Free`

#### 步骤3：添加环境变量

在 "Environment" 部分添加环境变量：

```
DEEPSEEK_API_KEY = 你的DeepSeek API密钥
```

⚠️ **重要**：去DeepSeek控制台重新生成新的API密钥！

#### 步骤4：部署

点击 "Create Web Service" 按钮，等待部署完成！

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
