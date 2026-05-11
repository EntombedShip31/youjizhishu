document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否已登录
    checkAuth();

    // 初始化页面
    initializePage();
});

// 初始化页面
function initializePage() {
    // 加载帖子列表
    loadPosts();
    
    // 初始化标签页切换
    initTabs();
    
    // 初始化发布功能
    initCreatePost();
    
    // 加载热门话题
    loadHotTopics();
    
    // 加载活跃用户
    loadActiveUsers();
    
    // 加载社区公告
    loadAnnouncements();
}

// 添加分页相关变量
let currentPage = 1;
const pageSize = 6;
let isLoading = false;
let hasMore = true;

// 修改加载帖子列表函数
function loadPosts(type = 'all', sort = 'latest', isLoadMore = false) {
    if (isLoading || (!isLoadMore && !hasMore)) return;
    
    isLoading = true;
    const container = document.getElementById('contentGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // 如果不是加载更多，则清空容器
    if (!isLoadMore) {
        container.innerHTML = '';
        currentPage = 1;
        hasMore = true;
    }

    // 显示加载动画
    loadMoreBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>加载中...</span>
    `;
    loadMoreBtn.disabled = true;

    // 模拟网络请求延迟
    setTimeout(() => {
        // 模拟帖子数据
        const posts = [
            {
                id: currentPage * 10 + 1,
                type: 'strategy',
                title: '北京三日游完全攻略',
                excerpt: '作为中国的首都，北京拥有众多历史文化景点。本攻略将为大家详细介绍如何在三天时间内游览北京的精华景点。',
                image: 'assets/img/3.jpg',
                author: {
                    name: '旅行达人',
                    avatar: 'assets/img/4.jpg'
                },
                stats: {
                    views: 1580,
                    likes: 128,
                    comments: 32
                }
            },
            {
                id: currentPage * 10 + 2,
                type: 'story',
                title: '我在西藏的难忘时光',
                excerpt: '第一次来到西藏，被这里的自然风光和人文景观深深吸引。高原上的点点滴滴，都让人终生难忘。',
                image: 'assets/img/6.jpg',
                author: {
                    name: '背包客',
                    avatar: 'assets/img/1.jpg'
                },
                stats: {
                    views: 980,
                    likes: 86,
                    comments: 24
                }
            }
            // 可以添加更多帖子数据
        ];

        // 添加新的帖子卡片，带有淡入动画
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card fade-in';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <div class="post-content">
                    <span class="post-type">${getTypeText(post.type)}</span>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <div class="post-author">
                            <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                            <span>${post.author.name}</span>
                        </div>
                        <div class="post-stats">
                            <span class="stat-item"><i class="fas fa-eye"></i>${post.stats.views}</span>
                            <span class="stat-item"><i class="fas fa-heart"></i>${post.stats.likes}</span>
                            <span class="stat-item"><i class="fas fa-comment"></i>${post.stats.comments}</span>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(postElement);

            // 触发重绘以应用动画
            void postElement.offsetWidth;
            postElement.style.opacity = '1';
            postElement.style.transform = 'translateY(0)';
        });

        // 更新加载状态
        currentPage++;
        isLoading = false;
        hasMore = currentPage < 4; // 模拟只有3页数据

        // 更新加载更多按钮状态
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = hasMore ? '加载更多' : '没有更多内容了';
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';

    }, 1000); // 模拟1秒的加载时间
}

// 加载热门话题
function loadHotTopics() {
    const container = document.getElementById('topicList');
    
    // 模拟话题数据
    const topics = [
        {
            id: 1,
            title: '最美古镇推荐',
            posts: 128,
            participants: 256
        },
        {
            id: 2,
            title: '春季赏花攻略',
            posts: 98,
            participants: 186
        },
        {
            id: 3,
            title: '摄影技巧分享',
            posts: 86,
            participants: 162
        }
    ];

    container.innerHTML = topics.map((topic, index) => `
        <div class="topic-item" onclick="showTopic(${topic.id})">
            <div class="topic-rank top-${index + 1}">${index + 1}</div>
            <div class="topic-info">
                <div class="topic-title">${topic.title}</div>
                <div class="topic-stats">
                    <span>${topic.posts}</span> 个帖子 · 
                    <span>${topic.participants}</span> 人参与
                </div>
            </div>
        </div>
    `).join('');
}

// 加载活跃用户
function loadActiveUsers() {
    const container = document.getElementById('userList');
    
    // 模拟用户数据
    const users = [
        {
            id: 1,
            name: '旅行达人',
            avatar: 'assets/img/4.jpg'
        },
        {
            id: 2,
            name: '摄影师小王',
            avatar: 'assets/img/1.jpg'
        },
        {
            id: 3,
            name: '美食家老李',
            avatar: 'assets/img/2.jpg'
        }
    ];

    container.innerHTML = users.map(user => `
        <div class="user-item" onclick="showUserProfile(${user.id})">
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
            <div class="user-name">${user.name}</div>
        </div>
    `).join('');
}

// 加载社区公告
function loadAnnouncements() {
    const container = document.getElementById('announcementList');
    
    // 模拟公告数据
    const announcements = [
        {
            id: 1,
            content: '社区新功能上线：智能助手全新升级！'
        },
        {
            id: 2,
            content: '春季摄影大赛开始报名，丰厚奖品等你来拿'
        }
    ];

    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            ${announcement.content}
        </div>
    `).join('');
}

