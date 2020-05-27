import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";
import logo from "./toplogo.jpg";

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
        {this.state.user.name ? (
          <div>
            <Navbar profile={this.state.user.profile} />
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
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}

function Navbar(props) {
  return (
    <nav>
      <ul className="inline-list">
        {/* https://twitter.com/TheOdinProject/photo */}
        <li className="left-nav-item">
          <img src={logo} alt="The Odin Project Logo" className="logo" />
          Topify
        </li>

        <li>
          <a href={props.profile}>
            <i className="fas fa-user-circle fa-2x"></i>
            Profile
          </a>
        </li>
        <li>|</li>
        <li>
          <a href="https://www.spotify.com/uk/download">Download</a>
        </li>
        <li>
          <a href="https://support.spotify.com/">Help</a>
        </li>
        <li>
          <a href="https://www.spotify.com/uk/premium/?checkout=false">
            Premium
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Greeting(props) {
  return <h1>Hello {props.name}</h1>;
}

function TopTrack(props) {
  return (
    <div>
      <h2>Your Top Track</h2>
      <p>
        {props.name}
        {props.url ? (
          <a href={props.url}>
            <i className="far fa-play-circle"></i>
          </a>
        ) : null}
      </p>
      <img src={props.imgSrc} alt="Cover of album containing top track" />
    </div>
  );
}

function TopArtist(props) {
  return (
    <div>
      <h2>Your Top Artist</h2>
      <p>
        {props.name}
        {props.url ? (
          <a href={props.url}>
            <i className="far fa-play-circle"></i>
          </a>
        ) : null}
      </p>
      <img src={props.imgSrc} alt="Top Artist" className="top-artist-img" />
    </div>
  );
}

class Search extends Component {
  async handleSubmit(e) {
    e.preventDefault();
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    const searchParams = e.currentTarget[0].value.split(" ").join("+");
    const res = await fetch(
      `https://api.spotify.com/v1/search?query=${searchParams}&type=artist,track,album,playlist,show,episode&limit=5&include_external=audio&market=US`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const data = await res.json();

    const artists = data.artists.items.filter((item) => item !== null);
    const albums = data.albums.items.filter((item) => item !== null);
    const tracks = data.tracks.items.filter((item) => item !== null);
    const shows = data.shows.items.filter((item) => item !== null);
    const episodes = data.episodes.items.filter((item) => item !== null);
    const playlists = data.playlists.items.filter((item) => item !== null);

    function getArtistsTopTracks() {
      return artists.map(async (artist) => {
        const artistTrackResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?limit=1&country=US`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        const artistTrackData = await artistTrackResponse.json();
        return {
          name: artist.name,
          id: artist.id,
          preview_url: artistTrackData.tracks[0].preview_url,
        };
      });
    }

    function getAlbumsTopTracks() {
      return albums.map(async (album) => {
        const albumTrackResponse = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1&country=US`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        const albumTrackData = await albumTrackResponse.json();
        return {
          name: album.name,
          artists: album.artists,
          id: album.id,
          preview_url: albumTrackData.items[0].preview_url,
        };
      });
    }

    function getPlaylistsTopTracks() {
      return playlists.map(async (playlist) => {
        const playlistTrackResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=1&country=US`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        const playlistTrackData = await playlistTrackResponse.json();
        console.log(playlistTrackData);

        return {
          name: playlist.name,
          artists: playlist.artists,
          id: playlist.id,
          preview_url: playlistTrackData.items[0].track.preview_url,
        };
      });
    }

    function getShowsTopEpisodes() {
      return shows.map(async (show) => {
        const showTrackResponse = await fetch(
          `https://api.spotify.com/v1/shows/${show.id}/episodes?limit=1&country=US`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        const showTrackData = await showTrackResponse.json();
        return {
          name: show.name,
          id: show.id,
          preview_url: showTrackData.items[0].audio_preview_url,
        };
      });
    }

    Promise.all(getArtistsTopTracks()).then((artistsAndTracksDetails) => {
      const artistsDetails = artistsAndTracksDetails;
      Promise.all(getAlbumsTopTracks()).then((albumsAndTracksDetails) => {
        const albumsDetails = albumsAndTracksDetails;
        Promise.all(getPlaylistsTopTracks()).then(
          (playlistsAndTracksDetails) => {
            const playlistsDetails = playlistsAndTracksDetails;
            Promise.all(getShowsTopEpisodes()).then((showsAndTracksDetails) => {
              const showsDetails = showsAndTracksDetails;

              this.props.setSearchResults({
                artistsDetails,
                albumsDetails,
                tracks,
                showsDetails,
                episodes,
                playlistsDetails,
              });
            });
          }
        );
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Search</h1>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input type="text" />
          <button type="submit">Find</button>
        </form>
      </div>
    );
  }
}

function SearchResults(props) {
  const someResults =
    props.results.artistsDetails.length > 0 &&
    props.results.tracks.length > 0 &&
    props.results.albumsDetails.length > 0 &&
    props.results.playlistsDetails.length > 0 &&
    props.results.showsDetails.length > 0 &&
    props.results.episodes.length > 0;

  return (
    <div className="search-results">
      {someResults ? (
        <div>
          {props.results.artistsDetails.length > 0 ? (
            <div>
              <h2>Artists</h2>
              <ul>
                {props.results.artistsDetails.map((artist) => {
                  return (
                    <div key={artist.id}>
                      <li>
                        {artist.name}
                        {artist.preview_url ? (
                          <a href={artist.preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}
                      </li>
                    </div>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.results.tracks.length > 0 ? (
            <div>
              <h2>Songs</h2>
              <ul>
                {props.results.tracks.map((track) => {
                  return (
                    <li key={track.id}>
                      <p>
                        {track.name}
                        {track.preview_url ? (
                          <a href={track.preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}

                        {track.artists.map((artist) => (
                          <span> - {artist.name}</span>
                        ))}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.results.albumsDetails.length > 0 ? (
            <div>
              <h2>Albums</h2>
              <ul>
                {props.results.albumsDetails.map((album) => {
                  return (
                    <li key={album.id}>
                      <p>
                        {album.name}
                        {album.preview_url ? (
                          <a href={album.preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}

                        {album.artists.map((artist) => (
                          <span> - {artist.name}</span>
                        ))}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.results.playlistsDetails.length > 0 ? (
            <div>
              <h2>Playlists</h2>
              <ul>
                {props.results.playlistsDetails.map((playlist) => {
                  return (
                    <li key={playlist.id}>
                      <p>
                        {playlist.name}
                        {playlist.preview_url ? (
                          <a href={playlist.preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.results.showsDetails.length > 0 ? (
            <div>
              <h2>Shows</h2>
              <ul>
                {props.results.showsDetails.map((show) => {
                  return (
                    <li key={show.id}>
                      <p>
                        {show.name}
                        {show.preview_url ? (
                          <a href={show.preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.results.episodes.length > 0 ? (
            <div>
              <h2>Episodes</h2>
              <ul>
                {props.results.episodes.map((episode) => {
                  return (
                    <li key={episode.id}>
                      <p>
                        {episode.name}
                        {episode.audio_preview_url ? (
                          <a href={episode.audio_preview_url}>
                            <i className="far fa-play-circle"></i>
                          </a>
                        ) : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

function Library(props) {
  return (
    <div>
      <h1>Your Library</h1>
      {props.playlists.length > 0 ? (
        <div>
          <h2>Your Playlists</h2>
          {props.playlists.map((playlist, i) => {
            return (
              <div key={i}>
                {playlist.imgSrc ? (
                  <img
                    src={playlist.imgSrc}
                    alt="Playlist cover"
                    className="playlist-img"
                  />
                ) : null}
                <p>{playlist.name}</p>
              </div>
            );
          })}
        </div>
      ) : null}

      {props.albums.length > 0 ? (
        <div>
          <h2>Albums</h2>
          {props.albums.map((album, i) => {
            return (
              <div key={i}>
                <img src={album.imgSrc} alt="Album cover" />
                <p>{album.name}</p>
              </div>
            );
          })}
        </div>
      ) : null}
      <CreatePlaylist />
    </div>
  );
}

class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base64: null,
    };
  }

  // https://stackoverflow.com/a/17711190/9472445
  getBase64(e) {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      if (JSON.stringify(e.target.result).includes("image/jpeg")) {
        this.setState({
          base64: e.target.result,
          error: null,
        });
      } else {
        this.setState({
          error: true,
        });
      }
    });
    reader.readAsDataURL(e.currentTarget.files[0]);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    const name = e.currentTarget[0].value;
    const playlistBody = { name: name };
    if (!this.state.error) {
      const playlistResponse = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(playlistBody),
        }
      );
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;
      if (this.state.base64) {
        const body = this.state.base64.split(",")[1];
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "image/jpeg",
          },
          body: body,
        }).then((res) => {
          if (res.status === 202) {
            // reset
            this.setState({
              base64: null,
              error: null,
            });
          } else {
            this.setState({
              error: true,
            });
          }
        });
      } else {
        window.location.reload();
      }
    }
  }
  render() {
    return (
      <div>
        <h2>Create Playlist</h2>
        <form
          onSubmit={(e) => this.handleSubmit(e)}
          encType="multipart/form-data"
        >
          <label htmlFor="name">Playlist Name:</label>
          <br />
          <input type="text" name="name" /> <br />
          <label htmlFor="image">Cover Image:</label>
          <br />
          <input type="file" name="image" onChange={(e) => this.getBase64(e)} />
          <br />
          <button type="submit">Create</button>
        </form>
        {this.state.error ? (
          <p>Image must be a JPEG image smaller than 256 KB</p>
        ) : null}
      </div>
    );
  }
}

export default App;
