#!/usr/bin/env python3

import credentials

base_url = "https://api.genius.com"
headers = {
    'Authorization': 'Bearer ' + credentials.auth['token']
}
