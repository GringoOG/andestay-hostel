import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+3rem)] pb-6">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">Contact</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 max-w-lg text-[var(--ink-soft)]">
              Questions about a stay, availability, or a private celebration — send us a message and
              we’ll get back to you shortly.
            </p>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
