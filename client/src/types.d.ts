export type UserType = {
  isAuthenticated: boolean;
  user: {
    username: string;
    email: string;
    avatarurl: string;
  };
};

export type RootState = {
  auth: {
    twitch: UserType;
    spotify: UserType;
  },
  musicData:{
    data:{
      currently_playing: SongType;
      queue: SongType[];
    },
    queueSize: number;
  }
};

export type SongType = {
  artists: ArtistType[];
  album: AlbumType;
  id: string;
  name: string;
  duration_ms: number;
  external_urls: {
    spotify: string;
  }
}

export type ArtistType = {
  id: string;
  name: string;
  uri: string;
  external_urls: {
    spotify: string;
  }
}

export type AlbumType = {
  id: string;
  name: string;
  uri: string;
  external_urls: {
    spotify: string;
  }
  images: ImageType[];
  artists: ArtistType[];
}

export type ImageType = {
  height: number;
  width: number;
  url: string;
}