/** Genovation's diamond G, redrawn as flat vector so it holds at any size. */
export default function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" role="img" aria-label="Genovation AI">
      <rect x="6" y="6" width="28" height="28" rx="4" transform="rotate(45 20 20)" fill="#E9E3D6" />
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontFamily="var(--font-archivo), Arial, sans-serif"
        fontSize="19"
        fontWeight="700"
        fill="#16202D"
      >
        G
      </text>
    </svg>
  );
}
