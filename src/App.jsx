import React, { useState } from 'react';
import { Plus, X, Calendar, CheckCircle2, Circle, Trash2, Edit2, Clock, Play, Pause, Square, Timer, Bell, FileText, Save, Search, Inbox, ChevronDown, ChevronRight, Flag, Users, HelpCircle, Filter, Check } from 'lucide-react';

// Simple embedded version - all code in one file
export default function TodoistClone() {
  // Initialize tasks with workout and automation data
  const initializeTasks = () => {
    const today = new Date();
    const tasks = [];
    
    // Add 4 weeks of fitness tasks
    const workouts = [
      { week: 1, day: 1, type: "Strength (Upper)", exercises: "Push-ups, Dumbbell Rows, Shoulder Press", sets: "3x10" },
      { week: 1, day: 2, type: "Cardio + Core", exercises: "Running, Plank, Bicycle Crunches", sets: "6 min + 3x30s" },
      { week: 1, day: 3, type: "Strength (Lower)", exercises: "Squats, Lunges, Calf Raises", sets: "3x12" },
      { week: 1, day: 4, type: "Mobility + Flexibility", exercises: "Yoga flow, Dynamic Stretching", sets: "20-30 min" },
      { week: 1, day: 5, type: "Strength + Cardio Mix", exercises: "Burpees, Dumbbell Thrusters, Mountain Climbers", sets: "3x10" },
      { week: 1, day: 6, type: "Active Recovery", exercises: "Walking, Light Stretching", sets: "20 min" },
      { week: 1, day: 7, type: "Rest", exercises: "Full rest day", sets: "—" },
    ];
    
    // Generate 4 weeks of workouts
    for (let week = 0; week < 4; week++) {
      workouts.forEach((workout, dayIndex) => {
        const taskDate = new Date(today);
        taskDate.setDate(today.getDate() + (week * 7) + dayIndex);
        
        tasks.push({
          id: `workout-${week}-${dayIndex}`,
          text: `Week ${week + 1}: ${workout.type}`,
          completed: false,
          date: taskDate.toISOString().split('T')[0],
          project: 'fitness',
          priority: workout.type.includes('Strength') ? 'high' : 'medium',
          createdAt: new Date().toLocaleTimeString(),
          description: `${workout.exercises}\n${workout.sets}`
        });
      });
    }
    
    // Add automation testing tasks (45 days)
    const automationTopics = [
      { day: 1, title: "Environment Setup 💻", phase: "Foundations" },
      { day: 2, title: "Playwright Fundamentals", phase: "Foundations" },
      { day: 3, title: "Element Locators", phase: "Foundations" },
      { day: 4, title: "Test Framework Integration", phase: "Foundations" },
      { day: 5, title: "Basic Interactions & Workflow", phase: "Foundations" },
      { day: 6, title: "Advanced Locators & Waits", phase: "Foundations" },
      { day: 7, title: "Version Control with Git", phase: "Foundations" },
      { day: 8, title: "Page Object Model - Day 1", phase: "Web Automation" },
      { day: 9, title: "Page Object Model - Day 2", phase: "Web Automation" },
      { day: 10, title: "E-commerce Flow - Login & Search", phase: "Web Automation" },
      { day: 11, title: "E-commerce Flow - Cart", phase: "Web Automation" },
      { day: 12, title: "E-commerce Flow - Checkout", phase: "Web Automation" },
      { day: 13, title: "Complex Scenarios", phase: "Web Automation" },
      { day: 14, title: "File Operations", phase: "Web Automation" },
      { day: 15, title: "Soft Assertions & Retries", phase: "Web Automation" },
      { day: 16, title: "Test Reports with Allure", phase: "Web Automation" },
      { day: 17, title: "Data-Driven Testing", phase: "Web Automation" },
      { day: 18, title: "Project Documentation", phase: "Web Automation" },
      { day: 19, title: "REST API Basics", phase: "API Automation" },
      { day: 20, title: "Postman to Automation", phase: "API Automation" },
      { day: 21, title: "API - GET & POST", phase: "API Automation" },
      { day: 22, title: "API - PUT & DELETE", phase: "API Automation" },
      { day: 23, title: "Authentication & Schema", phase: "API Automation" },
      { day: 24, title: "Combining UI and API", phase: "API Automation" },
      { day: 25, title: "API Project Refinement", phase: "API Automation" },
      { day: 26, title: "CI/CD with GitHub Actions", phase: "CI/CD" },
      { day: 27, title: "Run Tests in CI", phase: "CI/CD" },
      { day: 28, title: "Dockerizing Tests", phase: "CI/CD" },
      { day: 29, title: "Cross-Browser Testing", phase: "CI/CD" },
      { day: 30, title: "Parallel Test Execution", phase: "CI/CD" },
      { day: 31, title: "Advanced Reporting", phase: "CI/CD" },
      { day: 32, title: "Flaky Test Mitigation", phase: "CI/CD" },
      { day: 33, title: "Environment Configs", phase: "CI/CD" },
      { day: 34, title: "Project Refactoring", phase: "CI/CD" },
      { day: 35, title: "Bug Triaging & Review", phase: "CI/CD" },
      { day: 36, title: "Framework - Logging", phase: "Capstone" },
      { day: 37, title: "Framework - Exception Handling", phase: "Capstone" },
      { day: 38, title: "Framework - Utilities", phase: "Capstone" },
      { day: 39, title: "Advanced Data - Database", phase: "Capstone" },
      { day: 40, title: "Advanced Data - Large Datasets", phase: "Capstone" },
      { day: 41, title: "Dynamic Data Generation", phase: "Capstone" },
      { day: 42, title: "Final CI/CD - Full Suite", phase: "Capstone" },
      { day: 43, title: "Final CI/CD - Scheduling", phase: "Capstone" },
      { day: 44, title: "Full Regression & Bug Reports", phase: "Capstone" },
      { day: 45, title: "Final Documentation", phase: "Capstone" }
    ];
    
    automationTopics.forEach((topic) => {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + (topic.day - 1));
      
      tasks.push({
        id: `automation-${topic.day}`,
        text: `Day ${topic.day}: ${topic.title}`,
        completed: false,
        date: taskDate.toISOString().split('T')[0],
        project: 'automation',
        priority: topic.phase === 'Capstone' ? 'high' : 'medium',
        createdAt: new Date().toLocaleTimeString(),
        description: `Phase: ${topic.phase}`
      });
    });
    
    return tasks;
  };

  const [tasks, setTasks] = useState(initializeTasks());
  const [projects] = useState([
    { id: 'home', name: 'Home 🏠', color: 'orange', taskCount: 0 },
    { id: 'fitness', name: 'Fitness 💪', color: 'green', taskCount: 0 },
    { id: 'automation', name: 'Automation 🤖', color: 'blue', taskCount: 0 }
  ]);
  const [newTask, setNewTask] = useState('');
  const [selectedView, setSelectedView] = useState('today');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        date: today,
        project: selectedProject || 'home',
        priority: 'normal',
        createdAt: new Date().toLocaleTimeString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (selectedView === 'today') {
      filtered = filtered.filter(task => task.date === today);
    } else if (selectedView === 'upcoming') {
      filtered = filtered.filter(task => task.date >= today);
    } else if (selectedView === 'inbox') {
      filtered = filtered.filter(task => !task.completed);
    } else if (selectedView === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    if (selectedProject) {
      filtered = filtered.filter(task => task.project === selectedProject);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const activeTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              MR
            </div>
            <span className="font-medium text-gray-800">MR</span>
            <ChevronDown size={16} className="text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Add Task */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => document.getElementById('task-input')?.focus()}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <Plus size={16} />
            Add task
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => { setSelectedView('inbox'); setSelectedProject(null); }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                selectedView === 'inbox' && !selectedProject 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Inbox size={16} />
              <span>Inbox</span>
              <span className="ml-auto text-gray-400 text-sm">
                {tasks.filter(t => !t.completed).length}
              </span>
            </button>

            <button
              onClick={() => { setSelectedView('today'); setSelectedProject(null); }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                selectedView === 'today' && !selectedProject 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar size={16} />
              <span>Today</span>
              <span className="ml-auto text-gray-400 text-sm">
                {tasks.filter(t => t.date === today && !t.completed).length}
              </span>
            </button>

            <button
              onClick={() => { setSelectedView('upcoming'); setSelectedProject(null); }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                selectedView === 'upcoming' && !selectedProject 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar size={16} />
              <span>Upcoming</span>
            </button>

            <button
              onClick={() => { setSelectedView('completed'); setSelectedProject(null); }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                selectedView === 'completed' && !selectedProject 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle2 size={16} />
              <span>Completed</span>
              <span className="ml-auto text-gray-400 text-sm">
                {tasks.filter(t => t.completed).length}
              </span>
            </button>
          </div>

          {/* Projects */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setExpandedProjects(!expandedProjects)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                {expandedProjects ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="font-medium">My Projects</span>
              </button>
            </div>

            {expandedProjects && (
              <div className="space-y-1">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => { setSelectedProject(project.id); setSelectedView(''); }}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                      selectedProject === project.id 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full bg-${project.color}-500`}></div>
                    <span className="text-sm">{project.name}</span>
                    <span className="ml-auto text-gray-400 text-sm">
                      {tasks.filter(t => t.project === project.id && !t.completed).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md text-sm">
            <Users size={16} />
            <span>Add a team</span>
          </button>
          <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md text-sm">
            <HelpCircle size={16} />
            <span>Help & resources</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedProject 
                  ? projects.find(p => p.id === selectedProject)?.name 
                  : selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
              </h1>
              <p className="text-gray-500 text-sm">
                {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Circle size={20} className="text-gray-300" />
            <input
              id="task-input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add task"
              className="flex-1 text-lg border-none outline-none focus:ring-0"
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Add task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-auto bg-white">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="mb-4">
                <Circle size={64} className="mx-auto opacity-20" />
              </div>
              <h3 className="text-xl font-medium mb-2">No tasks found</h3>
              <p>Add a task above to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`px-6 py-4 group ${task.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 transition-colors ${
                        task.completed 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-300 hover:text-green-500'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-800'
                      }`}>
                        {task.text}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{task.date}</span>
                        <span>#{projects.find(p => p.id === task.project)?.name || 'Inbox'}</span>
                        {task.priority !== 'normal' && (
                          <span className={`flex items-center gap-1 ${
                            task.priority === 'high' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            <Flag size={12} />
                            {task.priority.toUpperCase()}
                          </span>
                        )}
                        <span>Added at {task.createdAt}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}