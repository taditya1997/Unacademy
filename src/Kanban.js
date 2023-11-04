import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import NewTaskButton from './NewTaskButton';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;' 
  justify-content: space-between;`;


const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 341px;
  border-radius: 5px;
  padding: 15px 15px;
  margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`;

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`;

const Dropdown = styled.select`
  margin: 10px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  min-width: 150px;
  max-width: 200px;
  background: #fff;
`;

const LOCAL_STORAGE_KEY = 'kanbanData';

const Kanban = () => {
  const [columnsFromBackend, setColumnsFromBackend] = useState({
    toDo: {
      title: 'To-do',
      items: [],
    },
    inProgress: {
      title: 'In Progress',
      items: [],
    },
    done: {
      title: 'Done',
      items: [],
    },
  });
  const [selectedColumn, setSelectedColumn] = useState('toDo');

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setColumnsFromBackend(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever columnsFromBackend changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columnsFromBackend));
  }, [columnsFromBackend]);

  const addNewTask = (taskText, dueDate) => {
    const newTask = {
      id: `task-${Date.now()}`,
      Task: taskText,
      Due_Date: new Date().toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    if (selectedColumn in columnsFromBackend) {
      const updatedColumns = {
        ...columnsFromBackend,
        [selectedColumn]: {
          ...columnsFromBackend[selectedColumn],
          items: [...columnsFromBackend[selectedColumn].items, newTask],
        },
      };
      setColumnsFromBackend(updatedColumns);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedColumn(event.target.value);
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  return (
    <div>
      <Header>
      <Dropdown value={selectedColumn} onChange={handleDropdownChange}>
        {Object.keys(columnsFromBackend).map((columnId) => (
          <option key={columnId} value={columnId}>
            {columnsFromBackend[columnId].title}
          </option>
        ))}
      </Dropdown>
      <NewTaskButton onAddTask={addNewTask} />
      </Header>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columnsFromBackend, setColumnsFromBackend)}>
        <Container>
          {Object.entries(columnsFromBackend).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                    <Title>{column.title}</Title>
                    {column.items.map((item, index) => (
                      <TaskCard key={item.id} item={item} index={index} />
          ))}
                    {provided.placeholder}
                  </TaskList>
                )}
              </Droppable>
            );
          })}
        </Container>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
