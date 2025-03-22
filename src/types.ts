export interface PlaylistTrack {
  path: string
  length: number
  artist: string
  name: string
}

export interface Artist {
  meta: { status: number }
  response: {
    hits: Array<{
      highlights: string[]
      index: string
      type: string
      result: {
        annotation_count: number
        api_path: string
        artist_names: string
        full_title: string
        header_image_thumbnail_url: string
        header_image_url: string
        id: number
        lyrics_owner_id: number
        lyrics_state: string
        path: string
        pyongs_count: number
        relationships_index_url: string
        release_date_components: {
          year: number
          month: number
          day: number
        }
        release_date_for_display: string
        release_date_with_abbreviated_month_for_display: string
        song_art_image_thumbnail_url: string
        song_art_image_url: string
        stats: {
          unreviewed_annotations: number
          hot: boolean
          pageviews: number
        }
        title: string
        title_with_featured: string
        url: string
        featured_artists: string[]
        primary_artist: {
          api_path: string
          header_image_url: string
          id: number
          image_url: string
          is_meme_verified: boolean
          is_verified: boolean
          name: string
          url: string
          iq: number
        }
      }
    }>
  }
}

export interface Songs {
  meta: {
    status: number
  }
  response: {
    songs: Array<{
      annotation_count: number
      api_path: string
      artist_names: string
      full_title: string
      header_image_thumbnail_url: string
      header_image_url: string
      id: number
      lyrics_owner_id: number
      lyrics_state: string
      path: string
      pyongs_count: number
      relationships_index_url: string
      release_date_components: {
        year: number
        month: number
        day: number
      }
      release_date_for_display: string
      release_date_with_abbreviated_month_for_display: string
      song_art_image_thumbnail_url: string
      song_art_image_url: string
      stats: {
        unreviewed_annotations: number
        concurrents: number
        hot: boolean
        pageviews: number
      }
      title: string
      title_with_featured: string
      url: string
      featured_artists: [
        {
          api_path: string
          header_image_url: string
          id: number
          image_url: string
          is_meme_verified: boolean
          is_verified: boolean
          name: string
          url: string
        },
      ]
      primary_artist: {
        api_path: string
        header_image_url: string
        id: number
        image_url: string
        is_meme_verified: boolean
        is_verified: boolean
        name: string
        url: string
        iq: number
      }
    }>
  }
}
