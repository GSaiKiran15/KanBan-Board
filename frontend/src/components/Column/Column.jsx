import "./Column.css"
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable'
import { Board } from '../Board/Board'
import axios from "axios"
import { useState } from "react"

export const Column = ({boards = [], id}) => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function addBoard(id) {
    axios.post('/api/newBoard', {
      title, subtitle, parent_board_id: id, project_id: id
    })
  }

  return (
    <div className='column'>
      <SortableContext
  items={boards.map(b => `col-${b.id}`)}
  strategy={horizontalListSortingStrategy}
>
  {boards.map(b => <Board key={b.id} id={b.id} title={b.title} cards={b.items} />)}
  
</SortableContext>

{showForm ? (<div>
  <input placeholder="Title of Table" required onChange={(e) => setTitle(e.target.value)}></input>
  <input placeholder="Sub-Title" onChange={(e) => setSubTitle(e.target.value)}></input>
  <button onClick={() => addBoard(id)}>Add Table</button>
  <button onClick={() => setShowForm(false)}>Cancel</button>
</div>) : (<div><button className="addBoard" onClick={() => setShowForm(true)}>Add Table</button></div>)}

    </div>
  )
}