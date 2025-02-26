import Link from "next/link";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CelebrityBookingForm } from "@/app/components/CelebrityBookingForm";

export async function generateStaticParams() {
  const { data: celebrities } = await supabase
    .from('celebrities')
    .select('id');

  if (!celebrities) return [];

  return celebrities.map((celebrity) => ({
    id: celebrity.id,
  }));
}

async function getCelebrity(id: string) {
  const { data, error } = await supabase
    .from('celebrities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to load celebrity');
  }

  return data;
}

export const dynamic = 'force-dynamic';

export default async function CelebrityProfile({ params }: { params: { id: string } }) {
  const celebrity = await getCelebrity(params.id);

  if (!celebrity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Celebrity not found</h1>
          <p className="text-gray-600 mt-2">The celebrity you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#05050F] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <img
                src={celebrity.image}
                alt={celebrity.name}
                className="w-80 h-80 rounded-full mx-auto md:mx-0 object-cover"
              />
              <h1 className="text-3xl font-bold mt-6">{celebrity.name}</h1>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">About {celebrity.name}</h2>
              <p className="text-gray-300 text-lg italic mb-4">
                {celebrity.full_description || celebrity.description}
              </p>
              <p className="text-xl mb-2">Category: {celebrity.category}</p>
              <p className="text-xl">Booking Fee: ${celebrity.fee_range}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">
              REQUEST BOOKING INFO ON {celebrity.name}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              We are happy to assist you with your interest in booking {celebrity.name}. 
              Please provide details about your organization and event type.
            </p>

            <CelebrityBookingForm celebrity={celebrity} />
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
                  <li><Link href="/celebrities" className="text-gray-400 hover:text-white transition-colors">Book Celebrity</Link></li>
                  <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
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