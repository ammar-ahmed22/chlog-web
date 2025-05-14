import { cn } from "@/lib/utils";

export interface CodeBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBadge({
  children,
  className,
}: CodeBadgeProps) {
  return (
    <code
      className={cn(
        "text-xs bg-gray-200 px-2 py-1 rounded font-mono",
        className,
      )}>
      {children}
    </code>
  );
}
