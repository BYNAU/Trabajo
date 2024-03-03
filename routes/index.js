const express = require("express")
const router = express.Router()
const dbConn = require("../bd.js")
const Producto = require("../models/Products.js")
const Users = require("../models/Users.js")
const Favoritos = require("../models/Favoritos.js")

router.get("/",(req,res) => {
    res.send('a')
})



module.exports = router