import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          Open Source Project
        </span>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Help Build the Future of Network QoS
        </h2>

        {/* Description */}
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          MycoFlow is an open-source project exploring bio-inspired approaches 
          to network traffic management. Contribute, test, or just star us on GitHub!
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#demo"
            className="btn-primary text-lg px-8 py-4"
          >
            Try Interactive Demo
          </Link>
          <a
            href="https://github.com/bariscanatakli/MycoFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg px-8 py-4"
          >
            View on GitHub
          </a>
        </div>

        {/* Project status */}
        <div className="mt-12 pt-12 border-t border-border/50">
          <p className="text-sm text-muted mb-6">Currently in active development</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">OpenWrt Target</span>
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">eBPF + CAKE</span>
            <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">MIT License</span>
          </div>
        </div>
      </div>
    </section>
  );
}
