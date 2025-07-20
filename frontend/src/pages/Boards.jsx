import '../App.css'
import { useLoaderData} from 'react-router-dom';

export default function Boards() {
    const data = useLoaderData()
    console.log(data);
    return (
        <>
        <div className='boardWrapper'>
        {data.map((table) => (
            <div className="board" key={table.id}>
            <span className="boardTitle">{table.title}</span>
            </div>
        ))
        }
        <button>Add a new Table</button>
        </div>
        </>
    )
}