// 修改初始化标签页切换函数
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 重置加载状态
            currentPage = 1;
            hasMore = true;
            
            // 加载新分类的帖子
            loadPosts(tab.dataset.type);
        });
    });

    // 绑定加载更多按钮事件
    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        loadPosts(activeTab.dataset.type, 'latest', true);
    });

    // 添加滚动加载功能
    window.addEventListener('scroll', () => {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const rect = loadMoreBtn.getBoundingClientRect();
        
        // 当按钮进入视口时自动加载更多
        if (rect.top <= window.innerHeight && !isLoading && hasMore) {
            const activeTab = document.querySelector('.tab-btn.active');
            loadPosts(activeTab.dataset.type, 'latest', true);
        }
    });
}

// 初始化发布功能
function initCreatePost() {
    const createBtn = document.getElementById('createPostBtn');
    const mainContent = document.querySelector('.main-section');
    const header = document.querySelector('.community-header');
    
    createBtn.addEventListener('click', () => {
        // 保存当前内容以便返回
        const originalContent = mainContent.innerHTML;
        const originalHeader = header.innerHTML;

        // 更新头部内容
        header.innerHTML = `
            <div class="header-content container">
                <div class="header-left">
                    <button class="back-btn" id="backToList">
                        <i class="fas fa-arrow-left"></i> 返回
                    </button>
                    <h1>发布内容</h1>
                </div>
            </div>
        `;

        // 更新主要内容区域
        mainContent.innerHTML = `
            <div class="create-post-container container">
                <div class="post-editor">
                    <div class="editor-section">
                        <div class="category-select">
                            <h3>选择分类</h3>
                            <div class="category-options">
                                <label class="category-option">
                                    <input type="radio" name="postType" value="strategy" checked>
                                    <span class="option-content">
                                        <i class="fas fa-map-marked-alt"></i>
                                        <div class="option-text">
                                            <h4>旅游攻略</h4>
                                            <p>分享详细的旅游路线和建议</p>
                                        </div>
                                    </span>
                                </label>
                                <label class="category-option">
                                    <input type="radio" name="postType" value="story">
                                    <span class="option-content">
                                        <i class="fas fa-book-open"></i>
                                        <div class="option-text">
                                            <h4>旅行故事</h4>
                                            <p>记录精彩的旅行见闻和感悟</p>
                                        </div>
                                    </span>
                                </label>
                                <label class="category-option">
                                    <input type="radio" name="postType" value="photo">
                                    <span class="option-content">
                                        <i class="fas fa-camera"></i>
                                        <div class="option-text">
                                            <h4>美图分享</h4>
                                            <p>展示精美的旅行照片和视频</p>
                                        </div>
                                    </span>
                                </label>
                                <label class="category-option">
                                    <input type="radio" name="postType" value="question">
                                    <span class="option-content">
                                        <i class="fas fa-question-circle"></i>
                                        <div class="option-text">
                                            <h4>问答互助</h4>
                                            <p>提出旅行相关的问题和解答</p>
                                        </div>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="editor-section">
                        <h3>标题</h3>
                        <input type="text" class="post-title" placeholder="请输入标题（2-50字）" maxlength="50">
                    </div>

                    <div class="editor-section">
                        <h3>正文</h3>
                        <div class="editor-toolbar">
                            <button type="button" title="加粗"><i class="fas fa-bold"></i></button>
                            <button type="button" title="斜体"><i class="fas fa-italic"></i></button>
                            <button type="button" title="标题"><i class="fas fa-heading"></i></button>
                            <button type="button" title="链接"><i class="fas fa-link"></i></button>
                            <button type="button" title="列表"><i class="fas fa-list-ul"></i></button>
                            <button type="button" title="引用"><i class="fas fa-quote-right"></i></button>
                        </div>
                        <textarea class="post-content" placeholder="分享你的旅行经历..."></textarea>
                    </div>

                    <div class="editor-section">
                        <h3>添加图片</h3>
                        <div class="image-uploader">
                            <div class="upload-area" id="uploadArea">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>点击或拖拽图片上传</p>
                                <span>支持 jpg、png 格式，最多可上传9张</span>
                                <input type="file" multiple accept="image/*" id="imageInput">
                            </div>
                            <div class="image-preview" id="imagePreview"></div>
                        </div>
                    </div>

                    <div class="editor-section">
                        <h3>添加标签</h3>
                        <div class="tag-editor">
                            <div class="tag-list" id="tagList"></div>
                            <input type="text" class="tag-input" placeholder="输入标签按回车添加，最多添加5个" id="tagInput">
                        </div>
                    </div>

                    <div class="editor-actions">
                        <button class="btn btn-outline" id="saveDraft">存为草稿</button>
                        <button class="btn btn-primary" id="publishPost">发布内容</button>
                    </div>
                </div>
            </div>
        `;

        // 绑定返回按钮事件
        document.getElementById('backToList').addEventListener('click', () => {
            header.innerHTML = originalHeader;
            mainContent.innerHTML = originalContent;
            // 重新初始化原页面的功能
            initTabs();
            loadPosts();
        });

        // 初始化图片上传
        initImageUpload();
        // 初始化标签输入
        initTagInput();
    });
}

