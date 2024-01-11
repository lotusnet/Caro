import { Layout } from 'components/layout/Layout';
import { MoveHandler, taskList as initial } from 'models/Task';
import { TaskStatuses } from 'models/TaskStatus';
import { useCallback, VFC } from 'react';
import InputTask from '~/components/checklist/InputTask';
import TaskLane from '~/components/checklist/TaskLane';
import useTaskLane from '~/hooks/useTaskLane';

export const CheckList : VFC = () => {

  const [taskLane, taskList, setTaskList] = useTaskLane(initial);
  const moveItem: MoveHandler = useCallback((dragIndex, targetIndex, status) => {
    const task = taskList[dragIndex];
    if (!task) return;
    setTaskList(prevState => {
      console.log(`dragIndex=${dragIndex}`);
      console.log(`targetIndex=${targetIndex}`);
      console.log(`task:status=${task.status} title=${task.title} contents=${task.contents}`);
      console.log(`prevState=${prevState}`);
      const newTaskList = prevState.filter((_, idx) => idx !== dragIndex);
      newTaskList.splice(targetIndex, 0, { ...task, status });
      console.log(`newTaskList=${newTaskList}`);
      return newTaskList;
    })
  }, [taskList, setTaskList]);
  
  let index = 0;
  return (<>
    <Layout title={`CHECK LIST`}>
      <div>
        <InputTask/>
        <div className='horizontal'>
          {TaskStatuses.map(status => {
            const tasks = taskLane[status];
            const firstIndex = index;
            if (tasks === undefined) return null;
            index = index + tasks.length;

            return (
              <>
                <section key={status} className={'lane-section'}>
                  <TaskLane
                    taskList={ tasks }
                    status={ status }
                    firstIndex={ firstIndex }
                    onMove={moveItem} />                
                </section>
              </>
            )
          })}
        </div>
      </div>
    </Layout>
    <style jsx>{`
      .container {
        max-width: 900px;
        width: 100%;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
      }
      .title {
        margin: 0;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 24px;
      }
      
      .lane {
        display: flex;
        min-height: 300px;
        border: 1px solid blueviolet;
        margin: 20px;
      }
      .lane-item {
        flex: 1 1 0px;
        min-width: 0;
      }
      .lane > .lane-item:not(:first-child) {
        border-left: 1px solid blueviolet;
      }
      .lane-item-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .lane-status {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 5px;
        border-bottom: 1px solid blueviolet;
      }
      .lane-status-name {
        margin: 0;
        font-weight: bold;
        font-size: 16px;
      }
      .lane-status-delete {
        margin-left: auto;
        font-size: 10px;
        cursor: pointer;
        color: blueviolet;
        border: 1px solid blueviolet;
      }
      
      .tasks {
        flex: 1 1 0px;
        margin: 0;
        padding: 10px;
        list-style: none;
      }
      .tasks > *:not(:first-child) {
        margin-top: 10px;
      }
      .task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        border: 1px solid blueviolet;
        background-color: #fff;
        box-sizing: border-box;
        cursor: grab;
      }
      .task-item::before {
        width: 15px;
        height: 15px;
        margin-right: 5px;
        border-radius: 2px;
        background-color: #aaa;
        content: "";
      }
      .task-item > span {
        overflow: hidden;
        display: table-cell;
        max-width: 193px;
        word-wrap: break-word;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .task-item > button {
        width: 40px;
        margin-left: auto;
        font-size: 12px;
        cursor: pointer;
      }
      
      .gu-mirror {
        position: fixed !important;
        margin: 0 !important;
        z-index: 9999 !important;
        opacity: 0.8;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
        filter: alpha(opacity=80);
      }
      .gu-hide {
        display: none !important;
      }
      .gu-unselectable {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      .gu-transit {
        opacity: 0.2;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
        filter: alpha(opacity=20);
      }
      .horizontal {
        display: flex;
      }
      .lane-section {
        box-sizing: border-box;
        width: 45%;
        max-width: 400px;
        min-width: 240px;
      }      
      .lane-section:not(:first-of-type) {
        margin-left: 10px;
      }
    `}</style>
  </>)
}

export default CheckList