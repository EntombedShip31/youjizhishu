document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializePage();
    initAddSpotButton();
    initParticleEffect();
});

// 模拟景点数据
const spotsData = [
    {
        id: 1,
        name: '故宫博物院',
        image: 'assets/img/3.jpg',
        description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最完整的木质结构古建筑之一。',
        location: '北京市东城区景山前街4号',
        price: 60,
        rating: 4.9,
        reviews: 12580,
        lat: 39.916345,
        lng: 116.397155,
        type: 'cultural',
        season: 'spring',
        features: ['文化遗产', '古建筑', '博物馆']
    },
    {
        id: 2,
        name: '西湖',
        image: 'assets/img/1.jpg',
        description: '西湖美景',
        location: '杭州市西湖区',
        price: 0,
        rating: 4.8,
        reviews: 8920,
        lat: 39.903524,
        lng: 116.397436,
        type: 'cultural',
        season: 'spring',
        features: ['自然风光', '文化']
    }
];

// 初始化页面
function initializePage() {
    // 加载景点列表
    loadSpots();
    
    // 初始化筛选功能
    initFilters();
    
    // 加载季节推荐
    loadSeasonalSpots();
    
    // 加载用户评价
    loadReviews();
    
    // 绑定搜索功能
    initSearch();
}

