export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Hello, theme.</h1>
        <p className="text-lg opacity-70">If you can see this in dark mode, the system works.</p>
      </div>
    </main>
  );
}