const express = require('express')
const mysql = require('mysql')
const posts = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
})

function getConnection() {
    return pool
}

posts.get('/posts', (req, res) => {
    const connection = getConnection()
    const createTableQueryString = "CREATE TABLE posts (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(255), title VARCHAR(255), abstract TEXT CHARACTER SET utf8mb4)"

    connection.query(createTableQueryString, (error, result) => {
        if (error) {
            if (error.code != "ER_TABLE_EXISTS_ERROR") {
                res.json({
                    success: false,
                    error: error.message,
                    code: error.code
                })
                return
            }
        }

        const queryString = "SELECT * FROM posts"

        connection.query(queryString, (error, rows, fields) => {
            if (error) {
                res.json({
                    success: false,
                    error: error.message,
                    code: error.code
                })
                return
            }
    
            const posts = rows.map(((row) => {
                return {
                    id: row.id,
                    code: row.code, 
                    title: row.title,
                    abstract: row.abstract
                }
            }))
    
            res.json({
                success: true,
                posts: posts
            })
        })
    })
})

posts.post('/posts', (req, res) => {
    const connection = getConnection()
    const createTableQueryString = "CREATE TABLE posts (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(255), title VARCHAR(255), abstract TEXT CHARACTER SET utf8mb4)"

    connection.query(createTableQueryString, (error, result) => {
        if (error) {
            if (error.code != "ER_TABLE_EXISTS_ERROR") {
                res.json({
                    success: false,
                    error: error.message,
                    code: error.code
                })
                return
            }
        }

        console.log(req)
        const code = req.body.code
        const title = req.body.title
        const abstract = req.body.abstract

        const queryString = "INSERT INTO posts (code, title, abstract) VALUES (?, ?, ?)"

        connection.query(queryString, [code, title, abstract], (error, result, fields) => {
            if (error) {
                console.log("Failed to insert post: " + error)
                res.json({
                    success: false,
                    error: error.message
                })
                return
            }

            console.log("Inserted a new post with id: " + result.insertId)

            res.json({
                success: true,
                post: {
                    id: result.insertId,
                    code: code,
                    title: title,
                    abstract: abstract
                }
            })
        })
    })
})

posts.delete('/posts', (req, res) => {
    const connection = getConnection()

    if (req.body.code) {
        const queryString = "DELETE FROM posts WHERE code = ?"

        connection.query(queryString, [req.body.code], (error, result) => {
            if (error) {
                res.json({
                    success: false,
                    error: error.message,
                    code: error.code
                })
                return
            }

            res.json({
                success: true
            })
        })
    } else if (req.body.id) {
        const queryString = "DELETE FROM posts WHERE id = ?"

        connection.query(queryString, [req.body.id], (error, result) => {
            if (error) {
                res.json({
                    success: false,
                    error: error.message,
                    code: error.code
                })
                return
            }

            res.json({
                success: true
            })
        })
    } else {
        res.json({
            success: false,
            error: "Invalid code/id.",
            code: "INVALID_DATA"
        })
    }
})

posts.patch('/posts', (req, res) => {
    if (!req.body.code) {
        res.json({
            success: false,
            error: "Invalid code.",
            code: "INVALID_DATA"
        })
        return
    }

    const queryString = "UPDATE posts SET title = ?, abstract = ? WHERE code = ?"

    const connection = getConnection()

    connection.query(queryString, [req.body.title, req.body.abstract, req.body.code], (error, result) => {
        if (error) {
            res.json({
                success: false,
                error: error.message,
                code: error.code
            })
            return
        }

        res.json({
            success: true
        })
    })
})

module.exports = posts