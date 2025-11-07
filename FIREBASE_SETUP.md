# 🔥 CONFIGURACIÓN DE FIREBASE PARA P-HARMONIA

## 📋 PASOS PARA CONFIGURAR FIREBASE

### 1. 🚀 Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `p-harmonia` (o el que prefieras)
4. Acepta los términos y crea el proyecto

### 2. 🔧 Configurar Authentication

1. En el panel de Firebase, ve a **Authentication**
2. Haz clic en **Comenzar**
3. Ve a la pestaña **Sign-in method**
4. Habilita **Correo electrónico/contraseña**
5. Guarda los cambios

### 3. 🗄️ Configurar Firestore Database

1. Ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba** (por ahora)
4. Elige una ubicación (recomendado: us-central)

### 4. 📱 Registrar tu App Web

1. En la página principal del proyecto, haz clic en el ícono **</>** (Web)
2. Nombre de la app: `P-Harmonia Web`
3. **NO** marques "También configurar Firebase Hosting"
4. Haz clic en **Registrar app**

### 5. 🔑 Obtener las Credenciales

Después de registrar la app, verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "p-harmonia-12345.firebaseapp.com",
  projectId: "p-harmonia-12345",
  storageBucket: "p-harmonia-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 6. 📝 Configurar el archivo .env

Copia los valores de tu configuración al archivo `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=p-harmonia-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=p-harmonia-12345
VITE_FIREBASE_STORAGE_BUCKET=p-harmonia-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

### 7. 🔒 Configurar Reglas de Seguridad

#### Firestore Rules:
Ve a **Firestore Database > Reglas** y usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir a usuarios autenticados leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Otras colecciones pueden agregarse aquí
  }
}
```

#### Storage Rules (si usas Storage):
Ve a **Storage > Reglas**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📁 ESTRUCTURA DE ARCHIVOS CREADA

```
├── .env                           # ✅ Credenciales (NO subir a Git)
├── .gitignore                     # ✅ Ignora archivos sensibles
├── Public/
│   └── assets/
│       └── js/
│           ├── firebase-config.js  # ✅ Configuración de Firebase
│           ├── firebase-auth.js    # ✅ Sistema de autenticación
│           └── auth.js            # ⚠️  Sistema anterior (backup)
```

## 🔄 ACTUALIZAR LAS PÁGINAS HTML

### Para usar Firebase en lugar del sistema local:

1. **En register.html y login.html**, reemplaza:
```html
<script src="assets/js/auth.js"></script>
```

Por:
```html
<script type="module" src="assets/js/firebase-auth.js"></script>
```

2. **Cambiar los IDs de los formularios** (si es necesario):
- `registerForm` ✅ (ya correcto)
- `loginForm` ✅ (ya correcto)

## 🧪 PROBAR LA CONFIGURACIÓN

1. **Abrir la consola del navegador** (F12)
2. **Ir a register.html**
3. **Deberías ver**: "🔥 Firebase inicializado correctamente para P-Harmonia"
4. **Si hay errores**: Revisa que todas las variables del .env estén correctas

## 🚨 IMPORTANTE - SEGURIDAD

### ✅ QUE SÍ HACER:
- Mantener el archivo `.env` en `.gitignore`
- Usar las reglas de seguridad de Firestore
- Validar datos en el frontend Y backend

### ❌ QUE NO HACER:
- Nunca subir el archivo `.env` a Git
- No usar las credenciales de ejemplo
- No dejar las reglas de Firestore abiertas

## 🎯 PRÓXIMOS PASOS

1. ✅ Configurar Firebase Console
2. ✅ Obtener credenciales
3. ✅ Llenar el archivo .env
4. 🔄 Actualizar las páginas HTML para usar Firebase
5. 🧪 Probar registro e inicio de sesión
6. 🔒 Configurar reglas de seguridad
7. 🚀 ¡Listo para producción!

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica que todas las variables del .env estén correctas
3. Asegúrate de que Authentication esté habilitado en Firebase
4. Verifica que las reglas de Firestore permitan las operaciones

**¡Tu sistema de autenticación con Firebase estará listo! 🔥**