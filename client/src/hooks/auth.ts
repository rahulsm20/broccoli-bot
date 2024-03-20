import { api } from "../api";

export const useSession = async () => {
  try {
    var isValid;
    const twitchToken = localStorage.getItem("TWITCH_AUTH_TOKEN");
    if (twitchToken) {
      isValid = await api.get("/auth?provider=twitch");
    }
    console.log(isValid);
  } catch (err) {
    console.log(`${err}`);
  }
};
