"use client";
import { EmailContactForm } from "@/components/EmailContactForm";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

type Feedback = {
  name: string;
  clazz: string;
  message: string;
  rating?: number;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const sectionTransition = { duration: 0.6, ease: "easeOut" };

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
};

function StatCard({ label, value, suffix = "+", delay = 0 }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);
  const inView = useInView(cardRef, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || hasAnimated.current || !numberRef.current) return;

    hasAnimated.current = true;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(latest) {
        if (!numberRef.current) return;
        numberRef.current.textContent = Math.round(latest).toString();
      },
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay, ...sectionTransition }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 40px rgba(15,23,42,0.15)",
      }}
      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-sky-50 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        <span ref={numberRef}>0</span>
        {suffix}
      </dd>
    </motion.div>
  );
}

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      name: "Aarav (Student)",
      clazz: "Class 10",
      message:
        "Sir explains every concept with simple examples. My maths marks improved a lot this year.",
      rating: 5,
    },
    {
      name: "Parent of Riya",
      clazz: "Class 8",
      message:
        "Very disciplined and focused teaching. Regular tests and personal attention.",
      rating: 5,
    },
  ]);

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    clazz: "",
    message: "",
    rating: "",
  });

  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackStatus(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      const ratingNumber = feedbackForm.rating
        ? Number(feedbackForm.rating)
        : undefined;

      setFeedbacks((prev) => [
        {
          name: feedbackForm.name,
          clazz: feedbackForm.clazz,
          message: feedbackForm.message,
          rating: ratingNumber,
        },
        ...prev,
      ]);

      setFeedbackForm({ name: "", clazz: "", message: "", rating: "" });
      setFeedbackStatus("Thank you! Your feedback has been submitted.");
    } catch (err) {
      setFeedbackStatus("Something went wrong. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <main
      suppressHydrationWarning
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-0 py-8 sm:px-0 sm:py-10 md:gap-20 md:py-14 lg:py-16"
    >
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-brand-400 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
        >
          <span className="text-base" aria-hidden="true">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={sectionTransition}
        className="grid gap-10 lg:grid-cols-[3fr,2fr] lg:items-center"
      >
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-700/60">
            Focused home tuition · Classes 6–12
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              Join Our <span className="text-brand-400">Tuition Classes</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Learn with{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Mr. Sharma
              </span>
              , an experienced teacher helping students build strong concepts in{" "}
              <span className="font-medium">Mathematics, Science, and English</span>{" "}
              with clear explanations, regular practice, and personal attention.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-300/70 transition-transform transition-shadow hover:translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/70 sm:w-auto"
            >
              Contact Teacher
            </a>
            <a
              href="#query"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-900 hover:text-slate-50 hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-brand-500 dark:hover:text-brand-50 sm:w-auto"
            >
              Send a Query
            </a>
          </div>

          <dl className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
            <StatCard label="Students Taught" value={250} suffix="+" delay={0.3} />
            <StatCard label="Years Experience" value={8} suffix="+" delay={0.4} />
            <StatCard label="Average Score" value={90} suffix="%+" delay={0.5} />
          </dl>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={sectionTransition}
          className="relative h-52 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-200 p-[1px] shadow-lg sm:h-60 md:h-72 lg:h-80 lg:mt-0 mt-6 dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(191,219,254,0.5),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_10%_0,rgba(15,23,42,0.7),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(30,64,175,0.6),transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-white/70 to-blue-50/70 p-6 text-slate-800 md:p-8 dark:from-slate-900/80 dark:to-blue-900/60 dark:text-slate-50">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500 md:text-xs dark:text-slate-300">
                Personal Coaching
              </p>
              <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-800 md:text-xl dark:text-slate-50">
                Strong concepts, regular practice, clear progress.
              </h2>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700 md:text-sm dark:text-slate-100/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                <span>Small batch size for focused attention.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                <span>Regular tests with detailed discussion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                <span>Dedicated doubt-solving support after class.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.section>

      {/* About Teacher */}
      <motion.section
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeInUp}
        transition={sectionTransition}
        className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-7 backdrop-blur md:px-7 md:py-8 dark:border-slate-800/80 dark:bg-slate-900/70"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
              About the Teacher
            </h2>
            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Mr. Rohan Sharma
              </span>{" "}
              is a dedicated tutor with a passion for simplifying difficult
              topics and making learning enjoyable. He focuses on concept
              clarity, exam strategy, and individual guidance for each student.
            </p>
          </div>

          <dl className="grid gap-4 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2 md:text-xs lg:text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Qualifications
              </dt>
              <dd className="mt-1">
                B.Sc (Mathematics), M.Sc (Physics), B.Ed
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Experience
              </dt>
              <dd className="mt-1">8+ years of teaching Classes 6–12</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Subjects
              </dt>
              <dd className="mt-1">
                Mathematics, Physics, Chemistry, Science, English
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Teaching Style
              </dt>
              <dd className="mt-1">
                Concept-based teaching with regular doubts and tests
              </dd>
            </div>
          </dl>
        </div>
      </motion.section>

      {/* Classes Offered */}
      <motion.section
        id="classes"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={sectionTransition}
        className="space-y-5"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
            Classes Offered
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Offline & Online batches available
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Class 6–8",
              subtitle: "Foundation & Basics",
              subjects: ["Mathematics", "Science", "English"],
            },
            {
              title: "Class 9–10",
              subtitle: "Board Exam Focus",
              subjects: ["Maths", "Science (Phy/Chem/Bio)", "English"],
            },
            {
              title: "Class 11–12",
              subtitle: "Advanced Exam Prep",
              subjects: ["Maths", "Physics", "Chemistry"],
            },
          ].map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: 0.08 * index,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                scale: 1.01,
                transition: { type: "spring", stiffness: 220, damping: 18 },
              }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/80 dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_18px_40px_rgba(15,23,42,0.9)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-x-[-10%] -top-24 h-48 bg-[radial-gradient(circle,_rgba(129,140,248,0.22),transparent_55%)]" />
              </div>
              <div className="relative space-y-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-lg">
                  {card.title}
                </h3>
                <p className="text-xs font-medium text-brand-300">
                  {card.subtitle}
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                  {card.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Student Feedback */}
      <motion.section
        id="feedback"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeInUp}
        transition={sectionTransition}
        className="grid gap-8 md:grid-cols-[3fr,2fr]"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
            What Students Say
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Hear from students and parents about their experience with these
            tuition classes.
          </p>

          <div className="grid gap-4 pb-1 sm:grid-cols-2 lg:grid-cols-2">
            {feedbacks.map((fb, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70"
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">{fb.message}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{fb.name}</p>
                    <p>{fb.clazz}</p>
                  </div>
                  {fb.rating && (
                    <p className="text-amber-300">
                      {"★".repeat(fb.rating)}
                      <span className="text-slate-500">
                        {" "}
                        ({fb.rating}/5)
                      </span>
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Submit Your Feedback
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Students and parents can share their experience here.
          </p>

          <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300">Name</label>
              <input
                required
                value={feedbackForm.name}
                onChange={(e) =>
                  setFeedbackForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500/40 placeholder:text-slate-400 focus:ring dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300">Class</label>
              <input
                required
                value={feedbackForm.clazz}
                onChange={(e) =>
                  setFeedbackForm((f) => ({ ...f, clazz: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500/40 placeholder:text-slate-400 focus:ring dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                placeholder="e.g. Class 10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300">Feedback</label>
              <textarea
                required
                value={feedbackForm.message}
                onChange={(e) =>
                  setFeedbackForm((f) => ({ ...f, message: e.target.value }))
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500/40 placeholder:text-slate-400 focus:ring dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                placeholder="Share your experience..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300">
                Star Rating (optional)
              </label>
              <select
                value={feedbackForm.rating}
                onChange={(e) =>
                  setFeedbackForm((f) => ({ ...f, rating: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500/40 focus:ring dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50"
              >
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            {feedbackStatus && (
              <p className="text-xs text-emerald-400">{feedbackStatus}</p>
            )}
            <button
              type="submit"
              disabled={submittingFeedback}
              className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </motion.section>

      {/* Contact / Query */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={sectionTransition}
        className="grid gap-8 md:grid-cols-[2.2fr,2fr]"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
            Contact & Location
          </h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Classes are conducted at the teacher&apos;s home and online (as per
            batch). Reach out to know about available timings, fees, and batch
            details.
          </p>
          <dl className="mt-4 space-y-2 text-sm text-slate-800 dark:text-slate-200">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Teacher
              </dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                Mr. Rohan Sharma
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Phone (for calls / WhatsApp)
              </dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                +91-9xxxxxxxxx {/* replace with actual number */}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                teacher@example.com {/* replace with actual email */}
              </dd>
            </div>
          </dl>
        </div>

        <div
          id="query"
          className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70"
        >
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Send a Query by Email
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Fill in your details and the teacher will respond as soon as
            possible.
          </p>

          <div className="mt-4">
            <EmailContactForm />
          </div>
        </div>
      </motion.section>

      <footer className="mt-6 border-t border-slate-800/80 pt-4 text-xs text-slate-500">
        © {new Date().getFullYear()} Tuition Classes by Mr. Sharma. All rights
        reserved.
      </footer>
    </main>
  );
}

