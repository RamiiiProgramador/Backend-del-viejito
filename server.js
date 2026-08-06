require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/games", gameRoutes);

const productos = [
    {
        id: 1,
        title: "Notebook para estudiar",
        price: 39990,
        description: "Notebook idea para clases online y programacion",
        thumbnail: "https://placehold.co/400x300?text=Notebook",
    },
    {
        id: 2,
        title: "Audifonos Bluetooth",
        price: 29990,
        description: "Audifonos para escuchar musica",
        thumbnail: "https://placehold.co/400x300?text=Audifonos",
    }
]

app.get("/", (req, res)=>{
    res.status(200).json({ mensaje: "API de videojuegos funcionando correctamente" });

});

app.get("/mensaje", (req, res)=>{
    res.json({
        mensaje: "Hola Ramiro",
        curso: "REACT + Express",
        modulo: "Backend",
    });
});

app.get("/productos", (req, res)=>{
    res.json({
        mensaje: "Listado de productos",
        total: productos.length,
        productos: productos,
    });
});

app.get("/productos/baratos", (rec, res)=>{
    const productosBaratos = productos.filter((producto)=> producto.price < 30000);
    res.json({
        mensaje: "Productos Baratos",
        total: productosBaratos.length,
        productos: productosBaratos,
    });
});

app.get("/api/productos/:id", (req, res)=>{
    const id = Number(req.params.id);

    const productoEncontrado = productos.find((producto)=> producto.id === id);
    if(!productoEncontrado){
        return res.status(404).json({
            mensaje: "Producto no encontrado",
        });
    }
    res.json(productoEncontrado);
});

app.get("/api/login", (req, res)=>{
    res.json({
        mensaje: "Esta ruta solo acepta solicitudes POST para iniciar sesión"
    });
});

app.post("/api/login", (req, res)=>{
    const {email, password} = req.body;
    
    if(email === "ramiro@educode.cl" && password === "123456") {
        return res.json({
            mensaje: "Login Correcto",
            usuario: {
                nombre: "Ramiro",
                email: email,
                rol: "estudiante",
            },
        });
    }

    res.status(401).json({
        mensaje: "Email o contraseña incorrecto"
    });
});

app.post("/api/productos", (req,res)=>{
    const {title, price, description, thumbnail}=req.body;
    if(!title || !price || !description){
        return res.status(400).json({
            mensaje: "Faltan datos obligatorios",
        });
    }

    const nuevoProducto= {
        id: productos.length + 1,
        title: title,
        price: Number(price),
        description: description,
        thumbnail: thumbnail || "https://placehold.co/400x300?text=Producto",
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        mensaje: "Producto creado correctamente",
        producto: nuevoProducto,
    });
});

// Middleware para rutas inexistentes.
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Middleware centralizado para errores inesperados.
app.use((error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).json({ mensaje: "ID de videojuego inválido" });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ mensaje: "Datos de videojuego inválidos", detalle: error.message });
    }

    console.error("Error interno del servidor:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor por un error de conexión a MongoDB.");
        process.exit(1);
    }
}

startServer();
