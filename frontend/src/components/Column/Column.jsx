import "./Column.css"
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable'
import { Board } from '../Board/Board'
import axios from "axios"
import { useState, useCallback } from "react"

export const Column = ({boards = [], id}) => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [boardsData, setBoardsData] = useState(boards)

  async function addBoard(id) {
    const response = await axios.post('/api/newBoard', {
      title, subtitle, parent_board_id: id, project_id: id
    })
    setBoardsData(prev => [...prev, response.data])
    setShowForm(false)
  }

   const handleDeleteBoard = useCallback(async (boardId) => {
    setBoardsData(prev => prev.filter(b => b.id !== boardId));
    try {
      await axios.delete('/api/deleteBoard', { data: { id: boardId } });
    } catch (err) {
      setBoardsData(prev => [...prev, boards.find(b => b.id === boardId)].filter(Boolean));
      console.error(err);
    }
  }, [boards]);

  return (
    <div className='kanban-board'>
      <SortableContext items={boardsData.map(b => `col-${b.id}`)} strategy={horizontalListSortingStrategy}>
        {boardsData.map(b => <Board key={b.id} id={b.id} title={b.title} cards={b.items} onDelete={handleDeleteBoard}/>)}
      </SortableContext>

      {showForm ? (
        <div className="add-item-form kanban-column"> {/* Reuse column style for form container */}
          <input placeholder="New column title..." required onChange={(e) => setTitle(e.target.value)} />
          <div className="form-actions">
            <button className="add-btn-primary" onClick={() => addBoard(id)}>Add List</button>
            <button className="add-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <button className="add-column-btn" onClick={() => setShowForm(true)}>+ Add Another List</button>
        </div>
      )}
    </div>
  );
}