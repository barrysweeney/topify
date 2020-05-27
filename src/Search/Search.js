import React, { Component } from "react";
import queryString from "query-string";

export class Search extends Component {
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
