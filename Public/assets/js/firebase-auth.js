// Firebase Authentication for P-Harmonia
import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

class FirebaseAuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.updateAuthUI();
      
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
      } else {
        console.log('❌ Usuario no autenticado');
      }
    });

    // Configurar event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Botones de logout
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
      // Validar datos
      this.validateRegistrationData(userData, confirmPassword);
      
      // Mostrar estado de carga
      this.setFormLoading(form, true);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Actualizar perfil del usuario
      await updateProfile(user, {
        displayName: `${userData.nombre} ${userData.apellido}`
      });
      
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      this.showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
      
      // Redirigir después del éxito
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 2000);
      
    } catch (error) {
      console.error('Error en registro:', error);
      this.showMessage(this.getErrorMessage(error), 'error');
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
      // Validar datos
      this.validateLoginData(credentials);
      
      // Mostrar estado de carga
      this.setFormLoading(form, true);
      
      // Iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      // Actualizar último login en Firestore
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      }, { merge: true });
      
      this.showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
      
      // Redirigir después del éxito
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
      
    } catch (error) {
      console.error('Error en login:', error);
      this.showMessage(this.getErrorMessage(error), 'error');
    } finally {
      this.setFormLoading(form, false);
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.showMessage('Sesión cerrada correctamente', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.showMessage('Error al cerrar sesión', 'error');
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

  getErrorMessage(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'Ya existe una cuenta con este correo electrónico',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };

    return errorMessages[error.code] || 'Error inesperado. Inténtalo de nuevo.';
  }

  showMessage(message, type = 'info') {
    let messageDiv = document.querySelector(`#${type}-message`);
    
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = `${type}-message`;
      messageDiv.className = `${type}-message`;
      
      const form = document.querySelector('form');
      if (form) {
        form.insertAdjacentElement('beforeend', messageDiv);
      }
    }
    
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Ocultar otros tipos de mensaje
    const messageTypes = ['error', 'success', 'info'];
    messageTypes.forEach(msgType => {
      if (msgType !== type) {
        const otherMsg = document.querySelector(`#${msgType}-message`);
        if (otherMsg) {
          otherMsg.style.display = 'none';
        }
      }
    });
    
    // Auto-ocultar mensajes de éxito
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

  updateAuthUI() {
    const user = this.currentUser;
    const userMenus = document.querySelectorAll('[data-user-menu]');
    const loginLinks = document.querySelectorAll('[data-login-link]');
    
    if (user) {
      // Mostrar menús de usuario
      userMenus.forEach(menu => {
        menu.style.display = 'block';
        const nameElement = menu.querySelector('[data-user-name]');
        if (nameElement) {
          nameElement.textContent = user.displayName || user.email;
        }
      });
      
      // Ocultar enlaces de login
      loginLinks.forEach(link => {
        link.style.display = 'none';
      });
    } else {
      // Ocultar menús de usuario
      userMenus.forEach(menu => {
        menu.style.display = 'none';
      });
      
      // Mostrar enlaces de login
      loginLinks.forEach(link => {
        link.style.display = 'block';
      });
    }
  }

  // Verificar si el usuario está autenticado
  isLoggedIn() {
    return !!this.currentUser;
  }

  // Obtener datos del usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Obtener datos adicionales del usuario desde Firestore
  async getUserData() {
    if (!this.currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }
}

// Inicializar el sistema de autenticación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.firebaseAuth = new FirebaseAuthSystem();
});

// Exportar para uso en otros scripts
export default FirebaseAuthSystem;