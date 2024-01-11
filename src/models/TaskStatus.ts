export const TaskStatuses = ['todo', 'doing', 'done'] as const
export type TaskStatus = (typeof TaskStatuses)[number]

export const TaskStatusMap = 
{
    todo: 'TODO',
    doing: 'DOING',
    done: 'DONE'
} as const