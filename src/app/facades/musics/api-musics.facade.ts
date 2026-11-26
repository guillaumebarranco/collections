import { getApiBaseUrl } from '../../core/config';
import {
  BaseMusic,
  UserAlbumNote,
  UserAlbumToListen,
  UserMusic,
} from '../../models/music-model';

export async function fetchUserMusicsFromApi(
  userId: string
): Promise<UserMusic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/musics/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Musics API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.musics || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserMusicsFromApi(
  userId: string
): Promise<import('../../models/music-model').Music[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/musics/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Musics merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchUserAlbumNotes(
  userId: string
): Promise<UserAlbumNote[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/musics/${encodeURIComponent(userId)}/album-notes`
  );
  if (!response.ok) {
    throw new Error('Album notes API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchUserAlbumsToListen(
  userId: string
): Promise<UserAlbumToListen[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/musics/${encodeURIComponent(userId)}/albums-to-listen`
  );
  if (!response.ok) {
    throw new Error('Albums to listen API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function addAlbumsToListen(payload: {
  userId: string;
  albums: UserAlbumToListen[];
}): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/musics/albums-to-listen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function removeAlbumToListen(payload: {
  userId: string;
  artist: string;
  album: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/musics/albums-to-listen/remove`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function saveAlbumNote(payload: {
  userId: string;
  artist: string;
  album: string;
  rating?: number;
  favorite?: boolean;
}): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/musics/album-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function saveMusicDetails(payload: {
  userId: string;
  title: string;
  artist: string;
  timesListened?: number;
  byHeart?: boolean;
  rating?: number;
  favorite?: boolean;
}): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/musics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function addExistingMusics(payload: {
  userId: string;
  musics: { title: string; artist: string }[];
}): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/musics/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchBaseMusicsFromApi(): Promise<BaseMusic[]> {
  const response = await fetch(`${getApiBaseUrl()}/musics/entities`);
  if (!response.ok) {
    throw new Error('Musics entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.musics || [];
}
