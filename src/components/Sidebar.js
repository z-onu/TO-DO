// src/components/Sidebar.js
import React from 'react';
import { 
  Plus, 
  Search, 
  Inbox, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  HelpCircle 
} from 'lucide-react';

export const Sidebar = ({ 
  projects, 
  selectedView, 
  selectedProject, 
  expandedProjects, 
  searchQuery, 
  newProjectName, 
  showProjectForm,
  tasks,
  onViewChange,
  onProjectSelect,
  onToggleProjects,
  onSearchChange,
  onAddProject,
  onProjectNameChange,
  onToggleProjectForm
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => onViewChange('inbox', null)}
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
            onClick={() => onViewChange('today', null)}
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
            onClick={() => onViewChange('upcoming', null)}
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
            onClick={() => onViewChange('completed', null)}
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

        {/* Projects Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onToggleProjects}
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
                  onClick={() => onProjectSelect(project.id)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left ${
                    selectedProject === project.id 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${project.color}-500`}></div>
                  <span>{project.name}</span>
                  <span className="ml-auto text-gray-400 text-sm">{project.taskCount}</span>
                </button>
              ))}

              <button
                onClick={() => onToggleProjectForm(true)}
                className="w-full flex items-center gap-3 px-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Plus size={16} />
                <span>Add project</span>
              </button>

              {showProjectForm && (
                <div className="px-2 py-2">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') onAddProject();
                      if (e.key === 'Escape') onToggleProjectForm(false);
                    }}
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
          <Users size={16} />
          <span>Add a team</span>
        </button>
        <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
          <HelpCircle size={16} />
          <span>Help & resources</span>
        </button>
      </div>
    </div>
  );
};