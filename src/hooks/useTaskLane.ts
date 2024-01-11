import { Task } from 'models/Task';
import { TaskStatus, TaskStatuses } from 'models/TaskStatus';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type TaskLists = {
  [k in TaskStatus]?: Task[]
};
type UseTaskLane = (tasks: Task[]) => [TaskLists, Task[], Dispatch<SetStateAction<Task[]>>];

const useTaskLane: UseTaskLane = (tasks) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [taskLists, setTaskLists] = useState<TaskLists>({});
  useEffect(() => {
    setTaskLists(
        TaskStatuses.reduce<TaskLists>((acc, status) => {
        acc[status] = taskList.filter(v => v.status === status);
        return acc;
      }, {})
    );
  }, [taskList])
  return [taskLists, taskList, setTaskList];
};

export default useTaskLane;