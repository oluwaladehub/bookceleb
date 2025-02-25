import Link from "next/link"
import { Award, Users, Clock, MessageSquare, Mail} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#05050F] text-white py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">About Bookceleb Agency</h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Your premier destination for booking celebrities and public figures for your events.
            We connect audiences with innovative minds and powerful messages.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#2F80ED] mb-2">1000+</h2>
            <p className="text-xl">Celebrity Profiles</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Award className="h-12 w-12" />, title: "Safe & Secure" },
              { icon: <Clock className="h-12 w-12" />, title: "24/7 Online Booking" },
              { icon: <Users className="h-12 w-12" />, title: "Over 500 booked Celebrity" },
              { icon: <MessageSquare className="h-12 w-12" />, title: "Friendly Support" },
            ].map((item, index) => (
              <div key={index} className="text-center p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow">
                <div className="text-[#2F80ED] mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
                alt="About Us"
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="text-[#2F80ED] font-semibold">About Bookceleb Agency</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">We are a top Booking Platform</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Bookceleb Agency is a full-service talent booking agency, specifically focused on the needs
                of event professionals looking to book keynote speakers, public figures and corporate
                entertainment for their events. Our mission is to provide a best-in-class talent booking
                experience from start to finish.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team thrives on keeping up with the latest trends and forward thinkers in order to
                identify and book the best keynote speakers for every client and every specific event.
                We love what we do, and we are passionate about helping our clients create the most
                successful event time and time again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#2F80ED] font-semibold mb-2">AWARDS & ACCOLADES</p>
            <h2 className="text-3xl font-bold mb-6">Countless numbers of Accolades & Awards</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Bookceleb Agency is regularly receiving national and regional recognition for our growth
              as a top celebrities bureau, and for our highly regarded workplace culture. We are excited
              to rank on the Inc. 5000 of America's Fastest-Growing Private Companies, and proud to be
              recognized by both Inc. Magazine and Triangle Business Journal as one of the Best Places To Work.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#05050F] text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Direct access to a vast network of celebrities and public figures",
                  "Transparent pricing and no hidden fees",
                  "Dedicated support team available 24/7",
                  "Seamless booking process from start to finish",
                  "Professional and experienced booking agents",
                  "Customized solutions for every event",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-[#2F80ED] font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">Bookceleb Agency connects you with top celebrities and public figures for your events and engagements.</p>
            </div>
            <div className="flex justify-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/celebrities" className="text-gray-400 hover:text-white transition-colors">Book Celebrity</a></li>
                  <li><a href="/search" className="text-gray-400 hover:text-white transition-colors">Search</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</a></li>
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