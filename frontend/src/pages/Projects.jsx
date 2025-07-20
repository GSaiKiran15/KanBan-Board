import {useLoaderData, useNavigate} from 'react-router-dom'

export default function Projects(){
    const {data} = useLoaderData()  
    const navigate = useNavigate()
    function openBoard(id){
        console.log(`/boards/${id}`);
        return navigate(`/boards/${id}`, {
            projectId : id
        })
    }

    return (
        <>
        {data.map((project) => (
            <button key={project.id} onClick={() => openBoard(project.id)}>{project.title}</button>
        ))}
        </>
    )
}