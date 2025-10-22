// src/services/TimerService.js
export class TimerService {
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  static showTimerAlert(taskText) {
    // Create a simple audio beep
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmIbAjih2/LMeSQFjMrr2QAAABcAAADfCAAAAgAAAA==');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    // Try to show browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Finished!', {
        body: `Timer for "${taskText}" has finished!`,
        icon: '⏰'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Finished!', {
            body: `Timer for "${taskText}" has finished!`,
            icon: '⏰'
          });
        }
      });
    }
    
    // Fallback alert
    alert(`⏰ Timer finished for: "${taskText}"`);
  }

  static requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}