"use client";

interface TryAgainButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function TryAgainButton({ className, children }: TryAgainButtonProps) {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
