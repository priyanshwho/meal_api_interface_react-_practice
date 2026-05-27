export const MealsSkeleton = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] shadow-[0_16px_44px_rgba(88,30,40,0.1)]"
        >
          <div className="aspect-[4/3] animate-pulse bg-[linear-gradient(110deg,var(--surface-soft)_8%,var(--surface-strong)_18%,var(--surface-soft)_33%)] [background-size:200%_100%]" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-[var(--surface-strong)]" />
            <div className="h-3 w-full animate-pulse rounded-full bg-[var(--surface-strong)]" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-[var(--surface-strong)]" />
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--surface-strong)]" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-[var(--surface-strong)]" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-10 flex-1 animate-pulse rounded-full bg-[var(--surface-strong)]" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--surface-strong)]" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
