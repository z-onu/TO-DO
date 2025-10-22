// src/services/TaskService.js
import { WorkoutData } from '../data/WorkoutData';
import { AutomationData } from '../data/AutomationData';

export class TaskService {
  static generateWorkoutTasks(startDate) {
    return WorkoutData.workouts.map((workout, index) => {
      const taskDate = new Date(startDate);
      taskDate.setDate(startDate.getDate() + (workout.week - 1) * 7 + (workout.day - 1));
      
      const taskText = workout.type === "Rest" 
        ? `Rest Day - Week ${workout.week}`
        : `${workout.type} - Week ${workout.week}`;

      const subtasks = workout.exercises !== "—" 
        ? workout.exercises.split(', ').map((exercise, idx) => ({
            id: `${index}-${idx}`,
            text: exercise.trim(),
            completed: false
          }))
        : [];

      return {
        id: `workout-${index}`,
        text: taskText,
        completed: false,
        date: taskDate.toISOString().split('T')[0],
        project: 'fitness',
        priority: workout.type.includes('Strength') ? 'high' : 
                 workout.type.includes('Cardio') ? 'medium' : 'normal',
        createdAt: new Date().toLocaleTimeString(),
        description: workout.type !== "Rest" ? `${workout.sets}\n\n${workout.notes}` : workout.notes,
        subtasks,
        labels: ['fitness', workout.type.toLowerCase().split(' ')[0]],
        reminders: [],
        deadline: null,
        location: 'Gym',
        comments: [],
        timer: { mode: 'stopwatch', isRunning: false, time: 0, targetTime: 300, showSettings: false },
        notes: { content: `Week ${workout.week} Day ${workout.day}\n${workout.notes}`, showNotes: false }
      };
    });
  }

  static generateAutomationTasks(startDate) {
    const allTasks = [];
    let dayCounter = 1;

    AutomationData.phases.forEach((phase, phaseIndex) => {
      phase.days.forEach((automation, dayIndex) => {
        const taskDate = new Date(startDate);
        taskDate.setDate(startDate.getDate() + (dayCounter - 1));
        
        const subtasks = [
          ...automation.tasks.map((task, idx) => ({
            id: `auto-${phaseIndex}-${dayIndex}-${idx}`,
            text: task.trim(),
            completed: false
          })),
          ...automation.questions.map((q, idx) => ({
            id: `q-${phaseIndex}-${dayIndex}-${idx}`,
            text: `Q: ${q.trim()}`,
            completed: false
          }))
        ];

        allTasks.push({
          id: `automation-${dayCounter}`,
          text: `Day ${dayCounter}: ${automation.title}`,
          completed: false,
          date: taskDate.toISOString().split('T')[0],
          project: 'automation',
          priority: phase.name === 'Foundations' ? 'high' : 'medium',
          createdAt: new Date().toLocaleTimeString(),
          description: `Phase: ${phase.name}\n\nTasks:\n${automation.tasks.join('\n')}\n\nInterview Prep Questions:\n${automation.questions.join('\n')}`,
          subtasks,
          labels: ['automation', 'learning', phase.name.toLowerCase()],
          reminders: [],
          deadline: null,
          location: 'Home Office',
          comments: [],
          timer: { mode: 'stopwatch', isRunning: false, time: 0, targetTime: 1800, showSettings: false },
          notes: { content: `Phase ${phase.name} - Day ${dayCounter}\nFocus: ${automation.title}`, showNotes: false }
        });
        
        dayCounter++;
      });
    });

    return allTasks;
  }
}