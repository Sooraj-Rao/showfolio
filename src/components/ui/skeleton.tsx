import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md dark:bg-muted-foreground/10 bg-muted-foreground/30", className)}
      {...props}
    />
  )
}

export { Skeleton }
