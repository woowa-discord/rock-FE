export default function Badge({ text }) {
  return (
    <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
      {text}
    </span>
  );
}
