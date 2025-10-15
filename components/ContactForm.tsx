"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

// 👇 import the background
import NeuralNetworkBackground from "./NeuralNetworkBackground";

export default function ContactFormWizard() {
  const [step, setStep] = useState(1);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked, files } = e.target as any;
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

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "attachments" && value instanceof FileList) {
        Array.from(value).forEach((file) =>
          payload.append("attachments", file)
        );
      } else {
        payload.append(key, String(value));
      }
    });

    const res = await fetch("/api/contact", {
      method: "POST",
      body: payload,
    });

    if (res.ok) {
      alert(
        `✅ Thank you ${formData.firstName}! Our AI team has logged your request for ${formData.service}.`
      );
    } else {
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center mt-[64px]">
      {/* 🔥 Background component */}
      <NeuralNetworkBackground />

      {/* Form stays above background */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8"
      >
        {/* Title + Subtitle */}
        <h1 className="text-2xl font-extrabold text-left mb-2 bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
          Get in Touch!
        </h1>
        <p className="text-left text-gray-600 mb-6">
          Tell us how we can help, and we’ll reach out
        </p>

        {/* Progress Bar */}
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

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 1: Basic Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name *"
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  name="lastName"
                  placeholder="Last Name *"
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                onChange={handleChange}
                required
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 2: Business Context</h2>
              <input
                name="company"
                placeholder="Company / Organization"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <select
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

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 3: Project Details</h2>
              <textarea
                name="details"
                placeholder="Tell us more about your request..."
                rows={4}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              ></textarea>
              <input
                type="file"
                name="attachments"
                multiple
                onChange={handleChange}
                className="w-full border mt-4 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 4: Preferences</h2>
              <select
                name="contactMethod"
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Preferred Contact Method —</option>
                <option>Email</option>
                <option>Phone</option>
              </select>
              <select
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
              <label className="flex items-center space-x-2 mt-4 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="consent"
                  onChange={handleChange}
                  required
                  className="h-5 w-5 text-cyan-500"
                />
                <span>
                  I consent to LinorAI securely processing my information for the
                  purpose of this request.
                </span>
              </label>

              {/* ✅ reCAPTCHA */}
              <div className="mt-4">
                <ReCAPTCHA
                  sitekey="YOUR_RECAPTCHA_SITE_KEY"
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

          {/* Navigation Buttons */}
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
                type="submit"
                className="ml-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                Submit
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
