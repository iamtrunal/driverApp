const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
require("./db/conn");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})