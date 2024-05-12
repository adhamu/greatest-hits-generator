import { writeFile } from 'fs/promises'
import { resolve } from 'path'

import { createPlaylist } from '../playlists'

jest.mock('fs/promises')
jest.mock('path')

const playlistTracks = [
  {
    path: '/PATH/1',
    length: 220,
    artist: '__ARTIST_1__',
    name: '__TRACK_NAME_1__',
  },
  {
    path: '/PATH/2',
    length: 240,
    artist: '__ARTIST_2__',
    name: '__TRACK_NAME_2__',
  },
]

describe('playlists', () => {
  const mockWriteFile = writeFile as jest.Mock
  const mockResolve = resolve as jest.Mock

  beforeEach(() => {
    mockResolve.mockImplementationOnce(f => f)
  })

  it('creates a playlist', async () => {
    await createPlaylist('__PLAYLIST_NAME__', playlistTracks)

    expect(mockWriteFile).toHaveBeenCalledWith(
      'output/__PLAYLIST_NAME__.m3u8',
      `#EXTM3U
#EXTINF:220,__ARTIST_1__ - __TRACK_NAME_1__
/PATH/1
#EXTINF:240,__ARTIST_2__ - __TRACK_NAME_2__
/PATH/2
`
    )
  })

  it('returns the filename after creating a playlist', async () => {
    const result = await createPlaylist('__PLAYLIST_NAME__', playlistTracks)

    expect(result).toBe('output/__PLAYLIST_NAME__.m3u8')
  })
})
