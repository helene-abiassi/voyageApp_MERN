import { useEffect, useState } from "react";
import "../styles/BucketList.css";

function BucketList() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");

  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, taskInput]);
      setTaskInput("");
    } else {
      alert("You must write something!");
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    setTasks(tasks);
    setTaskInput(taskInput);
  }, []);

  return (
    <div className="App beigeBox">
      <h2>bucket list</h2>
      <div>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task}
            <span className="close" onClick={() => removeTask(index)}>
              ×
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BucketList;
