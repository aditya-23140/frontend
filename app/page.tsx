"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Leaf,
  Network,
  Shield,
  Zap,
  CheckCircle,
  Brain,
  Lock,
  Gauge,
} from "lucide-react";
import Link from "next/link";

const FEDERATED_NODES = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * Math.PI * 2) / 6;
  return {
    x: 200 + Math.cos(angle) * 140,
    y: 200 + Math.sin(angle) * 140,
  };
});

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Architecture", href: "#architecture" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" },
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description:
        "Hierarchical CNNs trained on diverse plant disease datasets with 93.5% accuracy",
    },
    {
      icon: Lock,
      title: "Privacy Preserved",
      description:
        "Federated learning ensures raw agricultural data never leaves your farm",
    },
    {
      icon: Gauge,
      title: "Real-time Detection",
      description:
        "Instant disease identification with sub-second inference times",
    },
    {
      icon: Network,
      title: "Collaborative Learning",
      description:
        "Models improve collectively while maintaining individual data privacy",
    },
  ];

  const benefits = [
    "Early disease detection prevents crop loss",
    "Reduce pesticide usage with targeted treatment",
    "Improve yield predictions and planning",
    "Access to state-of-the-art AI without data sharing",
    "Continuous model improvement through federated updates",
    "Compliance with data privacy regulations",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">PlantGuard</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t border-border py-4 md:hidden">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-2 text-sm font-medium text-secondary-foreground">
                  <Network className="h-4 w-4" />
                  Federated Learning Technology
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                  Federated Deep Learning for Secure Plant Disease Detection
                </h1>
                <p className="text-lg text-foreground/70 leading-relaxed text-balance">
                  A privacy-preserving AI framework enabling accurate,
                  collaborative plant disease prediction without sharing raw
                  data. Powered by hierarchical CNNs and PyTorch.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={"/upload"}>
                  <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95">
                    Try Demo
                  </button>
                </Link>
                <Link
                  href={"/FederatedModel.docx"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold transition-all hover:bg-primary/5">
                    Download Research Paper
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    93.5%
                  </div>
                  <p className="text-sm text-foreground/60">
                    Federated Accuracy
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm font-semibold">Privacy</span>
                  </div>
                  <p className="text-sm text-foreground/60">Data Preserved</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="text-sm font-semibold">Real-time</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Sub-second Inference
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
              {/* Federated Network Visualization */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-md"
                aria-label="Federated learning network visualization"
              >
                {/* Central node */}
                <circle
                  cx="200"
                  cy="200"
                  r="40"
                  fill="currentColor"
                  className="text-primary"
                  opacity="0.9"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  opacity="0.3"
                />

                {/* Outer nodes - Use pre-calculated positions to avoid hydration mismatch */}
                {FEDERATED_NODES.map((node, i) => (
                  <g key={i}>
                    {/* Connection line */}
                    <line
                      x1="200"
                      y1="200"
                      x2={node.x}
                      y2={node.y}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-secondary"
                      opacity="0.4"
                    />
                    {/* Node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill="currentColor"
                      className="text-secondary"
                      opacity="0.7"
                    />
                    {/* Node border */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-secondary"
                      opacity="0.3"
                    />
                  </g>
                ))}

                {/* Center label */}
                <text
                  x="200"
                  y="210"
                  textAnchor="middle"
                  className="text-primary-foreground font-bold"
                  fontSize="14"
                >
                  AI
                </text>
              </svg>

              {/* Floating cards - Use semantic color tokens for dark mode */}
              <div className="absolute top-8 right-8 bg-card/80 backdrop-blur rounded-lg p-4 shadow-lg max-w-xs border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-card-foreground">
                    Disease Detection
                  </span>
                </div>
                <p className="text-xs text-foreground/60">
                  Real-time plant health analysis
                </p>
              </div>

              <div
                className="absolute bottom-8 left-8 bg-card/80 backdrop-blur rounded-lg p-4 shadow-lg max-w-xs border border-border"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-card-foreground">
                    Privacy First
                  </span>
                </div>
                <p className="text-xs text-foreground/60">
                  No raw data sharing required
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="architecture"
        className="relative py-20 md:py-32 border-t border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Our federated learning approach combines cutting-edge AI with
              privacy-first architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="results" className="relative py-20 md:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Choose PlantGuard?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground/80">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-24 w-24 text-primary/30 mx-auto mb-4" />
                <p className="text-foreground/60">
                  Advanced federated learning architecture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="about"
        className="relative py-20 md:py-32 border-t border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              A seamless workflow that protects your data while delivering
              powerful insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Images",
                description:
                  "Capture plant leaf images from your fields using any device",
              },
              {
                step: "2",
                title: "Local Analysis",
                description:
                  "Images are processed locally on your device using the federated model",
              },
              {
                step: "3",
                title: "Get Results",
                description:
                  "Receive instant disease diagnosis and treatment recommendations",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="p-8 rounded-lg border border-border bg-card/50">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-foreground/60">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="relative py-20 md:py-32 bg-primary/5 border-t border-border"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join farmers and agricultural organizations using federated learning
            for smarter crop management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95">
              Start Free Trial
            </button>
            <button className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold transition-all hover:bg-primary/5">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-semibold">PlantGuard</span>
              </div>
              <p className="text-sm text-foreground/60">
                Federated learning for agricultural AI
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              {
                title: "Resources",
                links: ["Documentation", "API Docs", "Support"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-foreground/60 hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground/60">
              © 2025 PlantGuard. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-foreground/60 hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
