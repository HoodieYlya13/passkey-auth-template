export default function Loading() {
  return (
    <div className="fixed top-1/2 left-1/2 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-background" />
    </div>
  );
}
