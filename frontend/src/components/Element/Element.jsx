import { useSortable } from "@dnd-kit/sortable"
import axios from "axios"
import {CSS} from '@dnd-kit/utilities' 

export const Element = ({element, id}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ id: `task-${element.id}`, data: { type:'task', taskId: element.id, columnId: element.board_id } });


    const style = {
            transition,
            transform: CSS.Transform.toString(transform),
            opacity: isDragging ? 0.7 : 1
        }

    async function deleteElement(id){
        console.log(typeof id, id)
        await axios.delete('/api/deleteelement', {data: {id: element.id}})
    }

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="element">
        <h4>{element.title}</h4>
        <button onClick={() => deleteElement(element.id)}>Delete</button>
        </div>
  )
}