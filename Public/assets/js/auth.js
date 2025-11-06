// Authentication system for P-Harmonia
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkAuthState();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Register form
        const registerForm = document.querySelector('[data-register]');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Login form
        const loginForm = document.querySelector('[data-form-login]');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-logout]')) {
                this.logout();
            }
        });
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const userData = {
            nombre: formData.get('nombre')?.trim(),
            apellido: formData.get('apellido')?.trim(),
            email: formData.get('email')?.trim(),
            password: formData.get('password')
        };

        const confirmPassword = formData.get('confirm-password');

        try {
            // Validate input
            this.validateRegistrationData(userData, confirmPassword);
            
            // Show loading state
            this.setFormLoading(form, true);
            
            // Register user
            await this.registerUser(userData);
            
            // Show success message
            this.showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            
            // Redirect to home
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const credentials = {
            email: formData.get('email')?.trim(),
            password: formData.get('password')
        };

        try {
            // Validate input
            this.validateLoginData(credentials);
            
            // Show loading state
            this.setFormLoading(form, true);
            
            // Login user
            await this.loginUser(credentials);
            
            // Show success message
            this.showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            // Redirect to home
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    validateRegistrationData(userData, confirmPassword) {
        if (!userData.nombre || !userData.apellido || !userData.email || !userData.password) {
            throw new Error('Por favor completa todos los campos');
        }

        if (userData.password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        if (userData.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        if (!this.isValidEmail(userData.email)) {
            throw new Error('Por favor ingresa un correo electrónico válido');
        }
    }

    validateLoginData(credentials) {
        if (!credentials.email || !credentials.password) {
            throw new Error('Por favor completa todos los campos');
        }

        if (!this.isValidEmail(credentials.email)) {
            throw new Error('Por favor ingresa un correo electrónico válido');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Check if user already exists
                    const existingUsers = this.getRegisteredUsers();
                    const userExists = existingUsers.some(user => user.email === userData.email);
                    
                    if (userExists) {
                        reject(new Error('Ya existe una cuenta con este correo electrónico'));
                        return;
                    }
                    
                    // Add user to registered users
                    existingUsers.push(userData);
                    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
                    
                    // Set current user session
                    this.setCurrentUser({
                        nombre: userData.nombre,
                        apellido: userData.apellido,
                        email: userData.email,
                        isLoggedIn: true
                    });
                    
                    resolve();
                } catch (error) {
                    reject(new Error('Error al crear la cuenta. Inténtalo de nuevo.'));
                }
            }, 1500);
        });
    }

    async loginUser(credentials) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Check if user exists and password matches
                    const registeredUsers = this.getRegisteredUsers();
                    const user = registeredUsers.find(u => 
                        u.email === credentials.email && u.password === credentials.password
                    );
                    
                    if (!user) {
                        reject(new Error('Correo electrónico o contraseña incorrectos'));
                        return;
                    }
                    
                    // Set current user session
                    this.setCurrentUser({
                        nombre: user.nombre,
                        apellido: user.apellido,
                        email: user.email,
                        isLoggedIn: true
                    });
                    
                    resolve();
                } catch (error) {
                    reject(new Error('Error al iniciar sesión. Inténtalo de nuevo.'));
                }
            }, 1500);
        });
    }

    logout() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }

    setCurrentUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    }

    getRegisteredUsers() {
        try {
            const users = localStorage.getItem('registeredUsers');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            return [];
        }
    }

    isLoggedIn() {
        const user = this.getCurrentUser();
        return user && user.isLoggedIn === true;
    }

    checkAuthState() {
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['home.html', 'profile.html', 'settings.html'];
        const authPages = ['login.html', 'register.html'];
        
        if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
            // Redirect to login if trying to access protected page without auth
            window.location.href = 'login.html';
        } else if (authPages.includes(currentPage) && this.isLoggedIn()) {
            // Redirect to home if already logged in and trying to access auth pages
            window.location.href = 'home.html';
        }
    }

    showMessage(message, type = 'info') {
        // Try to find existing message containers
        let messageDiv = document.querySelector(`#${type}-message`);
        
        if (!messageDiv) {
            // Create message div if it doesn't exist
            messageDiv = document.createElement('div');
            messageDiv.id = `${type}-message`;
            messageDiv.className = `${type}-message`;
            
            // Insert after form or at the beginning of main content
            const form = document.querySelector('form');
            if (form) {
                form.insertAdjacentElement('beforeend', messageDiv);
            } else {
                document.body.insertAdjacentElement('afterbegin', messageDiv);
            }
        }
        
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        // Hide other message types
        const messageTypes = ['error', 'success', 'info'];
        messageTypes.forEach(msgType => {
            if (msgType !== type) {
                const otherMsg = document.querySelector(`#${msgType}-message`);
                if (otherMsg) {
                    otherMsg.style.display = 'none';
                }
            }
        });
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    setFormLoading(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div> Procesando...';
        } else {
            submitBtn.disabled = false;
            if (submitBtn.dataset.originalText) {
                submitBtn.innerHTML = submitBtn.dataset.originalText;
            }
        }
    }

    // Utility method to get user display name
    getUserDisplayName() {
        const user = this.getCurrentUser();
        if (!user) return '';
        return `${user.nombre} ${user.apellido}`;
    }

    // Utility method to update UI based on auth state
    updateAuthUI() {
        const user = this.getCurrentUser();
        const userMenus = document.querySelectorAll('[data-user-menu]');
        const loginLinks = document.querySelectorAll('[data-login-link]');
        
        if (user && user.isLoggedIn) {
            // Show user menus
            userMenus.forEach(menu => {
                menu.style.display = 'block';
                const nameElement = menu.querySelector('[data-user-name]');
                if (nameElement) {
                    nameElement.textContent = this.getUserDisplayName();
                }
            });
            
            // Hide login links
            loginLinks.forEach(link => {
                link.style.display = 'none';
            });
        } else {
            // Hide user menus
            userMenus.forEach(menu => {
                menu.style.display = 'none';
            });
            
            // Show login links
            loginLinks.forEach(link => {
                link.style.display = 'block';
            });
        }
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}