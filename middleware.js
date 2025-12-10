const jwt = require('jsonwebtoken');
const path=require('path')
function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).sendFile(path.join(__dirname, 'public', 'session.html'))
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).sendFile(path.join(__dirname, 'public', 'expire.html'))
    }
}
module.exports = auth;
