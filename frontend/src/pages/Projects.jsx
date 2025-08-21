import {useLoaderData, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import axios from "axios"

export default function Projects(){
    const initialProjects = useLoaderData()  
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [projectInfo, setProjectInfo] = useState(initialProjects)
    
    function openBoard(id){
        return navigate(`/boards/${id}`, {
            projectId : id
        })
    }

    const handleCreateProject = async () => {
        console.log(353);
        
        const res = await axios.post('/api/newproject', {title: newTitle})
        const newProject = res.data

        console.log(newProject, 1);
        console.log(12356464);
        
        setProjectInfo(prev => [...prev, newProject])
        setNewTitle('');
        setShowForm(false);
    };

    const deleteProject = async (id) => {
        await axios.delete('/api/deleteproject', {data: {id}})
        setProjectInfo(prev => prev.filter(p => p.id !== id))
    }

    return (
        <>
        {console.log(projectInfo)}
        {projectInfo.map((project) => (<>
            <button key={project.id} onClick={() => openBoard(project.id)}>
            {project.title}
            </button>
            <button onClick={() => {deleteProject(project.id)}}>Delete Project</button><br></br>
            </>
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