import '../App.css'
import { useLoaderData, useParams} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import {closestCorners, DndContext} from "@dnd-kit/core"
import { Column } from '../components/Column/Column';
import { arrayMove } from '@dnd-kit/sortable';

export default function Boards() {
    const {id} = useParams()
    const [boards, setTasks] = useState(useLoaderData())
    const [showForm, setShowForm] = useState(false)
    const [tableName, setTableName] = useState('')
    const [elementCard, setElementCard] = useState('')
    const [elementForm, setElementForm] = useState(false)
    const [subheading, setSubheading] = useState('')
    const [activeBoard, setActiveBoard] = useState()
    const [boardsInfo, setBoardsInfo] = useState(boards)

    async function createNewTable(){
        const res = await axios.post('/api/newtable', {
            projectID : id,
            title: tableName,
            parent_board_id: id
        })
        const newBoard = res.data
        
        setBoardsInfo(prev => [...prev, newBoard])
        setShowForm(false)
        setTableName('')
    }

    async function createElement(board_id){
        const res = await axios.post('/api/newelement', {
            board_id: board_id,
            title: elementCard,
            subheading: subheading || ""
        })
        const newTable = res.data
    }

    async function deleteBoard(id) {
        console.log(typeof id);
        await axios.delete('/api/deleteboard', {
            data: {id}
        })
    }

    const getTaskPos = (id) => boards.findIndex((task) => task.id === id);

    const handleDragEnd = event => {
        const {active, over} = event
        if (active.id === over.id) return;
        setTasks((boards) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id)
            return arrayMove(boards, originalPos, newPos)
        })
    }

    return (
        <>
        <div className='App'>
            <h1>My Tasks</h1>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <Column boards={boards}/>
            </DndContext>
        </div>
        </>

        // <>
        // <div className='boardWrapper'>
        //     <DndContext collisionDetection={closestCorners}>
        //         <Column tasks={tasks}/>
        //     <div className="board" key={table.id}>
        //     <span className='boardTitle'>{table.title}</span><br></br>
        //     {tasks.items.map((item) => (
        //         <span key={item.id}>{item.title}<br></br><button onClick={() => {deleteElement(item.id)}}>Delete Element</button><br></br></span>
        //     ))}
        //     <>
        //     {activeBoard === table.id && elementForm ?
        //         <>
        //         <input placeholder='Card Name' value={elementCard} onChange={(e) => setElementCard(e.target.value)}></input>
        //         <button onClick={() => createElement(table.id)}>Add Card</button>
        //         <button onClick={() => setElementForm(false)}>Cancel</button>
        //         </>
        //         :<> <button onClick={() => {setElementForm(true), setActiveBoard(table.id)}}>Add Card</button>
        //         <button onClick={() => {deleteBoard(table.id)}}>Delete Table</button></>
        //     }
        //     </>
        //     </div>
        //     </DndContext>

        // {showForm ? <>
        // <input value={tableName} onChange={(e) => setTableName(e.target.value)}></input>
        // <button onClick={createNewTable}>Create</button>
        // <button onClick={() => setShowForm(false)}>Cancel</button>
        // </>
        // :<button onClick={() => setShowForm(true)}>Add a new Table</button>}
        // </div>
        // </>
    )
}