// 加载景点列表
function loadSpots(filters = {}) {
    const container = document.getElementById('spotsGrid');
    let filteredSpots = spotsData;
    
    // 应用筛选条件
    if (filters.region) {
        filteredSpots = filteredSpots.filter(spot => spot.region === filters.region);
    }
    if (filters.season) {
        filteredSpots = filteredSpots.filter(spot => spot.season === filters.season);
    }
    if (filters.type) {
        filteredSpots = filteredSpots.filter(spot => spot.type === filters.type);
    }
    
    // 应用排序
    if (filters.sort) {
        switch (filters.sort) {
            case 'popular':
                filteredSpots.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'rating':
                filteredSpots.sort((a, b) => b.rating - a.rating);
                break;
            case 'price':
                filteredSpots.sort((a, b) => a.price - b.price);
                break;
        }
    }
    
    // 渲染景点卡片
    container.innerHTML = filteredSpots.map(spot => `
        <div class="spot-card" data-id="${spot.id}" onclick="showDestinationDetail(${spot.id})">
            <img src="${spot.image}" alt="${spot.name}" class="spot-image">
            <div class="spot-content">
                <h3 class="spot-title">${spot.name}</h3>
                <div class="spot-info">
                    <span><i class="fas fa-map-marker-alt"></i> ${spot.location}</span>
                    <div class="spot-features">
                        ${spot.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
                <p class="spot-description">${spot.description}</p>
                <div class="spot-footer">
                    <div class="spot-rating">
                        <i class="fas fa-star"></i>
                        <span>${spot.rating}</span>
                        <small>(${spot.reviews}条评价)</small>
                    </div>
                    <div class="spot-price">
                        ${spot.price > 0 ? `¥${spot.price}` : '免费'}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化筛选功能
function initFilters() {
    const filters = {
        region: document.getElementById('regionFilter'),
        season: document.getElementById('seasonFilter'),
        sort: document.getElementById('sortFilter')
    };
    
    // 绑定筛选事件
    Object.values(filters).forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => {
                loadSpots({
                    region: filters.region?.value,
                    season: filters.season?.value,
                    sort: filters.sort?.value
                });
            });
        }
    });
    
    // 绑定标签点击事件
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.filter-tags .tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            loadSpots({ type: tag.textContent === '全部' ? '' : tag.textContent });
        });
    });
}

// 加载季节推荐
function loadSeasonalSpots() {
    const container = document.getElementById('seasonalSlider');
    if (!container) return;

    const currentSeason = getCurrentSeason();
    const seasonalSpots = {
        spring: [
            {
                id: 1,
                name: '故宫博物院',
                image: 'assets/img/3.jpg',
                description: '春日的故宫，粉墙黛瓦间点缀着盛开的海棠花，漫步其中感受600年紫禁城的历史底蕴。',
                rating: 4.9,
                features: ['文化古迹', '春花', '摄影']
            },
            {
                id: 2,
                name: '西湖风光',
                image: 'assets/img/1.jpg',
                description: '春季的西湖，烟雨朦胧中的断桥残雪，柳絮飞舞，处处展现着江南水乡的诗意。',
                rating: 4.8,
                features: ['自然风光', '园林', '文化']
            },
            {
                id: 3,
                name: '苏州园林',
                image: 'assets/img/苏州.jpg',
                description: '春天的苏州园林，亭台楼阁间繁花似锦，处处体现着江南园林的精致与典雅。',
                rating: 4.7,
                features: ['园林', '春花', '古建筑']
            }
        ],
        summer: [
            {
                id: 4,
                name: '洱海风光',
                image: 'assets/img/洱海.jpg',
                description: '夏季的洱海，碧波荡漾，远山如黛，是避暑休闲的绝佳去处。',
                rating: 4.9,
                features: ['自然风光', '避暑', '摄影']
            },
            {
                id: 5,
                name: '黄山云海',
                image: 'assets/img/黄山.jpg',
                description: '夏日清晨的黄山，云海翻腾，奇松怪石若隐若现，美不胜收。',
                rating: 4.8,
                features: ['自然风光', '山水', '摄影']
            },
            {
                id: 6,
                name: '成都美食',
                image: 'assets/img/sc.jpg',
                description: '夏季的成都，在美食与茶馆中感受悠闲的天府生活，品味地道川菜。',
                rating: 4.7,
                features: ['美食', '文化', '休闲']
            }
        ],
        autumn: [
            {
                id: 7,
                name: '西安古城',
                image: 'assets/img/xian.jpg',
                description: '秋季的西安古城，漫步城墙之上，感受千年古都的历史沧桑。',
                rating: 4.9,
                features: ['文化古迹', '历史', '美食']
            },
            {
                id: 8,
                name: '长城',
                image: 'assets/img/2.jpg',
                description: '秋日的长城，红叶满山。',
                rating: 4.8,
                features: ['文化遗产', '摄影']
            },
            {
                id: 9,
                name: '天安门广场',
                image: 'assets/img/4.jpg',
                description: '金秋时节的天安门广场，庄严肃穆，见证着新中国的发展历程。',
                rating: 4.9,
                features: ['地标', '文化', '爱国教育']
            }
        ],
        winter: [
            {
                id: 10,
                name: '北京故宫',
                image: 'assets/img/5.jpg',
                description: '冬日的故宫，白雪覆盖下的红墙金瓦，展现出不一样的皇城风貌。',
                rating: 4.8,
                features: ['文化遗产', '冬景', '摄影']
            },
            {
                id: 11,
                name: '香格里拉',
                image: 'assets/img/6.jpg',
                description: '冬季的香格里拉，皑皑白雪中的藏式建筑，仿佛人间天堂。',
                rating: 4.9,
                features: ['自然风光', '民族文化', '雪景']
            },
            {
                id: 12,
                name: '西湖雪景',
                image: 'assets/img/1.jpg',
                description: '雪后的西湖，白堤杨柳披银装，宛如一幅水墨丹青。',
                rating: 4.7,
                features: ['自然风光', '雪景', '摄影']
            }
        ]
    };

    const currentSeasonSpots = seasonalSpots[currentSeason];
    
    if (currentSeasonSpots.length === 0) {
        container.innerHTML = '<p>暂无当季推荐景点</p>';
        return;
    }
    
    container.innerHTML = currentSeasonSpots.map(spot => `
        <div class="seasonal-card">
            <img src="${spot.image}" alt="${spot.name}" class="seasonal-image">
            <div class="seasonal-content">
                <h3>${spot.name}</h3>
                <p class="seasonal-desc">${spot.description}</p>
                <div class="seasonal-footer">
                    <div class="seasonal-rating">
                        <i class="fas fa-star"></i>
                        <span>${spot.rating}</span>
                    </div>
                    <div class="seasonal-features">
                        ${spot.features.map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
                <button class="btn btn-primary view-detail-btn" onclick="showDestinationDetail(${spot.id})">查看详情</button>
            </div>
        </div>
    `).join('');
}

// 加载用户评价
function loadReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    const reviews = [
        {
            id: 1,
            user: {
                name: '张三',
                avatar: 'assets/img/1.jpg'
            },
            spot: '故宫博物院',
            content: '景色非常壮观，导览解说很专业，让人深入了解了很多历史文化知识。',
            rating: 5,
            date: '2024-03-15'
        }
    ];
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img src="${review.user.avatar}" alt="${review.user.name}" class="reviewer-avatar">
                <div>
                    <h4>${review.user.name}</h4>
                    <div class="review-meta">
                        <span class="review-rating">
                            ${'★'.repeat(review.rating)}
                        </span>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
            </div>
            <div class="review-content">
                <h5>${review.spot}</h5>
                <p>${review.content}</p>
            </div>
        </div>
    `).join('');
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        const handleSearch = () => {
            const keyword = searchInput.value.trim().toLowerCase();
            if (!keyword) return;
            
            const filteredSpots = spotsData.filter(spot => 
                spot.name.toLowerCase().includes(keyword) ||
                spot.description.toLowerCase().includes(keyword) ||
                spot.location.toLowerCase().includes(keyword) ||
                spot.features.some(feature => feature.toLowerCase().includes(keyword))
            );
            
            loadSpots({ spots: filteredSpots });
        };
        
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

// 获取当前季节
function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

// 显示景点详情
function showDestinationDetail(spotId) {
    window.location.href = `/detail?id=${spotId}`;
}

// 添加新建景点按钮的初始化和处理函数
function initAddSpotButton() {
    // 修改按钮位置到热门目的地标题旁边
    const sectionHeader = document.querySelector('.destinations-section .section-header');
    if (sectionHeader) {
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary add-spot-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i> 新建景点';
        addButton.onclick = showAddSpotForm;
        
        // 将按钮添加到标题栏右侧
        const headerRight = document.createElement('div');
        headerRight.className = 'header-right';
        headerRight.appendChild(addButton);
        sectionHeader.appendChild(headerRight);
    }
}

// 显示新建景点表单
function showAddSpotForm() {
    // 保存当前内容以便返回
    const mainContent = document.querySelector('.main-content');
    const originalContent = mainContent.innerHTML;

    // 更新页面内容
    mainContent.innerHTML = `
        <section class="add-spot-section container">
            <div class="section-header">
                <button class="back-btn" onclick="restoreSpotList()">
                    <i class="fas fa-arrow-left"></i> 返回列表
                </button>
                <h2>新建景点</h2>
            </div>
            <form class="add-spot-form" id="addSpotForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>景点名称</label>
                        <input type="text" required placeholder="请输入景点名称">
                    </div>
                    <div class="form-group">
                        <label>所在地区</label>
                        <input type="text" required placeholder="请输入所在地区">
                    </div>
                    <div class="form-group">
                        <label>景点类型</label>
                        <select required>
                            <option value="">请选择景点类型</option>
                            <option value="cultural">文化古迹</option>
                            <option value="nature">自然风光</option>
                            <option value="park">主题公园</option>
                            <option value="town">特色小镇</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>门票价格</label>
                        <input type="number" min="0" placeholder="请输入门票价格">
                    </div>
                    <div class="form-group">
                        <label>开放时间</label>
                        <input type="text" placeholder="例如：9:00-17:00">
                    </div>
                    <div class="form-group">
                        <label>推荐游玩时长</label>
                        <input type="text" placeholder="例如：2-3小时">
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label>景点地址</label>
                    <input type="text" required placeholder="请输入详细地址">
                </div>

                <div class="form-group full-width">
                    <label>景点描述</label>
                    <textarea rows="4" required placeholder="请输入景点详细描述"></textarea>
                </div>

                <div class="form-group full-width">
                    <label>上传景点图片</label>
                    <div class="upload-area" id="uploadArea">
                        <input type="file" id="spotImages" multiple accept="image/*" style="display: none;">
                        <div class="upload-trigger">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>点击或拖拽图片到此处上传</p>
                            <span>支持 jpg、png 格式，最多 5 张</span>
                        </div>
                    </div>
                    <div class="image-preview" id="imagePreview"></div>
                </div>

                <div class="form-group full-width">
                    <label>特色标签</label>
                    <div class="tags-input">
                        <input type="text" id="tagInput" placeholder="输入标签按回车添加">
                        <div class="tags-container" id="tagsContainer"></div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="restoreSpotList()">取消</button>
                    <button type="submit" class="btn btn-primary">提交</button>
                </div>
            </form>
        </section>
    `;

    // 初始化图片上传功能
    initImageUpload();
    // 初始化标签输入功能
    initTagsInput();
}

// 恢复景点列表
function restoreSpotList() {
    // 重新加载页面内容
    window.location.reload();
}

// 初始化图片上传
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('spotImages');
    const imagePreview = document.getElementById('imagePreview');
    const uploadedImages = [];

    if (uploadArea && imageInput && imagePreview) {
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
            if (uploadedImages.length + files.length > 5) {
                showToast('最多只能上传5张图片');
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
                        <button class="remove-image" type="button"><i class="fas fa-times"></i></button>
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
}

// 初始化标签输入
function initTagsInput() {
    const tagInput = document.getElementById('tagInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const tags = new Set();

    if (tagInput && tagsContainer) {
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = tagInput.value.trim();
                
                if (tag && tags.size < 5) {
                    tags.add(tag);
                    updateTags();
                    tagInput.value = '';
                } else if (tags.size >= 5) {
                    showToast('最多添加5个标签');
                }
            }
        });

        function updateTags() {
            tagsContainer.innerHTML = Array.from(tags).map(tag => `
                <span class="tag">
                    ${tag}
                    <button type="button" class="remove-tag" onclick="this.parentElement.remove(); tags.delete('${tag}');">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `).join('');
        }
    }
}

// 恢复原始内容
function restoreOriginalContent(originalContent) {
    document.querySelector('.main-content').innerHTML = decodeURIComponent(originalContent);
    initAddSpotButton(); // 重新初始化添加按钮
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

// 景点推荐页精美粒子特效
function initParticleEffect() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('heroSection');
    
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 70;
    
    const colors = [
        { r: 255, g: 220, b: 180 },
        { r: 180, g: 255, b: 220 },
        { r: 180, g: 220, b: 255 },
        { r: 255, g: 180, b: 220 }
    ];
    
    let mouseX = null;
    let mouseY = null;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 6 + 2;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.4 + 0.3;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.05 + 0.02;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.twinkle += this.twinkleSpeed;
            
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
            
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }
        
        draw() {
            const twinkleAlpha = this.alpha * (0.6 + Math.sin(this.twinkle) * 0.4);
            
            for (let i = 2; i >= 0; i--) {
                const size = this.size * (1 + i * 0.7);
                const alpha = twinkleAlpha * (0.35 - i * 0.1);
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.fill();
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${twinkleAlpha})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}