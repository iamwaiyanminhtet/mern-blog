import express from "express"

const app = express();

app.get('/', (req, res, next) => {
    res.json({greeting : "hello"})
})

app.listen(3000, () => {
    console.log('server running at port 3000')
})