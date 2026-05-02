document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否已登录
    checkAuth();

    // 获取URL中的景点ID
    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id');

    // 初始化页面
    initializePage(spotId);
});

// 模拟景点数据库
const spotsDatabase = {
    1: {
        name: '故宫博物院',
        images: ['assets/img/3.jpg'],
        rating: 4.9,
        reviews: 12580,
        tags: ['世界文化遗产', '5A级景区', '明清古建筑'],
        basicInfo: {
            openTime: '4月1日-10月31日：8:30-17:00\n11月1日-次年3月31日：8:30-16:30\n（16:00停止售票，周一闭馆）',
            price: '旺季（4月1日-10月31日）：¥60/人\n淡季（11月1日-次年3月31日）：¥40/人',
            address: '北京市东城区景山前街4号',
            traffic: '地铁1号线天安门东站下车步行10分钟\n公交1、2、52、82、120路故宫站下车'
        },
        introduction: {
            summary: '故宫博物院，旧称紫禁城，是中国明清两代的皇家宫殿，也是现今世界上规模最大、保存最完整的木质结构古建筑群。位于北京中轴线的中心，是中国古代宫廷建筑的代表作。',
            architecture: '故宫南北长961米，东西宽753米，四面围有高10米的城墙，外有宽52米的护城河。紫禁城内的建筑分为外朝和内廷两部分。外朝以太和殿、中和殿、保和殿三大殿为中心，是举行朝会和重大典礼的地方；内廷以乾清宫、交泰殿、坤宁宫后三宫为中心，是皇帝和后妃居住的地方。',
            highlights: [
                {
                    name: '太和殿',
                    description: '明清两代皇帝举行大典的地方',
                    icon: 'crown'
                },
                {
                    name: '乾清宫',
                    description: '皇帝日常居住和处理政务的地方',
                    icon: 'home'
                },
                {
                    name: '珍宝馆',
                    description: '收藏和展示皇家珍品',
                    icon: 'gem'
                },
                {
                    name: '御花园',
                    description: '皇家园林，四季景色不同',
                    icon: 'tree'
                }
            ]
        }
    },
    2: {
        name: '西湖风景区',
        images: ['assets/img/1.jpg'],
        rating: 4.8,
        reviews: 15800,
        tags: ['世界文化遗产', '5A级景区', '自然风光'],
        basicInfo: {
            openTime: '全天开放',
            price: '免费开放（部分景点单独收费）',
            address: '浙江省杭州市西湖区',
            traffic: '地铁1号线龙翔桥站下车\n公交K7、Y2、Y5等线路西湖站下车'
        },
        introduction: {
            summary: '西湖，位于浙江省杭州市西湖区，是中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。',
            architecture: '西湖景区由湖体及其周围的自然和人文景观组成。湖体面积约6.39平方公里，湖岸线长约15公里，平均水深2.27米。',
            highlights: [
                {
                    name: '断桥残雪',
                    description: '西湖十景之一，断桥情缘',
                    icon: 'bridge'
                },
                {
                    name: '雷峰塔',
                    description: '白蛇传说的重要场景',
                    icon: 'tower'
                },
                {
                    name: '三潭印月',
                    description: '湖中三座石塔倒影',
                    icon: 'moon'
                },
                {
                    name: '苏堤春晓',
                    description: '柳浪闻莺，春意盎然',
                    icon: 'leaf'
                }
            ]
        }
    }
    // 可以继续添加更多景点数据...
};

// 初始化页面
function initializePage(spotId) {
    if (!spotId || !spotsDatabase[spotId]) {
        showErrorPage();
        return;
    }

    const spotData = spotsDatabase[spotId];
    
    // 更新页面标题
    document.title = `游迹智述·${spotData.name}`;
    
    // 加载景点基本信息
    loadSpotBasicInfo(spotData);
    
    // 初始化图片画廊（确保有图片数据）
    if (spotData.images && spotData.images.length > 0) {
        initGallery(spotData.images);
    }
    
    // 初始化标签页
    initTabs();
    
    // 加载景点介绍内容
    if (spotData.introduction) {
        loadIntroContent(spotData.introduction);
    }
    
    // 绑定按钮事件
    bindButtonEvents();
    
    // 加载评价数据
    loadReviews();
    
    // 加载相关推荐
    loadRelatedSpots(spotId);
}

