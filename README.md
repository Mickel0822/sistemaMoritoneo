# Sistema de Monitoreo de Atención

Este proyecto es un sistema web minimalista que permite monitorear el nivel de atención de un usuario durante la lectura de uno de tres documentos fijos, utilizando la webcam y tres algoritmos de visión por computadora: **EAR**, **Head Pose** y **Mouth Opening Ratio (MOR)**. El sistema está compuesto por un frontend en Next.js + Tailwind CSS y un backend en Django REST Framework.

---

## 🚀 Características

- **Selección de documento:** El usuario elige entre tres textos de diferente longitud (corto, mediano, extenso).
- **Monitoreo en tiempo real:** Se utiliza la webcam para analizar la atención mediante tres algoritmos gratuitos y abiertos.
- **Resultados inmediatos:** Al finalizar la lectura, se muestran los porcentajes de atención de cada algoritmo y se resalta el mejor.
- **Interfaz minimalista:** Diseño responsivo, claro y sin distracciones.
- **Backend Django:** Recibe los resultados del monitoreo (no almacena datos por defecto).

---

## 📂 Estructura del Proyecto

```
sistema-monitoreo-atencion/
│
├── backend/         # Backend Django (API REST)
│   ├── api/
│   └── monitoreo/
│   └── requirements.txt
│
└── frontend/        # Frontend Next.js + Tailwind CSS
    ├── components/
    ├── app/
    ├── public/models/  # Modelos de face-api.js
    └── package.json
```

---

## ⚙️ Instalación y Ejecución

### 1. Clona el repositorio

```sh
git clone <URL-del-repo>
cd sistema-monitoreo-atencion
```

### 2. Backend (Django)

```sh
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

> El backend expone el endpoint: `POST /api/resultados/`  
> CORS ya está configurado para desarrollo.

### 3. Frontend (Next.js)

```sh
cd ../frontend
bun install  
bun run dev  
```

> El frontend estará disponible en: `http://localhost:3000`

---

## 🖥️ Uso del Sistema

1. **Accede a la web:** Abre `http://localhost:3000` en tu navegador.
2. **Selecciona un documento:** Elige entre corto, mediano o extenso.
3. **Lee el mensaje de pre-monitoreo:** Inicia la lectura cuando estés listo.
4. **Permite el acceso a la webcam:** El sistema analizará tu atención en tiempo real.
5. **Haz clic en "Terminé":** Al finalizar, verás los resultados de los tres algoritmos y el mejor resaltado, con una explicación detallada.
6. **Puedes volver a leer otro documento si lo deseas.**

---

## 🧠 Algoritmos Utilizados

### 1. Eye Aspect Ratio (EAR)
- **Fórmula:**  
  EAR = (||p2−p6|| + ||p3−p5||) / (2 * ||p1−p4||)
- **Atención:**  
  (% de fotogramas con EAR > 0.3 / Total de fotogramas) * 100
- **Precisión:**  
  80-85%

### 2. Head Pose Estimation
- **Fórmula:**  
  Medida de ángulos de cabeza (yaw/pitch/roll) usando los landmarks faciales y matrices PnP.
- **Atención:**  
  (% de fotogramas con ángulos < 15° respecto al frente / Total de fotogramas) * 100
- **Precisión:**  
  90%

### 3. Mouth Opening Ratio (MOR)
- **Fórmula:**  
  MOR = ||p51 − p57||  
  (Distancia vertical entre el labio superior [punto 51] e inferior [punto 57] de los landmarks faciales)
- **Atención:**  
  (% de fotogramas con MOR < umbral / Total de fotogramas) * 100  
  (Se considera atención cuando la boca está cerrada, es decir, MOR por debajo del umbral calibrado)
- **Precisión:**  
  80-90% (dependiendo de la calidad de la detección de landmarks y la calibración del umbral)

> Todos los algoritmos se calculan usando los landmarks faciales obtenidos con [face-api.js](https://github.com/justadudewhohacks/face-api.js).

---

## 🛡️ Notas de Privacidad

- El sistema **no almacena imágenes ni videos** de la webcam.
- Los resultados solo se envían al backend para su procesamiento (no se guardan por defecto).
- El acceso a la cámara es temporal y se apaga automáticamente al finalizar la lectura.

---

## 🛠️ Personalización

- Puedes modificar los textos de los documentos en `frontend/components/documentos.ts`.
- Si deseas almacenar los resultados, puedes extender el backend Django fácilmente.

---

## 📦 Dependencias principales

### Backend (`backend/requirements.txt`)
```
Django>=5.2
djangorestframework
django-cors-headers
```

### Frontend (`frontend/package.json`)
- next
- react
- tailwindcss
- face-api.js
- bun (o npm/yarn)

---

## 📝 Créditos

- Desarrollado con Next.js, Tailwind CSS, Django y face-api.js.
- Algoritmos de atención: EAR, Head Pose, Mouth Opening Ratio (implementación propia).
