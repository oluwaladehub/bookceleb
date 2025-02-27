import { Celebrity } from "../types/celebrity";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white h-full flex flex-col">
      <div className="relative h-32">
        <img
          src={celebrity.image}
          alt={celebrity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="font-bold text-base mb-1">{celebrity.name}</h3>
        <p className="text-gray-600 text-xs mb-2 flex-grow line-clamp-2">{celebrity.description}</p>
        <Link href={`/celebrity/${celebrity.id}`}>
          <Button className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-xs py-1">
            BOOK CELEBRITY
          </Button>
        </Link>
      </div>
    </div>
  );
}