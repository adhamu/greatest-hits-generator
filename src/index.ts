#!/usr/bin/env node

import { existsSync } from 'fs'
import { readdir } from 'fs/promises'
import { homedir } from 'os'
import { basename, resolve } from 'path'

import { spinner } from '@clack/prompts'
import { glob } from 'glob'
import musicMetaData from 'music-metadata'

import { createPlaylist } from './playlists'
import { textPrompt } from './prompts'
import { getArtistApiPath, getSongs } from './requests'
import { capitalize, normalizeString } from './utils'

import type { PlaylistTrack } from './types'

async function main() {
  const targetArtist = await textPrompt(
    'Type the name of the artist',
    'Artist name is required'
  )

  const mp3Path = await textPrompt(
    'Absolute directory path to MP3s',
    'Artist name is required',
    `${homedir()}/Music/Music/Media.localized/Music`
  ).then(resolve)

  if (!existsSync(mp3Path)) {
    throw new Error(`${mp3Path} does not exist`)
  }

  const s = spinner()
  s.start('Finding tracks')

  const artistApiPath = await getArtistApiPath(targetArtist)
  const artistDirectories = await readdir(mp3Path)
  const matches: PlaylistTrack[] = []

  for (const page of [1, 2, 3, 4, 5]) {
    const songs = await getSongs(artistApiPath, page)

    for (const song of songs) {
      const [artist, track] = [song.primary_artist.name, song.title].map(
        normalizeString
      )

      const artistDirectory = artistDirectories.find(
        dir => dir.toLowerCase() === artist
      )

      if (!artistDirectory) {
        continue
      }

      const tracks = await glob(
        `${mp3Path}/${artistDirectory}/**/*.{mp3,m4a,MP3,M4A}`
      )

      const match = tracks.find(m =>
        m.toLowerCase().includes(basename(track.toLowerCase()))
      )

      if (!match) {
        continue
      }

      const metadata = await musicMetaData.parseFile(match)

      matches.push({
        artist: metadata.common.artist as string,
        length: Math.trunc(metadata.format.duration ?? 0),
        name: metadata.common.title as string,
        path: match,
      })
    }
  }

  const playlist = await createPlaylist(
    `Best of ${capitalize(targetArtist)}`,
    matches
  )

  s.stop(`${playlist} written`)
}

main()
