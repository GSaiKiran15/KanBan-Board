import "./Column.css"
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import { Board } from '../Board/Board'

export const Column = ({boards}) => {
  return (
    <div className='column'>
      <SortableContext items={boards} strategy={verticalListSortingStrategy}>
        {boards.map((board) => (
            <Board id={board.id} title={board.title} elements={board.items} key={board.id}/>
        ))}
        </SortableContext>
    </div>
  )
}