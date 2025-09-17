import {useLoaderData, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import axios from "axios"
import './Projects.css'

export default function Projects(){
    const initialProjects = useLoaderData()  
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [projectInfo, setProjectInfo] = useState(initialProjects)
    
    function openBoard(id){
        const project = projectInfo.find(p => p.id === id)
        if (!project) return
        return navigate(`/boards/${id}`, {
            state: {projectId: id, title: project.title}
        })
    }

    const handleCreateProject = async () => {
        const res = await axios.post('/api/newProject', {title: newTitle})
        setProjectInfo(prev => [...prev, res.data])
        setNewTitle('');
        setShowForm(false);
    };

    const deleteProject = async (id) => {
        await axios.delete('/api/deleteProject', {data: {id}})
        setProjectInfo(prev => prev.filter(p => p.id !== id))
    }

    return (
                <div className="projects-page-container">
                    <div className="projects-header">
                        <h1>Projects</h1>
                        {!showForm && (
                            <button className="create-project-btn" onClick={() => setShowForm(true)}>
                                Create New Project
                            </button>
                        )}
                    </div>
                    
                    {showForm && (
                        <div className="new-project-form">
                            <input
                                type="text"
                                value={newTitle}
                                placeholder="Enter your new project title..."
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                            <div className="form-buttons">
                                <button className="create-btn" onClick={handleCreateProject}>Create</button>
                                <button onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className="projects-grid">
                        {projectInfo.map((project) => (
                            <div key={project.id} className="project-card project-card-clickable" onClick={() => openBoard(project.id)}>
                                <div>
                                    <h2>{project.title}</h2>
                                </div>
                                <button className="delete-project-btn" onClick={(e) => {e.stopPropagation(); deleteProject(project.id, e)}}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
}