const express = require('express');
const morgan = require('morgan');
const port = 5000
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/', require("./controllers/authController"));

app.listen(port, () => {
    console.log(`Server up at http://localhost:${port}`);
})
