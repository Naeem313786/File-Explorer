require('dotenv').config();
const path=require('path')
const fs=require('fs')
const express=require('express')
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes')
const auth=require("./middleware.js")
const cookieParser = require("cookie-parser");

const app=express();
connectDB();
app.use(cookieParser());
app.use(express.json())
app.use(express.static("public"));
app.use('/api/auth',authRoutes)
app.get('/', (req, res)=>{
      res.status(200).sendFile(path.join(__dirname, 'public', 'HomePage.html'))
})
app.get('/Register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
})
app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
app.get('/files', (req, res) => {
   const folderPath=req.query.path;
   console.log(folderPath)
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to access folder" });
        }
        const list = files.map(item => ({
            name: item.name,
            isFolder: item.isDirectory(),
            fullPath: path.join(folderPath, item.name)
        }));
        res.json(list);
    });
});

app.get("/api/download", (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("File path required");
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    res.download(filePath); 
});
app.get('/home', auth, (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        path: "/"
    });
    res.redirect('/'); 
});

app.post('/api/create-folder', (req, res, next)=>{
     const {parentPath, folderName}=req.body;
     if(!parentPath || !folderName){
        return res.status(400).json({message: "Missing folder Name or parentPath"});
     }
     const newFolderPath=path.join(parentPath, folderName);
     if(fs.existsSync(newFolderPath)){
        return res.status(400).json({message:"Folder Already Exist"});
     }
     try {
        fs.mkdirSync(newFolderPath)
        res.status(200).json({message:"Folder Created Successfully"})
     } catch (error) {
        res.status(500).json({message:"Internal Server Error", error})
     }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));