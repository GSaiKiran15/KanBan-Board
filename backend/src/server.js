import express from 'express'
import pool from './db.js'

const app = express()

app.use(express.json())

app.get('/api/projects', async (req, res) => {
    const {rows} = await pool.query('select * from projects')
    res.json(rows)
})

app.get('/api/boards/:id', async (req, res) => {
    const id = req.params.id
    const {rows} = await pool.query('select * from boards where parent_board_id=$1', [id])
    res.json(rows)
})

app.listen(8000, (req, res) => {
    console.log('Server is running on PORT 8000.');
})