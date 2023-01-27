const express = require('express');
const bodyParser = require('body-parser')
require('./db/conn')
require('mongoose')
const jwt = require('jsonwebtoken')
// schema
const registermodel = require('./models/regisschema')
const app = express();
const hbs = require('hbs');
const bcrypt = require('bcryptjs')
const path = require('path');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 4000;
const auth = require('./middleware/auth');

// if using postman
app.use(express.json());
//if using middleware in programe
app.use(cookieParser());
// if using live sever on browser
app.use(bodyParser.urlencoded({ extended: false }));

// path
const staticpath = path.join(__dirname, '../public')
const view_path = path.join(__dirname, '../templates/views')
const partialthpath = path.join(__dirname, '../templates/partials')

app.use(express.static(staticpath))
app.set("view engine", "hbs")
app.set("views", view_path)
hbs.registerPartials(partialthpath)

app.get("/", (req, res) => {
    res.render("login")
})
app.get('/index', (req, res) => {
    res.render('index')
})
//demo page create cookie
// app.get('/secret', (req, res) => {
//     res.render('secret')
// })
// app.get('/logout', auth, (req, res) => {
//     try {
//         res.clearCookie('jwt')
//        //single logout
// req.user.tokens = req.user.tokens.filter((currelemrnt) => {
//     return currelemrnt.token === req.token
// })
// all device logout
//    req.user.tokens = [];
//     } catch (error) {
//         res.status(500).send(error)
//     }
// });
app.get('/weather', (req, res) => {
    res.render('weather')
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('*', (req, res) => {
    res.render('error')
})
app.post('/register', async (req, res) => {
    try {
        const passwd = await req.body.passwd;
        const conformpasswd = await req.body.conpasswd;
        if (passwd === conformpasswd) {
            const createuser = new registermodel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gmail: req.body.gmail,
                phonenumber: req.body.mobile,
                password: passwd,
                conformpassword: conformpasswd
            })
            const token = await createuser.generateAuthToken();
            // //    cookie
            // //res.cookie[name,value,[options<that is optional>]]
            res.cookie('jwt', token);
            const saved = await createuser.save()
            res.status(200).render('index');
        } else {
            res.send("incoreect password")
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post("/", async (req, res) => {
    try {
        const gmail = req.body.username;
        const password = req.body.password;
        if (!gmail || !password) {
            res.status(400).send({
                data: 'failed',
                error: 'please Enter user data'
            })
            return;
        }
        // if (!gmail) {
        //     res.status(400).send({
        //         data: 'failed',
        //         error: 'please Enter username'
        //     })

        // }
        // if (!password) {
        //     res.status(400).send({
        //         data: 'failed',
        //         error: 'please Enter password',
        //     })
        //     // res.render('error')
        //     // res.status(401).send('no user exists in db to update')
        // }

        const register = await registermodel.findOne({ gmail: gmail })
        //comapare password
        const isMatch = await bcrypt.compare(password, register.password);
        //token generate
        const token = await register.generateAuthToken();
        //cookie generate
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });
        if (isMatch) {
            res.status(201).render('index')
        }
    } catch (err) {
        res.status(400).render('error')
    }
})

app.listen(port, () => {
    console.log(`listening ${port} number`);
})
