"use client";

import Link from "next/link";
import { Phone, Mail, Twitter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect} from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [celebrities, setCelebrities] = useState<Array<{
    id: number;
    name: string;
    image: string;
    description: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const { data, error } = await supabase
          .from('celebrities')
          .select('id, name, image, description')
          .limit(8);

        if (error) throw error;
        setCelebrities(data || []);
      } catch (err) {
        console.error('Error fetching celebrities:', err);
        setFetchError('Failed to load celebrities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

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
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            created_at: new Date().toISOString(),
          },
        ]);

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
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center px-4 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The future is here, don't be left out
          </h1>
          <p className="text-xl text-white/90 mb-8">
            We connect audiences with innovative minds and powerful messages and entertainment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
            <Link href="/celebrities" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#ff5722] hover:bg-[#f4511e] text-base sm:text-lg py-3 px-6">
                Book A Celebrity
              </Button>
            </Link>
            <Link href="/search" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-[#ff5722] border-white hover:bg-white/10 text-base sm:text-lg py-3 px-6">
                Search Celebrity
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#2F80ED] mb-2">1000+</h2>
            <p className="text-xl">Celebrity Profiles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🔒", title: "Safe & Secure" },
              { icon: "🕒", title: "24/7 Online Booking" },
              { icon: "👥", title: "Over 500 booked Celebrity" },
              { icon: "💬", title: "Friendly Support" },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-lg bg-white">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
                alt="About Us"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <span className="text-[#2F80ED] font-semibold">About Bookceleb Agency</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">We are a top Booking Platform</h2>
              <p className="text-gray-600 leading-relaxed">
                Bookceleb Agency is a full-service talent booking agency, specifically focused on the needs
                of event professionals looking to book keynote speakers, public figures and corporate
                entertainment for their events. Our mission is to provide a best-in-class talent booking
                experience from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Celebrities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Celebrities</h2>
          <p className="text-center text-gray-600 mb-12">
            This is a list of featured celebrities and public figures available for booking
          </p>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
            </div>
          ) : fetchError ? (
            <div className="text-center text-red-600 py-8">{fetchError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {celebrities.map((celebrity) => (
                <div key={celebrity.id} className="rounded-lg overflow-hidden shadow-lg bg-white h-full flex flex-col">
                  <div className="relative h-48">
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1">{celebrity.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">{celebrity.description}</p>
                    <Link href={`/celebrity/${celebrity.id}`}>
                      <Button className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-sm py-2">
                        BOOK CELEBRITY
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link href="/celebrities">
            <Button size="lg" className="bg-[#2F80ED] hover:bg-[#2F80ED]/90">
              View All Celebrities
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Contact Us</h2>
          <p className="text-center text-gray-600 mb-12">
            We are available 24/7 to take your Bookings
          </p>
          <div className="max-w-2xl mx-auto">
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
                {isSubmitting ? 'Sending...' : 'Leave a Message'}
              </Button>
            </form>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Phone className="h-6 w-6" />, label: "Phone" },
                { icon: <Mail className="h-6 w-6" />, label: "Email" },
                { icon: <MessageSquare className="h-6 w-6" />, label: "Whatsapp" },
                { icon: <Twitter className="h-6 w-6" />, label: "Twitter" },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white transition-colors"
                >
                  {contact.icon}
                  <span className="text-sm font-medium">{contact.label}</span>
                </div>
              ))}
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
