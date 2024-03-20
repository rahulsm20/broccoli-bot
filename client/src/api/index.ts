import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export const validateToken = async (provider: string) => {
  try {
    const res = await api.get(`/auth/${provider}/validate`);
    console.log(res.data.user, typeof res.data);
    return res.data.user[provider];
  } catch (err) {
    console.log(`${err}`);
  }
};

export const loginSpotify = async () => {
  try {
    window.location.replace(
      `${import.meta.env.VITE_SERVER_URL}/auth?provider=spotify`
    );
  } catch (err) {
    console.log(`${err}`);
  }
};

export const loginTwitch = async () => {
  try {
    window.location.replace(
      `${import.meta.env.VITE_SERVER_URL}/auth?provider=twitch`
    );
  } catch (err) {
    console.log(`${err}`);
  }
};

export const fetchQueue = async () => {
  try {
    const res = await api.get(`/music/spotify/queue?channel=coldfloat`);
    return res.data;
  } catch (err) {
    console.log(`${err}`);
  }
}