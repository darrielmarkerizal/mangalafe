// components/StatCard.jsx
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  isLoading = false,
}) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        )}
        {isLoading ? (
          <Skeleton className="h-5 w-5 rounded-full" />
        ) : (
          <Icon className={`h-5 w-5 ${iconColor}`} />
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-7 w-16 mt-2" />
      ) : (
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
      )}
      {isLoading ? (
        <Skeleton className="h-3 w-32 mt-2" />
      ) : (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
