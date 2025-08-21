import './Board.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Element } from '../Element/Element'

export const Board = ({id, title, elements}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className='board'>
        {title}
        <Element element={elements}/>
        <button>Delete</button>
        </div>
  )
}