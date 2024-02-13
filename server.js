const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => res.send('Servidor funcionando!'));

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, secret, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401); // No hay token, no autorizado
    }
};


app.get('/cats', (req, res) => {
  res.sendFile(__dirname + '/data/cats/cat.json');
});


app.get('/sell/publish', (req, res) => {
  res.sendFile(__dirname + '/data/sell/publish.json');
});


app.get('/cats_products/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  res.sendFile(__dirname + `/data/cats_products/${categoryId}`);
});


app.get('/products/:productId', (req, res) => {
  const { productId } = req.params;
  res.sendFile(__dirname + `/data/products/${productId}.json`);
});


app.get('/products_comments/:productId', (req, res) => {
  const { productId } = req.params;
  res.sendFile(__dirname + `/data/products_comments/${productId}.json`);
});


app.get('/user_cart/:userId', verifyToken, (req, res) => {
  const { userId } = req.params;
  res.sendFile(__dirname + `/data/user_cart/${userId}.json`);
});


app.get('/cart/buy', verifyToken, (req, res) => {
  res.sendFile(__dirname + '/data/cart/buy.json');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function verifyUser(username, password) {

    const users = {
        "admin": "password123",
        // otros usuarios...
    };
    
    return users[username] === password;
}


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (verifyUser(username, password)) {
        // Usuario autenticado correctamente
        const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
        res.json({ token });
    } else {
        // Autenticación fallida
        res.status(401).send('Credenciales incorrectas');
    }
});

app.post('/validate-token', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token válido' });
});





app.get('/protected', verifyToken, (req, res) => {
    jwt.verify(req.token, secret, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Acceso concedido',
                authData
            });
        }
    });
});

app.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));