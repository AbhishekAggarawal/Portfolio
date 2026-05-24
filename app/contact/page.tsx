"use client";

import { motion } from "framer-motion";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "(+91) 8789830967",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "abhishekmonu2000@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Ranchi, Jharkhand, 834001",
  },
];

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  service: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  firstname: "",
  lastname: "",
  email: "",
  number: "",
  service: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing again
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Email sent successfully!",
        });
        setFormData(initialFormData);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to send email. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050d1d] px-6 pb-24 pt-36 text-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
        }}
        className="mx-auto max-w-[1160px]"
      >
        <div className="flex flex-col gap-[30px] xl:flex-row">
          {/* form */}
          <div className="order-2 xl:order-none xl:w-[54%]">
            <form
              className="glass-card flex flex-col gap-6 p-10"
              onSubmit={handleSubmit}
            >
              <h3 className="text-4xl font-bold text-accent">
                Let's work together
              </h3>
              <p className="text-white/60 transition-all duration-500 group-hover:text-white/80">
                I build scalable AI systems and data platforms that solve real
                business problems. Reach out to collaborate on machine learning,
                analytics, or data engineering work.
              </p>

              {/* status message */}
              {submitStatus && (
                <div
                  className={`rounded-md border px-4 py-3 text-sm font-medium ${
                    submitStatus.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              {/* input grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  name="firstname"
                  type="text"
                  placeholder="Firstname *"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
                />
                <Input
                  name="lastname"
                  type="text"
                  placeholder="Lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
                />
                <Input
                  name="number"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.number}
                  onChange={handleChange}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
                />
              </div>

              {/* select */}
              <Select
                value={formData.service}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, service: value })
                }
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white focus:border-accent/50">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0f1a38]">
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value="ml-development">
                      ML model development
                    </SelectItem>
                    <SelectItem value="data-engineering">
                      Data engineering
                    </SelectItem>
                    <SelectItem value="analytics">
                      Analytics & data science
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                name="subject"
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
              />

              {/* textarea */}
              <Textarea
                name="message"
                className="h-[200px] border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-accent/50"
                placeholder="Type your message here. *"
                value={formData.message}
                onChange={handleChange}
                required
              />

              {/* button */}
              <Button
                type="submit"
                size="default"
                disabled={isSubmitting}
                className="max-w-40 bg-accent font-semibold text-primary hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* info */}
          <div className="order-1 mb-8 flex flex-1 items-center xl:order-none xl:mb-0 xl:justify-end">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => (
                <li
                  key={index}
                  className="glass-card flex items-center gap-6 p-6 transition-all duration-500 hover:border-accent/50"
                >
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md border border-accent/30 bg-accent/20 text-accent xl:h-[72px] xl:w-[72px]">
                    <div className="text-[28px]">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{item.title}</p>
                    <h3 className="text-xl text-white">{item.description}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Contact;