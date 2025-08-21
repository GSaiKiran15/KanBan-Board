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
    const boards = await pool.query('select * from boards where parent_board_id=$1', [id])
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

app.post('/api/newproject', async( req, res) => {
    const {title} = req.body
    const response = await pool.query('insert into projects (title) values ($1)', [title])
})

app.post('/api/newtable', async(req, res) => {
    const {projectID, title, parent_board_id} = req.body
    await pool.query('insert into boards (project_id, title, parent_board_id) values ($1, $2, $3)', [projectID, title, parent_board_id])
})

app.post('/api/newelement', async(req, res)=>{
    const {title, subtitle, board_id} = req.body
    const result = await pool.query(
    'SELECT COUNT(*) FROM elements WHERE board_id = $1',
    [board_id]
    );
    const position = parseInt(result.rows[0].count) + 1;

    await pool.query(
    'INSERT INTO elements (title, subtitle, board_id, position) VALUES ($1, $2, $3, $4)',
    [title, subtitle, board_id, position]
    );
})

app.delete('/api/deleteboard', async(req, res) => {
    const {id} = req.body
    console.log(id);
    await pool.query('delete from boards where id = $1', [id])
})

app.delete('/api/deleteelement', async(req, res) => {
    const {id} = req.body
    console.log(id);
    await pool.query('delete from elements where id = $1', [id])
})

app.delete('/api/deleteproject', async (req, res) => {
    const {id} = req.body
    console.log(id);
    await pool.query('delete from projects where id = $1', [id])
})

app.listen(8000, (req, res) => {
    console.log('Server is running on PORT 8000.');
})