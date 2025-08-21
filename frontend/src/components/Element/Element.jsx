import axios from "axios"

export const Element = ({element}) => {
    async function deleteElement(id){
        console.log(typeof id, id)
        await axios.delete('/api/deleteelement', {data: {id}})
    }

    return (
    <>
    {element.map((e) => (
        <>
        <h4 className="element">{e.title}</h4>
        <button onClick={() => deleteElement(e.id)}>Delete</button>
        </>
    ))}
    </>
  )
}
