import { useQuery } from "@tanstack/react-query";

export default function EmergencyPublicWebPage() {
  const { data } = useQuery({
    queryKey: ["xnxx_emergency_public_data"],
    queryFn: async () => {
      // Giả sử có API để lấy dữ liệu khẩn cấp công khai
      return await fetch("https://jsonplaceholder.typicode.com/users/1");
    },
  });
  return (
    <>
      <p>Code thẻ web</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
