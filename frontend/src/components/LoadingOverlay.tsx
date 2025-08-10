interface LoadingOverlayProps {
  label: string;
}

export function LoadingOverlay({ label }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/80 pt-8">
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
