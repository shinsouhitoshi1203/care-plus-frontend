"use client";

import { AlertCircle, Droplets, Heart, Pill, Stethoscope, Users } from "lucide-react-native";
import { ScrollView } from "react-native";
import { type EmergencyInfo } from "../types";
import { BloodTypeBadge, ContactCard, TagList } from "./data-display";
import { SectionCard } from "./section-card";

interface EmergencyInfoContentProps {
  data: EmergencyInfo;
}

export function EmergencyInfoContent({ data }: EmergencyInfoContentProps) {
  return (
    <ScrollView>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full mb-3">
              <Heart size={16} color="#DC2626" fill="#DC2626" />
              <span className="text-sm font-semibold text-red-600">Thông tin khẩn cấp</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{data.full_name}</h1>
            <p className="text-sm text-gray-500 mt-1">Thông tin dùng trong trường hợp khẩn cấp</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Blood Type */}
            <SectionCard icon={Droplets} title="Nhóm máu" accentColor="#DC2626">
              <BloodTypeBadge type={data.blood_type} />
            </SectionCard>

            {/* Allergies */}
            <SectionCard icon={AlertCircle} title="Dị ứng" accentColor="#F59E0B">
              <TagList items={data.allergies} emptyMessage="Không có thông tin dị ứng" color="amber" />
            </SectionCard>

            {/* Chronic Diseases */}
            <SectionCard icon={Stethoscope} title="Bệnh lý nền" accentColor="#7C3AED">
              <TagList items={data.chronic_diseases} emptyMessage="Không có bệnh lý nền" color="purple" />
            </SectionCard>

            {/* Current Medications */}
            <SectionCard icon={Pill} title="Thuốc đang dùng" accentColor="#059669">
              <TagList items={data.current_medications} emptyMessage="Không có thuốc đang sử dụng" color="emerald" />
            </SectionCard>

            {/* Emergency Contacts */}
            <SectionCard icon={Users} title="Liên hệ khẩn cấp" accentColor="#2563EB">
              {data.emergency_contacts && data.emergency_contacts.length > 0 ? (
                <div className="space-y-3">
                  {data.emergency_contacts.map((contact, index) => (
                    <ContactCard key={index} contact={contact} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic py-2">Chưa có người liên hệ khẩn cấp</p>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pt-2">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs text-gray-400">Thông tin được cung cấp bởi Care Plus</p>
          </div>
        </div>
      </div>
    </ScrollView>
  );
}
