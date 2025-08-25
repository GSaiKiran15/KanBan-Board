import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Task = ({ id, columnId, title }) => {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: `task-${id}`,                    // ✅ prefixed id
    data: { type: "task", taskId: id, columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="card" style={style} {...attributes} {...listeners}>
      <h4 className="element">{title}</h4>
      <button /* onClick={() => deleteElement(id)} */>Delete</button>
    </div>
  );
};
