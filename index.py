#!/usr/bin/env python3

import re
import os
import sys
import requests
import math
import glob
import string
import credentials
import argparse
import pickle
import time
from pathlib import Path
from libpytunes import Library
from colorama import Fore, Style

base_url = 'https://api.genius.com'
headers = {
    'Authorization': 'Bearer ' + credentials.auth['token']
}

FORMAT_DESCRIPTOR = "#EXTM3U"
RECORD_MARKER = "#EXTINF"

target_artist = None
mp3_path = None
itunes_library = None

def get_artist_api_path(artist):
    request = requests.get(
        base_url + '/search?q=' + artist + '&limit=1',
        headers=headers
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Finds the most popular hits from an artist, checks a directory of MP3s or your iTunes library to see if you have the songs and generates an M3U playlist'
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
    parser.add_argument(
        '-i',
        metavar='iTunes Library',
        type=str,
        required=False,
        help='Absolute path to iTunes Library XML file. If provided, will override -m'
    )

    args = parser.parse_args()

    target_artist = args.a
    mp3_path = Path(args.m)
    artist_api_path = get_artist_api_path(target_artist)

    if args.i is None:
        if not mp3_path.is_dir():
            raise Exception('mp3_path is not a directory')
            sys.exit(1)
        else:
            mp3_path = os.path.realpath(mp3_path)
    else:
        itunes_library = Path(args.i)
        if not itunes_library.is_file():
            raise Exception('iTunes library doesn\'t exist')
            sys.exit(1)
        else:
            itunes_library = os.path.realpath(itunes_library)

    if itunes_library is None:
        print('Searching through ' + mp3_path)
    else:
        print('Searching through ' + itunes_library)

    request = requests.get(
        base_url + artist_api_path + '/songs?sort=popularity&per_page=50',
        headers=headers
    )
    response = request.json()

for song in response['response']['songs']:
    print(song['primary_artist']['name'] + ' - ' + song['title'])
