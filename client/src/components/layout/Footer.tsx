"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="w-full border-t border-border mt-12">
      <div className="max-w-8xl mx-auto px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
        <div className="max-w-[50%]">© {currentYear} JKSoC — All India Summer Of Code</div>
        <div className="flex gap-4">
          <a className="hover:underline" href="/about">About</a>
          <a className="hover:underline" href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
