import './Board.css'
import { useSortable, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import axios from 'axios'
import { useState } from 'react'
import { Card } from '../Card/Card'

export const Board = ({id, title, cards = []}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: `col-${id}`, data: { type:'column', columnId:id } });
    const [cardTitle, setCardTitle] = useState('')
    const [cardSubTitle, setCardSubTitle] = useState('')
    const [showForm, setShowForm] = useState(false)

    async function newCard(boardId) {
      console.log(boardId);
      await axios.post('/api/newCard', {cardTitle, cardSubTitle, boardId})
    }
    
    async function deleteTable(id) {  
      await axios.delete('/api/deleteBoard', {
      data: {id}
    })
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

return (
    <div ref={setNodeRef} style={style} className="board">
      <div className="column-header">
        <p>{title}</p>
        <button className="dragHandle" {...attributes} {...listeners} aria-label="Drag column">⠿</button>
      </div>
     <SortableContext
  items={cards.map(c => `task-${c.id}`)}
  strategy={verticalListSortingStrategy}
>
  {cards.map(c => <Card key={c.id} card={c} />)}
</SortableContext>
      {showForm ? 
      <div>
        <input onChange={(e) => setCardTitle(e.target.value)} placeholder='Name of Card' required></input>
        <input onChange={(e) => setCardSubTitle(e.target.value)} placeholder='Description of Card'></input>
        <button onClick={() => newCard(id)}>Add Card</button>
        <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
         : <button onClick={() => setShowForm(true)}>+</button>}
      
      <button onClick={() => deleteTable(id)}>Delete</button>
    </div>
  );
}