import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function TodoList({ tasks, setTasks, carriedOverCount }) {
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  return (
    <div className="card todo-card">
      <div className="todo-header">
        <span className="mono-label">TASKS</span>
      </div>
      
      <div className="todo-list">
        {tasks.length === 0 ? (
          <div className="todo-empty-state">
            {carriedOverCount > 0 ? (
              <p className="empty-text">{carriedOverCount} task{carriedOverCount > 1 ? 's' : ''} carried over from yesterday.</p>
            ) : (
              <p className="empty-text">A fresh day to focus.</p>
            )}
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="todo-item">
              <input 
                type="checkbox" 
                className="todo-checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className={`todo-text ${task.completed ? 'completed' : ''}`}>
                {task.text}
              </span>
              <button className="todo-delete" onClick={() => removeTask(task.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <form className="todo-add" onSubmit={addTask}>
        <input 
          type="text" 
          className="todo-input"
          placeholder={tasks.length === 0 ? "+ Add your first task" : "New task..."}
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button type="submit" className="btn-add">
          <Plus size={16} /> Add
        </button>
      </form>
    </div>
  );
}
