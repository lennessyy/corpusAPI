require('module-alias/register')
require('dotenv').config()

const express = require('express')
const routes = require('@routes')

const PORT = process.env.PORT || 5000

const app = express()
app.use(routes);

app.listen(PORT, ()=>console.log(`App listening on port ${PORT}`));