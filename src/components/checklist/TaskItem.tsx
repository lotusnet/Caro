import { TagIcon } from '@primer/octicons-react';
import { Task } from 'models/Task';
import React from 'react';

const TaskItem: React.VFC<{id: string; task: Task}> = ({ task }) => (
  <>
    <div  className='item'>
        <TagIcon className='icon'/>
        <div className='task'>
        <p className='title'>{task.title}</p>
        <p className='contents'>{task.contents}</p>
        </div>
    </div>
    <style jsx>{`
      .item {
        box-sizing: border-box;
        display: flex;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        min-height: 30px;
        padding: 12px;
      }
      
      .task {
        margin-left: 12px;
      }
      
      .icon {
        margin: 8px 0;
        flex-shrink: 0;
        height: 24px;
        width: 24px;
      }
      
      .title {
        font-size: 1.1rem;
        font-weight: bold;
        margin: 8px 0;
      }
      
      .contents {
        font-size: 0.7rem;
        margin: 8px 0;
      }              
    `}</style>
  </>
);

export default TaskItem;