"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Send email notification
      const emailResponse = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!emailResponse.ok) {
        const responseData = await emailResponse.json();
        throw new Error(responseData.error || 'Failed to send email notification');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center text-center px-4 bg-[url('https://images.unsplash.com/photo-1516387938699-a93567ec168e')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90">
            Get in touch with us for any questions or inquiries
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about booking a celebrity? Our team is here to help you with any inquiries.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#2F80ED] p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">contact@bookceleb.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Textarea
                  placeholder="Enter Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px]"
                />
                {error && (
                  <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                    Message sent successfully!
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="text-2xl font-bold z-10 flex-shrink-0">
                <img src="/logo_white.png" alt="BookCeleb" className="h-12" />
              </Link>
              <p className="text-gray-400">Bookceleb Agency connects you with top celebrities and public figures for your events and engagements.</p>
            </div>
            <div className="flex justify-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/celebrities" className="text-gray-400 hover:text-white transition-colors">Book Celebrity</Link></li>
                  <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">Feel free to get in touch with us via phone or send us a message.</li>
                  <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@bookceleb.com</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Bookceleb Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}