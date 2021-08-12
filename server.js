const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var uplodedImages = [];

//set strorage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, changeNameOfFile(file))
    }
});

// If want more image you can adding another if field
let changeNameOfFile = (file) => {
    if (file.fieldname == 'albumPic') {
        var newFileName = Date.now() + path.extname(file.originalname)
        let albumPic = { "albumPic": newFileName }
        uplodedImages.push(albumPic)
        return newFileName
    } else if (file.fieldname == 'coverPic') {
        var newFileName = Date.now() + path.extname(file.originalname)
        let coverPic = { "coverPic": newFileName }
        uplodedImages.push(coverPic)
        return newFileName
    } else if (file.fieldname == 'jsonFiles') {
        return file.originalname
    } else {
        throw new Error("Please fill correctly")
    }
}

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|json/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('error: image only')
    }
}
//init upload
const upload = multer({
    storage: storage,
    limits: { fieldSize: 100000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

app.post("/upload", (req, res) => {
    new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (!err) {
                resolve()
            }
        })
    }).then(() => {
        let tempForUse = uplodedImages
        uplodedImages = []
        return res.send({ data: tempForUse })
    })

})

app.listen(9000, () => {
    console.log("running at port : 9000")
})