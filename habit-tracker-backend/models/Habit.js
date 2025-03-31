const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  progress: [String], // list of dates in YYYY-MM-DD format
  createdAt: { type: Date, default: Date.now }
});

// Метод для расчета статистики за период
habitSchema.methods.getStats = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Получаем все даты в формате YYYY-MM-DD между startDate и endDate
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  // Подсчитываем выполненные привычки
  const completedDates = this.progress.filter(date => 
    date >= startDate && date <= endDate
  );

  // Для еженедельных привычек считаем только по неделям
  if (this.frequency === 'weekly') {
    const weeks = Math.ceil(dates.length / 7);
    const completedWeeks = Math.ceil(completedDates.length / 7);
    return {
      total: weeks,
      completed: completedWeeks,
      percentage: Math.round((completedWeeks / weeks) * 100),
      streak: this.calculateStreak(completedDates)
    };
  }

  // Для ежедневных привычек
  return {
    total: dates.length,
    completed: completedDates.length,
    percentage: Math.round((completedDates.length / dates.length) * 100),
    streak: this.calculateStreak(completedDates)
  };
};

// Метод для расчета текущей серии
habitSchema.methods.calculateStreak = function(completedDates) {
  if (!completedDates.length) return 0;

  const today = new Date().toISOString().split('T')[0];
  const sortedDates = [...completedDates].sort();
  let streak = 0;
  let currentDate = new Date(today);

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = new Date(sortedDates[i]);
    const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 1 || diffDays === 0) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = mongoose.model('Habit', habitSchema);
