import { createContext, useContext } from "react";

const BoardContext = createContext(null)

export const useBoardContext = () => {
    const context = useContext(BoardContext)
    if (!context){
        throw new Error('useBoardContext must be used within BoardProvider')
    }
    return context
}

export default BoardContext