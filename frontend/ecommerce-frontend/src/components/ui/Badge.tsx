type BadgeProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};

export function Badge({ children, className = "" }: Readonly<BadgeProps>) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-4 py-0.5 text-xs font-light leading-relaxed  ${className}`}
    >
      {children}
    </span>
  );
}