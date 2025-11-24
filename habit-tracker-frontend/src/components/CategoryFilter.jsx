export const CategoryFilter = ({ selectedCategory, onSelectCategory, categories, isLoading }) => {
  if (isLoading) {
    return <div className="muted">Загружаем категории...</div>;
  }

  const buttonStyle = (isActive) => ({
    padding: '6px 12px',
    cursor: 'pointer',
    border: '1px solid #d1d5db',
    borderRadius: '16px',
    backgroundColor: isActive ? '#2563eb' : '#fff',
    color: isActive ? '#fff' : '#1f2937',
  });

  return (
    <div className="category-filter">
      <button onClick={() => onSelectCategory(null)} style={buttonStyle(selectedCategory === null)}>
        Все
      </button>
      <button onClick={() => onSelectCategory('null')} style={buttonStyle(selectedCategory === 'null')}>
        Без категории
      </button>
      {categories?.map((cat) => (
        <button key={cat._id} onClick={() => onSelectCategory(cat._id)} style={buttonStyle(selectedCategory === cat._id)}>
          {cat.name}
        </button>
      ))}
    </div>
  );
};
