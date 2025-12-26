const { onRequest } = require("firebase-functions/v2/https");

// Най-простата възможна функция
exports.chat = onRequest({ cors: true }, function (req, res) {
    res.json({ reply: "Здравей! Сървърът работи успешно! 🎉" });
});