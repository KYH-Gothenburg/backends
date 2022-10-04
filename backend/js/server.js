const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started. Listening on port ${port}.`);
});

let todos = [
    {
        id: 1,
        todo: "Handla mjölk",
        completed: false
    },
    {
        id: 2,
        todo: "Ring Karin",
        completed: true
    }
];

let id = 2;


// app.get("/", async (req, res) => {
//     res.status(200).json({
//         result: "All is well",
//         message: "Have a good day. Bye!"
//     });
// });


app.get("/todos", async (req, res) => {
    res.status(200).json(todos);
});

app.post("/todos", async (req, res) => {
    const todoText = req.body.todoText;
    id++;
    const todo = {
        id: id,
        todo: todoText,
        completed: false
    };

    todos.push(todo);
    res.status(201);
});


app.delete("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    todos = todos.filter(todoItem => todoItem.id !== id);
    res.status(200);
});

app.patch("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const completed = req.body.completed;

    todos.forEach(todo => {
        if(todo.id === id) {
            todo.completed = completed;
        }
    });
    res.status(201);
});