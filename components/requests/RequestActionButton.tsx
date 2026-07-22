"use client";

const VARIANTS = {
  primary:
    "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]",
  neutral:
    "rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40",
  danger:
    "rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-500 dark:border-red-500/40 dark:text-red-400 dark:hover:border-red-500",
} as const;

export default function RequestActionButton({
  action,
  requestId,
  label,
  variant = "neutral",
  confirmMessage,
}: {
  action: (formData: FormData) => void | Promise<void>;
  requestId: string;
  label: string;
  variant?: keyof typeof VARIANTS;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={
        confirmMessage
          ? (e) => {
              if (!confirm(confirmMessage)) e.preventDefault();
            }
          : undefined
      }
    >
      <input type="hidden" name="requestId" value={requestId} />
      <button type="submit" className={VARIANTS[variant]}>
        {label}
      </button>
    </form>
  );
}
