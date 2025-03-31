// components/StatCard.jsx
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  isLoading = false,
}) {
  const iconColorClass = iconColor.split("-")[1] || "primary";

  return (
    <motion.div
      className="rounded-xl border bg-white shadow-sm overflow-hidden group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Decorative left border */}
      <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/60 to-primary/10 group-hover:w-1.5 transition-all duration-200"></div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <motion.h3
              className="text-sm font-semibold tracking-tight text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>
          )}

          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <motion.div
              className={`p-2.5 rounded-full bg-${iconColorClass}-50 group-hover:bg-${iconColorClass}-100 transition-colors duration-200`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </motion.div>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-9 w-24 mt-3" />
        ) : (
          <motion.div
            className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {value}
          </motion.div>
        )}

        {isLoading ? (
          <Skeleton className="h-3 w-32 mt-3" />
        ) : (
          <motion.p
            className="text-xs text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Hover reveal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
}
