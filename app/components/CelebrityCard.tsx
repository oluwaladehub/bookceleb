import { Celebrity } from "../types/celebrity";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white h-full flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="relative h-32">
        <img
          src={celebrity.image}
          alt={celebrity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow space-y-2">
        <h3 className="font-bold text-base">{celebrity.name}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-fit">
          {celebrity.category}
        </span>
        <p className="text-gray-600 text-xs flex-grow line-clamp-2 after:content-['...']">
          {celebrity.description}
        </p>
        <Link href={`/celebrity/${celebrity.id}`}>
          <Button className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-xs py-1">
            BOOK CELEBRITY
          </Button>
        </Link>
      </div>
    </div>
  );
}