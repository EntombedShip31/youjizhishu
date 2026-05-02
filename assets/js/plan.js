// ========================================
// 游迹智述 - 行程规划页面 JavaScript（重构版）
// ========================================

// ==================== 全局变量 ====================
let map; // 地图实例
let markers = []; // 保存所有标记点
let savedMarkers = []; // 保存已选择的景点
let customIdCounter = 1000; // 自定义标记ID计数器
let toastTimer; // Toast定时器
let scheduleData = {}; // 日程数据

// ==================== 可配置参数 ====================
const MAP_CONFIG = {
    center: [39.9042, 116.4074], // 北京坐标
    zoom: 10,
    minZoom: 3,
    maxZoom: 18,
    tileUrl: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    subdomains: ['1', '2', '3', '4'],
    attribution: '© Amap © OpenStreetMap contributors'
};

// ==================== 中国知名景点数据库 ====================
const FAMOUS_SPOTS = [
    // 北京景点
    { id: 1, city: '北京', name: '故宫博物院', lat: 39.9163, lng: 116.3972, address: '北京市东城区景山前街4号', description: '明清两代皇家宫殿，世界文化遗产', category: '文化古迹', image: '../assets/img/3.jpg' },
    { id: 2, city: '北京', name: '颐和园', lat: 39.9998, lng: 116.2755, address: '北京市海淀区新建宫门路19号', description: '皇家园林博物馆', category: '园林景观', image: '../assets/img/1.jpg' },
    { id: 3, city: '北京', name: '八达岭长城', lat: 40.3578, lng: 116.0213, address: '北京市延庆区八达岭镇', description: '万里长城的重要组成部分', category: '文化古迹', image: '../assets/img/2.jpg' },
    { id: 4, city: '北京', name: '天坛公园', lat: 39.8819, lng: 116.4070, address: '北京市东城区天坛路甲1号', description: '明清两代皇帝祭天场所', category: '文化古迹', image: '../assets/img/4.jpg' },
    
    // 上海景点
    { id: 5, city: '上海', name: '外滩', lat: 31.2397, lng: 121.4998, address: '上海市黄浦区中山东一路', description: '万国建筑博览群', category: '城市景观', image: '../assets/img/5.jpg' },
    { id: 6, city: '上海', name: '豫园', lat: 31.2270, lng: 121.4912, address: '上海市黄浦区安仁街132号', description: '江南古典园林', category: '园林景观', image: '../assets/img/豫园.png' },
    { id: 7, city: '上海', name: '东方明珠', lat: 31.2397, lng: 121.4998, address: '上海市浦东新区世纪大道1号', description: '上海标志性建筑', category: '城市地标', image: '../assets/img/7.jpg' },
    
    // 西安景点
    { id: 8, city: '西安', name: '兵马俑', lat: 34.3841, lng: 109.2785, address: '陕西省西安市临潼区', description: '世界第八大奇迹', category: '文化古迹', image: '../assets/img/xian.jpg' },
    { id: 9, city: '西安', name: '华清宫', lat: 34.3591, lng: 109.2065, address: '陕西省西安市临潼区华清路', description: '唐代皇家温泉宫殿', category: '园林景观', image: '../assets/img/1.jpg' },
    { id: 10, city: '西安', name: '大雁塔', lat: 34.2184, lng: 108.9646, address: '陕西省西安市雁塔区', description: '唐代佛教塔建筑', category: '文化古迹', image: '../assets/img/3.jpg' },
    
    // 杭州景点
    { id: 11, city: '杭州', name: '西湖', lat: 30.2499, lng: 120.1486, address: '浙江省杭州市西湖区', description: '世界文化遗产，水光潋滟晴方好', category: '自然景观', image: '../assets/img/1.jpg' },
    { id: 12, city: '杭州', name: '灵隐寺', lat: 30.2366, lng: 120.0920, address: '浙江省杭州市西湖区灵隐路', description: '千年古刹，佛教圣地', category: '文化古迹', image: '../assets/img/2.jpg' },
    
    // 成都景点
    { id: 13, city: '成都', name: '大熊猫基地', lat: 30.7209, lng: 104.1034, address: '四川省成都市成华区', description: '大熊猫繁育研究基地', category: '自然景观', image: '../assets/img/sc.jpg' },
    { id: 14, city: '成都', name: '锦里古街', lat: 30.6473, lng: 104.0550, address: '四川省成都市武侯区', description: '川西民居风格古街', category: '特色街区', image: '../assets/img/3.jpg' },
    
    // 南京景点
    { id: 15, city: '南京', name: '夫子庙', lat: 32.0214, lng: 118.7841, address: '江苏省南京市秦淮区贡院街', description: '供奉和祭祀孔子的中国四大文庙之一', category: '文化古迹', image: '../assets/img/4.jpg' },
    { id: 16, city: '南京', name: '中山陵', lat: 32.0637, lng: 118.8445, address: '江苏省南京市玄武区紫金山', description: '孙中山先生的陵墓', category: '文化古迹', image: '../assets/img/5.jpg' },
    
    // 黄山
    { id: 17, city: '黄山', name: '黄山风景区', lat: 30.1400, lng: 118.1766, address: '安徽省黄山市黄山区', description: '五岳归来不看山，黄山归来不看岳', category: '自然风光', image: '../assets/img/黄山.jpg' },
    
    // 张家界
    { id: 18, city: '张家界', name: '张家界国家森林公园', lat: 29.1167, lng: 110.4833, address: '湖南省张家界市武陵源区', description: '阿凡达悬浮山取景地', category: '自然风光', image: '../assets/img/洱海.jpg' },
    
    // 桂林
    { id: 19, city: '桂林', name: '漓江风景区', lat: 25.2741, lng: 110.2993, address: '广西壮族自治区桂林市', description: '桂林山水甲天下', category: '自然风光', image: '../assets/img/洱海.jpg' },
    
    // 重庆
    { id: 20, city: '重庆', name: '洪崖洞', lat: 29.5636, lng: 106.5788, address: '重庆市渝中区嘉陵江滨江路', description: '网红打卡圣地', category: '特色街区', image: '../assets/img/sc.jpg' },
    
    // 青岛
    { id: 21, city: '青岛', name: '栈桥', lat: 36.0596, lng: 120.3167, address: '山东省青岛市市南区', description: '青岛标志性建筑', category: '城市景观', image: '../assets/img/6.jpg' },
    
    // 大理
    { id: 22, city: '大理', name: '洱海', lat: 25.6866, lng: 100.1992, address: '云南省大理市', description: '高原湖泊，风光旖旎', category: '自然风光', image: '../assets/img/洱海.jpg' },
    
    // 厦门
    { id: 23, city: '厦门', name: '鼓浪屿', lat: 24.4476, lng: 118.0732, address: '福建省厦门市思明区', description: '世界文化遗产，海上花园', category: '特色街区', image: '../assets/img/苏州.jpg' },
    
    // 三亚
    { id: 24, city: '三亚', name: '天涯海角', lat: 18.2980, lng: 109.5053, address: '海南省三亚市天涯区', description: '爱情圣地，海滨风光', category: '自然风光', image: '../assets/img/洱海.jpg' },
    
    // 丽江
    { id: 25, city: '丽江', name: '丽江古城', lat: 26.8721, lng: 100.2299, address: '云南省丽江市古城区', description: '世界文化遗产，纳西族文化', category: '特色街区', image: '../assets/img/6.jpg' },
    
    // 拉萨
    { id: 26, city: '拉萨', name: '布达拉宫', lat: 29.6578, lng: 91.1162, address: '西藏自治区拉萨市', description: '世界文化遗产，藏传佛教圣地', category: '文化古迹', image: '../assets/img/6.jpg' },
    
    // 苏州
    { id: 27, city: '苏州', name: '拙政园', lat: 31.3252, lng: 120.6287, address: '江苏省苏州市姑苏区东北街178号', description: '中国四大名园之首', category: '园林景观', image: '../assets/img/苏州.jpg' },
    
    // 广州
    { id: 28, city: '广州', name: '广州塔', lat: 23.1066, lng: 113.3245, address: '广东省广州市海珠区', description: '中国第一高塔', category: '城市地标', image: '../assets/img/5.jpg' },
    
    // 洛阳
    { id: 29, city: '洛阳', name: '龙门石窟', lat: 34.5536, lng: 112.4732, address: '河南省洛阳市洛龙区', description: '世界文化遗产，中国四大石窟之一', category: '文化古迹', image: '../assets/img/xian.jpg' },
    
    // 敦煌
    { id: 30, city: '敦煌', name: '莫高窟', lat: 40.0417, lng: 94.8167, address: '甘肃省酒泉市敦煌市', description: '世界文化遗产，艺术宝库', category: '文化古迹', image: '../assets/img/6.jpg' }
];

