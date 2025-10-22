// src/components/TaskItem.js
import React from 'react';
import { CheckCircle2, Circle, Edit2, Trash2, Flag, Clock, Timer, Play, Pause, Square, FileText, Save, Bell, Check, X } from 'lucide-react';
import { TimerService } from '../services/TimerService';

export const TaskItem = ({ 
  task, 
  projects, 
  editingId, 
  editText, 
  onToggleTask, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onEditTextChange, 
  onEditKeyPress, 
  onDeleteTask, 
  onOpenTaskDetail, 
  onToggleTimer, 
  onResetTimer, 
  onToggleNotes, 
  onUpdateNotes, 
  onToggleTimerSettings 
}) => {
  return (
    <div className={`px-6 py-4 group hover:bg-gray-50 ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={() => onToggleTask(task.id)}
          className={`mt-1 transition-colors ${
            task.completed 
              ? 'text-green-600 hover:text-green-700' 
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        
        <div className="flex-1 min-w-0">
          {editingId === task.id ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={onEditTextChange}
                onKeyDown={onEditKeyPress}
                onBlur={onSaveEdit}
                autoFocus
                className="flex-1 p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button onClick={onSaveEdit} className="text-green-600 hover:text-green-700 p-2">
                <Check size={16} />
              </button>
              <button onClick={onCancelEdit} className="text-red-600 hover:text-red-700 p-2">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <p 
                className={`text-lg cursor-pointer ${
                  task.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-800 hover:text-gray-600'
                }`}
                onClick={() => onOpenTaskDetail(task.id)}
              >
                {task.text}
              </p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{task.date}</span>
                <span>#{projects.find(p => p.id === task.project)?.name || 'Inbox'}</span>
                {task.priority !== 'normal' && (
                  <span className={`flex items-center gap-1 ${
                    task.priority === 'high' ? 'text-red-600' : 
                    task.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                  }`}>
                    <Flag size={12} />
                    P{task.priority === 'high' ? '1' : task.priority === 'medium' ? '2' : '3'}
                  </span>
                )}
                {task.labels.length > 0 && (
                  <div className="flex gap-1">
                    {task.labels.slice(0, 2).map(label => (
                      <span key={label} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {label}
                      </span>
                    ))}
                    {task.labels.length > 2 && (
                      <span className="text-gray-400">+{task.labels.length - 2}</span>
                    )}
                  </div>
                )}
                {task.subtasks.length > 0 && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                  </span>
                )}
                <span>Added at {task.createdAt}</span>
              </div>
            </div>
          )}
        </div>
        
        {editingId !== task.id && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onStartEdit(task.id, task.text)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Timer/Stopwatch Section */}
      <div className="ml-8 bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {task.timer.mode === 'timer' ? <Timer size={16} /> : <Clock size={16} />}
            <span className="text-sm font-medium">
              {task.timer.mode === 'timer' ? 'Timer' : 'Stopwatch'}
            </span>
            <span className={`text-lg font-mono ${
              task.timer.mode === 'timer' && task.timer.time <= 10 && task.timer.time > 0 
                ? 'text-red-600 font-bold' 
                : 'text-gray-700'
            }`}>
              {TimerService.formatTime(task.timer.time)}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onToggleNotes(task.id)}
              className={`transition-colors ${
                task.notes.showNotes 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Toggle Notes"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={() => onToggleTimerSettings(task.id)}
              className="text-gray-400 hover:text-gray-600"
              title="Timer Settings"
            >
              <Bell size={14} />
            </button>
          </div>
        </div>

        {/* Notes Section */}
        {task.notes.showNotes && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Task Notes</span>
            </div>
            <textarea
              value={task.notes.content}
              onChange={(e) => onUpdateNotes(task.id, e.target.value)}
              placeholder="Write your notes, progress updates, thoughts, or reminders here..."
              className="w-full p-2 text-sm border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-blue-600">
              <span>{task.notes.content.length} characters</span>
              <div className="flex items-center gap-1">
                <Save size={12} />
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => onToggleTimer(task.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
              task.timer.isRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {task.timer.isRunning ? <Pause size={14} /> : <Play size={14} />}
            {task.timer.isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => onResetTimer(task.id)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
          >
            <Square size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};