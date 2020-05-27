import React, { Component } from "react";
import queryString from "query-string";
export class CreatePlaylist extends Component {
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
            window.location.reload();
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
