import { ObjectStoreMeta } from 'ngx-indexed-db/lib/ngx-indexed-db.meta';

export const SONGS_INDEXED_DB_SCHEMA: ObjectStoreMeta = {
  store: 'songs',
  storeConfig: {keyPath: 'id', autoIncrement: false},
  storeSchema: [
    {name: 'name', keypath: 'name', options: {unique: false}},
    {name: 'artist', keypath: 'artist', options: {unique: false}},
    {name: 'year', keypath: 'year', options: {unique: false}},
    {name: 'bpm', keypath: 'bpm', options: {unique: false}},
    {name: 'gap', keypath: 'gap', options: {unique: false}},
    {name: 'start', keypath: 'start', options: {unique: false}},
    {name: 'end', keypath: 'end', options: {unique: false}},
    {name: 'pointsPerBeat', keypath: 'pointsPerBeat', options: {unique: false}},
    {name: 'notes', keypath: 'notes', options: {unique: false}}
  ]
}

export const SONG_COVERS_INDEXED_DB_SCHEMA: ObjectStoreMeta = {
  store: 'songCovers',
  storeConfig: { keyPath: 'songId', autoIncrement: false },
  storeSchema: [
    { name: 'image', keypath: 'image', options: { unique: false } },
  ]
}

export const SONG_VIDEOS_INDEXED_DB_SCHEMA: ObjectStoreMeta = {
  store: 'songVideos',
  storeConfig: { keyPath: 'songId', autoIncrement: false },
  storeSchema: [
    { name: 'video', keypath: 'video', options: { unique: false } },
  ]
}

export const SONG_AUDIOS_INDEXED_DB_SCHEMA: ObjectStoreMeta = {
  store: 'songAudios',
  storeConfig: { keyPath: 'songId', autoIncrement: false },
  storeSchema: [
    { name: 'audio', keypath: 'audio', options: { unique: false } },
  ]
}
