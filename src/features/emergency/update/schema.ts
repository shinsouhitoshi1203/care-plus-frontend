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
    blood_type: z.string().trim(),
    allergies: z.array(z.string().trim().min(1, "Nội dung không được để trống")),
    chronic_diseases: z.array(z.string().trim().min(1, "Nội dung không được để trống")),
    current_medications: z.array(z.string().trim().min(1, "Nội dung không được để trống")),
    emergency_contacts: z.array(emergencyContactSchema),
  })
  .superRefine((values, ctx) => {
    if (values.sections.includes("blood_type") && !values.blood_type.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blood_type"],
        message: "Hãy chọn nhóm máu",
      });
    }

    if (values.sections.includes("allergies") && values.allergies.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allergies"],
        message: "Hãy thêm ít nhất 1 thông tin dị ứng",
      });
    }

    if (values.sections.includes("chronic_diseases") && values.chronic_diseases.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chronic_diseases"],
        message: "Hãy thêm ít nhất 1 bệnh mãn tính",
      });
    }

    if (values.sections.includes("medications") && values.current_medications.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["current_medications"],
        message: "Hãy thêm ít nhất 1 loại thuốc",
      });
    }

    if (values.sections.includes("emergency_contacts")) {
      if (values.emergency_contacts.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergency_contacts"],
          message: "Hãy thêm ít nhất 1 liên hệ khẩn cấp",
        });
      }

      values.emergency_contacts.forEach((contact, index) => {
        if (!contact.name.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "name"],
            message: "Vui lòng nhập họ tên",
          });
        }

        if (!contact.relationship.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "relationship"],
            message: "Vui lòng nhập mối quan hệ",
          });
        }

        if (!contact.phone.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["emergency_contacts", index, "phone"],
            message: "Vui lòng nhập số điện thoại",
          });
        }

        if (contact.phone.trim() && !phonePattern.test(contact.phone.trim())) {
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
