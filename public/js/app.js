// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Note: End users (respondents) do NOT need authentication.
// They only access public survey links: /survey/:id

// Admin Auth Helper Functions (for admin users)
const adminAuth = {
    // Get admin token from localStorage
    getToken() {
        return localStorage.getItem('adminToken');
    },

    // Set admin token to localStorage
    setToken(token) {
        localStorage.setItem('adminToken', token);
    },

    // Remove admin token from localStorage
    removeToken() {
        localStorage.removeItem('adminToken');
    },

    // Get admin info from localStorage
    getAdmin() {
        const admin = localStorage.getItem('adminInfo');
        return admin ? JSON.parse(admin) : null;
    },

    // Set admin info to localStorage
    setAdmin(admin) {
        localStorage.setItem('adminInfo', JSON.stringify(admin));
    },

    // Remove admin info from localStorage
    removeAdmin() {
        localStorage.removeItem('adminInfo');
    },

    // Check if admin is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Logout admin
    logout() {
        this.removeToken();
        this.removeAdmin();
        window.location.href = '/admin/login';
    },

    // Get company ID from admin info
    getCompanyId() {
        const admin = this.getAdmin();
        return admin?.company?.id || admin?.company || null;
    }
};

// Public API Helper (for end users taking surveys - no auth needed)
const publicApi = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Request failed');
            return data;
        } catch (error) {
            console.error('Public API Error:', error);
            throw error;
        }
    },
    
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Request failed');
            return result;
        } catch (error) {
            console.error('Public API Error:', error);
            throw error;
        }
    }
};

// Admin API Helper Functions (for admin users)
const adminApi = {
    // Make authenticated admin request
    async request(endpoint, options = {}) {
        const token = adminAuth.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    adminAuth.logout();
                }
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('Admin API Error:', error);
            throw error;
        }
    },

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// UI Helper Functions
const ui = {
    // Show alert
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} fade-in`;
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    },

    // Show loading spinner
    showLoading(element) {
        if (element) {
            // Show loading in specific element
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            spinner.style.margin = '2rem auto';
            element.innerHTML = '';
            element.appendChild(spinner);
        } else {
            // Show global loading overlay
            let overlay = document.getElementById('globalLoadingOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'globalLoadingOverlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
                overlay.innerHTML = '<div class="spinner"></div>';
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        }
    },

    // Hide loading spinner
    hideLoading() {
        const overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Confirm dialog
    confirm(message) {
        return window.confirm(message);
    }
};

// Form Validation
const validation = {
    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password (min 6 characters)
    isValidPassword(password) {
        return password.length >= 6;
    },

    // Validate required field
    isRequired(value) {
        return value && value.trim() !== '';
    }
};

// Protect pages that require admin authentication
function requireAdminAuth() {
    if (!adminAuth.isAuthenticated()) {
        window.location.href = '/admin/login';
    }
}

// Redirect if already authenticated as admin
function redirectIfAdminAuthenticated() {
    if (adminAuth.isAuthenticated()) {
        window.location.href = '/dashboard';
    }
}

// Update navbar with admin info
function updateAdminNavbar() {
    const admin = adminAuth.getAdmin();
    const navbarNav = document.querySelector('.navbar-nav');

    if (navbarNav && admin) {
        // Add email and logout button if not already present
        const hasEmail = navbarNav.querySelector('.admin-email');
        if (!hasEmail) {
            const emailLi = document.createElement('li');
            emailLi.innerHTML = `<span class="nav-link admin-email">${admin.email}</span>`;
            navbarNav.appendChild(emailLi);
            
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<button onclick="adminAuth.logout()" class="btn btn-sm btn-outline">Đăng xuất</button>`;
            navbarNav.appendChild(logoutLi);
        }
    }
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Auto-detect if on admin page or public page
    const isAdminPage = window.location.pathname.includes('/admin') || 
                        window.location.pathname.includes('/dashboard') ||
                        window.location.pathname.includes('/create-survey') ||
                        window.location.pathname.includes('/analytics');
    
    if (isAdminPage) {
        updateAdminNavbar();
    }
});
