import express from 'express'

const app = express()

app.get('/', (req, res) => res.send('Hello Booloon'))


const port = 3031

app.listen(port, () => console.log(`Server ready on port http://127.0.0.1:${port}`))