// 加载景点基本信息
function loadSpotBasicInfo(spotData) {
    // 更新景点名称
    document.querySelector('.spot-title h1').textContent = spotData.name;
    
    // 更新评分和评价数
    document.querySelector('.rating-score').textContent = spotData.rating;
    document.querySelector('.review-count').textContent = `(${spotData.reviews}条评价)`;
    
    // 更新标签
    const tagsContainer = document.querySelector('.spot-tags');
    tagsContainer.innerHTML = spotData.tags.map(tag => 
        `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`
    ).join('');
    
    // 更新基本信息
    const infoItems = document.querySelectorAll('.info-item');
    infoItems[0].querySelector('.value').innerHTML = spotData.basicInfo.openTime;
    infoItems[1].querySelector('.value').innerHTML = spotData.basicInfo.price;
    infoItems[2].querySelector('.value').innerHTML = spotData.basicInfo.address;
    infoItems[3].querySelector('.value').innerHTML = spotData.basicInfo.traffic;
}

// 显示错误页面
function showErrorPage() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="error-page">
            <i class="fas fa-exclamation-circle"></i>
            <h2>抱歉，未找到该景点信息</h2>
            <p>该景点可能不存在或已被删除</p>
            <button class="btn btn-primary" onclick="window.location.href='/spot'">
                返回景点列表
            </button>
        </div>
    `;
}

// 初始化图片画廊
function initGallery(images) {
    const mainImage = document.querySelector('.gallery-main img');
    const photoCount = document.querySelector('.photo-count');
    const thumbsContainer = document.querySelector('.gallery-thumbs');
    
    // 检查必要元素是否存在
    if (!mainImage || !photoCount || !thumbsContainer || !images || !images.length) {
        console.log('Gallery elements not found or no images provided');
        return;
    }

    // 更新主图
    mainImage.src = images[0];
    
    // 生成缩略图
    thumbsContainer.innerHTML = images.map((img, index) => `
        <div class="gallery-thumb ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="景点图片">
        </div>
    `).join('');

    // 重新绑定缩略图点击事件
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // 更新主图
            mainImage.src = images[index];
            // 更新缩略图状态
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // 更新照片计数
    photoCount.textContent = `${images.length}张图片`;
}

// 初始化标签页切换
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新标签页状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            const targetId = tab.getAttribute('data-tab');
            loadTabContent(targetId);
        });
    });
}

// 加载标签页内容
function loadTabContent(tabId) {
    const contentDiv = document.querySelector('.tab-content');
    let content = '';

    switch(tabId) {
        case 'intro':
            // 重用当前景点的介绍内容
            const spotId = new URLSearchParams(window.location.search).get('id');
            const spotData = spotsDatabase[spotId];
            if (spotData) {
                loadIntroContent(spotData.introduction);
            }
            break;

        case 'history':
            content = `
                <div class="tab-pane active" id="historyContent">
                    <div class="rich-content">
                        <div class="history-timeline">
                            <h3><i class="fas fa-history"></i> 历史沿革</h3>
                            <div class="timeline-item">
                                <div class="time-point">1406年</div>
                                <div class="time-content">
                                    <h4>开工建设</h4>
                                    <p>明成祖朱棣下令营建北京皇宫，历时14年完工</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="time-point">1420年</div>
                                <div class="time-content">
                                    <h4>正式建成</h4>
                                    <p>紫禁城主体建筑完工，成为明朝皇宫</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="time-point">1644年</div>
                                <div class="time-content">
                                    <h4>清入主</h4>
                                    <p>清朝统治者入主紫禁城，并进行扩建</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="time-point">1925年</div>
                                <div class="time-content">
                                    <h4>博物院成立</h4>
                                    <p>紫禁城改为故宫博物院，正式对外开放</p>
                                </div>
                            </div>
                        </div>
                        <div class="cultural-value">
                            <h3><i class="fas fa-book"></i> 文化价值</h3>
                            <p>故宫是中国传统建筑艺术的精华，体现了中国古代"天人合一"的哲学思想和"礼制"文化。其建筑布局严格遵循等级制度，体现了封建社会的等级观念。同时，故宫还是中国传统文化的重要载体，收藏了大量珍贵文物。</p>
                        </div>
                    </div>
                </div>`;
            break;

        case 'tips':
            content = `
                <div class="tab-pane active" id="tipsContent">
                    <div class="rich-content">
                        <div class="tips-section">
                            <h3><i class="fas fa-clock"></i> 最佳游览时间</h3>
                            <div class="tips-grid">
                                <div class="tip-item">
                                    <h4>春季（3-5月）</h4>
                                    <p>气温适宜，游客相对较少，是游览的最佳季节</p>
                                </div>
                                <div class="tip-item">
                                    <h4>秋季（9-11月）</h4>
                                    <p>天高气爽，适合拍照，也是理想的游览时节</p>
                                </div>
                            </div>
                        </div>
                        <div class="tips-section">
                            <h3><i class="fas fa-map-signs"></i> 游览路线推荐</h3>
                            <div class="route-box">
                                <h4>经典路线（3-4小时）</h4>
                                <p>午门 → 太和门 → 太和殿 → 中和殿 → 保和殿 → 乾清宫 → 御花园</p>
                            </div>
                            <div class="route-box">
                                <h4>深度路线（5-6小时）</h4>
                                <p>包含经典路线 + 珍宝馆 → 钟表馆 → 宫廷文物展</p>
                            </div>
                        </div>
                        <div class="tips-section">
                            <h3><i class="fas fa-exclamation-circle"></i> 注意事项</h3>
                            <ul class="tips-list">
                                <li>建议提前在网上预约购票</li>
                                <li>参观时请遵守景区规定，不要触摸文物</li>
                                <li>景区内步行距离较长，建议穿舒适的鞋子</li>
                                <li>夏季防晒、冬季保暖措施要做好</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            break;

        case 'facilities':
            content = `
                <div class="tab-pane active" id="facilitiesContent">
                    <div class="rich-content">
                        <div class="facilities-grid">
                            <div class="facility-item">
                                <i class="fas fa-restroom"></i>
                                <h4>卫生间</h4>
                                <p>景区内设有多处公共卫生间，位置分布均匀</p>
                            </div>
                            <div class="facility-item">
                                <i class="fas fa-store"></i>
                                <h4>商店</h4>
                                <p>提供文创产品、纪念品等，可使用移动支付</p>
                            </div>
                            <div class="facility-item">
                                <i class="fas fa-utensils"></i>
                                <h4>餐饮</h4>
                                <p>设有休息区和小型餐饮点，提供简餐</p>
                            </div>
                            <div class="facility-item">
                                <i class="fas fa-wheelchair"></i>
                                <h4>无障碍设施</h4>
                                <p>主要参观路线设有无障碍通道和设施</p>
                            </div>
                        </div>
                    </div>
                </div>`;
            break;
    }

    if (content) {
        contentDiv.innerHTML = content;
    }
}

