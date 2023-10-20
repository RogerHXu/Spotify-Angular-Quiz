import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from "@angular/router";
import { slice } from "lodash";
import { DataService } from "src/track-data.service";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";
const GENRE_KEY = "genre-key";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private dataService: DataService) {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "rock";
  artists: number[] = [2, 3, 4];
  selectedArtist: number = 2;
  songs: number[] = [1, 2, 3];
  selectedSong: number = 1;

  artistTrackArray: any;
  authLoading: boolean = false;
  configLoading: boolean = false;
  tracks: any;
  token: String = "";

  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  shuffleArr(array: any, index: any) {
    const newArr = array.slice();
    for (var i = newArr.length - 1; i > 0; i--) {
      var rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr.slice(0, index);
  }

  async mapSpotifyResponseToTracks(response: { tracks: { items: any[] } }) {
    if (response && response.tracks && response.tracks.items) {
      const trackPromises = response.tracks.items.map(async (item) => ({
        artistName: item.artists[0].name,
        trackName: item.name,
        preview_url: item.preview_url,
        artistId: item.artists[0].id,
        trackId: item.id,
        artistImageURL: await this.getArtistImage(item.artists[0].id),
      }));
      return Promise.all(trackPromises);
    }
    return [];
  }

  async getArtistImage(artistId: any) {
    const customEndpoint = `https://api.spotify.com/v1/artists/${artistId}`;
    try {
      const response = await fetch(customEndpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data.images[0].url;
      } else {
        throw new Error("Failed to fetch artist image");
      }
    } catch (error) {
      console.error("Error fetching artist image:", error);
      throw error;
    }
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const storedGenreData = localStorage.getItem(GENRE_KEY);
    if (storedGenreData) {
      const storedGenres = JSON.parse(storedGenreData);
      this.genres = storedGenres;
      this.configLoading = false;
      return;
    }

    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    // console.log(response);
    this.genres = response.genres;
    localStorage.setItem(GENRE_KEY, JSON.stringify(this.genres));
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }

  setArtist(selectedArtist: number) {
    this.selectedArtist = selectedArtist;
  }

  setSong(selectedSong: number) {
    this.selectedSong = selectedSong;
  }

  letsPlay = async () => {
    const response = await fetchFromSpotify({
      token: this.token,
      endpoint: `search?q=genre%3A${this.selectedGenre}&type=track&market=US&limit=50`,
    });
    // console.log(response);
    let tracks = await this.mapSpotifyResponseToTracks(response);
    tracks = this.removeNoPreviewUrl(tracks);
    const uniqueTracks = this.removeDuplicate(tracks);
    const shuffled = this.shuffleArr(uniqueTracks, this.selectedArtist);
    console.log(shuffled);
    console.log(shuffled.length);
    if (shuffled.length >= this.selectedArtist) {
      this.dataService.setStoredData(shuffled, this.selectedSong);
      this.router.navigate(["/quiz"]);
    } else {
      alert(
        "There aren't enough available songs in the selected genre to create a quiz!"
      );
    }
  };

  removeDuplicate(tracks: any) {
    const unique = new Set();
    return tracks.filter((track: any) => {
      const key = `${track.artistId}`;
      if (unique.has(key)) return false;
      else unique.add(key);
      return true;
    });
  }

  removeNoPreviewUrl(tracks: any) {
    return tracks.filter(
      (track: { preview_url: null }) => track.preview_url !== null
    );
  }
}
