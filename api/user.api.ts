import { fetchApi } from "./base.api";
import { UserDto } from "@/models/user.models";

export const userApi = {
  updateUsername: (username: string) =>
    fetchApi<UserDto>(`/users/${username}`, {
      method: "PUT",
    }),

  getMe: () =>
    fetchApi<UserDto>("/users/me", {
      method: "GET",
    }),
};
