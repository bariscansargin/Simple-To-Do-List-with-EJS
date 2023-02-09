const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let items = []


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Setup EJS for server side rendering.
app.use(express.static("public"))

const printFormattedDate = () => {
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    return new Date().toLocaleDateString("en-US", options)
}

app.get("/", (req, res) => {
    res.render("list", { date: printFormattedDate(), newListItems: items });

})

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (item !== "") {
        items.push(item)

    }
    res.redirect("/");
    
    
})


app.listen(3000, () => console.log("SERVER İS RUNNİNG ON PORT 3000 !......"))