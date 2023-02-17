require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
var _ = require("lodash")
const app = express();





try {
    mongoose.connect(process.env.MONGO_URL) //!Connection with mongoDB
        .then(input => console.log("Connected MongoDB"))
} catch (error) {
    console.log(error);

}

//* DB Model's 
const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: String
    }
})

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todolist !"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item."
})
const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
})
const List = mongoose.model("List", listSchema)






app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Setup EJS for server side rendering.
app.use(express.static("public"))


/// Rendering root path.
app.get("/", (req, res) => {

    Item.find((error, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Added")
                }
            })
            res.redirect("/")
        } else {
            res.render("list", { listName: "Today", newListItems: foundItems })
        }
    })




})
//  Rendering work path.


app.get("/:customListName", (req, res) => { //TODO : CREATE DYNAMİC ROUTE ! 
    const customListName = _.capitalize(req.params.customListName)
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                console.log("Doesn't exist.")
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect(`/${customListName}`)

            } else {
                res.render("list", { listName: foundList.name, newListItems: foundList.items })

            }

        }
    })

})


app.get("/about", (req, res) => {
    res.render("about")
})
// Routing 
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list


    const item = new Item({
        name: itemName
    })
    if (listName === "Today") {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item)
            foundList.save()
            res.redirect(`/${listName}`)
        })
    }



})

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox
    const checkedListName = req.body.listName
    console.log(req.body);
    if (checkedListName === "Today") {
        Item.deleteOne({ _id: checkedItemId }, error => {  //* req.body.checkbox === value of checkbox in list.ejs *//
            if (error) {
                console.log(error)
            }
        })
        res.redirect("/")
    } else {
        List.findOne({ name: checkedListName }, (err, foundList) => {
            if (!err) {

                
                List.findOneAndUpdate({name:checkedListName},{$pull:{items:{_id:checkedItemId}}}, (err, result) => {
                    if(!err){
                        res.redirect(`/${checkedListName}`)
                    }
                })


            }
        })
    }
})

// Server listener
app.listen(3000, () => console.log("SERVER İS RUNNİNG ON PORT 3000 !......"))