// 初始化图片上传
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadedImages = [];

    uploadArea.addEventListener('click', () => imageInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        if (uploadedImages.length + files.length > 9) {
            alert('最多只能上传9张图片');
            return;
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('只能上传图片文件');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'preview-item';
                imageContainer.innerHTML = `
                    <img src="${e.target.result}" alt="预览图片">
                    <button class="remove-image"><i class="fas fa-times"></i></button>
                `;
                imagePreview.appendChild(imageContainer);
                uploadedImages.push(file);

                // 绑定删除按钮事件
                imageContainer.querySelector('.remove-image').onclick = () => {
                    imageContainer.remove();
                    const index = uploadedImages.indexOf(file);
                    if (index > -1) {
                        uploadedImages.splice(index, 1);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    }
}

// 初始化标签输入
function initTagInput() {
    const tagInput = document.getElementById('tagInput');
    const tagList = document.getElementById('tagList');
    const tags = new Set();

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInput.value.trim();
            
            if (tag && tags.size < 5) {
                tags.add(tag);
                updateTags();
                tagInput.value = '';
            } else if (tags.size >= 5) {
                alert('最多添加5个标签');
            }
        }
    });

    function updateTags() {
        tagList.innerHTML = Array.from(tags).map(tag => `
            <span class="tag">
                ${tag}
                <button class="remove-tag" onclick="this.parentElement.remove(); tags.delete('${tag}');">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
    }
}

// 获取帖子类型文本
function getTypeText(type) {
    const typeMap = {
        strategy: '旅游攻略',
        story: '旅行故事',
        photo: '美图分享',
        question: '问答互助'
    };
    return typeMap[type] || type;
}

// 显示帖子详情
function showPostDetail(postId) {
    // 跳转到帖子详情页（使用已有的detail路由）
    window.location.href = `detail.html?id=${postId}`;
}

// 显示用户主页
function showUserProfile(userId) {
    // 跳转到个人中心页（使用已有的profile路由）
    window.location.href = `profile.html?id=${userId}`;
}

// 显示话题详情
function showTopic(topicId) {
    // 暂时停留在当前页面，或者也可以跳转到社区页面
    alert(`话题详情功能开发中...（话题ID: ${topicId}）`);
} 