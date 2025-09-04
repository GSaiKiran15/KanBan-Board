import express from 'express'
import pool from './db.js'

const app = express()

app.use(express.json())

app.get('/api/projects', async (req, res) => {
    const {rows} = await pool.query('select * from projects')
    res.json(rows)
})

app.post('/api/newProject', async( req, res) => {
    const {title} = req.body
    await pool.query('insert into projects (title) values ($1)', [title])
})

app.delete('/api/deleteProject', async (req, res) => {
    const {id} = req.body
    await pool.query('delete from projects where id = $1', [id])
})

app.get('/api/boards/:id', async (req, res) => {
    const id = req.params.id
    const boards = await pool.query('select * from boards where project_id=$1', [id])
    const boardIds = boards.rows.map(b => b.id);
    const elemsRes = await pool.query(
    'SELECT * FROM elements WHERE board_id = ANY($1)',
    [boardIds]
    );
    const elements = elemsRes.rows;
    const boardsWithItems = boards.rows.map(board => ({
    ...board,
    items: elements.filter(el => el.board_id === board.id)
    }));
      res.json(boardsWithItems);
    })

app.post('/api/newBoard', async(req, res) => {
    const {title, project_id} = req.body
    const {rows} = await pool.query('insert into boards (title, project_id) values ($1, $2) returning *', [title, project_id])
})

app.delete('/api/deleteBoard', async(req, res) => {
    const {id} = req.body
    await pool.query('delete from boards where id = $1', [id])
})

app.post('/api/newCard', async(req, res)=>{
    const {cardTitle, cardSubTitle, boardId} = req.body
    const result = await pool.query(
    'SELECT COUNT(*) FROM elements WHERE board_id = $1',
    [boardId]
    );
    const position = parseInt(result.rows[0].count) + 1;

    await pool.query(
    'INSERT INTO elements (title, subtitle, board_id, position) VALUES ($1, $2, $3, $4)',
    [cardTitle, cardSubTitle, boardId, position]
    );
})

app.delete('/api/deleteCard', async(req, res) => {
    const {id} = req.body
    await pool.query('delete from elements where id = $1', [id])
})

app.listen(8000, (req, res) => {
    console.log('Server is running on PORT 8000.');
})