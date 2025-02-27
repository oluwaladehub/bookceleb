
"use client";

import { Celebrity } from "../types/celebrity";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform transition-transform hover:scale-[1.02]">
      <div className="relative h-48 sm:h-56">
        <img
          src={celebrity.image}
          alt={celebrity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg sm:text-xl mb-2">{celebrity.name}</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-3 flex-grow line-clamp-3">
          {celebrity.description}
        </p>
        <div className="space-y-2">
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-fit">
            {celebrity.category}
          </div>
          <Link href={`/celebrity/${celebrity.id}`} className="block w-full">
            <Button className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-sm sm:text-base py-2 sm:py-3">
              BOOK NOW
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}