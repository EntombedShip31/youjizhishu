// 主题系统初始化 - 放在最前面确保立即生效
(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    let effectiveTheme = savedTheme;
    
    if (savedTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            const newPrefersDark = mediaQuery.matches;
            document.documentElement.setAttribute('data-theme', newPrefersDark ? 'dark' : 'light');
        }
    });
})();

// 导航栏组件
class Navigation {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // 创建导航栏HTML
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.innerHTML = `
            <div class="nav-container container">
                <div class="nav-left">
                    <a href="home.html" class="nav-logo">
                        <img src="assets/img/logo.png" alt="游迹智述" class="nav-logo-img">
                        <span class="nav-logo-text">游迹智述</span>
                    </a>
                    <div class="nav-links">
                        <a href="home.html" class="nav-link" data-page="home">
                            <i class="fas fa-home"></i>首页
                        </a>
                        <a href="spot.html" class="nav-link" data-page="spot">
                            <i class="fas fa-map-marked-alt"></i>景点推荐
                        </a>
                        <a href="plan.html" class="nav-link" data-page="plan">
                            <i class="fas fa-route"></i>行程规划
                        </a>
                        <a href="community.html" class="nav-link" data-page="community">
                            <i class="fas fa-users"></i>互动社区
                        </a>
                    </div>
                </div>
                <div class="nav-right">
                    <div class="nav-search">
                        <input type="text" placeholder="搜索景点、攻略...">
                        <button id="navSearchBtn"><i class="fas fa-search"></i></button>
                    </div>
                    <div class="theme-toggle">
                        <button id="themeToggleBtn" class="theme-toggle-btn">
                            <i class="fas fa-sun"></i>
                        </button>
                    </div>
                    <div class="nav-ai-assistant">
                        <button id="aiAssistantBtn" class="ai-assistant-btn">
                            <i class="fas fa-robot"></i>
                            <span class="ai-badge">AI</span>
                        </button>
                    </div>
                    <div class="nav-user">
                        <div class="user-menu-trigger">
                            <span id="navUserName">游客</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="user-menu">
                            <a href="profile.html" class="menu-item">
                                <i class="fas fa-user"></i>个人中心
                            </a>
                            <a href="#" class="menu-item">
                                <i class="fas fa-heart"></i>我的收藏
                            </a>
                            <a href="#" class="menu-item">
                                <i class="fas fa-bell"></i>消息通知
                                <span class="badge">3</span>
                            </a>
                            <a href="settings.html" class="menu-item">
                                <i class="fas fa-cog"></i>系统设置
                            </a>
                            <div class="menu-divider"></div>
                            <a href="#" class="menu-item" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i>退出登录
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 插入到页面顶部
        document.body.insertBefore(nav, document.body.firstChild);

        // 设置当前页面的激活状态
        this.setActivePage();
    }

    bindEvents() {
        // 用户菜单触发器
        const menuTrigger = document.querySelector('.user-menu-trigger');
        const userMenu = document.querySelector('.user-menu');
        
        menuTrigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', () => {
            userMenu?.classList.remove('active');
        });

        // 退出登录
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // 导航搜索按钮
        document.getElementById('navSearchBtn')?.addEventListener('click', () => {
            const input = document.querySelector('.nav-search input');
            const keyword = input?.value.trim();
            if (keyword) {
                window.location.href = `spot.html?search=${encodeURIComponent(keyword)}`;
            }
        });

        // 导航搜索回车
        document.querySelector('.nav-search input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('navSearchBtn')?.click();
            }
        });

        // 主题切换按钮
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        this.initThemeButton(themeToggleBtn);
        themeToggleBtn?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // AI助手入口点击事件
        const aiAssistantBtn = document.getElementById('aiAssistantBtn');
        aiAssistantBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openAIAssistant();
        });

        // 更新用户信息
        this.updateUserInfo();
    }

    initThemeButton(btn) {
        if (!btn) return;
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.updateThemeIcon(btn, currentTheme);
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const btn = document.getElementById('themeToggleBtn');
        this.updateThemeIcon(btn, newTheme);
    }

    updateThemeIcon(btn, theme) {
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    openAIAssistant() {
        // 所有页面都使用悬浮AI助手
        this.showFloatingAIAssistant();
    }

    showFloatingAIAssistant() {
        // 检查是否已经存在悬浮AI助手
        if (document.getElementById('floatingAIAssistant')) {
            const floating = document.getElementById('floatingAIAssistant');
            if (floating.classList.contains('minimized')) {
                floating.classList.remove('minimized');
            }
            return;
        }
        
        // 创建悬浮AI助手
        const floatingAIAssistant = document.createElement('div');
        floatingAIAssistant.id = 'floatingAIAssistant';
        floatingAIAssistant.className = 'floating-ai-assistant';
        floatingAIAssistant.innerHTML = `
            <div class="floating-ai-header">
                <div class="floating-ai-title">
                    <i class="fas fa-robot"></i>
                    <h3>游迹智述助手</h3>
                </div>
                <div class="floating-ai-controls">
                    <button class="floating-ai-minimize"><i class="fas fa-window-minimize"></i></button>
                    <button class="floating-ai-close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="floating-ai-messages" id="floatingAIMessages">
                <div class="message ai-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>你好！我是游迹智述的AI助手 👋</p>
                        <p>我可以帮您：</p>
                        <ul>
                            <li>搜索景点信息</li>
                            <li>查询天气预报</li>
                            <li>规划旅行路线</li>
                            <li>推荐当地美食</li>
                        </ul>
                        <p>有什么需要帮助的吗？</p>
                    </div>
                </div>
            </div>
            <div class="quick-actions">
                <button class="quick-btn" data-query="搜索故宫">🏛️ 搜索景点</button>
                <button class="quick-btn" data-query="查询北京天气">🌤️ 查询天气</button>
                <button class="quick-btn" data-query="规划北京到上海路线">🛤️ 规划路线</button>
                <button class="quick-btn" data-query="推荐上海美食">🍜 美食推荐</button>
            </div>
            <div class="floating-ai-input">
                <input type="text" id="floatingAIInput" placeholder="输入您的问题或选择快捷操作...">
                <button id="floatingAISend" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(floatingAIAssistant);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .floating-ai-assistant {
                position: fixed;
                right: 30px;
                bottom: 30px;
                width: 420px;
                max-height: 580px;
                background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(52, 152, 219, 0.1);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(52, 152, 219, 0.1);
            }
            
