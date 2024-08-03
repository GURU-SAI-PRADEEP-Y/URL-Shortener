const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const ShortUrl = require('./models/schema');
const { assert } = require('console');

const dbUrl = 'mongodb+srv://Mini-url:QqXwkuKezxxVQ5zJ@cluster0.51bx0cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

main().then(console.log("MongoDB is connected")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engines", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log(`listening port ${port}`);
})

app.get("/", async (req, res) => {
    res.render("home.ejs");
})
app.get("/final", async (req, res) => {
    const lastUrl = await ShortUrl.findOne().sort({ _id: -1 });
    res.render("final.ejs", { lastUrl });
})
app.post("/shortUrl", async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect("/final");
})
app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full);
})