import { useState } from 'react'
import { Mail } from 'lucide-react'

const EMAIL = 'bushidokksa@gmail.com'
const INSTAGRAM_URL =
  'https://www.instagram.com/bushido_karate_kickboxing_dojo'
const FACEBOOK_URL = 'https://www.facebook.com/share/18iEX41qZh/'
const MAP_LINK = 'https://maps.app.goo.gl/NvQtZn4Wf2i1Q2hv7'
const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.0!2d72.8!3d19.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890'

function InstagramIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

const CONTACT_CARDS = [
  {
    icon: <Mail size={22} />,
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    cta: 'Send Email',
  },
  {
    icon: <InstagramIcon />,
    label: 'Instagram',
    value: '@bushido_karate_kickboxing_dojo',
    href: INSTAGRAM_URL,
    cta: 'Follow Us',
    external: true,
  },
  {
    icon: <FacebookIcon />,
    label: 'Facebook',
    value: 'Bushido Academy',
    href: FACEBOOK_URL,
    cta: 'Like Our Page',
    external: true,
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(
      form.subject || 'Enquiry from Bushido Academy website'
    )
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      {/* HERO BANNER */}
      <section className="relative py-24 sm:py-28 border-b border-neutral-900 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.18), transparent 60%), #0a0a0a',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #dc2626 0 2px, transparent 2px 80px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-4">
            Connect With Us
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide text-white">
            Get In Touch
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-neutral-700" />
            <span className="h-1 w-24 bg-red-600" />
            <span className="h-px w-12 bg-neutral-700" />
          </div>
          <p className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto">
            Have questions about training, classes, or joining the academy?
            We&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_CARDS.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noopener noreferrer' : undefined}
                className="group relative bg-[#171717] border border-neutral-800 hover:border-red-600 p-8 rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.4)] flex flex-col"
              >
                <span className="absolute top-0 left-0 h-1 w-0 bg-red-600 group-hover:w-full transition-all duration-500" />
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 mb-5 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {card.icon}
                </div>
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-2">
                  {card.label}
                </p>
                <p className="text-white font-semibold break-all mb-6 flex-1">
                  {card.value}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-400 group-hover:text-red-600 transition-colors">
                  {card.cta}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="py-16 sm:py-20 border-t border-neutral-900 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* INFO */}
            <div className="lg:col-span-2">
              <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
                Send a Message
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide mb-5">
                Drop Us a Line
              </h2>
              <span className="block h-1 w-16 bg-red-600 mb-6" />
              <p className="text-neutral-400 leading-relaxed mb-8">
                Whether you&rsquo;re a beginner curious about starting your
                journey or an experienced martial artist looking for advanced
                training, we&rsquo;re here to help. Fill in the form and
                we&rsquo;ll get back to you.
              </p>

              <div className="space-y-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-4 p-4 bg-[#171717] border border-neutral-800 hover:border-red-600 rounded-sm transition-colors group"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">
                      Email
                    </p>
                    <p className="text-white font-semibold text-sm break-all">
                      {EMAIL}
                    </p>
                  </div>
                </a>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#171717] border border-neutral-800 hover:border-red-600 rounded-sm transition-colors group"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-red-950/40 border border-red-900/50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <MapPinIcon />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">
                      Location
                    </p>
                    <p className="text-white font-semibold text-sm">
                      Mumbai, India
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-3 bg-[#171717] border border-neutral-800 p-6 sm:p-10 rounded-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="subject"
                  className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your interest, age group, experience level..."
                  className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-600 focus:outline-none text-white px-4 py-3 rounded-sm placeholder:text-neutral-600 transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="group mt-7 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.6)]"
              >
                Send Message
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </button>
              <p className="mt-3 text-xs text-neutral-500">
                Submitting opens your email client addressed to {EMAIL}.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-bold mb-3">
              Visit the Dojo
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
              Find Us on the Map
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="h-px w-8 bg-neutral-700" />
              <span className="w-2 h-2 bg-red-600 rotate-45" />
              <span className="h-px w-8 bg-neutral-700" />
            </div>
          </div>
        </div>
        <div className="w-full border-t-2 border-red-600">
          <iframe
            src={MAP_EMBED}
            title="Bushido Academy Location"
            width="100%"
            height="500"
            style={{ border: 0, filter: 'grayscale(0.4) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full"
          />
        </div>
      </section>
    </div>
  )
}
