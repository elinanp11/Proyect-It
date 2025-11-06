# Sistema de Autenticación - P-Harmonia

## ✨ Características implementadas

### Diseño
- **Páginas de registro y login** con el mismo diseño elegante de `belleza.html`
- **Colores y estilos consistentes** con la paleta de la aplicación
- **Diseño responsive** que se adapta a dispositivos móviles
- **Animaciones suaves** y efectos visuales atractivos

### Funcionalidad
- **Registro de usuarios** con validación completa
- **Inicio de sesión** con verificación de credenciales
- **Almacenamiento local** de usuarios registrados
- **Gestión de sesiones** con localStorage
- **Validación en tiempo real** de formularios
- **Mensajes de error y éxito** informativos
- **Estados de carga** con spinners animados

## 🚀 Cómo probar el sistema

### 1. Registro de nuevo usuario
1. Abre `register.html`
2. Completa todos los campos:
   - Nombre: Tu nombre
   - Apellido: Tu apellido  
   - Email: tu@correo.com
   - Contraseña: mínimo 6 caracteres
   - Confirmar contraseña: debe coincidir
3. Haz clic en "Crear cuenta"
4. Serás redirigido automáticamente a `home.html`

### 2. Inicio de sesión
1. Abre `login.html`
2. Ingresa las credenciales del usuario registrado
3. Haz clic en "Iniciar sesión"
4. Serás redirigido a `home.html`

### 3. Gestión de sesión
- La sesión se mantiene activa hasta cerrar sesión
- Si intentas acceder a páginas protegidas sin estar logueado, serás redirigido al login
- Si ya estás logueado e intentas acceder al login/registro, serás redirigido al home

## 🔧 Archivos modificados/creados

### Páginas actualizadas:
- `Public/register.html` - Nuevo diseño y funcionalidad completa
- `Public/login.html` - Nuevo diseño y funcionalidad completa

### Archivos nuevos:
- `Public/home.html` - Página principal para usuarios autenticados
- `Public/assets/js/auth.js` - Sistema de autenticación completo
- `Public/README_AUTH.md` - Esta documentación

### Archivos mejorados:
- `Public/assets/css/style.css` - Estilos adicionales para auth

## 💡 Características técnicas

### Validaciones implementadas:
- ✅ Campos obligatorios
- ✅ Formato de email válido
- ✅ Contraseña mínima de 6 caracteres
- ✅ Confirmación de contraseña
- ✅ Usuario único por email
- ✅ Credenciales correctas en login

### Experiencia de usuario:
- ✅ Mensajes de error claros
- ✅ Estados de carga visual
- ✅ Redirecciones automáticas
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Iconos intuitivos

### Seguridad básica:
- ✅ Validación client-side
- ✅ Gestión de sesiones
- ✅ Protección de páginas
- ✅ Limpieza de datos de entrada

## 🎨 Paleta de colores utilizada

```css
--tickle-me-pink: #F283AF;
--champagne: #FBF4EB;
--blush: #FBD9E5;
--raspberry-rose: #C43670;
--white: #FFFFFF;
--text-dark: #333333;
--text-light: #666666;
```

## 📱 Responsive Design

El sistema funciona perfectamente en:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

¡El sistema está listo para usar! 🎉