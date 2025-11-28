const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("OK")
});

app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`)
});