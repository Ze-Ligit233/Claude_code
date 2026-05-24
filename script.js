document.addEventListener('DOMContentLoaded', () => {
    // --- 配置与状态 ---
    let CONFIG = {
        focus: { time: 25 * 60, color: 'var(--bg-focus)', label: '专注' },
        short: { time: 5 * 60, color: 'var(--bg-short)', label: '短休' },
        long: { time: 15 * 60, color: 'var(--bg-long)', label: '长休' }
    };

    let currentMode = 'focus';
    let timeLeft = CONFIG[currentMode].time;
    let timerId = null;
    let isRunning = false;
    let pomsCompleted = 0;

    // --- DOM 元素 ---
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const circle = document.querySelector('.progress-ring__circle');
    const body = document.body;
    const countDisplay = document.getElementById('count');

    // 设置面板元素
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings');
    const inputFocus = document.getElementById('input-focus');
    const inputShort = document.getElementById('input-short');
    const inputLong = document.getElementById('input-long');

    // --- 环形进度条逻辑 ---
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = 0;

    function setProgress(percent) {
        const offset = circumference - (percent / 100 * circumference);
        circle.style.strokeDashoffset = offset;
    }

    // --- 核心功能 ---

    function updateDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const totalTime = CONFIG[currentMode].time;
        const percent = (timeLeft / totalTime) * 100;
        setProgress(percent);
    }

    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        isRunning = true;
        startBtn.textContent = '暂停';
        startBtn.style.background = 'rgba(255,255,255,0.8)';

        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                completeCycle();
            }
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        startBtn.textContent = '开始';
        startBtn.style.background = 'white';
        clearInterval(timerId);
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = CONFIG[currentMode].time;
        updateDisplay();
    }

    function completeCycle() {
        pauseTimer();

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});

        if (currentMode === 'focus') {
            pomsCompleted++;
            countDisplay.textContent = pomsCompleted;
            alert(`专注结束！你已经完成了 ${pomsCompleted} 个番茄钟。`);
            switchMode('short');
        } else {
            alert(`${CONFIG[currentMode].label}结束了，回到专注模式吧！`);
            switchMode('focus');
        }
    }

    function switchMode(mode) {
        currentMode = mode;
        timeLeft = CONFIG[mode].time;

        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
        });
        body.style.background = CONFIG[mode].color;

        resetTimer();
    }

    // --- 设置功能 ---
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    saveSettingsBtn.addEventListener('click', () => {
        CONFIG.focus.time = parseInt(inputFocus.value) * 60;
        CONFIG.short.time = parseInt(inputShort.value) * 60;
        CONFIG.long.time = parseInt(inputLong.value) * 60;

        settingsModal.classList.remove('active');
        switchMode(currentMode); // 立即应用新设置
    });

    // --- 事件绑定 ---
    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchMode(btn.getAttribute('data-mode'));
        });
    });

    updateDisplay();
});
