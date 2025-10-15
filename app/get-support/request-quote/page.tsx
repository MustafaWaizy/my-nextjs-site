"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestQuotePage() {
  const [step, setStep] = useState(1);
  const [showServices, setShowServices] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

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

  const handleNext = () => {
    if (step < steps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setShowServices(false); // Close dropdown after selection
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  return (
    <div className="py-16 px-6 max-w-3xl mx-auto font-orbitron">
      {/* Title */}
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

      {/* Step-by-step Form */}
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

          {/* Step 3: Mobile Number */}
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
                 Which <strong className="text-cyan-500">services</strong>{" "}
                are you interested in?
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

              {/* Services Dropdown Button */}
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

          {/* Step 5: Project Vision */}
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
                 Tell us about your{" "}
                <strong className="text-purple-500">project vision</strong>.
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

          {/* Step 6: Budget & Timeline */}
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
            onClick={() => alert(" Quote request submitted!")}
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Submit Your Request
          </button>
        )}
      </div>
    </div>
  );
}
