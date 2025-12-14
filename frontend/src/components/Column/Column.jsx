import "./Column.css";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Board } from "../Board/Board";
import axios from "axios";
import { useState } from "react";
import { useBoardContext } from "../../contexts/BoardContext";
import useUser from "../../useUser";

export const Column = ({ id }) => {
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { boards, setBoards } = useBoardContext();
  const { user, isLoading } = useUser();

  async function handleAddBoard(id) {
    if (!user) {
      return;
    }
    const token = await user.getIdToken();
    const response = await axios.post(
      "/api/newBoard",
      {
        title,
        parent_board_id: id,
        project_id: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBoards((prev) => [...prev, response.data]);
    setShowForm(false);
  }

  return (
    <div className="kanban-board">
      <SortableContext
        items={boards.map((b) => `col-${b.id}`)}
        strategy={horizontalListSortingStrategy}
      >
        {boards.map((b) => (
          <Board key={b.id} id={b.id} title={b.title} cards={b.items ?? []} />
        ))}
      </SortableContext>

      {showForm ? (
        <div className="add-item-form kanban-column">
          {" "}
          {/* Reuse column style for form container */}
          <input
            placeholder="New column title..."
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="form-actions">
            <button
              className="add-btn-primary"
              onClick={() => handleAddBoard(id)}
            >
              Add List
            </button>
            <button
              className="add-btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button className="add-column-btn" onClick={() => setShowForm(true)}>
            + Add Another List
          </button>
        </div>
      )}
    </div>
  );
};
