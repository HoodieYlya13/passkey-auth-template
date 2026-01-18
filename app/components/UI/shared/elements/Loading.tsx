export default function Loading() {
  return (
    <div className="fixed w-full min-h-fullscreen flex items-center justify-center">
      <div className="size-20 animate-spin rounded-full border-4 border-foreground border-t-background" />
    </div>
  );
}
