import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { slice } from "lodash";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
// const TOKEN_KEY = "whos-who-access-token";
const TOKEN_KEY = "my-access_token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
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
        value:
          "BQCNEW8tIk9IsYAdxFZ0D4dl0JNZfwOAI0l_UB3QBJJzzbpWuyAkP8e6wT-Ti2pM0TM4jnkp6b0q_rri2cSG7IW9A3_iXqSr0QOcJw5-TIeODz5mlok",
        expiration: Date.now() + 3600,
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
        //  const artistImageURL = await this.getArtistImage(item.artists[0].id);
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
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "search?q=genre%3Arock&type=track&market=US",
      // endpoint: `search?q=genre:"${this.selectedGenre}"&type=artist&type=tracks`,
      // endpoint: "recommendations/available-genre-seeds",
      // endpoint: "search?genre:`${genre}`&limit=50",
    });
    const tracks = await this.mapSpotifyResponseToTracks(response);
    const shuffled = this.shuffleArr(tracks, 3);
    console.log(tracks);
    console.log(shuffled);
    // console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  // loadGenres2 = async (t: any) => {
  //   this.configLoading = true;
  //   const response = await fetchFromSpotify({
  //     token: t,
  //     endpoint: "search?q=genre%3Arock&type=track&market=US", //
  //     // endpoint: `search?q=genre:"${this.selectedGenre}"&type=artist&type=tracks`,
  //     // endpoint: "recommendations/available-genre-seeds",
  //     // endpoint: "search?genre:`${genre}`&limit=50",
  //   });
  //   const tracks = await this.mapSpotifyResponseToTracks(response);
  //   // const shuffled = this.shuffleArr(tracks);
  //   console.log(tracks);
  //   // console.log(shuffled);

  //   // console.log(response);
  //   this.genres = response.genres;
  //   this.configLoading = false;
  // };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }
}
