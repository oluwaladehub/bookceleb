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
        <div className="relative h-64">
          <img
            src={celebrity.image}
            alt={celebrity.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{celebrity.name}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {celebrity.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{celebrity.description}</p>
          <div className="flex items-center justify-between">
            {/* <span className="text-[#2F80ED] font-semibold">{celebrity.fee_range}</span> */}
            <Button className="bg-[#2F80ED] hover:bg-[#2F80ED]/90">
              BOOK CELEBRITY
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}