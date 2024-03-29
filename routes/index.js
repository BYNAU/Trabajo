const express = require("express")
const router = express.Router()
const dbConn = require("../bd.js")
const Producto = require("../models/Products.js")
const Users = require("../models/Users.js")
const Favoritos = require("../models/Favoritos.js")

router.get("/",(req,res) => {
    res.render('index')
})

router.get("/login",(req,res) => {
    res.render('login')
})

router.post("/login", async (req,res) => {
    const usuarioEncontrado = await Users.findOne({nombre:req.body.nombre })
    console.log(usuarioEncontrado.nombre)
    if (usuarioEncontrado.nombre == "admin"){
        res.redirect("/admin")
    }else if (usuarioEncontrado){
        res.redirect(`/inicio/${req.body.nombre}`)
    } else {
        res.redirect("/register")
    }
})

router.get("/register",(req,res) => {
    res.render('register')
})

router.post("/register", async (req,res) => {
    console.log(req.body)
    
    const encontrado = await Users.findOne({nombre:req.body.nombre })
    if (encontrado) {
        res.redirect("/register")
    } else {
        const newUser = new Users({
            nombre:req.body.nombre,
            contra:req.body.contra,
            correo:req.body.correo
        })
        await newUser.save()
        res.redirect("/login")
    }

})

router.get("/inicio/:nombre", (req,res) => {

    const nombre = req.params.nombre
    res.render('welcome',{nombre})
})

router.post("/inicio/:nombre", async (req,res) => {
    
    console.log(req.body)
    const nombre = req.params.nombre
    const listaFavoritos = await Favoritos.find({})
    res.render('productos',{nombre,listaFavoritos})
})

router.get("/productos/:nombre", async (req,res) => {

    const listaProductos = await Producto.find({})
    const nombre = req.params.nombre
    res.render('anadirProducto',{nombre, listaProductos})
})

router.post("/productos/:nombre", async (req,res) => {
    const encontrar = await Producto.findOne({nombre:req.body.nombre})
    if(encontrar){
        

        const newFav = new Favoritos({
            nombre:req.body.nombre,
            foto: encontrar.foto,
            descripcion:encontrar.descripcion,
            favoritos:[req.params.nombre]
        })
        await newFav.save()
        res.redirect("/")
    } else {
        const newFav = new Favoritos({
            nombre:req.body.nombre,
            foto: "",
            descripcion:"",
            favoritos:[]
        })
        await newFav.save()
    }
    
    const nombre = req.params.nombre
    res.render('anadirProducto',{nombre})
    
})

router.get("/admin",(req,res) => {
    res.render('welcomeAdmin')
})

router.get("/productos", async (req,res) => {
    const mostrarProductos = await Producto.find({})
    res.render('mostrar', {mostrarProductos})
})

router.get("/usuarios", async (req,res) => {
    const mostrarUser = await Users.find({})
    res.render('usuarios', {mostrarUser})
})

router.post("/eliminar", async (req,res) => {
    const nombree = req.body.nombre
    const eliminar = await Producto.findOneAndDelete({nombre: nombree})
} )

router.get("/modificar", async (req,res) => {
    res.render("modificar")
} )

router.post("/modificar", async (req,res) => {
    console.log(req.body)
    const nombree = req.body.nombre
    await Producto.findOneAndUpdate({nombre: nombree},{
        nombre: nombree,
        foto: req.body.foto,
        descripcion: req.body.descripcion
    })
    res.redirect("/inicio/:nombre")
    
} )

router.get("/anadir", async (req,res) => {
    
    res.render("newproduct")
} )

router.post("/anadir", async (req,res) => {
    const newPro = new Producto({
        nombre:req.body.nombre,
        foto:req.body.foto,
        descripcion:req.body.descripcion
    })
    await newPro.save()
    res.render("newproduct")
} )

module.exports = router