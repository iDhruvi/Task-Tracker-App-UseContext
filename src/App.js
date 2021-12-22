import "./App.css";
import Header from "./Components/Header";
import Tasks from "./Components/Tasks";
import { useState, useEffect } from "react";
import AddTaskForm from "./Components/AddTaskForm";
import Footer from "./Components/Footer";
import About from "./Components/About";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TaskContext } from "./Components/Context";
import { ShowContext } from "./Components/Context";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const serverTasks = await fetchTasks();
      setTasks(serverTasks);
    }
    getTasks()
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data;
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  }

  const delTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    //console.log("Delete: ", id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {

    const gettask = await fetchTask(id)
    const updateTask = { ...gettask, Reminder: !gettask.Reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updateTask),
    })

    const data = await res.json()
    //console.log("Toogle: ", id);
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, Reminder: data.Reminder } : task
      )
    );
  };

  const AddTask = async (task) => {

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();
    setTasks([...tasks, data]);

  };

  return (
    <Router>
      <div className="App">
        <div className="container">
          <ShowContext.Provider value={showAddTask}>
            <Header
              onBtnAdd={() => setShowAddTask(!showAddTask)}
            />
          </ShowContext.Provider>
          <Routes>
            <Route path="/" element={
              <>
                {showAddTask && <AddTaskForm onAdd={AddTask} />}
                {tasks.length > 0 ? (
                  <TaskContext.Provider value={tasks}>
                    <Tasks onDelete={delTask} onToggle={toggleReminder} />
                  </TaskContext.Provider>
                ) : (
                  "No Task To Show"
                )}
              </>
            } />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </div>

      </div>
    </Router>
  );
}

export default App;
