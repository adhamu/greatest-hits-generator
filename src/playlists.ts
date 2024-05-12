import { writeFile } from 'fs/promises'
import { resolve } from 'path'

import type { PlaylistTrack } from './types'

const RECORD_MARKER = '#EXTINF'
const FORMAT_DESCRIPTOR = '#EXTM3U'

export const createPlaylist = async (name: string, tracks: PlaylistTrack[]) => {
  const filename = resolve(`${name}.m3u8`)
  const content = tracks
    .map(
      track =>
        `${RECORD_MARKER}:${track.length},${track.artist} - ${track.name}\n${track.path}\n`
    )
    .join('')

  await writeFile(filename, `${FORMAT_DESCRIPTOR}\n${content}`)

  return filename
}