// 绑定按钮事件
function bindButtonEvents() {
    // 语音导览按钮
    const startTourBtn = document.getElementById('startTourBtn');
    startTourBtn.addEventListener('click', () => {
        showTourDialog();
    });
    
    // 加入行程按钮
    const addToTripBtn = document.getElementById('addToTripBtn');
    addToTripBtn.addEventListener('click', () => {
        showAddToTripDialog();
    });
    
    // 收藏按钮
    const collectBtn = document.getElementById('collectBtn');
    collectBtn.addEventListener('click', () => {
        toggleCollect();
    });
    
    // 分按钮
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        showShareDialog();
    });
}

// 显示语音导览对话框
function showTourDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3><i class="fas fa-headphones"></i> 语音导览</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="audio-player">
                    <div class="player-controls">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="progress-bar">
                            <div class="progress-current"></div>
                        </div>
                        <div class="time-info">
                            <span class="current-time">00:00</span>
                            <span>/</span>
                            <span class="total-time">05:30</span>
                        </div>
                    </div>
                </div>
                <div class="tour-text">
                    <h4>景点介绍</h4>
                    <p>故宫，又名紫禁城，是中国明清两代的皇家宫殿。这里是世界上现存规模最大、保存最完整的木质结构古建筑群，也是中国传统建筑艺术的精华。</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定关闭事件
    bindDialogEvents(dialog);

    // 初始化音频播放器
    initAudioPlayer(dialog);
}

