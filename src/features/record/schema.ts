import * as z from "zod";

export const bloodPressureSchema = z.object({
  type: z.literal("blood_pressure"),
  value: z.object({
    systolic: z.number(),
    diastolic: z.number(),
  }),
  note: z.string().optional(),
  unit: z.literal("mmHg"),
});

export const weightSchema = z.object({
  type: z.literal("weight"),
  value: z.object({
    _: z.number(),
  }),
  note: z.string().optional(),
  unit: z.literal("kg"),
});

export const bloodSugarSchema = z.object({
  type: z.literal("blood_sugar"),
  value: z.object({
    _: z.number(),
  }),
  note: z.string().optional(),
  unit: z.literal("mg/dL"),
});

export const healthRecordSchema = z.discriminatedUnion("type", [bloodPressureSchema, weightSchema, bloodSugarSchema]);
// export type AddHealthRecordProps = z.infer<typeof healthRecordSchema> & { value: Record<string, any> | null };
export const bloodPresssureDefaultValue = {
  type: "blood_pressure",
  note: "",
  value: {
    systolic: 0,
    diastolic: 0,
  },
  unit: "mmHg",
};
