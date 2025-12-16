import express from "express";
import pool from "./db.js";
import admin from "firebase-admin";
import cors from "cors";
import fs from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Using Firebase credentials from environment variable");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error.message);
    process.exit(1);
  }
} else if (fs.existsSync("./credentials.json")) {
  serviceAccount = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
  console.log("Using Firebase credentials from credentials.json file");
} else {
  console.error("ERROR: Firebase credentials not found!");
  console.error(
    "Set FIREBASE_SERVICE_ACCOUNT environment variable or provide credentials.json"
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL ||
    "http://localhost:5173" ||
    "https://kanban-backend-ahbb.onrender.com/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.post("/api/newUser", async (req, res) => {
  const { uid, email, name } = req.body;
  if (!uid || !email || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const { rows } = await pool.query(
      "insert into users (id, email, display_name) values($1, $2, $3) returning *",
      [uid, email, name]
    );
    res.json(rows);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "User already exists" });
    }
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects", authenticate, async (req, res) => {
  const uid = req.user.uid;
  const { rows } = await pool.query(
    "select * from projects where owner_id=$1",
    [uid]
  );
  res.json(rows);
});

app.post("/api/newProject", authenticate, async (req, res) => {
  const title = (req.body?.title ?? "").trim();
  const uid = req.user.uid;
  if (!title) return res.status(400).json({ error: "title is required" });

  try {
    const { rows } = await pool.query(
      "INSERT INTO projects (title, owner_id) VALUES ($1, $2) RETURNING *;",
      [title, uid]
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

app.delete("/api/deleteProject", authenticate, async (req, res) => {
  const uid = req.user.uid;
  const id = Number(req.body?.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM projects WHERE id = $1 and owner_id = $2",
      [id, uid]
    );
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

app.get("/api/boards/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const uid = req.user.uid;
  const { rows } = await pool.query(
    "select exists (select 1 from projects where id=$1 and owner_id = $2)",
    [id, uid]
  );

  const ownsProject = rows[0].exists;
  if (!ownsProject) {
    return res.status(403).json({
      error: "Unauthorized: You do not have access to this project",
    });
  }
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

app.post("/api/newBoard", authenticate, async (req, res) => {
  const { title, project_id } = req.body;
  const uid = req.user.uid;
  const isOwner = await pool.query(
    "select exists (select 1 from projects where id = $1 and owner_id = $2)",
    [project_id, uid]
  );
  if (!isOwner.rows[0].exists) {
    return res
      .status(403)
      .json({ error: "Unauthorized: You do not own this project" });
  }
  const { rows } = await pool.query(
    "insert into boards (title, project_id) values ($1, $2) returning *",
    [title, project_id]
  );
  res.json(rows[0]);
});

app.delete("/api/deleteBoard/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const uid = req.user.uid;
  const isOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [id]
  );
  if (isOwner.rows[0].owner_id !== uid) {
    return res
      .status(403)
      .json({ error: "Unauthorized: You do not own this board" });
  }
  await pool.query("delete from boards where id = $1", [id]);
  res.sendStatus(200);
});

app.post("/api/newCard", authenticate, async (req, res) => {
  const { cardTitle, cardSubTitle, boardId } = req.body;
  const uid = req.user.uid;
  const isOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [boardId]
  );
  if (isOwner.rows[0].owner_id !== uid) {
    return res.status(403).json({
      error:
        "Unauthorized: You do not have permission to add cards to this board",
    });
  }
  const result = await pool.query(
    "SELECT COUNT(*) FROM elements WHERE board_id = $1",
    [boardId]
  );
  const position = parseInt(result.rows[0].count) + 1;
  const { rows } = await pool.query(
    "INSERT INTO elements (title, subtitle, board_id, position) VALUES ($1, $2, $3, $4) returning *",
    [cardTitle, cardSubTitle, boardId, position]
  );
  res.json(rows[0]);
});

app.patch("/api/editCard/:id", authenticate, async (req, res) => {
  const cardId = req.params.id;
  const { editedTitle, editedSubTitle, boardId } = req.body;
  const uid = req.user.uid;
  const isOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [boardId]
  );
  if (isOwner.rows[0].owner_id !== uid) {
    return res.status(403).json({
      error: "Unauthorized: You do not have permission to edit this card",
    });
  }
  const { rows } = await pool.query(
    "update elements set title=$1 where id=$2 returning id, title",
    [editedTitle, cardId]
  );
  res.sendStatus(200);
});

app.delete("/api/deleteCard/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const uid = req.user.uid;
  const { boardId } = req.body;
  const isOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [boardId]
  );
  if (isOwner.rows[0].owner_id !== uid) {
    return res.status(403).json({
      error: "Unauthorized: You do not have permission to delete this card",
    });
  }
  await pool.query("delete from elements where id = $1", [id]);
  res.sendStatus(200);
});

app.patch("/api/moveCard/:id", authenticate, async (req, res) => {
  const cardId = req.params.id;
  const { destinationBoardId, boardId } = req.body;
  const uid = req.user.uid;
  const isOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [boardId]
  );
  const destinationOwner = await pool.query(
    "select (select owner_id from projects where id = (select project_id from boards where id = $1))",
    [destinationBoardId]
  );
  if (
    destinationOwner.rows[0].owner_id !== uid ||
    isOwner.rows[0].owner_id !== uid
  ) {
    return res.status(403).json({
      error: "Unauthorized: You do not have permission to move this card",
    });
  }
  const { rows } = await pool.query(
    "UPDATE elements SET board_id = $1 WHERE id = $2 RETURNING *",
    [destinationBoardId, cardId]
  );

  res.json(rows[0]);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(", ")}`);
});
