//출석 뱃지

export default function Badge({ text }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '4px',
        right: '4px',
        backgroundColor: '#e91e63',
        color: '#fff',
        borderRadius: '12px',
        padding: '2px 6px',
        fontSize: '0.7em',
      }}
    >
      {text}
    </div>
  );
}
