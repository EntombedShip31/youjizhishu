document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializePage();
});

let systemThemeMediaQuery = null;

function initializePage() {
    bindSettingEvents();
    initThemeSystem();
    loadUserSettings();
}

function bindSettingEvents() {
    document.querySelectorAll('.setting-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const setting = e.currentTarget.querySelector('span').textContent;
            handleSettingClick(setting);
        });
    });

    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingId = e.target.id;
            const isEnabled = e.target.checked;
            updateSetting(settingId, isEnabled);
        });
    });

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
        });
    });

    document.querySelectorAll('.about-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.currentTarget.getAttribute('href').substring(1);
            handleAboutClick(type);
        });
    });
}

function handleSettingClick(setting) {
    switch(setting) {
        case '修改头像':
            showAvatarUpload();
            break;
        case '更改用户名':
            showUsernameEdit();
            break;
        case '个性签名':
            showBioEdit();
            break;
        case '修改密码':
            showPasswordChange();
            break;
        case '手机绑定':
            showPhoneBinding();
            break;
        case '邮箱绑定':
            showEmailBinding();
            break;
    }
}

function updateSetting(settingId, value) {
    console.log(`更新设置: ${settingId} = ${value}`);
    showToast('设置已更新');
}

function initThemeSystem() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    applyTheme(savedTheme);
    
    updateThemeUI(savedTheme);
    
    setupSystemThemeListener();
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    
    applyTheme(theme);
    
    updateThemeUI(theme);
    
    showToast('主题已更新');
}

function applyTheme(theme) {
    let effectiveTheme = theme;
    
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme);
}

function updateThemeUI(theme) {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });
}

function setupSystemThemeListener() {
    if (systemThemeMediaQuery) {
        systemThemeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    
    systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);
}

function handleSystemThemeChange() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'auto') {
        applyTheme('auto');
    }
}

function loadUserSettings() {
    const settings = {
        profileVisibility: true,
        tripSharing: false,
        locationSharing: true,
        systemNotifications: true,
        tripReminders: true,
        communityNotifications: false
    };

    Object.entries(settings).forEach(([key, value]) => {
        const toggle = document.getElementById(key);
        if (toggle) {
            toggle.checked = value;
        }
    });
}

function showAvatarUpload() {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>修改头像</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="dialog-body">
                <div class="avatar-upload">
                    <input type="file" accept="image/*" id="avatarInput">
                    <div class="upload-area">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>点击或拖拽图片上传</p>
                    </div>
                    <div class="avatar-preview"></div>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-outline">取消</button>
                <button class="btn btn-primary">保存</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('.close-btn').addEventListener('click', () => {
        dialog.remove();
    });

    dialog.querySelector('.btn-outline').addEventListener('click', () => {
        dialog.remove();
    });
}

function showUsernameEdit() {}
function showBioEdit() {}
function showPasswordChange() {}
function showPhoneBinding() {}
function showEmailBinding() {}

function handleAboutClick(type) {
    switch(type) {
        case 'terms':
            window.open('terms.html', '_blank');
            break;
        case 'privacy':
            window.open('privacy.html', '_blank');
            break;
        case 'help':
            window.open('help.html', '_blank');
            break;
    }
}

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
