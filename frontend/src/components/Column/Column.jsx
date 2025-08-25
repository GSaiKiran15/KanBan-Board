import "./Column.css";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Board } from "../Board/Board";

export const Column = ({ boards }) => {
  return (
    <div className="column">
      <SortableContext
        items={boards.map((b) => `col-${b.id}`)}          // ✅ ids only
        strategy={horizontalListSortingStrategy}
      >
        {boards.map((b) => (
          <Board key={b.id} id={b.id} title={b.title} elements={b.items} />
        ))}
      </SortableContext>
    </div>
  );
};