// ==================== 城市坐标数据库 ====================
const CITY_COORDINATES = {
    '北京': [39.9042, 116.4074],
    '上海': [31.2304, 121.4737],
    '西安': [34.3416, 108.9398],
    '杭州': [30.2741, 120.1551],
    '成都': [30.5728, 104.0668],
    '南京': [32.0603, 118.7969],
    '黄山': [29.7133, 118.3387],
    '张家界': [29.1167, 110.4833],
    '桂林': [25.2741, 110.2993],
    '重庆': [29.4316, 106.9123],
    '青岛': [36.0671, 120.3826],
    '大理': [25.6065, 100.2679],
    '厦门': [24.4798, 118.0894],
    '三亚': [18.2528, 109.5119],
    '丽江': [26.8721, 100.2299],
    '拉萨': [29.6520, 91.1728],
    '苏州': [31.2989, 120.5853],
    '广州': [23.1291, 113.2644],
    '洛阳': [34.6656, 112.4540],
    '敦煌': [40.1418, 94.6614]
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    
    setTimeout(function() {
        initMap();
        initDestinationSearch();
        initDatePickers();
        initSpotSearch();
        initSaveAndShare();
        loadRecommendations();
        initSpotsList();
        loadSavedPlan(); // 加载已保存的行程
        console.log('初始化完成！');
    }, 100);
});

