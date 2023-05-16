const express = require('express')
const cors = require('cors');
const User = require('./model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs')
const Post = require('./model/Post')

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

mongoose.connect('', () => {
    console.log('connect to db');
})

const salt = bcrypt.genSaltSync(10)
const secret = 'gsdhklzbvdlvslkvgbcjhbvpiajsksdgvvchjdghj'

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userDoc = await User.findOne({ username })
    const passok = bcrypt.compareSync(password, userDoc.password)
    if (passok) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username
            })
        })
    } else {
        res.status(400).json('wrong credentials')
    }

});

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err
        res.json(info)
    })
    res.json(req.cookies)
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)

    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err
        const { title, summary, content } = req.body
        const newPost = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })

        res.json(newPost);
    })


})

app.get('/post', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    res.json(posts)
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params

    const singlePost = await Post.findById(id).populate('author', ['username'])
    res.json(singlePost)
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null 
    if (req.file) {
        const { originalname, path } = req.file
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        newPath = path + '.' + ext
        fs.renameSync(path, newPath)
    }

    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err
        const { title, summary, content, id } = req.body
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if(!isAuthor) {
           return res.status(400).json('your are not author')
        } 
       await postDoc.update({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        })

        res.json(postDoc);
    })


})

app.listen(5000, () => {
    console.log('Running')
});