// 初始化音频播放器
function initAudioPlayer(dialog) {
    const playBtn = dialog.querySelector('.play-btn');
    const progressBar = dialog.querySelector('.progress-bar');
    const progressCurrent = dialog.querySelector('.progress-current');
    const currentTime = dialog.querySelector('.current-time');
    const totalTime = dialog.querySelector('.total-time');
    
    let isPlaying = false;
    let progress = 0;
    let progressTimer = null;

    // 播放/暂停按钮点击事件
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startPlaying();
        } else {
            pausePlaying();
        }
    });

    // 进度条点击事件
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        progress = (x / rect.width) * 100;
        updateProgress();
    });

    function startPlaying() {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        progressTimer = setInterval(() => {
            progress += 0.4;
            if (progress >= 100) {
                progress = 0;
                pausePlaying();
            }
            updateProgress();
        }, 100);
    }

    function pausePlaying() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(progressTimer);
    }

    function updateProgress() {
        progressCurrent.style.width = `${progress}%`;
        
        // 更新时间显示
        const totalSeconds = 330; // 5:30 的总秒数
        const currentSeconds = Math.floor((progress / 100) * totalSeconds);
        currentTime.textContent = formatTime(currentSeconds);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
}

// 显示加入行程对话框
function showAddToTripDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3><i class="fas fa-calendar-plus"></i> 加入行程</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="form-group">
                    <label>选择行程</label>
                    <select class="form-select">
                        <option value="new">创建新行程</option>
                        <option value="1">北京三日游</option>
                        <option value="2">长城一日游</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>游玩日期</label>
                    <input type="date" class="form-input">
                </div>
                <div class="form-group">
                    <label>游玩时间</label>
                    <div class="time-range">
                        <input type="time" value="09:00" class="form-input">
                        <span>至</span>
                        <input type="time" value="11:00" class="form-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>备注信息</label>
                    <textarea class="form-textarea" placeholder="添加备注信息..."></textarea>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary confirm-btn">确认添加</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定关闭事件
    bindDialogEvents(dialog);
}

// 切换收藏状态
function toggleCollect() {
    const collectBtn = document.getElementById('collectBtn');
    
    // 显示收藏对话框
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3><i class="fas fa-folder-plus"></i> 添加到收藏</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="collect-options">
                    <div class="collect-folder">
                        <label>选择收藏夹</label>
                        <select class="form-select">
                            <option value="default">默认收藏夹</option>
                            <option value="want">想去的地方</option>
                            <option value="visited">去过的地方</option>
                            <option value="new">+ 新建收藏夹</option>
                        </select>
                    </div>
                    <div class="collect-note">
                        <label>添加备注（可选）</label>
                        <textarea class="form-textarea" placeholder="记录一下你对这个地方的想法..."></textarea>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary confirm-btn">确认收藏</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定事件
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const confirmBtn = dialog.querySelector('.confirm-btn');
    const select = dialog.querySelector('select');

    // 关闭按钮事件
    closeBtn.onclick = () => {
        dialog.style.opacity = '0';
        setTimeout(() => dialog.remove(), 300);
    };

    // 取消按钮事件
    cancelBtn.onclick = closeBtn.onclick;

    // 新建收藏夹选项
    select.onchange = (e) => {
        if (e.target.value === 'new') {
            showNewFolderDialog(select);
        }
    };

    // 确认收藏事件
    confirmBtn.onclick = () => {
        const folder = select.value;
        const note = dialog.querySelector('textarea').value;
        
        // 更新按钮状态
        collectBtn.classList.add('active');
        collectBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        
        // 保存收藏信息
        saveCollection(folder, note);
        
        // 显示成功提示
        showToast('收藏成功');
        
        // 关闭对话框
        closeBtn.onclick();
    };
}

// 显示新建收藏夹对话框
function showNewFolderDialog(select) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content" style="max-width: 400px;">
            <div class="dialog-header">
                <h3><i class="fas fa-folder-plus"></i> 新建收藏夹</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="form-group">
                    <label>收藏夹名</label>
                    <input type="text" class="form-input" placeholder="给收藏夹起个名字">
                </div>
                <div class="form-group">
                    <label>收藏夹描述（可选）</label>
                    <textarea class="form-textarea" placeholder="添加描述..."></textarea>
                </div>
                <div class="form-group">
                    <label class="privacy-setting">
                        <input type="checkbox" checked>
                        <span>设为私密收藏夹</span>
                    </label>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary confirm-btn">创建</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定事件
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const confirmBtn = dialog.querySelector('.confirm-btn');

    const close = () => {
        dialog.style.opacity = '0';
        setTimeout(() => {
            dialog.remove();
            select.value = 'default'; // 重置选择框
        }, 300);
    };

    closeBtn.onclick = close;
    cancelBtn.onclick = close;

    confirmBtn.onclick = () => {
        const name = dialog.querySelector('input').value.trim();
        if (!name) {
            showToast('请输入收藏夹名称');
            return;
        }

        // 添加新选项
        const option = new Option(name, name);
        select.add(option, select.options[select.options.length - 1]);
        select.value = name;

        // 显示成功提示
        showToast('创建成功');
        
        // 关闭对话框
        close();
    };
}

