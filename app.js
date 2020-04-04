const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/public')));  
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-'+Date.now()+path.extname(file.originalname))
    }
})

//Init Uload
const upload = multer({
    storage: storage,
    limits:{fileSize: 3000000},
    fileFilter: function(req,file,cb){
        //put validation here
        // checkFileType(file,cb);

    }
}).single('myimage');


function checkFileType(file,cb){
    //Allow extensions
    const filetypes= /jpeg|jpg|png|svg|gif/;
    //check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase);
    //Check MimeTypes
    const mimetype = filetypes.test(file.minetype);
    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Images Only');
    }
}

app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{msg:err})
        }else{
            console.log(req.file);
            res.send('test');
        }
    })
})



const Port = process.env.PORT || 5000;


app.listen(Port,()=>console.log(`Server is running on Port ${Port}.`));