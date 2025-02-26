"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <>
      <Link href="/celebrities" className="hover:text-gray-300 transition-colors py-2" onClick={onLinkClick}>
        Find Celebrity
      </Link>
      <Link href="/about" className="hover:text-gray-300 transition-colors py-2" onClick={onLinkClick}>
        About
      </Link>
      <Link href="/contact" className="hover:text-gray-300 transition-colors py-2" onClick={onLinkClick}>
        Contact
      </Link>
      <Link
        href="/celebrities"
        className="bg-[#2f81ed3f] px-6 py-2 rounded-md hover:bg-[#2F80ED]/90 transition-colors"
        onClick={onLinkClick}
      >
        BOOK NOW
      </Link>
    </>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-[#05050F] text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold z-10 flex-shrink-0" onClick={closeMenu}>
            <img src="/logo_white.png" alt="BookCeleb" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-[#05050F] flex flex-col items-center justify-center gap-4 text-lg md:hidden">
              <NavLinks onLinkClick={closeMenu} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}