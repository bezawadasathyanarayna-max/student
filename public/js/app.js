/**
 * Student Management System - Frontend Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // App State
    let currentStudent = null;

    // DOM Elements - Sections
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const errorText = document.getElementById('error-text');
    const regInput = document.getElementById('register-number');
    const passInput = document.getElementById('password');
    const togglePassBtn = document.getElementById('toggle-password');
    const passEyeIcon = document.getElementById('pass-eye-icon');
    const btnLogout = document.getElementById('btn-logout');

    // Navigation & Tabs
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const viewTabBtns = document.querySelectorAll('.view-tab-btn');

    // Theme Toggle
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    // Quick Demo Chips
    const demoChips = document.querySelectorAll('.btn-demo-chip');

    // -------------------------------------------------------------------
    // 1. INITIALIZATION & THEME CHECK
    // -------------------------------------------------------------------
    initTheme();
    checkActiveSession();

    function initTheme() {
        const savedTheme = localStorage.getItem('edupulse_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeIcon.className = 'fa-solid fa-sun';
            themeText.textContent = 'Light Mode';
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = 'Dark Mode';
        }
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                document.body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('edupulse_theme', 'dark');
                themeIcon.className = 'fa-solid fa-moon';
                themeText.textContent = 'Dark Mode';
                showToast('Switched to Dark Mode', 'info');
            } else {
                document.body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('edupulse_theme', 'light');
                themeIcon.className = 'fa-solid fa-sun';
                themeText.textContent = 'Light Mode';
                showToast('Switched to Light Mode', 'info');
            }
        });
    }

    // Password Eye Toggle
    if (togglePassBtn) {
        togglePassBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            passEyeIcon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });
    }

    // Quick Demo Fill
    demoChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const reg = chip.getAttribute('data-reg');
            const pass = chip.getAttribute('data-pass');
            regInput.value = reg;
            passInput.value = pass;
            showToast(`Auto-filled credentials for ${reg}`, 'info');
        });
    });

    // -------------------------------------------------------------------
    // 2. AUTHENTICATION & LOGIN FLOW
    // -------------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const registerNumber = regInput.value.trim();
            const password = passInput.value.trim();

            if (!registerNumber || !password) {
                showError('Please enter both Register Number and Password.');
                return;
            }

            hideError();
            setLoginLoading(true);

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ register_number: registerNumber, password }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Login failed. Please check credentials.');
                }

                showToast(`Welcome back, ${data.student.name}!`, 'success');
                
                // Fetch complete profile with courses & attendance
                await checkActiveSession();

            } catch (err) {
                showError(err.message);
                showToast(err.message, 'danger');
            } finally {
                setLoginLoading(false);
            }
        });
    }

    // Check existing login session on load
    async function checkActiveSession() {
        try {
            const response = await fetch('/api/student/me');
            const data = await response.json();

            if (response.ok && data.success && data.student) {
                currentStudent = data.student;
                renderDashboard(currentStudent);
                showDashboard();
            } else {
                showLogin();
            }
        } catch (err) {
            console.log('Session check:', err.message);
            showLogin();
        }
    }

    // Logout Handler
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                currentStudent = null;
                showToast('Logged out successfully', 'info');
                showLogin();
            } catch (err) {
                console.error('Logout error:', err);
                showLogin();
            }
        });
    }

    // -------------------------------------------------------------------
    // 3. UI DASHBOARD RENDERING
    // -------------------------------------------------------------------
    function renderDashboard(student) {
        // Fallback Avatar
        const avatarUrl = student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

        // Sidebar & Top Bar
        document.getElementById('sidebar-name').textContent = student.name;
        document.getElementById('sidebar-reg').textContent = student.register_number;
        document.getElementById('sidebar-avatar').src = avatarUrl;
        document.getElementById('topbar-name').textContent = student.name;
        document.getElementById('topbar-gpa').textContent = student.gpa ? student.gpa.toFixed(2) : '3.80';
        document.getElementById('topbar-avatar').src = avatarUrl;

        // Metric Stats
        document.getElementById('stat-gpa').textContent = student.gpa ? student.gpa.toFixed(2) : '3.80';
        document.getElementById('stat-attendance').textContent = `${student.attendance_percentage || 90}%`;
        document.getElementById('stat-courses-count').textContent = student.courses ? student.courses.length : 0;
        document.getElementById('stat-semester').textContent = student.semester || '6th Sem';
        document.getElementById('stat-department-short').textContent = student.department || 'CSE';

        // Tab 1: Profile Summary Overview
        document.getElementById('overview-avatar').src = avatarUrl;
        document.getElementById('overview-full-name').textContent = student.name;
        document.getElementById('overview-email').innerHTML = `<i class="fa-solid fa-envelope"></i> ${student.email}`;
        document.getElementById('overview-dept-badge').textContent = student.department;
        document.getElementById('reg-badge-overview').textContent = student.register_number;
        document.getElementById('detail-reg').textContent = student.register_number;
        document.getElementById('detail-dept').textContent = student.department;
        document.getElementById('detail-year-sem').textContent = `${student.year} (${student.semester})`;
        document.getElementById('detail-phone').textContent = student.phone || 'N/A';

        // Overview Table Courses
        const overviewTbody = document.getElementById('overview-courses-tbody');
        overviewTbody.innerHTML = '';
        const courses = student.courses || [];

        if (courses.length === 0) {
            overviewTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No courses enrolled yet.</td></tr>`;
        } else {
            courses.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="font-mono">${c.course_code}</td>
                    <td><strong>${c.course_name}</strong></td>
                    <td><span class="grade-badge ${getGradeClass(c.grade)}">${c.grade}</span></td>
                    <td><strong>${c.score}%</strong></td>
                `;
                overviewTbody.appendChild(tr);
            });
        }

        // Tab 2: Full Courses Table
        const fullTbody = document.getElementById('full-courses-tbody');
        fullTbody.innerHTML = '';
        if (courses.length === 0) {
            fullTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No course data found.</td></tr>`;
        } else {
            courses.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="font-mono"><strong>${c.course_code}</strong></td>
                    <td><strong>${c.course_name}</strong></td>
                    <td>${c.credits} Credits</td>
                    <td>${c.instructor}</td>
                    <td><strong>${c.score} / 100</strong></td>
                    <td><span class="grade-badge ${getGradeClass(c.grade)}">${c.grade}</span></td>
                `;
                fullTbody.appendChild(tr);
            });
        }

        // Tab 3: Attendance Grid
        const attContainer = document.getElementById('attendance-cards-container');
        attContainer.innerHTML = '';
        const attendanceList = student.attendance || [];

        if (attendanceList.length === 0) {
            attContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No attendance logs available.</p>`;
        } else {
            attendanceList.forEach(item => {
                const percent = Math.round((item.attended_classes / item.total_classes) * 100);
                const card = document.createElement('div');
                card.className = 'attendance-card';
                card.innerHTML = `
                    <div class="att-header">
                        <h4>${item.subject}</h4>
                        <span class="att-percent ${percent < 75 ? 'text-danger' : ''}">${percent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                    <div class="att-footer">
                        <span>Attended: <strong>${item.attended_classes}</strong> / ${item.total_classes}</span>
                        <span>${percent >= 75 ? 'Eligible' : 'Warning'}</span>
                    </div>
                `;
                attContainer.appendChild(card);
            });
        }

        // Tab 4: Detailed Profile Tab
        document.getElementById('profile-avatar-large').src = avatarUrl;
        document.getElementById('profile-large-name').textContent = student.name;
        document.getElementById('profile-large-reg').textContent = student.register_number;
        document.getElementById('profile-large-dept').textContent = student.department;
        document.getElementById('profile-large-year').textContent = student.year;
        
        document.getElementById('prof-field-reg').textContent = student.register_number;
        document.getElementById('prof-field-name').textContent = student.name;
        document.getElementById('prof-field-email').textContent = student.email;
        document.getElementById('prof-field-age').textContent = `${student.age} Years Old`;
        document.getElementById('prof-field-dept').textContent = student.department;
        document.getElementById('prof-field-standing').textContent = `${student.year} (${student.semester})`;
        document.getElementById('prof-field-phone').textContent = student.phone || '+1 (555) 019-2834';
    }

    // -------------------------------------------------------------------
    // 4. TAB NAVIGATION & VIEW SWITCHING
    // -------------------------------------------------------------------
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            navItems.forEach(n => n.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            item.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');

            // Update Header Title
            const titles = {
                'tab-overview': 'Academic Overview',
                'tab-courses': 'Courses & Academic Grades',
                'tab-attendance': 'Subject Attendance Breakdown',
                'tab-profile': 'Student Personal Profile'
            };
            document.getElementById('page-title').textContent = titles[targetTab] || 'Dashboard';
        });
    });

    viewTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            const navBtn = document.querySelector(`.nav-item[data-tab="${target}"]`);
            if (navBtn) navBtn.click();
        });
    });

    // -------------------------------------------------------------------
    // 5. HELPER FUNCTIONS
    // -------------------------------------------------------------------
    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    }

    function showLogin() {
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        regInput.focus();
    }

    function setLoginLoading(loading) {
        btnLogin.disabled = loading;
        const textSpan = btnLogin.querySelector('.btn-text');
        const loaderSpan = btnLogin.querySelector('.btn-loader');
        if (loading) {
            textSpan.classList.add('hidden');
            loaderSpan.classList.remove('hidden');
        } else {
            textSpan.classList.remove('hidden');
            loaderSpan.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorText.textContent = msg;
        loginErrorMsg.classList.remove('hidden');
    }

    function hideError() {
        loginErrorMsg.classList.add('hidden');
    }

    function getGradeClass(grade) {
        if (!grade) return 'grade-A';
        if (grade.includes('A+')) return 'grade-A-plus';
        if (grade.includes('A')) return 'grade-A';
        return 'grade-B-plus';
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-circle-check',
            danger: 'fa-circle-xmark',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || 'fa-circle-info'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
});
