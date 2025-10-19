"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import NeuralNetworkBackground from "../../../../LinorAI/components/NeuralNetworkBackground";

export default function RequestQuotePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false); // ✅ show success screen
  const [submitting, setSubmitting] = useState(false); // optional disable submit
  const [showServices, setShowServices] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<{ name: string; data: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    services: [] as string[],
    customService: "",
    vision: "",
    budget: "",
    customBudget: "",
    timeline: "",
    customTimeline: "",
  });

  const steps = 6;

  const availableServices = [
    "AI Chatbots",
    "Virtual Assistants",
    "Predictive Analytics",
    "Intelligent Automation",
    "Web Development",
    "E-Commerce",
    "API Integration",
    "Cloud Services",
    "IT Security",
    "Other",
  ];

  const budgets = [
    "< $5,000",
    "$5,000-$10,000",
    "$10,000-$25,000",
    "$25,000-$50,000",
    "> $50,000",
    "Other",
  ];

  const timelines = [
    "2-4 weeks",
    "1-2 months",
    "3-6 months",
    "6+ months",
    "Other",
  ];

  // ---------------- Handlers ----------------
  const handleNext = () => {
    if (step < steps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleService = (service: string) => {
    if (formData.services.includes(service)) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s !== service),
      });
    } else {
      setFormData({ ...formData, services: [...formData.services, service] });
    }
    setShowServices(false);
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const base64Files = await Promise.all(
      filesArray.map(
        (file) =>
          new Promise<{ name: string; data: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const base64Data = (reader.result as string).split(",")[1];
              resolve({ name: file.name, data: base64Data });
            };
            reader.onerror = (error) => reject(error);
          })
      )
    );
    setAttachments(base64Files);
  };

  const handleSubmit = async () => {
    if (!recaptchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken, attachments }),
      });

      if (res.ok) {
        setSubmitted(true); // ✅ show success screen
      } else {
        alert("Failed to submit your request. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the request.");
    }

    setSubmitting(false);
  };

  // ---------------- Success Screen ----------------
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
            Thank you, {formData.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            Your request for <strong>{formData.services.join(", ")}</strong> has been successfully submitted.
            Our team will contact you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                name: "",
                email: "",
                mobile: "",
                services: [],
                customService: "",
                vision: "",
                budget: "",
                customBudget: "",
                timeline: "",
                customTimeline: "",
              });
              setAttachments([]);
              setRecaptchaToken(null);
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
    <div className="py-16 px-6 max-w-3xl mx-auto font-orbitron">
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-lg">
        Request a Quote
      </h1>

      {/* Progress */}
      <div className="flex justify-between items-center mb-10">
        <span className="text-sm text-gray-500">
          Step {step} of {steps}
        </span>
        <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / steps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Form Container */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                Hi there! What’s your{" "}
                <strong className="text-cyan-500">full name</strong>?
              </p>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </motion.div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                Great! What’s the best{" "}
                <strong className="text-purple-500">email</strong> to reach
                you?
              </p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500"
              />
            </motion.div>
          )}

          {/* Step 3: Mobile */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                What’s your <strong className="text-purple-500">mobile number</strong>?
              </p>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500"
              />
            </motion.div>
          )}

          {/* Step 4: Services */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                Which <strong className="text-cyan-500">services</strong> are you interested in?
              </p>

              {/* Selected Services Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.services.map((s) => (
                  <div
                    key={s}
                    className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeService(s)}
                      className="ml-2 text-purple-500 hover:text-purple-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Services Dropdown */}
              <button
                type="button"
                onClick={() => setShowServices(!showServices)}
                className="px-4 py-3 bg-gray-100 rounded-lg w-full text-left border border-gray-300 hover:bg-gray-200"
              >
                --Select services--
              </button>

              <AnimatePresence>
                {showServices && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
                  >
                    {availableServices.map((s) => {
                      const selected = formData.services.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className={`px-4 py-2 rounded-lg border text-left transition-colors duration-200 ${
                            selected
                              ? "bg-purple-500 text-white border-purple-500"
                              : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {formData.services.includes("Other") && (
                <input
                  type="text"
                  name="customService"
                  placeholder="Please specify your service"
                  value={formData.customService}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 mt-4"
                />
              )}
            </motion.div>
          )}

          {/* Step 5: Vision */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                Tell us about your <strong className="text-purple-500">project vision</strong>.
              </p>
              <textarea
                name="vision"
                placeholder="Describe your goals..."
                value={formData.vision}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500"
              />
            </motion.div>
          )}

          {/* Step 6: Budget & Timeline + Attachments + reCAPTCHA */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                Finally, what’s your <strong className="text-cyan-500">budget</strong> &{" "}
                <strong className="text-purple-500">timeline</strong>?
              </p>

              {/* Budget */}
              <button
                type="button"
                onClick={() => setShowBudget(!showBudget)}
                className="px-4 py-3 bg-gray-100 rounded-lg w-full text-left border border-gray-300 hover:bg-gray-200"
              >
                {formData.budget || "--Select your budget--"}
              </button>
              <AnimatePresence>
                {showBudget && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
                  >
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, budget: b });
                          setShowBudget(false);
                        }}
                        className="px-4 py-2 rounded-lg border bg-gray-100 border-gray-300 hover:bg-gray-200 text-left"
                      >
                        {b}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {formData.budget === "Other" && (
                <input
                  type="text"
                  name="customBudget"
                  placeholder="Enter your budget"
                  value={formData.customBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 mt-4"
                />
              )}

              {/* Timeline */}
              <button
                type="button"
                onClick={() => setShowTimeline(!showTimeline)}
                className="px-4 py-3 bg-gray-100 rounded-lg w-full text-left border border-gray-300 hover:bg-gray-200 mt-4"
              >
                {formData.timeline || "--Select your timeline--"}
              </button>
              <AnimatePresence>
                {showTimeline && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
                  >
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, timeline: t });
                          setShowTimeline(false);
                        }}
                        className="px-4 py-2 rounded-lg border bg-gray-100 border-gray-300 hover:bg-gray-200 text-left"
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {formData.timeline === "Other" && (
                <input
                  type="text"
                  name="customTimeline"
                  placeholder="Enter your timeline"
                  value={formData.customTimeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 mt-4"
                />
              )}

              {/* Attachments */}
              <div className="mt-4">
                <label className="block mb-2 text-gray-700">Attachments (optional)</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              {/* reCAPTCHA */}
              <div className="mt-6">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        {step < steps ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-3 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-400 to-blue-500"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Your Request"}
          </button>
        )}
      </div>
    </div>
  );
}
