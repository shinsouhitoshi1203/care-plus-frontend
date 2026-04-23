"use client";

import { User, Phone } from "lucide-react-native";
import { type EmergencyContact } from "../types";

interface BloodTypeBadgeProps {
  type: string | null;
}

export function BloodTypeBadge({ type }: BloodTypeBadgeProps) {
  if (!type) {
    return (
      <span className="text-gray-400 text-sm italic">Chưa cập nhật</span>
    );
  }

  return (
    <div className="inline-flex items-center justify-center px-4 py-2 bg-red-50 rounded-lg border border-red-100">
      <span className="text-lg font-bold text-red-600">{type}</span>
    </div>
  );
}

type ColorKey = "blue" | "amber" | "emerald" | "purple" | "rose";

interface TagListProps {
  items: string[];
  emptyMessage: string;
  color?: ColorKey;
}

const colorMap: Record<ColorKey, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
};

export function TagList({ items, emptyMessage, color = "blue" }: TagListProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic py-2">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colorMap[color]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

interface ContactCardProps {
  contact: EmergencyContact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <User size={18} color="#2563EB" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
        <p className="text-sm text-gray-500">{contact.relationship}</p>
        <a
          href={`tel:${contact.phone}`}
          className="inline-flex items-center gap-1 mt-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Phone size={14} />
          {contact.phone}
        </a>
      </div>
    </div>
  );
}
