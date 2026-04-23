import { type EmergencyContactDraft, type EmergencyFormValues } from "./types";

function normalizeStringList(values: string[]): string[] {
  const uniqueValues = new Set<string>();

  values.forEach((rawValue) => {
    const value = rawValue.trim();
    if (value) {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues);
}

function normalizeContacts(contacts: EmergencyContactDraft[]): EmergencyContactDraft[] {
  return contacts
    .map((contact) => ({
      name: contact.name.trim(),
      relationship: contact.relationship.trim(),
      phone: contact.phone.trim(),
    }))
    .filter((contact) => contact.name || contact.relationship || contact.phone);
}

export function sanitizeEmergencyFormValues(values: EmergencyFormValues): EmergencyFormValues {
  return {
    ...values,
    blood_type: values.blood_type.trim(),
    allergies: normalizeStringList(values.allergies),
    chronic_diseases: normalizeStringList(values.chronic_diseases),
    current_medications: normalizeStringList(values.current_medications),
    emergency_contacts: normalizeContacts(values.emergency_contacts),
  };
}
