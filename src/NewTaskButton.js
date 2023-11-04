import React, { useState } from 'react';
import styled from 'styled-components';

const NewTaskButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
   margin: 1rem;
   width:100%;
   max-width: 300px;
`;


const Input = styled.input`
  width: 75%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

const Button = styled.button`
  width: 25%;
  background-color: #0074d9;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

const NewTaskButton = ({ onAddTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText) {
      onAddTask(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <NewTaskButtonContainer>
      <Input
        type="text"
        placeholder="New task"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
      />
      <Button onClick={handleAddTask}>Add Task</Button>
    </NewTaskButtonContainer>
  );
};

export default NewTaskButton;
