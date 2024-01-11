
import { DndItemTypes, MoveHandler, Task, TaskWithIndex } from 'models/Task';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type Props = {
    task: Task,
    order: number,
    onMove: MoveHandler,
    children: React.ReactNode;
}

const Draggable: React.VFC<Props> = ({
    task, order, onMove, children
}) => {
  
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: DndItemTypes.Task,
    hover(dragItem: TaskWithIndex, monitor) {
      if (!ref.current) return;
      const dragIndex = dragItem.order;
      const hoverIndex = order;
      if (dragIndex === hoverIndex) return;

      if (task.status === dragItem.status) {
        const hoverRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
        const mousePosition = monitor.getClientOffset();
        if (!mousePosition) return;
        const hoverClientY = mousePosition.y - hoverRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY * 0.5) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY * 1.5) return;
      }

      onMove(dragIndex, hoverIndex, task.status);
      dragItem.order = hoverIndex;
      dragItem.status = task.status;
    }
  });

  const [{ isDragging, canDrag }, drag] = useDrag({
    type: DndItemTypes.Task,
    item: { ...task, order },
    isDragging: monitor => monitor.getItem().id === task.id,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    })
  })

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: canDrag ? 'move' : 'default',
      }}
    >
      {children}
    </div>
  );
};

export default Draggable;