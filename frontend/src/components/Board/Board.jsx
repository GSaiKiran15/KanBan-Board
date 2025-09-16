import './Board.css'
import { useSortable, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import axios from 'axios'
import { useState } from 'react'
import { Card } from '../Card/Card'

export const Board = ({id, title, cards = [], onDelete}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: `col-${id}`, data: { type:'column', columnId:id } });
    const [cardTitle, setCardTitle] = useState('')
    const [cardSubTitle, setCardSubTitle] = useState('')
    const [showForm, setShowForm] = useState(false)

    async function newCard(boardId) {
      await axios.post('/api/newCard', {cardTitle, cardSubTitle, boardId})
    }
    
    async function deleteTable(id) {  
      await axios.delete('/api/deleteBoard', {
      data: {id}
    }), onDelete?.(id)
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

return (
    <div ref={setNodeRef} style={style} className="kanban-column">
      <div className="column-header-draggable">
        <span>{title}</span>
        <div>
           <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); deleteTable(id)}} className="delete-btn">✕</button>
           <button className="drag-handle" {...attributes} {...listeners} aria-label="Drag column">⠿</button>
        </div>
      </div>
      
      {/* This container is crucial for vertical scrolling */}
      <div className="column-tasks">
        <SortableContext items={cards.map(c => `task-${c.id}`)} strategy={verticalListSortingStrategy}>
          {cards.map(c => <Card key={c.id} card={c} />)}
        </SortableContext>
        
        {showForm ? (
          <div className="add-item-form">
            <input onChange={(e) => setCardTitle(e.target.value)} placeholder="Enter a title for this card..." required />
            <div className="form-actions">
                <button className="add-btn-primary" onClick={() => newCard(id)}>Add Card</button>
                <button className="add-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>+ Add a card</button>
        )}
      </div>
    </div>
  );
}