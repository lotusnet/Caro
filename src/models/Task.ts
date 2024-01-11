import { TaskStatus } from "./TaskStatus";

export const DndItemTypes = {
  Task: 'task',
}

export type Task = {
  id: string
  title: string,
  contents?: string,  
  status: TaskStatus,
}

export type TaskWithIndex = Task & {
  order: number,
}

export type MoveHandler = (dragIndex: number, targetIndex: number, status: TaskStatus) => void;

export const taskList: TaskWithIndex[] = [{
  order: 1,
  id: '1',
  status: 'todo',
  title: 'Runing',
  contents: 'To Musashi Kosugi : 8.0Km',
}, {
  order: 2,
  id: '2',
  status: 'doing',
  title: 'Weight Training',
  contents: 'Push-ups : 10 * 3',
}, {
  order: 3,
  id: '3',
  status: 'doing',
  title: 'Write Note',
  contents: 'Plan Do Check Action',
}, {
  order: 4,
  id: '4',
  status: 'doing',
  title: 'Football Skill 1',
  contents: 'Lifting: 100/1min',
}, {
  order: 5,
  id: '5',
  status: 'doing',
  title: 'Football Skill 2',
  contents: 'Shoot',
}, {
  order: 6,
  id: '6',
  status: 'doing',
  title: 'Football Skill 3',
  contents: 'Dribble',
}, {
  order: 7,
  id: '7',
  status: 'doing',
  title: 'Football Skill 4',
  contents: 'Deffence',
}, {
  order: 8,
  id: '8',
  status: 'doing',
  title: 'Football Skill 5',
  contents: 'Pass',
}, {
  order: 9,
  id: '9',
  status: 'done',
  title: 'Eat Lunch',
  contents: '@Vansan',
}];