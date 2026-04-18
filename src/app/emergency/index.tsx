import { useQuery } from "@tanstack/react-query";

export default function EmergencyInfoWebPage() {
  const { data } = useQuery({
    queryKey: ["emergencyInfo.xnxx"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      return await response.json();
    },
  });
  return <>{data && JSON.stringify(data)}</>;
}
