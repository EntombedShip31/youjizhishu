document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否已登录
    checkAuth();

    // 初始化页面
    initializePage();
});

// 初始化页面
function initializePage() {
    // 加载用户信息
    loadUserInfo();
    
    // 加载收藏内容
    loadCollections();
    
    // 加载行程内容
    loadTrips();
    
    // 加载文章内容
    loadArticles();
    
    // 加载消息内容
    loadMessages();
    
    // 绑定事件处理
    bindEvents();
}

// 加载用户信息
function loadUserInfo() {
    // 模拟用户数据
    const userData = {
        name: '旅行达人',
        avatar: 'assets/img/4.jpg',
        bio: '热爱旅行，记录美好时刻',
        stats: {
            collections: 128,
            trips: 36,
            likes: 256
        }
    };

    // 更新页面信息
    document.querySelector('.user-details h1').textContent = userData.name;
    document.querySelector('.user-bio').textContent = userData.bio;
    document.getElementById('userAvatar').src = userData.avatar;

    // 更新统计数据
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers[0].textContent = userData.stats.collections;
    statNumbers[1].textContent = userData.stats.trips;
    statNumbers[2].textContent = userData.stats.likes;
}

// 加载收藏内容
function loadCollections() {
    // 模拟收藏数据
    const collections = [
        {
            id: 1,
            name: '故宫博物院',
            image: 'assets/img/3.jpg'
        },
        {
            id: 2,
            name: '西湖',
            image: 'assets/img/1.jpg'
        },
        {
            id: 3,
            name: '长城',
            image: 'assets/img/2.jpg'
        }
    ];

    // 修改选择器以匹配正确的元素
    const container = document.querySelector('.collection-grid');
    if (container) {
        container.innerHTML = collections.map(item => `
            <div class="collection-item">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
            </div>
        `).join('');
    }
}

// 加载行程内容
function loadTrips() {
    // 模拟行程数据
    const trips = [
        {
            date: '4月15日',
            title: '北京文化之旅',
            spots: '3天2晚 · 4个景点',
            status: 'upcoming'
        },
        {
            date: '5月1日',
            title: '杭州休闲游',
            spots: '2天1晚 · 3个景点',
            status: 'planning'
        }
    ];

    // 修改选择器以匹配正确的元素
    const container = document.querySelector('.trip-list');
    if (container) {
        container.innerHTML = trips.map(trip => `
            <div class="trip-item">
                <div class="trip-date">${trip.date}</div>
                <div class="trip-info">
                    <h4>${trip.title}</h4>
                    <p>${trip.spots}</p>
                </div>
                <span class="trip-status ${trip.status}">${getStatusText(trip.status)}</span>
            </div>
        `).join('');
    }
}

// 加载文章内容
function loadArticles() {
    // 模拟文章数据
    const articles = [
        {
            image: 'assets/img/3.jpg',
            title: '北京三日游完全攻略',
            stats: '阅读 1280 · 点赞 328'
        },
        {
            image: 'assets/img/1.jpg',
            title: '西湖最佳拍摄地点推荐',
            stats: '阅读 960 · 点赞 256'
        }
    ];

    // 修改选择器以匹配正确的元素
    const container = document.querySelector('.article-list');
    if (container) {
        container.innerHTML = articles.map(article => `
            <div class="article-item">
                <img src="${article.image}" alt="${article.title}">
                <div class="article-info">
                    <h4>${article.title}</h4>
                    <p>${article.stats}</p>
                </div>
            </div>
        `).join('');
    }
}

