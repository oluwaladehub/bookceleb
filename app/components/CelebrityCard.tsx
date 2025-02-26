import { Celebrity } from "../types/celebrity";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <Link href={`/celebrity/${celebrity.id}`} className="block">
        <div className="relative h-48">
          <img
            src={celebrity.image}
            alt={celebrity.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{celebrity.name}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">
              {celebrity.category}
            </span>
          </div>
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{celebrity.description}</p>
          <div className="flex items-center justify-between">
            <Button className="bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-sm py-2">
              BOOK CELEBRITY
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}