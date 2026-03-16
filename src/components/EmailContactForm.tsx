"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

type EmailJsError = {
  status?: number;
  text?: string;
  message?: string;
};

export function EmailContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "Email service is not configured (missing EmailJS env vars).",
        );
      }

      emailjs.init({ publicKey });

      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
        to_email: "sumitraj72177@gmail.com",
        to: "sumitraj72177@gmail.com",
        email_to: "sumitraj72177@gmail.com",
        recipient: "sumitraj72177@gmail.com",
        recipient_email: "sumitraj72177@gmail.com",
      };

      const res = await emailjs.send(serviceId, templateId, templateParams);

      if (res.status !== 200) throw new Error("EmailJS send failed");

      setForm({ name: "", email: "", message: "" });
      setStatus("Your query has been sent successfully.");
    } catch (err: unknown) {
      const e = err as EmailJsError;
      const statusCode = typeof e?.status === "number" ? e.status : undefined;
      const text = typeof e?.text === "string" ? e.text : undefined;
      const message = typeof e?.message === "string" ? e.message : undefined;

      console.error("EmailJS error:", { status: statusCode, text, message, err });

      const details = text || message;
      setStatus(
        details
          ? `Sorry, something went wrong: ${details}`
          : "Sorry, something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white/80 p-5 shadow-md backdrop-blur-sm dark:bg-slate-900/80"
    >
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Name
        </label>
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Message
        </label>
        <textarea
          required
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
          placeholder="Ask about timings, fees, or batches..."
        />
      </div>

      {status && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">{status}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Query"}
      </button>
    </form>
  );
}