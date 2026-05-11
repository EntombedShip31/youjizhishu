document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否已登录
    checkAuth();

    // 初始化页面
    initializePage();
});

// 初始化页面
function initializePage() {
    // 初始化轮播图
    initCarousel();
    
    // 初始化主题标签页
    initThemeTabs();
    
    // 加载热门目的地
    loadDestinations();
    
    // 加载热门攻略
    loadGuides();
    
    // 加载社区精选
    loadCommunityPosts();
}

// 轮播图数据
const carouselData = [
    {
        image: 'assets/img/1.jpg',
        title: '西湖风光',
        description: '领略杭州西湖的诗情画意'
    },
    {
        image: 'assets/img/2.jpg',
        title: '长城奇观',
        description: '登临万里长城，俯瞰壮美山河'
    },
    {
        image: 'assets/img/3.jpg',
        title: '故宫博物院',
        description: '感受600年紫禁城的历史底蕴'
    },
    {
        image: 'assets/img/4.jpg',
        title: '北京风光',
        description: '古都文化，现代魅力'
    },
    {
        image: 'assets/img/5.jpg',
        title: '上海夜景',
        description: '魔都风情，璀璨夜景'
    },
    {
        image: 'assets/img/6.jpg',
        title: '西藏之旅',
        description: '走进西藏，感受雪域高原的神秘魅力'
    },
    {
        image: 'assets/img/7.jpg',
        title: '云南秘境',
        description: '远离人群，探索云南的秘境之美'
    }
];

// 初始化轮播图
function initCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const slides = carousel.querySelector('.carousel-slides');
    
    // 生成轮播图内容
    slides.innerHTML = carouselData.map((slide, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}">
            <img src="${slide.image}" alt="${slide.title}">
            <div class="slide-content">
                <h2>${slide.title}</h2>
                <p>${slide.description}</p>
            </div>
        </div>
    `).join('');
    
    // 生成指示器
    const indicators = carousel.querySelector('.carousel-indicators');
    indicators.innerHTML = carouselData.map((_, index) => `
        <button class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');
    
    // 绑定指示器点击事件
    indicators.addEventListener('click', (e) => {
        if (e.target.classList.contains('indicator')) {
            goToSlide(parseInt(e.target.dataset.index));
        }
    });
    
    // 绑定上一张/下一张按钮事件
    carousel.querySelector('.prev').addEventListener('click', () => prevSlide());
    carousel.querySelector('.next').addEventListener('click', () => nextSlide());
    
    // 自动轮播
    let currentSlide = 0;
    const autoPlayInterval = setInterval(() => nextSlide(), 12000);
    
    // 鼠标悬停时暂停自动轮播
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => setInterval(() => nextSlide(), 12000));
    
    function goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide((currentSlide + 1) % carouselData.length);
    }
    
    function prevSlide() {
        goToSlide((currentSlide - 1 + carouselData.length) % carouselData.length);
    }
}

// 初始化主题标签页
function initThemeTabs() {
    const tabs = document.querySelectorAll('.theme-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新标签页状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 加载对应主题内容
            loadThemeContent(tab.dataset.theme);
        });
    });
    
    // 默认加载文化古迹主题
    loadThemeContent('cultural');
}