// 加载消息内容
function loadMessages() {
    // 模拟消息数据
    const messages = [
        {
            icon: 'comment-dots',
            title: '收到新的评论',
            content: '张三评论了你的文章《北京三日游》',
            time: '10分钟前',
            unread: true
        },
        {
            icon: 'heart',
            title: '获得新的点赞',
            content: '李四点赞了你的行程分享',
            time: '30分钟前',
            unread: true
        }
    ];

    // 修改选择器以匹配正确的元素
    const container = document.querySelector('.message-list');
    if (container) {
        container.innerHTML = messages.map(message => `
            <div class="message-item ${message.unread ? 'unread' : ''}">
                <i class="fas fa-${message.icon}"></i>
                <div class="message-info">
                    <h4>${message.title}</h4>
                    <p>${message.content}</p>
                    <span class="message-time">${message.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// 绑定事件处理
function bindEvents() {
    // 查看全部按钮点击事件
    document.querySelectorAll('.btn-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cardId = e.target.closest('.feature-card').id;
            handleViewMore(cardId);
        });
    });

    // 设置项点击事件
    document.querySelectorAll('.setting-item').forEach(item => {
        item.addEventListener('click', () => {
            handleSetting(item.dataset.setting);
        });
    });

    // 帮助项点击事件
    document.querySelectorAll('.help-item').forEach(item => {
        item.addEventListener('click', () => {
            handleHelp(item.dataset.type);
        });
    });
}

// 处理查看更多
function handleViewMore(cardId) {
    switch(cardId) {
        case 'collectionsCard':
            window.location.href = 'collections.html';
            break;
        case 'tripsCard':
            window.location.href = 'trips.html';
            break;
        case 'articlesCard':
            window.location.href = 'articles.html';
            break;
        case 'messagesCard':
            window.location.href = 'messages.html';
            break;
    }
}

// 处理设置项点击
function handleSetting(setting) {
    switch(setting) {
        case 'profile':
            // 处理个人资料设置
            break;
        case 'security':
            // 处理账号安全设置
            break;
        case 'notification':
            // 处理消息通知设置
            break;
    }
}

// 处理帮助项点击
function handleHelp(type) {
    switch(type) {
        case 'guide':
            window.location.href = 'guide.html';
            break;
        case 'service':
            // 打开客服对话
            break;
        case 'feedback':
            showFeedbackDialog();
            break;
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        upcoming: '即将出行',
        planning: '规划中',
        completed: '已完成'
    };
    return statusMap[status] || status;
}

// 添加显示反馈对话框的函数
function showFeedbackDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="feedback-dialog">
            <div class="dialog-header">
                <h3><i class="fas fa-comment-dots"></i> 问题反馈</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="form-group">
                    <label>问题类型</label>
                    <select class="feedback-type">
                        <option value="bug">功能异常</option>
                        <option value="suggestion">功能建议</option>
                        <option value="content">内容相关</option>
                        <option value="other">其他问题</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>问题描述</label>
                    <textarea class="feedback-content" placeholder="请详细描述您遇到的问题..." rows="5"></textarea>
                </div>
                <div class="form-group">
                    <label>上传截图（可选）</label>
                    <div class="upload-area">
                        <input type="file" id="feedbackImage" accept="image/*" multiple>
                        <div class="upload-trigger">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>点击或拖拽图片到此处</p>
                            <span>支持 jpg、png 格式，最多 3 张</span>
                        </div>
                    </div>
                    <div class="image-preview"></div>
                </div>
                <div class="form-group">
                    <label>联系方式（可选）</label>
                    <input type="text" class="feedback-contact" placeholder="请留下您的邮箱或手机号，方便我们回复您">
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary submit-btn">提交反馈</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    // 绑定关闭事件
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    closeBtn.onclick = () => dialog.remove();
    cancelBtn.onclick = () => dialog.remove();

    // 绑定提交事件
    const submitBtn = dialog.querySelector('.submit-btn');
    submitBtn.onclick = () => {
        const type = dialog.querySelector('.feedback-type').value;
        const content = dialog.querySelector('.feedback-content').value;
        const contact = dialog.querySelector('.feedback-contact').value;

        if (!content.trim()) {
            showToast('请描述您遇到的问题');
            return;
        }

        // 这里应该调用API提交反馈
        console.log('提交反馈:', { type, content, contact });
        showToast('感谢您的反馈！');
        dialog.remove();
    };

    // 初始化图片上传
    initImageUpload(dialog);
}

// 初始化图片上传功能
function initImageUpload(dialog) {
    const uploadArea = dialog.querySelector('.upload-area');
    const imageInput = dialog.querySelector('#feedbackImage');
    const imagePreview = dialog.querySelector('.image-preview');
    const uploadedImages = [];

    uploadArea.onclick = () => imageInput.click();

    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    };

    uploadArea.ondragleave = () => {
        uploadArea.classList.remove('dragover');
    };

    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    };

    imageInput.onchange = (e) => {
        handleFiles(e.target.files);
    };

    function handleFiles(files) {
        if (uploadedImages.length + files.length > 3) {
            showToast('最多只能上传3张图片');
            return;
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                showToast('只能上传图片文件');
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