import { DndItemTypes, MoveHandler, Task, TaskWithIndex } from 'models/Task';
import { VFC } from 'react';
import { useDrop } from 'react-dnd';
import { TaskStatus, TaskStatusMap } from "../../models/TaskStatus";
import Draggable from './Draggable';
import TaskItem from './TaskItem';

type Props = {
  taskList: Task[];
  status: TaskStatus,
  firstIndex: number,
  onMove: MoveHandler
}

export const TaskLane : VFC<Props>= (props: Props) => {
  const {taskList, status, firstIndex, onMove} = props;  
  const [, ref] = useDrop({
    accept: DndItemTypes.Task,
    hover(dragItem: TaskWithIndex): void {
      const dragIndex = dragItem.order;
      if (dragItem.status === status) return;
      const targetIndex = dragIndex < firstIndex ?
        // forward
        firstIndex + taskList.length - 1 :
        // backward
        firstIndex + taskList.length;
      onMove(dragIndex, targetIndex, status);
      dragItem.order = targetIndex;
      dragItem.status = status;
    }
  });

  return (
    <>
      <div className={['status', status].join(' ')}>
        <h2><span className='count'>{taskList.length  }</span>{TaskStatusMap[status]}</h2>
        <div className='status-inner'>
          <ul className='list' ref={ref}>
            {taskList.map((task, i) => {
              return (
                <li key={task.id} className='item-wrapper'>
                  <Draggable task={task} order={firstIndex + i} onMove={onMove}>
                    <TaskItem id={task.id} task={task} />
                  </Draggable>
                </li>
            );
            })}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .status {
            box-sizing: border-box;
            width: 100%;
            max-height: 80vh;            
            margin: 0 10px;
            padding: 0 12px 12px;
            display: flex;
            flex-direction: column;
            border: 1px solid #cccccc;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        .status-inner {
          overflow: auto;
        }        
        .status > h2 {
            display: flex;
            align-items: center;
            margin: 8px 4px 12px;
            font-size: 1.2rem;
        }
        
        .count {
            display: inline-block;
            min-width: 12px;
            padding: 0 6px;
            font-size: 0.8rem;
            font-weight: normal;
            color: white;
            line-height: 1.5;
            text-align: center;
            background-color: #a6a6a6;
            border: 1px solid transparent;
            border-radius: 2em;
            margin-right: 8px;
        }
        
        .list {
            list-style: none;
            margin: 0;
            padding: 0;
            height: 100%;
            min-height: 60px;
        }
        
        .item-wrapper:not(:first-of-type) {
            margin: 12px 0 0;
        }  
      `}</style>
    </>
  );
}

export default TaskLane