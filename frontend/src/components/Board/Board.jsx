import "./Board.css";
import { useState } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../Task/Task"; // renamed from Element

export const Board = ({ id, title, elements = [] }) => {
  const columnSortable = useSortable({
    id: `col-${id}`,                               // ✅ prefixed id
    data: { type: "column", columnId: id },
  });

  const { setNodeRef, attributes, listeners, transform, transition } = columnSortable;

  const style = { transform: CSS.Transform.toString(transform), transition };

  // Local state for render; real state moves are handled in DndContext onDragEnd
  const [items] = useState(elements);

  return (
    <div ref={setNodeRef} style={style} className="board">
      <div className="column-header">
        <span className="boardTitle">{title}</span>
        {/* drag handle for the column */}
        <button className="dragHandle" {...attributes} {...listeners} aria-label="Drag column">⠿</button>
      </div>

      <SortableContext
        items={items.map((t) => `task-${t.id}`)}     // ✅ ids only
        strategy={verticalListSortingStrategy}       // ✅ vertical for cards
      >
        <div className="boardItems">
          {items.map((t) => (
            <Task key={t.id} id={t.id} columnId={id} title={t.title} />
          ))}
        </div>
      </SortableContext>

      <button>Delete</button>
    </div>
  );
};
