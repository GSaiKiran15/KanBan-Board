import { useSortable } from "@dnd-kit/sortable"
import axios from "axios"
import {CSS} from '@dnd-kit/utilities' 

export const Card = ({card}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ id: `task-${card.id}`, data: { type:'task', taskId: card.id, columnId: card.board_id } });


    const style = {
            transition,
            transform: CSS.Transform.toString(transform),
            opacity: isDragging ? 0.7 : 1
        }

    async function deleteCard(id){
        await axios.delete('/api/deleteCard', {data: {id}})
    }

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="card">
        <h4>{card.title}</h4>
        <button
  type="button"
  onPointerDown={(e) => e.stopPropagation()} // prevent drag from starting
  onClick={(e) => {
    e.stopPropagation();                     // prevent bubbling to draggable
    deleteCard(card.id);
  }}
>
  Delete
</button>

        </div>
  )
}