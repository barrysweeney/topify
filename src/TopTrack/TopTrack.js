import React from "react";
export function TopTrack(props) {
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
