import {useLoaderData, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import axios from "axios"

export default function Projects(){
    const {data} = useLoaderData()  
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    
    function openBoard(id){
        console.log(`/boards/${id}`);
        return navigate(`/boards/${id}`, {
            projectId : id
        })
    }

    const handleCreateProject = async () => {
        await axios.post('/api/newproject', {title: newTitle})
        console.log("Creating project with title:", newTitle);
        setNewTitle('');
        setShowForm(false);
    };

    return (
        <>
        {data.map((project) => (
            <button key={project.id} onClick={() => openBoard(project.id)}>
            {project.title}
            </button>
        ))}

        {showForm ? (
            <div>
            <input
                type="text"
                value={newTitle}
                placeholder="Project title"
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={handleCreateProject}>Create</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
        ) : (
            <button onClick={() => setShowForm(true)}>New Project</button>
        )}
        </>
    );
}