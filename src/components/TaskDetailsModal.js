// src/components/TaskDetailModal.js
import React from 'react';
import { X, CheckCircle2, Circle, Calendar, Flag, Bell, MoreHorizontal, Paperclip } from 'lucide-react';

export const TaskDetailModal = ({ 
  task, 
  projects, 
  newSubtask, 
  isOpen, 
  onClose, 
  onUpdateTask, 
  onToggleSubtask, 
  onDeleteSubtask, 
  onAddSubtask, 
  onNewSubtaskChange, 
  onAddComment, 
  onAddLabel, 
  onRemoveLabel 
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span># {projects.find(p => p.id === task.project)?.name || 'Home'}</span>
                <span>/</span>
                <span>📝 Routines</span>
              </div>
              <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-start gap-3">
              <button
                onClick={() => onUpdateTask(task.id, 'completed', !task.completed)}
                className={`mt-1 transition-colors ${
                  task.completed ? 'text-green-600 hover:text-green-700' : 'text-gray-300 hover:text-green-500'
                }`}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => onUpdateTask(task.id, 'text', e.target.value)}
                  className="text-xl font-medium border-none outline-none w-full p-1 rounded hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={() => {
                    const newContent = prompt('Edit description:', task.description) || task.description;
                    onUpdateTask(task.id, 'description', newContent);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                >
                  ≡ {task.description ? 'Edit description' : 'Add description'}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {/* Description */}
            {task.description && (
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Subtasks */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Sub-tasks</h3>
              <div className="space-y-2">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <button
                      onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className={`transition-colors ${
                        subtask.completed ? 'text-green-600' : 'text-gray-300 hover:text-green-500'
                      }`}
                    >
                      {subtask.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {subtask.text}
                    </span>
                    <button
                      onClick={() => onDeleteSubtask(task.id, subtask.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center gap-3 p-2">
                  <Circle size={16} className="text-gray-300" />
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => onNewSubtaskChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') onAddSubtask(task.id);
                    }}
                    placeholder="Add sub-task"
                    className="flex-1 border-none outline-none focus:bg-gray-50 p-1 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Comments</h3>
              <div className="space-y-3">
                {task.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    M
                  </div>
                  <input
                    type="text"
                    placeholder="Comment"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        onAddComment(task.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button className="text-gray-400 hover:text-gray-600">
                    <Paperclip size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <Calendar size={16} />
                Date
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <Flag size={16} />
                Priority
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <Bell size={16} />
                Reminders
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <MoreHorizontal size={16} />
              </button>
              <div className="flex-1"></div>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <div className="p-4 space-y-6">
            {/* Project */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Project</h4>
              <div className="flex items-center gap-2">
                <span># {projects.find(p => p.id === task.project)?.name || 'Home'}</span>
                <span>/</span>
                <span className="text-blue-600">📝 Routines</span>
              </div>
            </div>

            {/* Date */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Date</h4>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => onUpdateTask(task.id, 'date', e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
              <select
                value={task.priority}
                onChange={(e) => onUpdateTask(task.id, 'priority', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="low">🔵 P3</option>
                <option value="normal">⚪ P4</option>
                <option value="medium">🟡 P2</option>
                <option value="high">🔴 P1</option>
              </select>
            </div>

            {/* Labels */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {task.labels.map(label => (
                  <span
                    key={label}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {label}
                    <button
                      onClick={() => onRemoveLabel(task.id, label)}
                      className="hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add label"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    onAddLabel(task.id, e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
              <input
                type="text"
                placeholder="Add location"
                value={task.location}
                onChange={(e) => onUpdateTask(task.id, 'location', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};