import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());

app.get("/api/projects", async (req, res) => {
  const { rows } = await pool.query("select * from projects");
  res.json(rows);
});

app.post("/api/newProject", async (req, res) => {
  const title = (req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  try {
    const { rows } = await pool.query(
      "INSERT INTO projects (title) VALUES ($1) RETURNING *;",
      [title]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "project title already exists" });
    }
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/api/deleteProject", async (req, res) => {
  const id = Number(req.body?.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM projects WHERE id = $1",
      [id]
    );
    console.log(rowCount);
    if (rowCount === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(409).json({
        error:
          "Project has dependent rows (boards/cards). Delete children first or enable ON DELETE CASCADE.",
      });
    }
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

app.get("/api/boards/:id", async (req, res) => {
  const id = req.params.id;
  const boards = await pool.query("select * from boards where project_id=$1", [
    id,
  ]);
  const boardIds = boards.rows.map((b) => b.id);
  const elemsRes = await pool.query(
    "SELECT * FROM elements WHERE board_id = ANY($1)",
    [boardIds]
  );
  const elements = elemsRes.rows;
  const boardsWithItems = boards.rows.map((board) => ({
    ...board,
    items: elements.filter((el) => el.board_id === board.id),
  }));
  res.json(boardsWithItems);
});

app.post("/api/newBoard", async (req, res) => {
  const { title, project_id } = req.body;
  const { rows } = await pool.query(
    "insert into boards (title, project_id) values ($1, $2) returning *",
    [title, project_id]
  );
  console.log(rows[0]);
  res.json(rows[0]);
});

app.delete("/api/deleteBoard/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("delete from boards where id = $1", [id]);
  res.sendStatus(200);
});

app.post("/api/newCard", async (req, res) => {
  const { cardTitle, cardSubTitle, boardId } = req.body;
  const result = await pool.query(
    "SELECT COUNT(*) FROM elements WHERE board_id = $1",
    [boardId]
  );
  const position = parseInt(result.rows[0].count) + 1;

  const { rows } = await pool.query(
    "INSERT INTO elements (title, subtitle, board_id, position) VALUES ($1, $2, $3, $4) returning *",
    [cardTitle, cardSubTitle, boardId, position]
  );
  console.log(rows[0]);
  res.json(rows[0]);
});

app.patch("/api/editCard/:id", async (req, res) => {
  const cardId = req.params.id;
  const { editedTitle, editedSubTitle } = req.body;
  const { rows } = await pool.query(
    "update elements set title=$1 where id=$2 returning id, title",
    [editedTitle, cardId]
  );
  res.sendStatus(200);
});

app.delete("/api/deleteCard/:id", async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("delete from elements where id = $1", [id]);
  res.sendStatus(200);
});

app.listen(8000, (req, res) => {
  console.log("Server is running on PORT 8000.");
});
