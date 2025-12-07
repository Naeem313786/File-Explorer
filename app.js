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
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
app.get('/Register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
})
app.get('/files', (req, res) => {
   const folderPath=req.query.path;
   console.log(folderPath)
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to access folder" });
        }

        const list = files.map(item => ({
            // name: item.name,
            // type: item.isDirectory() ? "folder" : "file"
            name: item.name,
            isFolder: item.isDirectory(),
            fullPath: path.join(folderPath, item.name)
        }));
        res.json(list);
    });
});
app.get('/home', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get("/api/download", (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("File path required");
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    res.download(filePath); 
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));