            .floating-ai-header {
                padding: 18px 24px;
                background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            }
            
            .floating-ai-title {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .floating-ai-title i {
                font-size: 22px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .floating-ai-title h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                letter-spacing: -0.3px;
            }
            
            .floating-ai-controls {
                display: flex;
                gap: 10px;
            }
            
            .floating-ai-controls button {
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 6px;
                border-radius: 8px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .floating-ai-controls button:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .floating-ai-messages {
                flex: 1;
                padding: 20px 24px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-height: 360px;
                background: linear-gradient(180deg, rgba(52,152,219,0.02) 0%, rgba(46,204,113,0.02) 100%);
            }
            
            .quick-actions {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                padding: 0 24px 10px;
                border-top: 1px solid rgba(52, 152, 219, 0.08);
                background: white;
            }
            
            .quick-btn {
                padding: 8px 14px;
                background: linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(46, 204, 113, 0.08) 100%);
                border: 1px solid rgba(52, 152, 219, 0.15);
                border-radius: 20px;
                font-size: 13px;
                color: #3498db;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .quick-btn:hover {
                background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            }
            
            .floating-ai-input {
                display: flex;
                gap: 12px;
                padding: 18px 24px;
                border-top: 1px solid rgba(52, 152, 219, 0.1);
                background: white;
            }
            
            .floating-ai-input input {
                flex: 1;
                padding: 14px 20px;
                border: 2px solid #e2e8f0;
                border-radius: 24px;
                font-size: 15px;
                outline: none;
                transition: all 0.3s ease;
                background: #f8fafc;
                font-family: inherit;
            }
            
            .floating-ai-input input:focus {
                border-color: #3498db;
                box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
                background: white;
            }
            
            .floating-ai-input input::placeholder {
                color: #94a3b8;
            }
            
            .floating-ai-input button {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
                color: white;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            }
            
            .floating-ai-input button:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 8px 24px rgba(52, 152, 219, 0.4);
            }
            