// ==================== 地图初始化 ====================
function initMap() {
    try {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            console.error('地图容器 #mapContainer 不存在！');
            showToast('地图容器不存在', 'error');
            return;
        }

        console.log('正在初始化地图...');

        map = L.map('mapContainer', {
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            minZoom: MAP_CONFIG.minZoom,
            maxZoom: MAP_CONFIG.maxZoom,
            zoomControl: false,
            attributionControl: true
        });

        L.tileLayer(MAP_CONFIG.tileUrl, {
            subdomains: MAP_CONFIG.subdomains,
            attribution: MAP_CONFIG.attribution
        }).addTo(map);

        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false,
            maxWidth: 100
        }).addTo(map);

        console.log('地图初始化成功！');

        initMapTools();

        map.on('click', function(e) {
            const spotName = prompt('请输入景点名称（可选）：');
            if (spotName !== null) {
                addCustomMarker(e.latlng, spotName || '自定义景点');
            }
        });

        setTimeout(function() {
            map.invalidateSize();
            console.log('地图大小已刷新');
        }, 200);

        window.addEventListener('resize', function() {
            map.invalidateSize();
        });

    } catch (error) {
        console.error('地图初始化失败：', error);
        showToast('地图初始化失败，请刷新页面重试', 'error');
    }
}

// ==================== 地图工具按钮 ====================
function initMapTools() {
    document.getElementById('zoomIn').onclick = function() {
        if (map) map.zoomIn();
    };

    document.getElementById('zoomOut').onclick = function() {
        if (map) map.zoomOut();
    };

    document.getElementById('locate').onclick = function() {
        if (!map) return;
        
        showToast('正在获取位置...', 'info');
        
        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true
        });

        map.once('locationfound', function(e) {
            const marker = L.marker(e.latlng).addTo(map);
            marker.bindPopup('您当前的位置').openPopup();
            showToast('定位成功！');
        });

        map.once('locationerror', function() {
            showToast('无法获取您的位置', 'error');
        });
    };
}

// ==================== 添加自定义标记 ====================
function addCustomMarker(latlng, name) {
    if (!map) return;

    const greenIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #2ecc71; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 0 12px rgba(46, 204, 113, 0.6); border: 3px solid white;"><i class="fas fa-map-marker-alt"></i></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    const marker = L.marker(latlng, { icon: greenIcon }).addTo(map);
    
    const spotData = {
        id: customIdCounter++,
        name: name,
        lat: latlng.lat,
        lng: latlng.lng,
        address: '获取地址中...',
        isCustom: true,
        marker: marker
    };

    markers.push(spotData);
    savedMarkers.push(spotData);

    marker.bindPopup(createPopupContent(spotData)).openPopup();

    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latlng.lat + '&lon=' + latlng.lng + '&zoom=18&addressdetails=1')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.display_name) {
                spotData.address = data.display_name;
                marker.setPopupContent(createPopupContent(spotData));
                updateSpotsList();
            }
        })
        .catch(function() {
            spotData.address = '未知位置';
            marker.setPopupContent(createPopupContent(spotData));
            updateSpotsList();
        });

    updateSpotsList();
    showToast('已添加自定义景点！');
}

// ==================== 添加蓝色标记（系统推荐） ====================
function addBlueMarker(latlng, name, address, id, category) {
    if (!map) return;

    const blueIcon = L.divIcon({
        className: 'blue-marker',
        html: '<div style="background-color: #3498db; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 0 12px rgba(52, 152, 219, 0.6); border: 3px solid white;"><i class="fas fa-map-marker-alt"></i></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    const marker = L.marker(latlng, { icon: blueIcon }).addTo(map);
    
    const spotData = {
        id: id,
        name: name,
        lat: latlng[0],
        lng: latlng[1],
        address: address,
        category: category || '景点',
        isCustom: false,
        marker: marker
    };

    markers.push(spotData);
    savedMarkers.push(spotData);

    marker.bindPopup(createPopupContent(spotData)).openPopup();
    updateSpotsList();
}

// ==================== 创建标记弹窗内容 ====================
function createPopupContent(spot) {
    let buttons = '<button onclick="showAddToScheduleModal(' + spot.id + ')" style="flex: 1; padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px;"><i class="fas fa-calendar-plus"></i> 添加行程</button>';
    
    if (spot.isCustom) {
        buttons += '<button onclick="removeMarker(' + spot.id + ')" style="padding: 8px 12px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px; margin-left: 8px;"><i class="fas fa-trash"></i> 删除</button>';
    }

    return '<div style="min-width: 220px; padding: 5px;">' +
        '<h4 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;">' + spot.name + '</h4>' +
        (spot.category ? '<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-bottom: 8px;">' + spot.category + '</span>' : '') +
        '<p style="margin: 0 0 15px 0; color: #666; font-size: 13px; line-height: 1.4;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>' + spot.address + '</p>' +
        '<div style="display: flex;">' + buttons + '</div>' +
        '</div>';
}

// ==================== 移除标记 ====================
function removeMarker(id) {
    if (!map) return;

    const markerIndex = markers.findIndex(function(m) { return m.id === id; });
    if (markerIndex !== -1 && markers[markerIndex].marker) {
        map.removeLayer(markers[markerIndex].marker);
        markers.splice(markerIndex, 1);
    }

    const savedIndex = savedMarkers.findIndex(function(m) { return m.id === id; });
    if (savedIndex !== -1) {
        savedMarkers.splice(savedIndex, 1);
    }

    updateSpotsList();
    showToast('已删除景点');
}

// ==================== 目的地搜索 ====================
function initDestinationSearch() {
    const destinationInput = document.getElementById('destination');
    if (!destinationInput) return;

    const searchDestination = function() {
        const query = destinationInput.value.trim();
        if (!query) return;

        showToast('正在搜索 "' + query + '"...', 'info');

        const cityCoords = CITY_COORDINATES[query];
        if (cityCoords) {
            if (map) {
                map.flyTo(cityCoords, 12, {
                    animate: true,
                    duration: 1
                });
                addBlueMarker(cityCoords, query, query + '市区', Date.now(), '城市');
            }
            showToast('已定位到：' + query);
            return;
        }

        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&accept-language=zh-CN,zh;q=0.9,en;q=0.8&limit=1')
            .then(function(response) { 
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }
                return response.json(); 
            })
            .then(function(data) {
                if (data && data.length > 0) {
                    const location = data[0];
                    const latlng = [parseFloat(location.lat), parseFloat(location.lon)];
                    const displayName = location.display_name.split(',')[0];
                    
                    if (map) {
                        map.flyTo(latlng, 12, {
                            animate: true,
                            duration: 1
                        });
                        addBlueMarker(latlng, displayName, location.display_name, Date.now(), '城市');
                    }
                    
                    showToast('已定位到：' + displayName);
                } else {
                    showToast('未找到 "' + query + '"，请尝试其他关键词', 'error');
                }
            })
            .catch(function(error) {
                console.error('搜索错误：', error);
                showToast('搜索失败，请检查网络或稍后重试', 'error');
            });
    };

    destinationInput.addEventListener('change', searchDestination);
    destinationInput.addEventListener('blur', searchDestination);
    destinationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchDestination();
    });
}

