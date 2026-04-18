
export function Stars({ rating }) {
  return (
    <span className="text-stone-400 text-xs tracking-tight">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}
