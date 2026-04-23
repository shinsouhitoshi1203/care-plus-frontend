import * as z from "zod";
import { EMERGENCY_SECTION_KEYS } from "./types";

const emergencyContactSchema = z.object({
  name: z.string().trim(),
  relationship: z.string().trim(),
  phone: z.string().trim(),
});

const sectionEnum = z.enum(EMERGENCY_SECTION_KEYS);

const phonePattern = /^[0-9+\s.-]+$/;

export const emergencyUpdateFormSchema = z
  .object({
    sections: z.array(sectionEnum).min(1, "Hãy chọn ít nhất 1 mục cần cập nhật"),
    blood_type: z.string().trim().optional(),
    allergies: z.array(z.string().trim().min(1, "Nội dung không được để trống")).optional(),
    chronic_diseases: z.array(z.string().trim().min(1, "Nội dung không được để trống")).optional(),
    current_medications: z.array(z.string().trim().min(1, "Nội dung không được để trống")).optional(),
    emergency_contacts: z.array(emergencyContactSchema).optional(),
  })
  .strict()
  .superRefine((values, ctx) => {
    const bloodType = values.blood_type?.trim() ?? "";
    const allergies = values.allergies ?? [];
    const chronicDiseases = values.chronic_diseases ?? [];
    const currentMedications = values.current_medications ?? [];
    const emergencyContacts = values.emergency_contacts ?? [];

    if (values.sections.includes("blood_type") && !bloodType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blood_type"],
        message: "Hãy chọn nhóm máu",
      });
    }

    if (values.sections.includes("allergies") && allergies.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allergies"],
        message: "Hãy thêm ít nhất 1 thông tin dị ứng",
      });
    }

    if (values.sections.includes("chronic_diseases") && chronicDiseases.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chronic_diseases"],
        message: "Hãy thêm ít nhất 1 bệnh mãn tính",
      });
    }

    if (values.sections.includes("current_medications") && currentMedications.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["current_medications"],
        message: "Hãy thêm ít nhất 1 loại thuốc",
      });
    }

    if (values.sections.includes("emergency_contacts")) {
      if (emergencyContacts.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergency_contacts"],
          message: "Hãy thêm ít nhất 1 liên hệ khẩn cấp",
        });
      }

      emergencyContacts.forEach((contact, index) => {
        const name = contact.name.trim();
        const relationship = contact.relationship.trim();
        const phone = contact.phone.trim();

        if (!name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "name"],
            message: "Vui lòng nhập họ tên",
          });
        }

        if (!relationship) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "relationship"],
            message: "Vui lòng nhập mối quan hệ",
          });
        }

        if (!phone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "phone"],
            message: "Vui lòng nhập số điện thoại",
          });
        }

        if (phone && !phonePattern.test(phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "phone"],
            message: "Số điện thoại không hợp lệ",
          });
        }
      });
    }
  });

export type EmergencyUpdateFormSchema = z.infer<typeof emergencyUpdateFormSchema>;