            .floating-ai-assistant.minimized {
                width: 68px;
                height: 68px;
                max-height: 68px;
                border-radius: 34px;
                right: 20px;
                bottom: 20px;
                box-shadow: 0 8px 24px rgba(52, 152, 219, 0.3);
            }
            
            .floating-ai-assistant.minimized .floating-ai-messages,
            .floating-ai-assistant.minimized .floating-ai-input,
            .floating-ai-assistant.minimized .quick-actions {
                display: none;
            }
            
            .floating-ai-assistant.minimized .floating-ai-header {
                padding: 0;
                height: 68px;
                justify-content: center;
            }
            
            .floating-ai-assistant.minimized .floating-ai-title h3,
            .floating-ai-assistant.minimized .floating-ai-minimize {
                display: none;
            }
            
            .floating-ai-assistant.minimized .floating-ai-controls {
                display: none;
            }
            
            /* 消息样式 */
            .floating-ai-messages .message {
                display: flex;
                gap: 14px;
                animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes messageSlide {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            .floating-ai-messages .message.ai-message {
                align-self: flex-start;
            }
            
            .floating-ai-messages .message.user-message {
                align-self: flex-end;
                flex-direction: row-reverse;
            }
            
            .floating-ai-messages .message-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: white;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            }
            
            .floating-ai-messages .message.user-message .message-avatar {
                background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
            }
            
            .floating-ai-messages .message-content {
                max-width: 78%;
                padding: 14px 18px;
                border-radius: 18px;
                line-height: 1.7;
                font-size: 15px;
                word-wrap: break-word;
            }
            
            .floating-ai-messages .message.ai-message .message-content {
                background: white;
                color: #1e293b;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(52, 152, 219, 0.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            
            .floating-ai-messages .message.user-message .message-content {
                background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
                color: white;
                border-bottom-right-radius: 6px;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            }
            
            .message-content p {
                margin: 0 0 10px 0;
            }
            
            .message-content p:last-child {
                margin-bottom: 0;
            }
            
            .message-content h2,
            .message-content h3,
            .message-content h4 {
                margin: 16px 0 8px 0;
                font-weight: 700;
                color: #1e293b;
            }
            
            .floating-ai-messages .message.user-message .message-content h2,
            .floating-ai-messages .message.user-message .message-content h3,
            .floating-ai-messages .message.user-message .message-content h4 {
                color: white;
            }
            
            .message-content ul,
            .message-content ol {
                margin: 10px 0;
                padding-left: 24px;
            }
            
            .message-content li {
                margin-bottom: 6px;
            }
            
            .message-content code {
                background: rgba(52, 152, 219, 0.1);
                padding: 3px 8px;
                border-radius: 6px;
                font-family: 'SF Mono', 'Fira Code', monospace;
                font-size: 0.88em;
                color: #3498db;
            }
            
            .message-content pre {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                padding: 16px;
                border-radius: 12px;
                overflow-x: auto;
                margin: 12px 0;
            }
            
            .message-content pre code {
                background: none;
                padding: 0;
                color: #e2e8f0;
            }
            
            .message-content strong {
                font-weight: 700;
            }
            
            .message-content a {
                color: #3498db;
                text-decoration: none;
                border-bottom: 1px solid rgba(52, 152, 219, 0.3);
                transition: all 0.2s;
            }
            
            .message-content a:hover {
                color: #2ecc71;
                border-bottom-color: #2ecc71;
            }
            
            .message-content del {
                color: #94a3b8;
                text-decoration-thickness: 2px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .typing-indicator {
                display: flex;
                gap: 5px;
                padding: 8px 0;
            }
            
            .typing-indicator span {
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, #3498db, #2ecc71);
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out both;
            }
            
            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typingBounce {
                0%, 80%, 100% { 
                    transform: translateY(0) scale(0); 
                    opacity: 0.5;
                }
                40% { 
                    transform: translateY(-8px) scale(1); 
                    opacity: 1;
                }
            }
            
            /* 工具调用样式 */
            .tool-call {
                background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%);
                border: 1px solid rgba(52, 152, 219, 0.2);
                border-radius: 12px;
                padding: 12px 16px;
                margin: 10px 0;
                animation: toolCallSlide 0.3s ease;
            }
            
            @keyframes toolCallSlide {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .tool-call-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-weight: 600;
                color: #3498db;
                font-size: 14px;
            }
            
            .tool-call-header i {
                font-size: 16px;
            }
            
            .tool-call-content {
                background: white;
                border-radius: 8px;
                padding: 10px 14px;
                font-size: 13px;
                color: #475569;
                font-family: 'SF Mono', 'Fira Code', monospace;
            }
            
            .tool-call-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                margin-top: 6px;
            }
            
            .tool-call-status.loading {
                background: rgba(52, 152, 219, 0.1);
                color: #3498db;
            }
            
            .tool-call-status.success {
                background: rgba(46, 204, 113, 0.1);
                color: #2ecc71;
            }
            
            .tool-call-status.error {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
        `;
        document.head.appendChild(style);
        
        // 绑定事件
        this.bindFloatingAIAssistantEvents();
    }

    bindFloatingAIAssistantEvents() {
        const floatingAIAssistant = document.getElementById('floatingAIAssistant');
        const minimizeBtn = floatingAIAssistant?.querySelector('.floating-ai-minimize');
        const closeBtn = floatingAIAssistant?.querySelector('.floating-ai-close');
        const sendBtn = document.getElementById('floatingAISend');
        const input = document.getElementById('floatingAIInput');
        const messagesContainer = document.getElementById('floatingAIMessages');
        const quickBtns = floatingAIAssistant?.querySelectorAll('.quick-btn');

        // 最小化按钮
        minimizeBtn?.addEventListener('click', () => {
            floatingAIAssistant.classList.toggle('minimized');
            if (floatingAIAssistant.classList.contains('minimized')) {
                floatingAIAssistant.style.right = '20px';
                floatingAIAssistant.style.bottom = '20px';
            } else {
                floatingAIAssistant.style.right = '30px';
                floatingAIAssistant.style.bottom = '30px';
            }
        });

        // 关闭按钮
        closeBtn?.addEventListener('click', () => {
            floatingAIAssistant.remove();
        });

        // 发送按钮
        sendBtn?.addEventListener('click', () => {
            this.sendFloatingAIMessage();
        });

        // 输入框回车事件
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendFloatingAIMessage();
            }
        });

        // 快捷按钮事件
        quickBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                if (query) {
                    input.value = query;
                    this.sendFloatingAIMessage();
                }
            });
        });

        // 使悬浮窗可拖动
        this.makeFloatingAIDraggable(floatingAIAssistant);
    }

    sendFloatingAIMessage() {
        const input = document.getElementById('floatingAIInput');
        const messagesContainer = document.getElementById('floatingAIMessages');
        const message = input?.value.trim();
        
        if (!message) return;
        
        // 添加用户消息
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(userMessageDiv);
        
        // 清空输入框
        input.value = '';
        
        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 创建AI消息容器
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        aiMessageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content"></div>
        `;
        messagesContainer.appendChild(aiMessageDiv);
        const aiContentDiv = aiMessageDiv.querySelector('.message-content');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 检测是否需要调用工具
        const toolResult = this.detectAndCallTool(message, aiContentDiv, messagesContainer);
        
        if (!toolResult) {
            // 不需要调用工具，直接调用AI
            this.showTypingIndicator(aiContentDiv);
            this.fetchAIResponseStream(message, (partialResponse, isComplete) => {
                aiContentDiv.innerHTML = this.parseMarkdown(partialResponse);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }
    }

    showTypingIndicator(container) {
        container.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    }

    detectAndCallTool(message, aiContentDiv, messagesContainer) {
        // 检测关键词
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('搜索') || lowerMsg.includes('景点')) {
            this.callTool('search_scenic', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('天气') || lowerMsg.includes('温度')) {
            this.callTool('get_weather', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('路线') || lowerMsg.includes('规划') || lowerMsg.includes('导航')) {
            this.callTool('plan_route', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('美食') || lowerMsg.includes('推荐') || lowerMsg.includes('餐厅')) {
            this.callTool('recommend_food', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        return false;
    }

    callTool(toolName, message, aiContentDiv, messagesContainer) {
        // 工具名称映射
        const toolInfo = {
            search_scenic: { icon: 'fa-search', name: '搜索景点' },
            get_weather: { icon: 'fa-cloud-sun', name: '查询天气' },
            plan_route: { icon: 'fa-route', name: '规划路线' },
            recommend_food: { icon: 'fa-utensils', name: '美食推荐' }
        };
        
        const info = toolInfo[toolName] || { icon: 'fa-wrench', name: toolName };
        
        // 显示工具调用加载中
        aiContentDiv.innerHTML = `
            <div class="tool-call">
                <div class="tool-call-header">
                    <i class="fas ${info.icon}"></i>
                    <span>正在调用 ${info.name}</span>
                </div>
                <div class="tool-call-content">正在处理您的请求...</div>
                <div class="tool-call-status loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>执行中</span>
                </div>
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 模拟工具调用延迟
        setTimeout(() => {
            // 更新为成功状态
            let toolResult = '';
            let aiResponse = '';
            
            switch (toolName) {
                case 'search_scenic':
                    toolResult = `找到景点：故宫博物院\n位置：北京市东城区景山前街4号\n评分：5.0\n介绍：明清两代皇家宫殿，世界文化遗产，中国最大的古代文化艺术博物馆。`;
                    aiResponse = `## 🏛️ 故宫博物院搜索结果\n\n我为您找到了故宫博物院的信息：\n\n**📍 位置**：北京市东城区景山前街4号\n**⭐ 评分**：5.0/5.0\n**📜 介绍**：故宫博物院是明清两代的皇家宫殿，是世界文化遗产，也是中国最大的古代文化艺术博物馆。\n\n**🎯 参观建议**：\n- 建议游览时间：4-5小时\n- 最佳参观季节：春秋两季\n- 提前网络预约门票\n\n需要我帮您规划参观路线吗？`;
                    break;
                case 'get_weather':
                    toolResult = `城市：北京\n日期：${new Date().toLocaleDateString()}\n天气：晴\n温度：18°C - 28°C\n风向：东南风 2级\n湿度：45%`;
                    aiResponse = `## 🌤️ 北京天气预报\n\n**📅 日期**：${new Date().toLocaleDateString()}\n**🌥️ 天气**：晴\n**🌡️ 温度**：18°C - 28°C\n**💨 风向**：东南风 2级\n**💧 湿度**：45%\n\n**👕 穿衣建议**：\n- 白天：轻薄外套或长袖衬衫\n- 早晚：稍厚一点的外套\n- 紫外线较强，注意防晒\n\n天气不错，适合出行！需要其他帮助吗？`;
                    break;
                case 'plan_route':
                    toolResult = `路线：北京 → 上海\n距离：约1318公里\n推荐方式：\n1. 高铁：4-5小时，二等座约553元\n2. 飞机：2小时，机票约400-1200元\n3. 自驾：约14小时\n推荐景点：济南、南京、苏州`;
                    aiResponse = `## 🚄 北京到上海路线规划\n\n我为您规划了从北京到上海的出行路线：\n\n**📏 距离**：约1318公里\n\n**🚌 出行方式推荐**：\n1. **高铁**（推荐）：4-5小时，二等座约553元\n2. **飞机**：2小时，机票约400-1200元（因季节波动）\n3. **自驾**：约14小时，适合沿途游玩\n\n**🎯 途经推荐景点**：\n- 济南：趵突泉、大明湖\n- 南京：中山陵、夫子庙\n- 苏州：苏州园林、周庄古镇\n\n需要详细的每日行程规划吗？`;
                    break;
                case 'recommend_food':
                    toolResult = `推荐美食：\n1. 南翔小笼包 - 皮薄馅多，汤汁鲜美\n2. 生煎馒头 - 底脆馅嫩，香气四溢\n3. 红烧肉 - 甜而不腻，入口即化\n4. 白斩鸡 - 皮脆肉嫩，原汁原味\n5. 油爆虾 - 酥脆鲜香，肉质紧实\n推荐餐厅：老正兴、南翔馒头店、绿波廊`;
                    aiResponse = `## 🍜 上海美食推荐\n\n到上海怎能不吃这些地道美食！\n\n**🥟 必吃推荐**：\n1. **南翔小笼包** - 皮薄馅多，汤汁鲜美\n2. **生煎馒头** - 底脆馅嫩，香气四溢\n3. **红烧肉** - 甜而不腻，入口即化\n4. **白斩鸡** - 皮脆肉嫩，原汁原味\n5. **油爆虾** - 酥脆鲜香，肉质紧实\n\n**🍽️ 推荐餐厅**：\n- 老正兴（百年老字号）\n- 南翔馒头店（城隍庙店）\n- 绿波廊（正宗本帮菜）\n\n**📍 美食街推荐**：\n- 城隍庙美食街\n- 南京东路步行街\n- 吴江路美食街\n\n要我帮您定位这些餐厅的位置吗？`;
                    break;
                default:
                    toolResult = '功能执行成功';
                    aiResponse = '好的，我已经帮您完成了操作！还有什么需要帮助的吗？';
            }
            
            // 更新为成功状态
            aiContentDiv.innerHTML = `
                <div class="tool-call">
                    <div class="tool-call-header">
                        <i class="fas ${info.icon}"></i>
                        <span>调用 ${info.name}</span>
                    </div>
                    <div class="tool-call-content">${this.escapeHtml(toolResult).replace(/\n/g, '<br>')}</div>
                    <div class="tool-call-status success">
                        <i class="fas fa-check-circle"></i>
                        <span>执行成功</span>
                    </div>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // 延迟显示AI回复
            setTimeout(() => {
                const newAiMessageDiv = document.createElement('div');
                newAiMessageDiv.className = 'message ai-message';
                newAiMessageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `;
                messagesContainer.appendChild(newAiMessageDiv);
                const newAiContentDiv = newAiMessageDiv.querySelector('.message-content');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // 模拟流式输出
                this.simulateStreamOutput(aiResponse, newAiContentDiv, messagesContainer);
            }, 800);
        }, 1500);
    }

    simulateStreamOutput(text, container, messagesContainer) {
        let currentIndex = 0;
        const speed = 30;
        
        const outputInterval = setInterval(() => {
            if (currentIndex < text.length) {
                currentIndex += Math.floor(Math.random() * 3) + 1;
                const partialText = text.substring(0, currentIndex);
                container.innerHTML = this.parseMarkdown(partialText);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                clearInterval(outputInterval);
                container.innerHTML = this.parseMarkdown(text);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, speed);
    }

    fetchAIResponseStream(message, onUpdate) {
        // 调用deepseek API
        const apiKey = 'sk-029d6af079b344b7a010ab125fe333d4';
        const url = 'https://api.deepseek.com/v1/chat/completions';
        
        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: '你是游迹智述的AI助手，专注于提供旅行相关的建议和信息，包括景点推荐、行程规划、当地美食等。请用友好、专业的语气回答用户问题，回答时可以使用markdown格式。'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            stream: true
        };
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API请求失败');
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            
            // 流式处理响应
            function processStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        onUpdate(fullResponse, true);
                        return;
                    }
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    lines.forEach(line => {
                        line = line.trim();
                        if (line === '' || line === 'data: [DONE]') return;
                        
                        if (line.startsWith('data: ')) {
                            line = line.substring(6);
                            try {
                                const data = JSON.parse(line);
                                if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                    fullResponse += data.choices[0].delta.content;
                                    onUpdate(fullResponse, false);
                                }
                            } catch (error) {
                                console.error('解析响应失败', error);
                            }
                        }
                    });
                    
                    return processStream();
                });
            }
            
            return processStream();
        })
        .catch(error => {
            console.error('API调用失败', error);
            onUpdate('抱歉，我暂时无法回答您的问题，请稍后再试。您可以尝试：\n1. 询问景点推荐\n2. 请求行程规划建议\n3. 了解当地美食文化', true);
        });
    }

    parseMarkdown(text) {
        if (!text) return '';
        
        // 先处理代码块，避免被其他规则干扰
        let html = text;
        
        // 代码块 ```code```
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
        });
        
        // 内联代码 `code`
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            return `<code>${this.escapeHtml(code)}</code>`;
        });
        
        // 标题
        html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
        html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
        html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');
        
        // 加粗
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // 斜体
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // 删除线
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // 链接 [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 处理列表
        let inList = false;
        let listType = null;
        let listContent = '';
        const lines = html.split('\n');
        let result = [];
        
        lines.forEach(line => {
            // 无序列表
            const ulMatch = line.match(/^([-*+]) (.*)$/);
            // 有序列表
            const olMatch = line.match(/^(\d+)\. (.*)$/);
            
            if (ulMatch || olMatch) {
                const currentType = ulMatch ? 'ul' : 'ol';
                const content = ulMatch ? ulMatch[2] : olMatch[2];
                
                if (!inList || listType !== currentType) {
                    if (inList) {
                        result.push(`</${listType}>`);
                    }
                    inList = true;
                    listType = currentType;
                    result.push(`<${listType}>`);
                }
                result.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    result.push(`</${listType}>`);
                    inList = false;
                    listType = null;
                }
                result.push(line);
            }
        });
        
        if (inList) {
            result.push(`</${listType}>`);
        }
        
        html = result.join('\n');
        
        // 处理段落和换行
        html = html.replace(/\n\n+/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        // 包裹在段落中（如果还没有）
        if (!html.startsWith('<p') && !html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<pre')) {
            html = '<p>' + html + '</p>';
        }
        
        return html;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    makeFloatingAIDraggable(element) {
        if (!element) return;
        
        let isDragging = false;
        let offsetX, offsetY;
        
        const header = element.querySelector('.floating-ai-header');
        
        header?.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            element.style.left = boundedX + 'px';
            element.style.top = boundedY + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (header) {
                header.style.cursor = 'move';
            }
        });
    }

    setActivePage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        const currentPage = fileName === 'index' || fileName === '' ? 'home' : fileName;
        const links = document.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });
    }

    updateUserInfo() {
        const username = localStorage.getItem('username');
        const avatar = localStorage.getItem('avatar');
        
        if (username) {
            const userNameEl = document.getElementById('navUserName');
            if (userNameEl) {
                userNameEl.textContent = username;
            }
        }
    }

    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('avatar');
            
            const nav = document.querySelector('.navbar');
            nav?.classList.add('fade-out');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    }
}

