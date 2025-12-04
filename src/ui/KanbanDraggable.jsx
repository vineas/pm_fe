import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import { updateTaskStatus } from '../api/taskApi';

const statusOrder = ['todo','inprogress','done'];

export default function KanbanDraggable({ tasks = [], projectId, onOpenTask }) {
  const grouped = statusOrder.map(s => ({ status: s, items: tasks.filter(t => t.status === s) }));
  const q = useQueryClient();
  const updateMut = useMutation(({id,status}) => updateTaskStatus(id, status), {
    onSuccess: () => q.invalidateQueries(['project', projectId])
  });

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const fromCol = source.droppableId;
    const toCol = destination.droppableId;
    if (fromCol === toCol) return;

    // optimistic update optional — we'll just call backend update
    updateMut.mutate({ id: Number(draggableId), status: toCol });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {grouped.map(col => (
          <Droppable droppableId={col.status} key={col.status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/3 bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{col.status.toUpperCase()}</h4>
                  <span className="text-sm text-gray-500">{col.items.length}</span>
                </div>

                <div className="space-y-2 min-h-[50px]">
                  {col.items.map((t, idx) => (
                    <Draggable draggableId={String(t.id)} index={idx} key={t.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow-sm cursor-grab"
                          onDoubleClick={() => onOpenTask(t)}
                        >
                          <div className="font-medium">{t.name}</div>
                          <div className="text-xs text-gray-500">Bobot: {t.bobot}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}