// 加载主题内容
function loadThemeContent(theme) {
    const container = document.getElementById('themesContent');
    const themeData = {
        cultural: [
            {
                id: 1,
                image: 'assets/img/3.jpg',
                title: '故宫博物院',
                description: '中国明清两代的皇家宫殿',
                tags: ['文化遗产', '古建筑', '博物馆']
            },
            {
                id: 2,
                image: 'assets/img/xian.jpg',
                title: '西安古城',
                description: '千年古都，文化荟萃',
                tags: ['历史古迹', '美食', '文化']
            },
            {
                id: 3,
                image: 'assets/img/苏州.jpg',
                title: '苏州园林',
                description: '江南园林，诗意栖居',
                tags: ['园林', '建筑', '文化']
            }
        ],
        nature: [
            {
                id: 4,
                image: 'assets/img/黄山.jpg',
                title: '黄山风景',
                description: '奇松怪石、云海日出',
                tags: ['自然风光', '山水', '摄影']
            }
        ],
        food: [
            {
                id: 5,
                image: 'assets/img/sc.jpg',
                title: '成都美食',
                description: '天府之国，美食天堂',
                tags: ['美食', '川菜', '小吃']
            }
        ],
        photography: [
            {
                id: 6,
                image: 'assets/img/洱海.jpg',
                title: '洱海日落',
                description: '古城夕照，湖光山色',
                tags: ['摄影', '自然', '风光']
            }
        ]
    };
    
    const data = themeData[theme] || [];
    container.innerHTML = data.map(item => `
        <div class="theme-card" data-theme-id="${item.id}">
            <div class="theme-image-wrapper">
                <img src="${item.image}" alt="${item.title}" class="theme-image">
            </div>
            <div class="theme-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="theme-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // 添加点击事件
    container.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const themeId = card.dataset.themeId;
            window.location.href = `spot.html?id=${themeId}`;
        });
    });
}

// 加载热门目的地
function loadDestinations() {
    // 实现热门目的地加载逻辑
}

// 加载热门攻略
function loadGuides() {
    const container = document.querySelector('.guides-grid');
    const guidesData = [
        {
            id: 1,
            title: '北京三日游完全攻略',
            author: '旅行达人',
            avatar: 'assets/img/4.jpg',
            views: 1500,
            likes: 120
        },
        {
            id: 2,
            title: '杭州西湖一日游',
            author: '摄影师小王',
            avatar: 'assets/img/1.jpg',
            views: 1200,
            likes: 98
        },
        {
            id: 3,
            title: '成都美食探店指南',
            author: '美食家老李',
            avatar: 'assets/img/sc.jpg',
            views: 980,
            likes: 86
        }
    ];
    
    container.innerHTML = guidesData.map(guide => `
        <div class="guide-card" data-guide-id="${guide.id}">
            <div class="guide-content">
                <h3>${guide.title}</h3>
                <div class="guide-author">
                    <div class="author-avatar-wrapper">
                        <img src="${guide.avatar}" alt="${guide.author}" class="author-avatar">
                    </div>
                    <span>${guide.author}</span>
                </div>
                <div class="guide-stats">
                    <span><i class="fas fa-eye"></i>${guide.views}</span>
                    <span><i class="fas fa-heart"></i>${guide.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 添加点击事件
    container.querySelectorAll('.guide-card').forEach(card => {
        card.addEventListener('click', () => {
            const guideId = card.dataset.guideId;
            window.location.href = `detail.html?id=${guideId}`;
        });
    });
}

// 加载社区精选
function loadCommunityPosts() {
    const container = document.querySelector('.community-grid');
    const postsData = [
        {
            id: 1,
            title: '记录我的西藏之旅',
            excerpt: '走进西藏，感受雪域高原的神秘魅力...',
            author: '高原行者',
            avatar: 'assets/img/6.jpg',
            image: 'assets/img/6.jpg'
        },
        {
            id: 2,
            title: '云南小众景点探秘',
            excerpt: '远离人群，探索云南的秘境之美...',
            author: '背包客小张',
            avatar: 'assets/img/洱海.jpg',
            image: 'assets/img/洱海.jpg'
        },
        {
            id: 3,
            title: '江南水乡摄影指南',
            excerpt: '带你发现江南水乡的最佳拍摄地...',
            author: '摄影师阿文',
            avatar: 'assets/img/苏州.jpg',
            image: 'assets/img/苏州.jpg'
        }
    ];
    
    container.innerHTML = postsData.map(post => `
        <div class="community-card" data-post-id="${post.id}">
            <div class="post-image-wrapper">
                <img src="${post.image}" alt="${post.title}" class="post-image">
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="post-author">
                    <div class="author-avatar-wrapper">
                        <img src="${post.avatar}" alt="${post.author}" class="author-avatar">
                    </div>
                    <span>${post.author}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 添加点击事件
    container.querySelectorAll('.community-card').forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.dataset.postId;
            window.location.href = `community.html`;
        });
    });
}

// 搜索功能
document.querySelector('.search-btn').addEventListener('click', () => {
    const keyword = document.querySelector('.search-box input').value.trim();
    if (keyword) {
        window.location.href = `spot.html?search=${encodeURIComponent(keyword)}`;
    }
});

// 搜索框回车事件
document.querySelector('.search-box input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.querySelector('.search-btn').click();
    }
});

// AI对话功能
function initAIChat() {
    const chatInput = document.getElementById('aiChatInput');
    const chatSend = document.getElementById('aiChatSend');
    const chatMessages = document.getElementById('aiChatMessages');
    
    // 发送按钮点击事件
    chatSend.addEventListener('click', sendMessage);
    
    // 输入框回车事件
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addMessage('user', message);
        chatInput.value = '';
        
        // 创建AI消息容器
        const aiMessageDiv = createAIMessageDiv();
        chatMessages.appendChild(aiMessageDiv);
        const aiContentDiv = aiMessageDiv.querySelector('.message-content');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 检测是否需要调用工具
        const toolResult = detectAndCallToolHome(message, aiContentDiv, chatMessages);
        
        if (!toolResult) {
            // 不需要调用工具，直接调用AI
            fetchAIResponseStream(message, (partialResponse, isComplete) => {
                aiContentDiv.innerHTML = parseMarkdown(partialResponse);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }
    }

    function detectAndCallToolHome(message, aiContentDiv, messagesContainer) {
        // 检测关键词
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('搜索') || lowerMsg.includes('景点')) {
            callToolHome('search_scenic', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('天气') || lowerMsg.includes('温度')) {
            callToolHome('get_weather', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('路线') || lowerMsg.includes('规划') || lowerMsg.includes('导航')) {
            callToolHome('plan_route', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        if (lowerMsg.includes('美食') || lowerMsg.includes('推荐') || lowerMsg.includes('餐厅')) {
            callToolHome('recommend_food', message, aiContentDiv, messagesContainer);
            return true;
        }
        
        return false;
    }

    function callToolHome(toolName, message, aiContentDiv, messagesContainer) {
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
                    <div class="tool-call-content">${escapeHtml(toolResult).replace(/\n/g, '<br>')}</div>
                    <div class="tool-call-status success">
                        <i class="fas fa-check-circle"></i>
                        <span>执行成功</span>
                    </div>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // 延迟显示AI回复
            setTimeout(() => {
                const newAiMessageDiv = createAIMessageDiv();
                messagesContainer.appendChild(newAiMessageDiv);
                const newAiContentDiv = newAiMessageDiv.querySelector('.message-content');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // 模拟流式输出
                simulateStreamOutputHome(aiResponse, newAiContentDiv, messagesContainer);
            }, 800);
        }, 1500);
    }

    function simulateStreamOutputHome(text, container, messagesContainer) {
        let currentIndex = 0;
        const speed = 30;
        
        const outputInterval = setInterval(() => {
            if (currentIndex < text.length) {
                currentIndex += Math.floor(Math.random() * 3) + 1;
                const partialText = text.substring(0, currentIndex);
                container.innerHTML = parseMarkdown(partialText);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                clearInterval(outputInterval);
                container.innerHTML = parseMarkdown(text);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, speed);
    }
    
    function createAIMessageDiv() {
        const div = document.createElement('div');
        div.className = 'message ai-message';
        div.innerHTML = `
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
        return div;
    }
    
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        let contentHTML;
        if (type === 'ai') {
            contentHTML = parseMarkdown(content);
        } else {
            contentHTML = `<p>${escapeHtml(content)}</p>`;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'ai' ? 'fa-robot' : 'fa-user'}"></i>
            </div>
            <div class="message-content">
                ${contentHTML}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function parseMarkdown(text) {
        if (!text) return '';
        
        // 先处理代码块，避免被其他规则干扰
        let html = text;
        
        // 代码块 ```code```
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre><code>${escapeHtml(code)}</code></pre>`;
        });
        
        // 内联代码 `code`
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            return `<code>${escapeHtml(code)}</code>`;
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
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function fetchAIResponseStream(message, onUpdate) {
        const url = '/api/chat';
        
        const requestBody = {
            messages: [
                {
                    role: 'system',
                    content: '你是游迹智述的AI助手，专注于提供旅行相关的建议和信息，包括景点推荐、旅行攻略、当地美食等。请用友好、专业的语气回答用户问题，回答时可以使用markdown格式。'
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
                'Content-Type': 'application/json'
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
                                console.error('解析响应失败:', error);
                            }
                        }
                    });
                    
                    return processStream();
                });
            }
            
            return processStream();
        })
        .catch(error => {
            console.error('API调用失败:', error);
            onUpdate('抱歉，我暂时无法回答您的问题，请稍后再试。', true);
        });
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
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
        .typing-indicator span:nth-child(1) {
            animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
            animation-delay: -0.16s;
        }
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
}

// 初始化AI对话功能
document.addEventListener('DOMContentLoaded', initAIChat);

// 初始化所有卡片点击事件
function initCardEvents() {
    // 在线智能导览卡片 - 打开全局AI助手
    const aiGuideCard = document.getElementById('aiGuideCard');
    
    if (aiGuideCard) {
        aiGuideCard.addEventListener('click', function() {
            // 确保common.js中的Navigation已初始化并调用openFloatingAIAssistant
            if (typeof openFloatingAIAssistant === 'function') {
                openFloatingAIAssistant();
            } else {
                showToast('AI助手功能正在加载中...');
            }
        });
        
        aiGuideCard.style.cursor = 'pointer';
    }
    
    // 个性化路线卡片
    const personalizedRouteCard = document.getElementById('personalizedRouteCard');
    if (personalizedRouteCard) {
        personalizedRouteCard.addEventListener('click', function() {
            window.location.href = 'plan.html';
        });
        
        // 添加悬停效果
        personalizedRouteCard.style.cursor = 'pointer';
    }
    
    // 社区互动卡片
    const communityCard = document.getElementById('communityCard');
    if (communityCard) {
        communityCard.addEventListener('click', function() {
            window.location.href = 'community.html';
        });
        
        // 添加悬停效果
        communityCard.style.cursor = 'pointer';
    }
}

// 页面加载完成后初始化卡片事件
document.addEventListener('DOMContentLoaded', initCardEvents); 