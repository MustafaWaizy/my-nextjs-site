"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

export default function ContactFormWizard() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    details: "",
    contactMethod: "",
    deliveryMethod: "",
    attachments: null as FileList | null,
    consent: false,
  });

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked, files } = target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, attachments: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("⚠️ Please consent to data processing before submitting.");
      return;
    }

    if (!captchaValue) {
      alert("⚠️ Please verify that you are not a robot.");
      return;
    }

    setSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "attachments" && value instanceof FileList) {
        Array.from(value).forEach((file) => payload.append("attachments", file));
      } else if (value !== null) {
        payload.append(key, String(value));
      }
    });

    payload.append("g-recaptcha-response", captchaValue || "");

    const res = await fetch("/api/contact", {
      method: "POST",
      body: payload,
    });

    setSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("❌ Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center mt-[64px]">
        <NeuralNetworkBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white shadow-2xl rounded-2xl p-10 max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex justify-center mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thank you, {formData.firstName}!
          </h2>
          <p className="text-gray-600 mb-6">
            Your request for <strong>{formData.service}</strong> has been successfully submitted.
            Our team will contact you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                company: "",
                service: "",
                details: "",
                contactMethod: "",
                deliveryMethod: "",
                attachments: null,
                consent: false,
              });
            }}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-start justify-center mt-[64px]">
      <NeuralNetworkBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-2xl font-extrabold text-left mb-2 bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
          Get in Touch!
        </h1>
        <p className="text-left text-gray-600 mb-6">
          Tell us how we can help, and we’ll reach out
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${(step / 4) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 1: Basic Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name *"
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name *"
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email *"
                onChange={handleChange}
                required
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <label htmlFor="phone" className="sr-only">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 2: Business Context</h2>
              <label htmlFor="company" className="sr-only">Company</label>
              <input
                id="company"
                name="company"
                placeholder="Company / Organization"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <label htmlFor="service" className="sr-only">Service</label>
              <select
                id="service"
                name="service"
                onChange={handleChange}
                required
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Select Service —</option>
                <option>AI Chatbots & Virtual Assistant</option>
                <option>AI Strategy Consulting</option>
                <option>Predictive Analytics</option>
                <option>Web Development</option>
                <option>IT Security Services</option>
                <option>Cloud Services</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 3: Project Details</h2>
              <label htmlFor="details" className="sr-only">Details</label>
              <textarea
                id="details"
                name="details"
                placeholder="Tell us more about your request..."
                rows={4}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              ></textarea>
              <label htmlFor="attachments" className="sr-only">Attachments</label>
              <input
                id="attachments"
                type="file"
                name="attachments"
                multiple
                onChange={handleChange}
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 4: Preferences</h2>
              <label htmlFor="contactMethod" className="sr-only">Contact Method</label>
              <select
                id="contactMethod"
                name="contactMethod"
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Preferred Contact Method —</option>
                <option>Email</option>
                <option>Phone</option>
              </select>
              <label htmlFor="deliveryMethod" className="sr-only">Delivery Method</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                onChange={handleChange}
                required
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Preferred Service Delivery —</option>
                <option>Remote</option>
                <option>Onsite</option>
                <option>No Preference</option>
              </select>
              <label htmlFor="consent" className="flex items-center space-x-2 mt-4 text-sm text-gray-700">
                <input
                  id="consent"
                  type="checkbox"
                  name="consent"
                  onChange={handleChange}
                  required
                  className="h-5 w-5 text-cyan-500"
                />
                <span>
                  I consent to LinorAI securely processing my information for the purpose of this request.
                </span>
              </label>

              <div className="mt-4">
                <ReCAPTCHA
                  sitekey="6Lev8O0rAAAAAESgfW6JY7lV9yhQ07_FJrHf6uPr"
                  onChange={handleCaptchaChange}
                />
                {!captchaValue && (
                  <p className="text-red-500 text-sm mt-1">
                    Please verify that you are not a robot.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                Next →
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={submitting}
                type="submit"
                className={`ml-auto px-6 py-2 text-white rounded-lg shadow-md transition ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg"
                }`}
              >
                {submitting ? "Submitting..." : "Submit"}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