// ==================== 日期选择器 ====================
function initDatePickers() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (!startDate || !endDate) return;

    const today = new Date().toISOString().split('T')[0];
    startDate.min = today;
    endDate.min = today;

    startDate.addEventListener('change', function() {
        endDate.min = startDate.value;
        if (endDate.value && endDate.value < startDate.value) {
            endDate.value = startDate.value;
        }
        updateScheduleDays();
    });

    endDate.addEventListener('change', function() {
        if (startDate.value && endDate.value < startDate.value) {
            startDate.value = endDate.value;
        }
        updateScheduleDays();
    });
}

// ==================== 格式化日期为 yyyy/mm/dd ====================
function formatDate(date) {
    const d = new Date(date);
    return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
}

// ==================== 更新日程天数 ====================
function updateScheduleDays() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const container = document.getElementById('scheduleDays');

    if (!container) return;

    if (!startDate.getTime() || !endDate.getTime()) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">请选择开始和结束日期</div>';
        return;
    }

    const days = [];
    let currentDate = new Date(startDate);
    let dayCount = 1;

    while (currentDate <= endDate) {
        days.push({ date: new Date(currentDate), dayNum: dayCount });
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
    }

    container.innerHTML = days.map(function(day) {
        const dateKey = day.date.toISOString().split('T')[0];
        const daySpots = scheduleData[dateKey] || [];
        return '<div class="schedule-day" data-date="' + dateKey + '">' +
            '<div class="day-header">' +
            '<h3 class="day-title">第' + day.dayNum + '天 ' + formatDate(day.date) + '</h3>' +
            '</div>' +
            '<div class="spots-list" id="spots-' + dateKey + '">' +
            daySpots.map(function(spot, index) {
                return renderSpotItem(spot, index);
            }).join('') +
            '</div>' +
            '</div>';
    }).join('');
}

// ==================== 渲染景点项 ====================
function renderSpotItem(spot, index) {
    return '<div class="spot-item" data-index="' + index + '" draggable="true" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" ondrop="handleDrop(event)" ondragend="handleDragEnd(event)" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
        '<div class="drag-handle" style="cursor: grab; color: #999;"><i class="fas fa-grip-vertical"></i></div>' +
        '<span class="spot-time" style="color: #3498db; font-weight: 600; min-width: 120px;">' + spot.startTime + '-' + spot.endTime + '</span>' +
        '<div class="spot-info" style="flex: 1;">' +
        '<span class="spot-name" style="display: block; color: #2c3e50; font-weight: 500;">' + spot.name + '</span>' +
        (spot.note ? '<span style="font-size: 12px; color: #999;">' + spot.note + '</span>' : '') +
        '</div>' +
        '<div class="spot-actions" style="display: flex; gap: 8px;">' +
        '<button class="spot-btn" onclick="locateSpot(' + spot.lat + ',' + spot.lng + ')" style="background: none; border: none; color: #3498db; cursor: pointer; padding: 4px;"><i class="fas fa-map-marker-alt"></i></button>' +
        '<button class="spot-btn" onclick="removeSpotFromSchedule(this)" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 4px;"><i class="fas fa-trash"></i></button>' +
        '</div>' +
        '</div>';
}

// ==================== 拖拽功能 ====================
let draggedItem = null;
let draggedDate = null;

