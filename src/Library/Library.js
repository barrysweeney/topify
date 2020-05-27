import React from "react";
import { CreatePlaylist } from "../CreatePlaylist/CreatePlaylist";
export function Library(props) {
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
