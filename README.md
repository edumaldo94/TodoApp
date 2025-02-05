backend/
├── src/
│   ├── controllers/   # Lógica de los controladores
│   ├── routes/        # Definición de rutas
│   ├── models/        # Conexión y consultas a la base de datos
│   ├── utils/         # Funciones utilitarias
│   └── app.js         # Punto de entrada del servidor
├── .env               # Variables de entorno (opcional)
└── package.json       # Dependencias del proyecto


Directory structure:
└── edumaldo94-todoapp/
    ├── README.md
    ├── backend/
    │   ├── app.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── .env
    │   ├── node_modules
    │   └── src/
    │       ├── controllers/
    │       │   └── tasks.js
    │       ├── models/
    │       │   └── db.js
    │       └── routes/
    │           └── tasks.js
    └── frontend/
        └── myapp/
            ├── App.js
            ├── app.json
            ├── index.js
            ├── package-lock.json
            ├── package.json
            ├── .gitignore
            ├── assets/
            └── src/
                ├── app/
                │   └── api.js
                └── screens/
                    └── TaskList.js
