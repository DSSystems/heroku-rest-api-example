const express = require("express")
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 3000

const posts = require("./routes/posts.js")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use(posts)

app.get("/", (req, res) => {
    res.json({
        success: true,
        allowed_requests: [
            { 
                method: "GET", 
                path: "/posts", 
                description: "Lists all the posts."
            },
            {
                method: "POST",
                path: "/posts",
                description: "Adds a new post.", 
                body: [{param_name: "code", type: "String"}, {param_name: "title", type: "String"}, {param_name: "abstract", type: "String"}]
            },
            {
                method: "PATCH", 
                path: "/posts",
                description: "Edits an existing post. You must provide an existing code in the body request", 
                body: [{param_name: "code", type: "String"}, {param_name: "title", type: "String"}, {param_name: "abstract", type: "String"}]
            },
            {
                method: "DELETE",
                path: "/posts",
                description: "Deletes a post with a given code provided in the body.",
                body: [{param_name: "code", type: "String"}]
            }
        ]
    })
})

app.listen(PORT, () => {
    console.log("Server is up and listening on: " + PORT)
})