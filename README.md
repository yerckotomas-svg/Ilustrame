# Ilustrame — App de Gestión

App de gestión para tu negocio de estampados DTF y productos personalizados.

---

## 🚀 Cómo subir a Vercel (paso a paso)

### Opción A — Subir el ZIP directo (más fácil)

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta gratis (puedes entrar con Google)
2. En el dashboard haz clic en **"Add New Project"**
3. Elige **"Deploy from your computer"** o arrastra la carpeta del proyecto
4. Vercel detecta automáticamente que es un proyecto Vite/React
5. Haz clic en **Deploy** — en 1-2 minutos tendrás tu URL

### Opción B — Usando GitHub (recomendado para actualizaciones fáciles)

1. Crea cuenta en [github.com](https://github.com)
2. Crea un repositorio nuevo y sube los archivos
3. En Vercel conecta tu cuenta de GitHub
4. Selecciona el repositorio → Deploy
5. Cada vez que actualices el código en GitHub, Vercel actualiza la app automáticamente

---

## 📱 Instalar como app en el celular

### iPhone (Safari):
1. Abre la URL de tu app en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona **"Añadir a pantalla de inicio"**
4. ¡Listo! Aparece como app en tu iPhone

### Android (Chrome):
1. Abre la URL en Chrome
2. Toca los 3 puntos del menú
3. Selecciona **"Añadir a pantalla de inicio"**
4. ¡Listo!

---

## 🛠️ Estructura del proyecto

```
ilustrame/
├── public/
│   ├── manifest.json     ← configuración PWA
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── main.jsx          ← entrada de React
│   └── App.jsx           ← toda la aplicación
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ✏️ Cómo modificar la app

Abre `src/App.jsx` con cualquier editor de texto (recomendado: VS Code).

Los datos de ejemplo están al inicio del archivo en las variables `INIT_*`.
Puedes cambiar colores editando las variables CSS en `:root` dentro de la constante `CSS`.

---

## 📦 Secciones disponibles

- ⚡ Dashboard — resumen general
- 💸 Ventas — ingresos cobrados
- 📋 Pedidos — seguimiento de órdenes
- 📦 Stock — inventario
- 👥 Clientes — base de datos
- 🧾 Gastos — egresos
- 📄 Cotizaciones — presupuestos
- 📊 Estadísticas — gráficos y análisis