// 保存收藏信息
function saveCollection(folder, note) {
    const spotId = new URLSearchParams(window.location.search).get('id');
    const collections = JSON.parse(localStorage.getItem('collections') || '{}');
    
    if (!collections[folder]) {
        collections[folder] = [];
    }
    
    collections[folder].push({
        spotId,
        note,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('collections', JSON.stringify(collections));
}

// 显示分享对话框
function showShareDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3><i class="fas fa-share-alt"></i> 分享</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="share-options">
                    <div class="share-item">
                        <i class="fab fa-weixin"></i>
                        <span>微信</span>
                    </div>
                    <div class="share-item">
                        <i class="fab fa-qq"></i>
                        <span>QQ</span>
                    </div>
                    <div class="share-item">
                        <i class="fab fa-weibo"></i>
                        <span>微博</span>
                    </div>
                    <div class="share-item">
                        <i class="fas fa-link"></i>
                        <span>复制链接</span>
                    </div>
                </div>
                <div class="share-qrcode">
                    <i class="fas fa-qrcode"></i>
                    <p>扫描二维码分享给好友</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定关闭事件
    bindDialogEvents(dialog);
}

// 绑定对话框事件
function bindDialogEvents(dialog) {
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    
    // 关闭按钮事件
    closeBtn.onclick = () => {
        dialog.style.opacity = '0';
        setTimeout(() => dialog.remove(), 300);
    };
    
    // 取消按钮事件
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            dialog.style.opacity = '0';
            setTimeout(() => dialog.remove(), 300);
        };
    }
    
    // 点击遮罩层关闭
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.style.opacity = '0';
            setTimeout(() => dialog.remove(), 300);
        }
    });
}

