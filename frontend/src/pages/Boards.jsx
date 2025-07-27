import '../App.css'
import { useLoaderData, useParams} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Boards() {
    const {id} = useParams()
    const data = useLoaderData()
    const [showForm, setShowForm] = useState(false)
    const [tableName, setTableName] = useState('')
    const [elementCard, setElementCard] = useState('')
    const [elementForm, setElementForm] = useState(false)
    const [subheading, setSubheading] = useState('')
    const [activeBoard, setActiveBoard] = useState()

    async function createNewTable(){
        await axios.post('/api/newtable', {
            projectID : id,
            title: tableName,
            parent_board_id: id
        })
        setShowForm(false)
        setTableName('')
    }

    async function createElement(board_id){
        await axios.post('/api/newelement', {
            board_id: board_id,
            title: elementCard,
            subheading: subheading || ""
        })
    }

    return (
        <>
        <div className='boardWrapper'>
        {data.map((table) => (
            <div className="board" key={table.id}>
            <span className='boardTitle'>{table.title}</span>
            {table.items.map((item) => (
                <span key={item.id}>{item.title}</span>
            ))}
            <>
            {activeBoard === table.id && elementForm ?
                <>
                <input placeholder='Card Name' value={elementCard} onChange={(e) => setElementCard(e.target.value)}></input>
                <button onClick={() => createElement(table.id)}>Add Card</button>
                <button onClick={() => setElementForm(false)}>Cancel</button>
                </>
                : <button onClick={() => {setElementForm(true), setActiveBoard(table.id)}}>Add Card</button>
            }
            </>
            </div>
        ))
        }
        {showForm ? <>
        <input value={tableName} onChange={(e) => setTableName(e.target.value)}></input>
        <button onClick={createNewTable}>Create</button>
        <button onClick={() => setShowForm(false)}>Cancel</button>
        </>
        :<button onClick={() => setShowForm(true)}>Add a new Table</button>}
        </div>
        </>
    )
}