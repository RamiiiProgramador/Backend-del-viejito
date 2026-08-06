const dns = require("dns");
const mongoose = require("mongoose");

// Evita problemas de resolución SRV de MongoDB Atlas en algunos equipos Windows.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("La variable MONGO_URI no está configurada");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error.message);
        throw error;
    }
}

module.exports = connectDB;