function handleDragStart(e) {
    draggedItem = e.target.closest('.spot-item');
    draggedDate = e.target.closest('.schedule-day').dataset.date;
    e.target.closest('.spot-item').style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const targetDay = e.target.closest('.schedule-day');
    const targetSpot = e.target.closest('.spot-item');
    
    if (targetDay && draggedItem) {
        const targetDate = targetDay.dataset.date;
        const spotsList = targetDay.querySelector('.spots-list');
        
        if (targetSpot) {
            spotsList.insertBefore(draggedItem, targetSpot);
        } else {
            spotsList.appendChild(draggedItem);
        }
        
        reorderSchedule();
    }
}

function handleDragEnd(e) {
    e.target.closest('.spot-item').style.opacity = '1';
    draggedItem = null;
    draggedDate = null;
}

function reorderSchedule() {
    Object.keys(scheduleData).forEach(date => {
        const spotsList = document.getElementById('spots-' + date);
        if (spotsList) {
            const spotItems = spotsList.querySelectorAll('.spot-item');
            const newSpots = [];
            spotItems.forEach(item => {
                const spotName = item.querySelector('.spot-name').textContent;
                const timeText = item.querySelector('.spot-time').textContent;
                const [startTime, endTime] = timeText.split('-');
                const noteEl = item.querySelector('.spot-info span:last-child');
                const note = noteEl && noteEl !== item.querySelector('.spot-name') ? noteEl.textContent : '';
                newSpots.push({
                    name: spotName,
                    startTime: startTime,
                    endTime: endTime,
                    note: note
                });
            });
            scheduleData[date] = newSpots;
        }
    });
    saveScheduleData();
}

// ==================== 定位景点 ====================
function locateSpot(lat, lng) {
    if (map) {
        map.flyTo([lat, lng], 16, {
            animate: true,
            duration: 1
        });
    }
}

