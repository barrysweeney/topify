import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import "./App.css";
import queryString from "query-string";
import { Greeting } from "../Greeting/Greeting";
import { TopTrack } from "../TopTrack/TopTrack";
import { TopArtist } from "../TopArtist/TopArtist";
import { Search } from "../Search/Search";
import { SearchResults } from "../SearchResults/SearchResults";
import { Library } from "../Library/Library";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      topTrack: {},
      topArtist: {},
      playlists: [],
      albums: [],
      searchResults: null,
    };
  }

  async componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    // GET user's display name and
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          user: {
            name: data.display_name,
            profile: data.external_urls.spotify,
          },
        });
      });

    // GET user's top track
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=1", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          topTrack: {
            name: data.items[0].name,
            img: data.items[0].album.images[1].url,
            url: data.items[0].preview_url,
          },
        });
      });

    // GET user's top artist
    const artistResponse = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=1",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const artistData = await artistResponse.json();
    const artistTrackResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistData.items[0].id}/top-tracks?limit=1&country=US`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const artistTrackData = await artistTrackResponse.json();
    this.setState({
      topArtist: {
        name: artistData.items[0].name,
        img: artistData.items[0].images[2].url,
        url: artistTrackData.tracks[0].preview_url,
      },
    });

    // GET user's playlists
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const playlists = [];
        data.items.forEach((item) => {
          const playlist = {};
          playlist.name = item.name;
          playlist.imgSrc = item.images.length > 0 ? item.images[0].url : "";
          playlist.tracksEndpoint = item.tracks.href;
          playlists.push(playlist);
        });
        this.setState({
          playlists: playlists,
        });
      });

    // GET user's saved albums
    fetch("https://api.spotify.com/v1/me/albums", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const albums = [];
        data.items.forEach((item) => {
          const album = {};
          album.name = item.album.name;
          album.imgSrc = item.images[2].url;
          albums.push(album);
        });
        this.setState({
          albums: albums,
        });
      });
  }

  setSearchResults(results) {
    this.setState({
      searchResults: results,
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar profile={this.state.user.profile} />
        {this.state.user.name ? (
          <div>
            <Greeting name={this.state.user.name} />
            <TopTrack
              name={this.state.topTrack.name}
              imgSrc={this.state.topTrack.img}
              url={this.state.topTrack.url}
            />
            <TopArtist
              name={this.state.topArtist.name}
              imgSrc={this.state.topArtist.img}
              url={this.state.topArtist.url}
            />
            <hr />
            <Search
              setSearchResults={(results) => this.setSearchResults(results)}
            />
            {this.state.searchResults ? (
              <SearchResults results={this.state.searchResults} />
            ) : null}
            <hr />
            <Library
              playlists={this.state.playlists}
              albums={this.state.albums}
            />
          </div>
        ) : (
          <button
            className="sign-in-button"
            onClick={() =>
              (window.location =
                "https://quiet-fjord-91390.herokuapp.com/login")
            }
          >
            Sign in with Spotify <i class="fab fa-spotify"></i>
          </button>
        )}
      </div>
    );
  }
}

export default App;
