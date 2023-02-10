const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let items = []
let workItems = []


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

/// Routing = /
app.get("/", (req, res) => {
    res.render("list", { listName: printFormattedDate(), newListItems: items });

})

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (item !== "") {
        if (req.body.list === "Works") {
            workItems.push(item)
            res.redirect("/work") //Routing work path
        } else {
            items.push(item)
            res.redirect("/");
        }


    }else{
        if (req.body.list === "Works"){
            res.redirect("/work")
        }else{
            res.redirect("/")
        }
    }

    console.log(req.body)


})
//  Rendering work path

app.get("/work", (req, res) => {
    res.render("list", { listName: "Works", newListItems: workItems })

})







// Server listener
app.listen(3000, () => console.log("SERVER İS RUNNİNG ON PORT 3000 !......"))