// ==================== 景点搜索 ====================
function initSpotSearch() {
    const searchInput = document.getElementById('spotSearch');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    searchResultsContainer.id = 'searchResultsContainer';
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(searchResultsContainer);

    const handleSearch = function() {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        showToast('正在搜索 "' + keyword + '"...', 'info');

        const results = searchFamousSpots(keyword);

        if (results.length > 0) {
            searchResultsContainer.innerHTML = results.map(function(spot) {
                return '<div class="search-result-item" data-lat="' + spot.lat + '" data-lng="' + spot.lng + '" data-name="' + spot.name.replace(/"/g, '&quot;') + '" data-address="' + spot.address.replace(/"/g, '&quot;') + '" data-id="' + spot.id + '" data-category="' + (spot.category || '').replace(/"/g, '&quot;') + '">' +
                    '<img src="' + (spot.image || '../assets/img/spot-default.jpg') + '" alt="' + spot.name + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">' +
                    '<div class="result-info">' +
                    '<h4 style="margin: 0 0 5px 0;">' + spot.name + '</h4>' +
                    '<p style="margin: 0; font-size: 12px; color: #666;">' + (spot.city ? '[' + spot.city + '] ' : '') + spot.address.substring(0, 30) + '...</p>' +
                    (spot.category ? '<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 1px 6px; border-radius: 8px; font-size: 10px; margin-top: 4px;">' + spot.category + '</span>' : '') +
                    '</div>' +
                    '</div>';
            }).join('');
            searchResultsContainer.style.display = 'block';
            showToast('找到 ' + results.length + ' 个相关景点');
        } else {
            searchResultsContainer.innerHTML = '<div class="no-results">未找到 "' + keyword + '，请尝试其他关键词</div>';
            searchResultsContainer.style.display = 'block';
            showToast('未找到相关景点', 'error');
        }
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    searchResultsContainer.addEventListener('click', function(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const lat = parseFloat(resultItem.dataset.lat);
            const lng = parseFloat(resultItem.dataset.lng);
            const name = resultItem.dataset.name;
            const address = resultItem.dataset.address;
            const id = parseInt(resultItem.dataset.id) || Date.now();
            const category = resultItem.dataset.category;

            if (map) {
                map.flyTo([lat, lng], 15, {
                    animate: true,
                    duration: 1
                });
            }

            addBlueMarker([lat, lng], name, address, id, category);

            searchResultsContainer.style.display = 'none';
            searchInput.value = '';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchResultsContainer.style.display = 'none';
        }
    });
}

// ==================== 搜索知名景点 ====================
function searchFamousSpots(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return FAMOUS_SPOTS.filter(function(spot) {
        return spot.name.toLowerCase().indexOf(lowerKeyword) !== -1 ||
               spot.city.toLowerCase().indexOf(lowerKeyword) !== -1 ||
               spot.address.toLowerCase().indexOf(lowerKeyword) !== -1 ||
               (spot.category && spot.category.toLowerCase().indexOf(lowerKeyword) !== -1);
    });
}

// ==================== 加载推荐景点 ====================
function loadRecommendations() {
    const container = document.getElementById('recommendationList');
    if (!container) return;

    const recommended = FAMOUS_SPOTS.slice(0, 6);

    container.innerHTML = recommended.map(function(spot) {
        return '<div class="recommendation-card" ' +
            'onclick="goToRecommendation(' + spot.lat + ', ' + spot.lng + ', \'' + spot.name.replace(/'/g, '\\\'') + '\', \'' + spot.address.replace(/'/g, '\\\'') + '\', ' + spot.id + ', \'' + (spot.category || '').replace(/'/g, '\\\'') + '\')" ' +
            'style="cursor: pointer;">' +
            '<img src="' + (spot.image || '../assets/img/spot-default.jpg') + '" alt="' + spot.name + '" class="card-image">' +
            '<div class="card-content">' +
            '<h3 class="card-title">' + spot.name + '</h3>' +
            '<p class="card-info">' + spot.address + '</p>' +
            (spot.category ? '<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 10px; font-size: 11px;">' + spot.category + '</span>' : '') +
            '</div>' +
            '</div>';
    }).join('');
}

// ==================== 跳转到推荐景点 ====================
function goToRecommendation(lat, lng, name, address, id, category) {
    if (map) {
        map.flyTo([lat, lng], 15, {
            animate: true,
            duration: 1
        });
    }
    addBlueMarker([lat, lng], name, address, id, category);
}

// ==================== 已选景点列表 ====================
function initSpotsList() {
    const scheduleContainer = document.querySelector('.schedule-container');
    if (!scheduleContainer) return;

    const spotsListContainer = document.createElement('div');
    spotsListContainer.className = 'spots-list-container';
    spotsListContainer.id = 'spotsListContainer';
    spotsListContainer.innerHTML = '<h3 style="margin: 0 0 12px 0; font-size: 16px; color: #2c3e50;"><i class="fas fa-list"></i> 已选景点</h3>' +
        '<div id="spotsList" style="max-height: 200px; overflow-y: auto;"></div>';
    scheduleContainer.parentElement.insertBefore(spotsListContainer, scheduleContainer);

    updateSpotsList();
}

// ==================== 更新已选景点列表 ====================
function updateSpotsList() {
    const spotsList = document.getElementById('spotsList');
    if (!spotsList) return;

    if (savedMarkers.length === 0) {
        spotsList.innerHTML = '<div style="text-align: center; color: #999; padding: 15px; font-size: 13px;">暂无已选景点</div>';
        return;
    }

    spotsList.innerHTML = savedMarkers.map(function(spot) {
        return '<div class="spots-list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8f9fa; border-radius: 6px; margin-bottom: 8px;">' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
            '<span style="width: 12px; height: 12px; border-radius: 50%; background: ' + (spot.isCustom ? '#2ecc71' : '#3498db') + ';"></span>' +
            '<span style="font-size: 14px; color: #2c3e50;">' + spot.name + '</span>' +
            '</div>' +
            '<div style="display: flex; gap: 5px;">' +
            '<button onclick="showAddToScheduleModal(' + spot.id + ')" style="background: none; border: none; color: #3498db; cursor: pointer; padding: 4px; font-size: 14px;"><i class="fas fa-calendar-plus"></i></button>' +
            '<button onclick="removeMarker(' + spot.id + ')" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 4px; font-size: 14px;"><i class="fas fa-trash"></i></button>' +
            '</div>' +
            '</div>';
    }).join('');
}

// ==================== 显示添加到行程弹窗 ====================
function showAddToScheduleModal(id) {
    const spot = savedMarkers.find(function(m) { return m.id === id; });
    if (!spot) {
        showToast('找不到该景点', 'error');
        return;
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        showToast('请先选择行程日期', 'error');
        return;
    }

    addSpotToSchedule(spot);
}

// ==================== 添加景点到行程 ====================
function addSpotToSchedule(spot) {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    const modal = document.createElement('div');
    modal.className = 'dialog-overlay';
    modal.innerHTML = '<div class="dialog-content">' +
        '<div class="dialog-header">' +
        '<h3><i class="fas fa-calendar-plus"></i> 添加到行程</h3>' +
        '<button class="close-btn" onclick="closeModal(this)">&times;</button>' +
        '</div>' +
        '<div class="dialog-body">' +
        '<div class="spot-preview" style="display: flex; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 20px;">' +
        '<div style="width: 100px; height: 70px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px;">' +
        '<i class="fas fa-landmark"></i>' +
        '</div>' +
        '<div>' +
        '<h4 style="margin: 0 0 6px 0;">' + spot.name + '</h4>' +
        '<p style="margin: 0; color: #666; font-size: 13px;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>' + spot.address.substring(0, 40) + '...</p>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>选择日期</label>' +
        '<select id="scheduleDate">' + generateDateOptions(startDate, endDate) + '</select>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>游玩时间</label>' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
        '<input type="time" id="startTime" value="09:00" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">' +
        '<span>至</span>' +
        '<input type="time" id="endTime" value="11:00" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>备注（可选）</label>' +
        '<textarea id="scheduleNote" placeholder="添加备注信息..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>' +
        '</div>' +
        '</div>' +
        '<div class="dialog-footer">' +
        '<button class="btn btn-outline" onclick="closeModal(this)">取消</button>' +
        '<button class="btn btn-primary" onclick="confirmAddSpot(this, ' + JSON.stringify(spot).replace(/"/g, '&quot;') + ')">确认添加</button>' +
        '</div>' +
        '</div>';

    document.body.appendChild(modal);

    addModalStyles();
}

function generateDateOptions(startDate, endDate) {
    let options = '';
    let currentDate = new Date(startDate);
    let dayCount = 1;

    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        options += '<option value="' + dateStr + '">第' + dayCount + '天 ' + formatDate(currentDate) + '</option>';
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
    }

    return options;
}

function confirmAddSpot(btn, spot) {
    const modal = btn.closest('.dialog-overlay');
    const date = modal.querySelector('#scheduleDate').value;
    const startTime = modal.querySelector('#startTime').value;
    const endTime = modal.querySelector('#endTime').value;
    const note = modal.querySelector('#scheduleNote').value;

    if (!scheduleData[date]) {
        scheduleData[date] = [];
    }

    const spotData = {
        id: spot.id,
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
        startTime: startTime,
        endTime: endTime,
        note: note
    };

    scheduleData[date].push(spotData);

    const spotsListEl = document.getElementById('spots-' + date);
    if (spotsListEl) {
        const index = scheduleData[date].length - 1;
        spotsListEl.innerHTML += renderSpotItem(spotData, index);
    }

    saveScheduleData();
    closeModal(btn);
    showToast('景点已添加到行程！');
}

function removeSpotFromSchedule(btn) {
    const spotItem = btn.closest('.spot-item');
    const date = spotItem.closest('.schedule-day').dataset.date;
    const index = parseInt(spotItem.dataset.index);
    
    if (scheduleData[date]) {
        scheduleData[date].splice(index, 1);
        if (scheduleData[date].length === 0) {
            delete scheduleData[date];
        }
    }
    
    spotItem.remove();
    saveScheduleData();
    showToast('已从行程中移除');
}

function saveScheduleData() {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

function loadScheduleData() {
    const saved = localStorage.getItem('scheduleData');
    if (saved) {
        scheduleData = JSON.parse(saved);
    }
}

function closeModal(btn) {
    const modal = btn.closest('.dialog-overlay');
    if (modal) {
        modal.remove();
    }
}

function addModalStyles() {
    const existingStyle = document.getElementById('modal-styles');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = '.dialog-overlay {' +
        'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'width: 100%;' +
        'height: 100%;' +
        'background: rgba(0, 0, 0, 0.5);' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'z-index: 2000;' +
        'animation: fadeIn 0.3s ease;' +
    '}' +
    '@keyframes fadeIn {' +
        'from { opacity: 0; }' +
        'to { opacity: 1; }' +
    '}' +
    '.dialog-content {' +
        'background: white;' +
        'border-radius: 16px;' +
        'width: 90%;' +
        'max-width: 500px;' +
        'max-height: 90vh;' +
        'overflow-y: auto;' +
        'box-shadow: 0 10px 40px rgba(0,0,0,0.3);' +
        'animation: slideUp 0.3s ease;' +
    '}' +
    '@keyframes slideUp {' +
        'from { transform: translateY(30px); opacity: 0; }' +
        'to { transform: translateY(0); opacity: 1; }' +
    '}' +
    '.dialog-header {' +
        'padding: 20px;' +
        'border-bottom: 1px solid #eee;' +
        'display: flex;' +
        'justify-content: space-between;' +
        'align-items: center;' +
    '}' +
    '.dialog-header h3 {' +
        'margin: 0;' +
        'color: #2c3e50;' +
        'font-size: 18px;' +
    '}' +
    '.close-btn {' +
        'background: none;' +
        'border: none;' +
        'font-size: 24px;' +
        'cursor: pointer;' +
        'color: #999;' +
        'line-height: 1;' +
        'transition: color 0.2s;' +
    '}' +
    '.close-btn:hover {' +
        'color: #333;' +
    '}' +
    '.dialog-body {' +
        'padding: 20px;' +
    '}' +
    '.form-group {' +
        'margin-bottom: 18px;' +
    '}' +
    '.form-group label {' +
        'display: block;' +
        'margin-bottom: 8px;' +
        'color: #2c3e50;' +
        'font-weight: 500;' +
        'font-size: 14px;' +
    '}' +
    '.form-group select,' +
    '.form-group input[type="time"] {' +
        'width: 100%;' +
        'padding: 10px 12px;' +
        'border: 1px solid #ddd;' +
        'border-radius: 8px;' +
        'font-size: 14px;' +
        'transition: border-color 0.2s, box-shadow 0.2s;' +
    '}' +
    '.form-group select:focus,' +
    '.form-group input[type="time"]:focus {' +
        'outline: none;' +
        'border-color: #3498db;' +
        'box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);' +
    '}' +
    '.dialog-footer {' +
        'padding: 20px;' +
        'border-top: 1px solid #eee;' +
        'display: flex;' +
        'justify-content: flex-end;' +
        'gap: 12px;' +
    '}';

    document.head.appendChild(style);
}

// ==================== 保存和分享 ====================
function initSaveAndShare() {
    const saveBtn = document.getElementById('savePlanBtn');
    const shareBtn = document.getElementById('sharePlanBtn');

    if (saveBtn) {
        saveBtn.onclick = savePlan;
    }

    if (shareBtn) {
        shareBtn.onclick = sharePlan;
    }
}

function savePlan() {
    const plan = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        spots: savedMarkers.map(function(m) {
            return {
                id: m.id,
                name: m.name,
                lat: m.lat,
                lng: m.lng,
                address: m.address,
                category: m.category,
                isCustom: m.isCustom
            };
        }),
        schedule: scheduleData,
        savedAt: new Date().toISOString()
    };

    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    savedPlans.push(plan);
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
    localStorage.setItem('currentPlan', JSON.stringify(plan));

    showToast('行程保存成功！', 'success');
}

function loadSavedPlan() {
    loadScheduleData();
    const currentPlan = localStorage.getItem('currentPlan');
    if (currentPlan) {
        try {
            const plan = JSON.parse(currentPlan);
            if (plan.destination) document.getElementById('destination').value = plan.destination;
            if (plan.startDate) document.getElementById('startDate').value = plan.startDate;
            if (plan.endDate) document.getElementById('endDate').value = plan.endDate;
            if (plan.schedule) scheduleData = plan.schedule;
            
            updateScheduleDays();
        } catch (e) {
            console.error('加载行程失败', e);
        }
    }
}

function sharePlan() {
    const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const shareUrl = 'https://youji.com/route/' + shareId;

    const plan = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        spots: savedMarkers,
        shareId: shareId
    };
    const sharedPlans = JSON.parse(localStorage.getItem('sharedPlans') || '{}');
    sharedPlans[shareId] = plan;
    localStorage.setItem('sharedPlans', JSON.stringify(sharedPlans));

    navigator.clipboard.writeText(shareUrl).then(function() {
        const modal = document.createElement('div');
        modal.className = 'dialog-overlay';
        modal.innerHTML = '<div class="dialog-content">' +
            '<div class="dialog-header">' +
            '<h3><i class="fas fa-share-alt"></i> 分享行程</h3>' +
            '<button class="close-btn" onclick="closeModal(this)">&times;</button>' +
            '</div>' +
            '<div class="dialog-body" style="text-align: center;">' +
            '<div style="font-size: 48px; margin-bottom: 16px;">🎉</div>' +
            '<p style="margin-bottom: 20px; color: #2c3e50;">分享链接已复制到剪贴板！</p>' +
            '<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; color: #3498db; margin-bottom: 20px;">' +
            shareUrl +
            '</div>' +
            '<button class="btn btn-primary" onclick="closeModal(this)" style="width: 100%;">好的</button>' +
            '</div>' +
            '</div>';
        document.body.appendChild(modal);

        addModalStyles();
        showToast('分享链接已复制！');
    }).catch(function() {
        alert('分享链接：' + shareUrl);
    });
}

