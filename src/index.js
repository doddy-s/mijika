const express = require('express');
const path = require('path')
const publicRoutes = require('./routes/public.route');
const htmxRoutes = require('./routes/htmx.route');
const { handleError } = require('./middlewares/handleError');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.use('/htmx', htmxRoutes)
app.use('/', publicRoutes)
app.use(handleError())

app.listen(port, () => console.log(`Mijika app listening on port ${port}!`));
