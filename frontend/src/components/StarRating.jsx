export default function StarRating({ value = 0, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="star-rating" style={{ display: 'inline-flex', gap: '4px' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          style={{
            cursor: onChange ? 'pointer' : 'default',
            color: star <= value ? 'var(--star)' : 'var(--text-muted)',
            fontSize: '18px',
            transition: 'var(--transition)'
          }}
        >
          {star <= value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