// 用户认证检查
function checkAuth() {
    const token = localStorage.getItem('token');
    const fileName = window.location.pathname.split('/').pop();
    const currentPage = fileName.replace('.html', '');
    
    if (!token && currentPage !== 'index' && currentPage !== '') {
        window.location.href = 'index.html';
    }
}

// ===== 全局滚动触发动画 =====
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    if (revealElements.length === 0) {
        addScrollClasses();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || (index * 0.1);
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

function addScrollClasses() {
    const selectors = [
        '.feature-card',
        '.destination-card',
        '.theme-card',
        '.guide-card',
        '.community-card',
        '.post-card',
        '.spot-card',
        '.seasonal-card',
        '.review-card',
        '.sidebar-card',
        '.recommendation-card',
        '.section-header',
        '.ai-chat-container',
        '.ai-assistant'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('scroll-reveal');
            el.dataset.delay = (index * 0.1).toFixed(1);
        });
    });
}

// ===== 鼠标跟随光效 =====
function initMouseGlow() {
    const cards = document.querySelectorAll('.feature-card, .destination-card, .post-card, .spot-card, .theme-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(52, 152, 219, 0.04), transparent)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });
}

// ===== 页面加载动画 =====
function initPageLoadAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
}

// ===== 数字计数动画 =====
function animateCountUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== 粒子背景效果 =====
function initParticleBackground() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';
    heroSection.style.position = 'relative';
    heroSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 152, 219, ${p.opacity})`;
            ctx.fill();

            particles.forEach((p2, j) => {
                if (i === j) return;
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(52, 152, 219, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// 全局变量存储Navigation实例
let navigationInstance = null;

// 页面加载完成后初始化导航栏和效果
document.addEventListener('DOMContentLoaded', () => {
    navigationInstance = new Navigation();
    initScrollAnimations();
    initMouseGlow();
    initPageLoadAnimation();
    initParticleBackground();
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// 全局AI助手打开函数
window.openFloatingAIAssistant = function() {
    if (navigationInstance && navigationInstance.showFloatingAIAssistant) {
        navigationInstance.showFloatingAIAssistant();
    } else {
        console.warn('Navigation实例未初始化');
    }
};
