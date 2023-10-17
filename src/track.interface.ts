// data.model.ts
export interface TrackData {
  artistName: string;
  trackName: string;
  preview_url: string | null;
  artistId: string;
  trackId: string;
  artistImageURL: string;
}

export interface TrackDataArray extends Array<TrackData> {}

export interface TrackDataWithSelection {
  trackData: TrackData[];
  selectedTracks: number;
}
