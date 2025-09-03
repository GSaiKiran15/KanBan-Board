import "./Column.css"
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable'
import { Board } from '../Board/Board'
import axios from "axios"
import { useState } from "react"

export const Column = ({boards = [], id}) => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function addTable(id) {
    axios.post('/api/newTable', {
      title, subtitle, parent_board_id: id, project_id: id
    })
  }

  return (
    <div className='column'>
      <SortableContext
  items={boards.map(b => `col-${b.id}`)}
  strategy={horizontalListSortingStrategy}
>
  {boards.map(b => <Board key={b.id} id={b.id} title={b.title} elements={b.items} />)}
  
</SortableContext>

{showForm ? (<div>
  <input placeholder="Title of Table" required onChange={(e) => setTitle(e.target.value)}></input>
  <input placeholder="Sub-Title" onChange={(e) => setSubTitle(e.target.value)}></input>
  <button onClick={() => addTable(id)}>Add Table</button>
  <button onClick={() => setShowForm(false)}>Cancel</button>
</div>) : (<div><button className="addTable" onClick={() => setShowForm(true)}>Add Table</button></div>)}

    </div>
  )
}