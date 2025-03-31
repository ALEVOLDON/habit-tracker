const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  progress: [String], // list of dates in YYYY-MM-DD format
  createdAt: { type: Date, default: Date.now }
});

// Метод для расчета статистики за период
habitSchema.methods.getStats = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Подсчитываем выполненные привычки
  const completedDates = this.progress.filter(date => 
    date >= startDate && date <= endDate
  );

  // Для еженедельных привычек считаем только по неделям
  if (this.frequency === 'weekly') {
    // Считаем количество полных недель в периоде
    const weeks = Math.ceil((end - start + 1) / (7 * 24 * 60 * 60 * 1000));
    const completedWeeks = completedDates.length;
    return {
      total: weeks,
      completed: completedWeeks,
      percentage: weeks > 0 ? Math.round((completedWeeks / weeks) * 100) : 0,
      streak: this.calculateStreak(completedDates)
    };
  }

  // Для ежедневных привычек
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  const total = dates.length;
  const completed = completedDates.length;
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    streak: this.calculateStreak(completedDates)
  };
};

// Метод для расчета текущей серии
habitSchema.methods.calculateStreak = function(completedDates) {
  if (!completedDates.length) return 0;

  const sortedDates = [...completedDates].sort();
  let streak = 1;
  let currentDate = new Date(sortedDates[sortedDates.length - 1]);

  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const date = new Date(sortedDates[i]);
    const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

    if ((this.frequency === 'daily' && diffDays === 1) || 
        (this.frequency === 'weekly' && diffDays <= 7)) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = mongoose.model('Habit', habitSchema);