// 显示提示信息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 加载评价数据
function loadReviews() {
    const container = document.querySelector('.review-list');
    if (!container) return;

    // 模拟评价数据
    const reviews = [
        {
            id: 1,
            user: {
                name: '张三',
                level: '资深玩家'
            },
            rating: 5,
            date: '2024-03-15',
            content: '景色非常壮观，导览解说很专业，让人深入了解了很多历史文化知识。建议早上去人少一些，可以更好地欣赏和拍照。',
            likes: 128,
            replies: 12
        },
        {
            id: 2,
            user: {
                name: '李四',
                level: '旅行达人'
            },
            rating: 4,
            date: '2024-03-14',
            content: '整体体验不错，建议早上去人少一些，下午游客比较多。导游讲解很专业，了解了很多历史故事。',
            likes: 56,
            replies: 5
        }
    ];

    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="reviewer-info">
                <div class="reviewer-meta">
                    <h4>${review.user.name}</h4>
                    <span class="reviewer-badge">${review.user.level}</span>
                </div>
                <div class="review-rating">
                    <div class="rating-stars">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                    <span class="review-date">${review.date}</span>
                </div>
            </div>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
            <div class="review-footer">
                <button class="review-action">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${review.likes}</span>
                </button>
                <button class="review-action">
                    <i class="fas fa-comment"></i>
                    <span>${review.replies}</span>
                </button>
            </div>
        </div>
    `).join('');
}

// 加载相关推荐
function loadRelatedSpots(spotId) {
    const container = document.querySelector('.related-grid');
    if (!container) return;

    // 模拟相关景点数据
    const relatedSpots = [
        {
            id: 1,
            name: '天安门广场',
            image: 'assets/img/4.jpg',
            description: '世界上最大的城市广场',
            rating: 4.8,
            price: '免费'
        },
        {
            id: 2,
            name: '长城',
            image: 'assets/img/2.jpg',
            description: '世界文化遗产',
            rating: 4.7,
            price: '¥30'
        },
        {
            id: 3,
            name: '西湖',
            image: 'assets/img/1.jpg',
            description: '西湖美景',
            rating: 4.9,
            price: '¥40'
        }
    ];

    container.innerHTML = relatedSpots.map(spot => `
        <div class="related-card" onclick="showDestinationDetail(${spot.id})">
            <div class="related-image-wrapper">
                <img src="${spot.image}" alt="${spot.name}" class="related-image">
            </div>
            <div class="related-content">
                <h3>${spot.name}</h3>
                <p>${spot.description}</p>
                <div class="related-footer">
                    <div class="spot-rating">
                        <i class="fas fa-star"></i>
                        <span>${spot.rating}</span>
                    </div>
                    <div class="spot-price">${spot.price}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示景点详情
function showDestinationDetail(spotId) {
    window.location.href = `/detail?id=${spotId}`;
}

// 加载景点介绍内容
function loadIntroContent(introData) {
    const container = document.querySelector('.tab-content');
    if (!container) return;

    // 获取当前景点数据
    const spotId = new URLSearchParams(window.location.search).get('id');
    const spotData = spotsDatabase[spotId];
    if (!spotData) return;

    container.innerHTML = `
        <div class="tab-pane active" id="introContent">
            <div class="rich-content">
                <div class="intro-header">
                    <div class="intro-text">
                        <h2>${spotData.name}</h2>
                        <p class="subtitle">自然与人文的完美融合</p>
                        <p class="description">${introData.summary}</p>
                    </div>
                    <div class="intro-image">
                        <img src="${spotData.images[0]}" alt="${spotData.name}" class="main-image">
                        <p class="image-caption">景区全景图</p>
                    </div>
                </div>

                <div class="section-block">
                    <h3><i class="fas fa-landmark"></i> 景区概况</h3>
                    <p>${introData.architecture}</p>
                </div>

                <div class="highlight-box">
                    <h4><i class="fas fa-star"></i> 必看景点</h4>
                    <div class="highlight-grid">
                        ${introData.highlights.map(spot => `
                            <div class="highlight-item">
                                <i class="fas fa-${spot.icon}"></i>
                                <h5>${spot.name}</h5>
                                <p>${spot.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 显示写评价对话框
function showReviewDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content review-dialog">
            <div class="dialog-header">
                <h3><i class="fas fa-edit"></i> 写评价</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="dialog-body">
                <div class="rating-section">
                    <label>总体评分</label>
                    <div class="star-rating">
                        <i class="fas fa-star" data-rating="1"></i>
                        <i class="fas fa-star" data-rating="2"></i>
                        <i class="fas fa-star" data-rating="3"></i>
                        <i class="fas fa-star" data-rating="4"></i>
                        <i class="fas fa-star" data-rating="5"></i>
                    </div>
                    <span class="rating-text">请选择评分</span>
                </div>
                <div class="review-form">
                    <div class="form-group">
                        <label>评价内容</label>
                        <textarea class="review-content" placeholder="分享您的游览体验..." rows="5"></textarea>
                        <div class="word-count">0/500</div>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary confirm-btn">发布评价</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.style.opacity = '1');

    // 绑定评分事件
    const stars = dialog.querySelectorAll('.star-rating i');
    const ratingText = dialog.querySelector('.rating-text');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(rating);
            updateRatingText(rating);
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            updateStars(currentRating);
            updateRatingText(currentRating);
        });
    });

    const starContainer = dialog.querySelector('.star-rating');
    starContainer.addEventListener('mouseout', () => {
        updateStars(currentRating);
        updateRatingText(currentRating);
    });

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.style.color = starRating <= rating ? '#f39c12' : '#ddd';
        });
    }

    function updateRatingText(rating) {
        const texts = ['请选择评分', '很差', '一般', '好', '很好', '非常好'];
        ratingText.textContent = texts[rating];
    }

    // 绑定字数统计
    const textarea = dialog.querySelector('.review-content');
    const wordCount = dialog.querySelector('.word-count');

    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        wordCount.textContent = `${length}/500`;
        if (length > 500) {
            textarea.value = textarea.value.substring(0, 500);
            wordCount.textContent = '500/500';
        }
    });

    // 绑定关闭事件
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const confirmBtn = dialog.querySelector('.confirm-btn');

    const close = () => {
        dialog.style.opacity = '0';
        setTimeout(() => dialog.remove(), 300);
    };

    closeBtn.onclick = close;
    cancelBtn.onclick = close;

    // 确认发布事件
    confirmBtn.onclick = () => {
        if (!currentRating) {
            showToast('请选择评分');
            return;
        }

        const content = textarea.value.trim();
        if (!content) {
            showToast('请填写评价内容');
            return;
        }

        // 这里应该调用API保存评价
        console.log('发布评价:', { rating: currentRating, content });
        showToast('评价发布成功');
        close();
    };
}

// 绑定写评价按钮事件
document.querySelector('.write-review-btn').addEventListener('click', showReviewDialog); 