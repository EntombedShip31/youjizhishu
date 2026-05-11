document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initLoginParticles();
});

function initializePage() {
    // 初始化表单切换
    initFormTabs();
    
    // 初始化密码显示切换
    initPasswordToggle();
    
    // 初始化短信验证码发送
    initSmsCode();
    
    // 初始化表单提交
    initFormSubmit();
}

// 初始化表单切换
function initFormTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新表单显示
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${btn.dataset.tab}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
}

// 初始化密码显示切换
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// 初始化短信验证码发送
function initSmsCode() {
    const sendBtn = document.querySelector('.send-code');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const phone = document.querySelector('input[type="tel"]').value;
            if (!phone) {
                showToast('请输入手机号码');
                return;
            }
            
            // 开始倒计时
            startCountdown(sendBtn);
            
            // 显示发送成功提示
            showToast('验证码已发送');
        });
    }
}

// 倒计时功能
function startCountdown(btn) {
    let seconds = 60;
    btn.disabled = true;
    btn.style.background = '#ccc';
    
    const timer = setInterval(() => {
        seconds--;
        btn.textContent = `${seconds}秒后重试`;
        
        if (seconds <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.textContent = '获取验证码';
            btn.style.background = '#3498db';
        }
    }, 1000);
}

// 初始化表单提交
function initFormSubmit() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    // 获取登录按钮并显示加载状态
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
        // 模拟登录延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 保存登录状态
        localStorage.setItem('token', 'mock_token');
        localStorage.setItem('username', '管理员');
        
        // 显示成功提示
        showToast('登录成功！');
        
        // 延迟跳转
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
        
    } catch (error) {
        showToast('登录失败，请稍后重试');
    } finally {
        hideLoading(submitBtn);
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
        // 模拟注册延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast('注册成功！');
        
        // 延迟后切换到登录表单
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
            e.target.reset();
        }, 500);
        
    } catch (error) {
        showToast('注册失败，请稍后重试');
    } finally {
        hideLoading(submitBtn);
    }
}

// 显示加载状态
function showLoading(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `
        <span class="loading-spinner"></span>
        <span>处理中...</span>
    `;
    button.dataset.originalText = originalText;
}

// 隐藏加载状态
function hideLoading(button) {
    const originalText = button.dataset.originalText;
    button.disabled = false;
    button.textContent = originalText;
}

// 显示提示信息
function showToast(message) {
    // 检查是否已存在toast
    let toast = document.querySelector('.toast');
    if (toast) {
        toast.remove();
    }
    
    // 创建新的toast
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加样式
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px',
        zIndex: '9999',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: '0',
        transform: 'translate(-50%, -20px)'
    });
    
    document.body.appendChild(toast);
    
    // 触发重绘以应用过渡效果
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
} 

// 登录页樱花飘落特效
function initLoginParticles() {
    const canvas = document.getElementById('loginParticleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.auth-background');
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const sakuras = [];
    const sakuraCount = 40;
    
    // 樱花花瓣颜色
    const colors = [
        { r: 255, g: 183, b: 197 },
        { r: 255, g: 192, b: 203 },
        { r: 255, g: 170, b: 187 },
        { r: 255, g: 200, b: 210 }
    ];
    
    // 樱花类
    class Sakura {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 100;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.wave = Math.random() * Math.PI * 2;
            this.waveSpeed = Math.random() * 0.02 + 0.01;
            this.waveRadius = Math.random() * 30 + 15;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.4 + 0.2;
        }
        
        update() {
            this.y += this.speedY;
            this.wave += this.waveSpeed;
            this.x = this.x + this.speedX + Math.sin(this.wave) * 0.5;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);
            gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.3})`);
            
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x1 = Math.cos(angle) * this.size * 0.4;
                const y1 = Math.sin(angle) * this.size * 0.4;
                const x2 = Math.cos(angle + Math.PI / 5) * this.size;
                const y2 = Math.sin(angle + Math.PI / 5) * this.size;
                
                if (i === 0) {
                    ctx.moveTo(x2, y2);
                } else {
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    ctx.quadraticCurveTo(x1, y1, x2, y2);
                }
            }
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    for (let i = 0; i < sakuraCount; i++) {
        sakuras.push(new Sakura());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < sakuras.length; i++) {
            sakuras[i].update();
            sakuras[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
} 