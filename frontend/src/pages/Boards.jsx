import "../App.css";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "../components/Column/Column";
import "./Boards.css";
import BoardContext from "../contexts/BoardContext";

const colKey = (id) => `col-${id}`;
const taskKey = (id) => `task-${id}`;

export default function Boards() {
  const [boards, setBoards] = useState(useLoaderData() ?? []);
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;
  const projectTitle = state?.title ?? "My Tasks";

  const onDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id === over.id) return;

    const a = active.data?.current;
    const o = over.data?.current;
    if (a?.type === "column" && o?.type === "column") {
      setBoards((prev) => {
        const ids = prev.map((b) => colKey(b.id));
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    if (a?.type === "task") {
      setBoards((prev) => {
        const next = prev.map((b) => ({ ...b, items: [...(b.items || [])] }));

        const fromCol = next.find((b) => b.id === a.columnId);
        if (!fromCol) return prev;

        const fromIds = fromCol.items.map((t) => taskKey(t.id));
        const oldIndex = fromIds.indexOf(active.id);
        if (oldIndex === -1) return prev;

        if (o?.type === "task" && o.columnId === a.columnId) {
          const toIds = fromCol.items.map((t) => taskKey(t.id));
          const newIndex = toIds.indexOf(over.id);
          if (newIndex === -1 || newIndex === oldIndex) return prev;
          fromCol.items = arrayMove(fromCol.items, oldIndex, newIndex);
          return next;
        }

        const [moved] = fromCol.items.splice(oldIndex, 1);
        let toCol = null;
        if (o?.type === "task") {
          toCol = next.find((b) => b.id === o.columnId);
        } else if (o?.type === "column") {
          toCol = next.find((b) => b.id === o.columnId);
        }
        if (!toCol) {
          fromCol.items.splice(oldIndex, 0, moved);
          return prev;
        }

        let insertIndex = toCol.items.length;
        if (o?.type === "task") {
          const toIds = toCol.items.map((t) => taskKey(t.id));
          const idx = toIds.indexOf(over.id);
          insertIndex = idx === -1 ? toCol.items.length : idx;
        }

        moved.board_id = toCol.id;
        toCol.items.splice(insertIndex, 0, moved);
        return next;
      });
    }
  };

  const boardContextValue = {
    boards,
    setBoards,
  };

  return (
    <BoardContext.Provider value={boardContextValue}>
      <div className="boards-page-container">
        <header className="boards-header">
          <h1>{projectTitle}</h1>
        </header>
        <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <Column boards={boards} setBoards={setBoards} id={id} />
        </DndContext>
      </div>
    </BoardContext.Provider>
  );
}
