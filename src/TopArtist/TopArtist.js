import React from "react";
export function TopArtist(props) {
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
