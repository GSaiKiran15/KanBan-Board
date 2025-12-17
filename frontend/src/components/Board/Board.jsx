import "./Board.css";
import {
  useSortable,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Card } from "../Card/Card";
import { useBoardContext } from "../../contexts/BoardContext";
import axios from "../../utils/api.js";
import useUser from "../../useUser";

export const Board = ({ id, title, cards = [] }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `col-${id}`, data: { type: "column", columnId: id } });
  const [cardTitle, setCardTitle] = useState("");
  const [cardSubTitle, setCardSubTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { setBoards } = useBoardContext();
  const { user, isLoading } = useUser();
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} className="kanban-column">
      <div className="column-header-draggable">
        <span>{title}</span>
        <div>
          <button
            onPointerDown={async (e) => {
              e.stopPropagation();
              setBoards((prevBoards) =>
                prevBoards.filter((board) => board.id !== id)
              );
              try {
                if (isLoading || !user) {
                  return;
                }
                const token = await user.getIdToken();
                await axios.delete(`/api/deleteBoard/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
              } catch (error) {
                return error;
              }
            }}
            className="delete-btn"
          >
            ✕
          </button>
          <button
            className="drag-handle"
            {...attributes}
            {...listeners}
            aria-label="Drag column"
          >
            ⠿
          </button>
        </div>
      </div>

      <div className="column-tasks">
        <SortableContext
          items={cards.map((c) => `task-${c.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((c) => (
            <Card key={c.id} card={c} columnId={id} />
          ))}
        </SortableContext>

        {showForm ? (
          <div className="add-item-form">
            <input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              required
            />

            <div className="form-actions">
              <button
                className="add-btn-primary"
                onClick={async () => {
                  if (!cardTitle.trim()) return;
                  try {
                    if (isLoading || !user) {
                      return;
                    }
                    const token = await user.getIdToken();
                    const response = await axios.post(
                      "/api/newCard",
                      {
                        cardTitle,
                        cardSubTitle,
                        boardId: id,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const realCard = response.data;

                    setBoards((prevBoards) =>
                      prevBoards.map((board) =>
                        board.id === id
                          ? {
                              ...board,
                              items: [...(board.items ?? []), realCard],
                            }
                          : board
                      )
                    );

                    setShowForm(false);
                    setCardTitle("");
                    setCardSubTitle("");
                  } catch (error) {
                    return error;
                  }
                }}
              >
                Add Card
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
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
};
