export const getGreetingByTime = (date: Date = new Date()): string => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return "Chào buổi sáng ☀️";
  if (hour >= 11 && hour < 13) return "Chào buổi trưa 🍽️";
  if (hour >= 13 && hour < 18) return "Chào buổi chiều 🌤️";
  if (hour >= 18 && hour < 22) return "Chào buổi tối 🌙";

  return "Chúc bạn ngủ ngon 😴";
};