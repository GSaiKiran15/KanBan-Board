import { useSortable } from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities' 

export const Card = ({card, onDeleteCard}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ id: `task-${card.id}`, data: { type:'task', taskId: card.id, columnId: card.board_id } });

    const style = {
            transition,
            transform: CSS.Transform.toString(transform),
            opacity: isDragging ? 0.7 : 1
        }

    async function deleteCard(id){
        onDeleteCard?.(id)
    }

 return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="task-card">
      <p>{card.title}</p>
      <button
        type="button"
        className="delete-btn delete-btn-card"
        onPointerDown={(e) => e.stopPropagation()} // This is great for preventing drag!
        onClick={(e) => {
          e.stopPropagation();
          deleteCard(card.id);
        }}
      >
        ✕
      </button>
    </div>
  );
}