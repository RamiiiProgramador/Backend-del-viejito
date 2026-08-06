const mongoose = require("mongoose");
const Game = require("../models/Game");

function hasRequiredFields(data) {
    return (
        typeof data.title === "string" && data.title.trim() &&
        typeof data.genre === "string" && data.genre.trim() &&
        data.year !== undefined && data.year !== null && data.year !== ""
    );
}

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function validateGame(req, res) {
    if (!hasRequiredFields(req.body)) {
        res.status(400).json({ mensaje: "Faltan los campos obligatorios: title, genre y year" });
        return false;
    }

    if (!Number.isFinite(Number(req.body.year))) {
        res.status(400).json({ mensaje: "El campo year debe ser un número" });
        return false;
    }

    return true;
}

exports.createGame = async (req, res, next) => {
    if (!validateGame(req, res)) return;

    try {
        const game = await Game.create({
            title: req.body.title,
            genre: req.body.genre,
            year: Number(req.body.year),
            platform: req.body.platform
        });
        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
};

exports.getGames = async (req, res, next) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
};

exports.getGameById = async (req, res, next) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ mensaje: "ID de videojuego inválido" });
    }

    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
};

exports.updateGame = async (req, res, next) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ mensaje: "ID de videojuego inválido" });
    }
    if (!validateGame(req, res)) return;

    try {
        const game = await Game.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            genre: req.body.genre,
            year: Number(req.body.year),
            platform: req.body.platform
        }, {
            new: true,
            runValidators: true
        });
        if (!game) return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        res.status(200).json(game);
    } catch (error) {
        next(error);
    }
};

exports.deleteGame = async (req, res, next) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ mensaje: "ID de videojuego inválido" });
    }

    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        res.status(200).json({ mensaje: "Videojuego eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
