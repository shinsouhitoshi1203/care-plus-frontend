"use client";

import { User } from "lucide-react-native";

interface SectionCardProps {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
  accentColor: string;
}

export function SectionCard({ icon: Icon, title, children, accentColor }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <Icon size={20} color={accentColor} strokeWidth={2} />
        <h3 className="font-semibold text-gray-800" style={{ fontSize: "15px" }}>
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
