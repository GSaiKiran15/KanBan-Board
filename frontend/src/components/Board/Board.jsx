import './Board.css'
import { useSortable, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Element } from '../Element/Element'
import axios from 'axios'

export const Board = ({id, title, elements = []}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: `col-${id}`, data: { type:'column', columnId:id } });

    async function addTask() {
      const {rows} = axios.post('api/newTask', {})
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

return (
    <div ref={setNodeRef} style={style} className="board">
      <div className="column-header">
        <p>{title}</p>
        {/* 🔒 Column drag handle only */}
        <button className="dragHandle" {...attributes} {...listeners} aria-label="Drag column">⠿</button>
      </div>

      {/* ✅ IDs-only list for tasks (vertical) */}
     <SortableContext
  items={elements.map(e => `task-${e.id}`)}
  strategy={verticalListSortingStrategy}
>
  {elements.map(e => <Element key={e.id} element={e} />)}
</SortableContext>
      <button id='addTask'>+</button>
      <button>Delete</button>
    </div>
  );

  // return (
  //   <div ref={setNodeRef} {...attributes} {...listeners} style={style} className='board'>
  //       <h3>{title}</h3>
  //       <SortableContext items={elements.map(e => `task-${e.id}`)} strategy={verticalListSortingStrategy}> 
  //         {elements.map((element) => (
  //           <Element element={element}/>
  //         ))}
  //       </SortableContext>
  //       <button>Delete</button>
  //       </div>
  // )
}