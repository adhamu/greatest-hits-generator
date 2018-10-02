#!/usr/bin/env python3

import re
import os
import sys
import requests
import eyed3
import math
import glob
import string
import credentials
import argparse
import time
from pathlib import Path
from colorama import Fore

base_url = 'https://api.genius.com'
credentials = {
    'Authorization': 'Bearer ' + credentials.auth['token']
}

FORMAT_DESCRIPTOR = "#EXTM3U"
RECORD_MARKER = "#EXTINF"

target_artist = None
mp3_path = None


def get_artist_api_path(artist):
    request = requests.get(
        base_url + '/search?q=' + artist + '&limit=1',
        headers=credentials
    )
    response = request.json()

    return response['response']['hits'][0]['result']['primary_artist']['api_path']


def append_to_playlist(playlist_name, mp3_path, track_length, artist, track_name):
    """Append to playlist."""
    playlist = Path(playlist_name + '.m3u')
    if not playlist.is_file():
        create_playlist(playlist_name)

    l = str(RECORD_MARKER) + ":" + str(track_length) + "," + str(artist) + " - " + str(track_name)
    if l not in open(playlist_name + '.m3u').read():
        print(Fore.GREEN + 'Adding ' + track_name + ' to ' + playlist_name)
        fp = open(playlist_name + '.m3u', 'a+')
        fp.write(l + "\n")
        fp.write(mp3_path + "\n")
        fp.close()
    else:
        print(Fore.BLUE + 'Skipping... ' + track_name + ' exists in ' + playlist_name)


def create_playlist(playlist_name):
    """Create a playlist."""
    fp = open(playlist_name + '.m3u', 'a+')
    fp.write(FORMAT_DESCRIPTOR + '\n')
    fp.close()


def normalize_string(string):
    return string.lower().replace('.', '')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Finds the most popular hits from an artist, checks a directory of MP3s to see if you have the songs and generates an M3U playlist'
    )
    parser.add_argument(
        '-a',
        metavar='Artist',
        type=str,
        required=True,
        help='The artist you\'re searching for'
    )
    parser.add_argument(
        '-m',
        metavar='MP3 folder path',
        type=str,
        default='.',
        help='Absolute directory path to MP3s. (Default = current directory)'
    )

    args = parser.parse_args()

    target_artist = args.a
    mp3_path = Path(args.m)
    artist_api_path = get_artist_api_path(target_artist)

    if not mp3_path.is_dir():
        raise Exception('mp3_path is not a directory')
        sys.exit(1)
    else:
        mp3_path = os.path.realpath(mp3_path)

    print('Searching through ' + mp3_path)

    request = requests.get(
        base_url + artist_api_path + '/songs?sort=popularity&per_page=50&page=1',
        headers=credentials
    )
    response = request.json()


for song in response['response']['songs']:
    artist = normalize_string(song['primary_artist']['name'])
    track = normalize_string(song['title'])

    for file in os.listdir(mp3_path):
        if artist == file.lower():

            import glob

            for match in glob.iglob(mp3_path + '/' + file + '/**/*', recursive=True):
                if track in match.lower():
                    audiofile = eyed3.load(match)
                    if audiofile is None:
                        print(Fore.RED + 'Couldn\'t load ID3 tag')
                        sys.exit('bad shit happened')

                    artist = str(audiofile.tag.artist)
                    if audiofile.tag.album_artist:
                        artist = str(audiofile.tag.album_artist)
                    track_name = str(audiofile.tag.title)
                    track_length = math.ceil(audiofile.info.time_secs)

                    append_to_playlist(
                        target_artist + ' - Top 50',
                        match,
                        track_length,
                        artist,
                        track_name
                    )
                    print(match)
