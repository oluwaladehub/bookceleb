"use client";

import { useState, useEffect } from "react";
import { CelebrityCard } from "../components/CelebrityCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Celebrity } from "../types/celebrity";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function CelebritiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCelebrities();
  }, []);

  const fetchCelebrities = async () => {
    try {
      const { data, error } = await supabase
        .from('celebrities')
        .select('*')
        .order('name');

      if (error) throw error;
      setCelebrities(data || []);
    } catch (err) {
      setError('Failed to fetch celebrities. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCelebrities = celebrities.filter((celebrity) =>
    celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celebrity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celebrity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2F80ED]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">All Celebrities</h1>
          <p className="text-gray-600 mb-8">
            Browse through our extensive list of celebrities available for booking
          </p>
          <Input
            type="search"
            placeholder="Search celebrities by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xl mx-auto"
          />
        </div>

        {error && (
          <div className="text-center py-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCelebrities.map((celebrity) => (
            <CelebrityCard key={celebrity.id} celebrity={celebrity} />
          ))}
        </div>

        {filteredCelebrities.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">
              No celebrities found matching your search.
            </h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms or browse our complete list.
            </p>
          </div>
        )}
      </div>
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