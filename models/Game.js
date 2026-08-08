const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        genre: { type: String, required: true, trim: true },
        year: { type: Number, required: true },
        price: { type: Number, required: true },
        platform: { type: String, trim: true },
        description: { type: String, required: true, trim: true},
        image: { type: String, required: true, trim: true},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
