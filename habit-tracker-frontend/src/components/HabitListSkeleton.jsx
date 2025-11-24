const HabitListSkeleton = ({ count = 4 }) => {
  return (
    <div className="habit-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="habit-item skeleton" />
      ))}
    </div>
  );
};

export default HabitListSkeleton;
