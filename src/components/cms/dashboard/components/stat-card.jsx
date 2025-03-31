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
    <div className="rounded-xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
      <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/60 to-primary/10 group-hover:w-1.5 transition-all duration-200"></div>

      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        )}
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <div className={`p-2 rounded-full bg-${iconColor.split("-")[1]}-50`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-24 mt-3" />
      ) : (
        <div className="text-2xl sm:text-3xl font-bold mt-2">{value}</div>
      )}
      {isLoading ? (
        <Skeleton className="h-3 w-32 mt-3" />
      ) : (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
