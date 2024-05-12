import type { Artist, Songs } from './types'

const baseUrl = 'https://api.genius.com'
const headers = {
  Authorization: `Bearer ${process.env.GENIUS_CLIENT_TOKEN}`,
}

const request = <T>(url: string, options?: RequestInit): Promise<T> =>
  fetch(url, options).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<T>
  })

export const getArtistApiPath = (artist: string) =>
  request<Artist>(`${baseUrl}/search?q=${artist}&limit=1`, {
    headers,
  }).then(result => result.response.hits[0].result.primary_artist.api_path)

export const getSongs = (artistApiPath: string, page = 1, perPage = 50) =>
  request<Songs>(
    `${baseUrl}${artistApiPath}/songs?sort=popularity&per_page=${perPage}&page=${page}`,
    {
      headers,
    }
  ).then(result => result.response.songs)
