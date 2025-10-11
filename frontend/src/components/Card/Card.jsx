// Card.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Card = ({ card, columnId, onDeleteCard }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${card.id}`, // must match Board’s SortableContext items
    data: { type: "task", taskId: card.id, columnId }, // explicit columnId
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="task-card"
    >
      <p>{card.title}</p>
      <button
        type="button"
        className="delete-btn delete-btn-card"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDeleteCard?.(card.id);
        }}
      >
        ✕
      </button>
    </div>
  );
};