// ==================== Toast提示消息 ====================
function showToast(message, type) {
    if (type === undefined) type = 'info';

    if (toastTimer) clearTimeout(toastTimer);

    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: white; padding: 16px 24px; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; z-index: 3000; animation: toastIn 0.3s ease; border-left: 4px solid ' + colors[type] + ';';
    toast.innerHTML = '<i class="fas fa-' + icons[type] + '" style="color: ' + colors[type] + '; font-size: 20px;"></i>' +
        '<span style="color: #2c3e50; font-weight: 500;">' + message + '</span>';

    document.body.appendChild(toast);

    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = '@keyframes toastIn {' +
            'from { transform: translateX(100%); opacity: 0; }' +
            'to { transform: translateX(0); opacity: 1; }' +
        '}' +
        '@keyframes toastOut {' +
            'from { transform: translateX(0); opacity: 1; }' +
            'to { transform: translateX(100%); opacity: 0; }' +
        '}';
        document.head.appendChild(style);
    }

    toastTimer = setTimeout(function() {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// ========================================
// 搜索结果样式
// ========================================
(function() {
    const style = document.createElement('style');
    style.textContent = '.search-results {' +
        'position: absolute;' +
        'top: 100%;' +
        'left: 0;' +
        'right: 0;' +
        'background: white;' +
        'border-radius: 8px;' +
        'box-shadow: 0 4px 20px rgba(0,0,0,0.15);' +
        'margin-top: 8px;' +
        'max-height: 300px;' +
        'overflow-y: auto;' +
        'display: none;' +
        'z-index: 1000;' +
    '}' +
    '.search-result-item {' +
        'display: flex;' +
        'align-items: center;' +
        'gap: 12px;' +
        'padding: 12px 16px;' +
        'cursor: pointer;' +
        'transition: background-color 0.2s ease;' +
        'border-bottom: 1px solid #f0f0f0;' +
    '}' +
    '.search-result-item:last-child {' +
        'border-bottom: none;' +
    '}' +
    '.search-result-item:hover {' +
        'background-color: #f8f9fa;' +
    '}' +
    '.search-result-item .result-info {' +
        'flex: 1;' +
    '}' +
    '.search-result-item .result-info h4 {' +
        'margin: 0 0 4px 0;' +
        'color: #2c3e50;' +
        'font-size: 14px;' +
        'font-weight: 500;' +
    '}' +
    '.search-result-item .result-info p {' +
        'margin: 0;' +
        'font-size: 12px;' +
        'color: #666;' +
        'line-height: 1.4;' +
    '}' +
    '.no-results {' +
        'padding: 30px 20px;' +
        'text-align: center;' +
        'color: #999;' +
        'font-size: 14px;' +
    '}';
    document.head.appendChild(style);
})();
