import "./Board.css";
import {
  useSortable,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useState } from "react";
import { Card } from "../Card/Card";

export const Board = ({
  id,
  title,
  cards = [],
  onDelete,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onMoveCard,
  allBoards,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `col-${id}`, data: { type: "column", columnId: id } });
  const [cardTitle, setCardTitle] = useState("");
  const [cardSubTitle, setCardSubTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [cardData, setCardData] = useState(cards);
  useEffect(() => {
    setCardData(cards);
  }, [cards]);

  async function newCard() {
    await onAddCard?.(id, { title: cardTitle, subtitle: cardSubTitle });
    setShowForm(false);
    setCardTitle("");
    setCardSubTitle("");
  }

  const handleDeleteCard = useCallback(
    async (cardId) => {
      setCardData((prev) => prev.filter((c) => c.id !== cardId));
      onDeleteCard?.(cardId);
    },
    [onDeleteCard]
  );

  const handleEditCard = useCallback(
    async (cardId, editedTitle) => {
      setCardData((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, title: editedTitle } : c))
      );
      onEditCard?.(cardId, editedTitle);
    },
    [onEditCard]
  );

  async function deleteTable(id) {
    onDelete?.(id);
  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleMoveCard = useCallback(
    async (cardId, moveId) => {
      onMoveCard?.(cardId, moveId);
    },
    [onMoveCard]
  );

  return (
    <div ref={setNodeRef} style={style} className="kanban-column">
      <div className="column-header-draggable">
        <span>{title}</span>
        <div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              deleteTable(id);
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

      {/* This container is crucial for vertical scrolling */}
      <div className="column-tasks">
        <SortableContext
          items={cardData.map((c) => `task-${c.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {cardData.map((c) => (
            <Card
              key={c.id}
              card={c}
              columnId={id}
              boards={allBoards}
              onDeleteCard={handleDeleteCard}
              onEditCard={handleEditCard}
              onMoveCard={handleMoveCard}
              allBoards={allBoards}
            />
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
              <button className="add-btn-primary" onClick={() => newCard(id)}>
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
