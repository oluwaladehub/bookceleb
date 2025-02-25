"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { CelebrityCard } from "../components/CelebrityCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Celebrity } from "../types/celebrity";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Celebrity[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setIsLoading(true);
    setError(null);
    
    try {
      const query = searchQuery.toLowerCase();
      const { data, error } = await supabase
        .from('celebrities')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Search Celebrities</h1>
          <p className="text-gray-600 mb-8">
            Find the perfect celebrity for your next event
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-4 max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-[#2F80ED] hover:bg-[#2F80ED]/90" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>

        {error && (
          <div className="text-center py-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {hasSearched && !error && (
          <div className="space-y-8">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((celebrity) => (
                  <CelebrityCard key={celebrity.id} celebrity={celebrity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-600">
                  No celebrities found matching "{searchQuery}"
                </h2>
                <p className="text-gray-500 mt-2">
                  Try different keywords or browse our complete list of celebrities.
                </p>
              </div>
            )}
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