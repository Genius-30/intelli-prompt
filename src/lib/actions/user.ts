import axiosInstance from "@/lib/axios";

export async function getUserByUsername(username: string) {
  try {
    const { data } = await axiosInstance.get(`/user/${username}`);

    return data.user || null;
  } catch {
    return null;
  }
}
