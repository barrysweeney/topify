import React from "react";
export function SearchResults(props) {
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
