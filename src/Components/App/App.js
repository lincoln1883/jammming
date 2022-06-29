import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchResults: [],
			playlistName: "My Playlist",
			playlistTracks: [],
		};

		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	// Use the track’s id property to check if the current song is in the playlistTracks state.
	// If the id is new, add the song to the end of the playlist.
	// Set the new state of the playlist.

	addTrack(track) {
		let tracks = this.state.playlistTracks;
		if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
			return;
		}
		tracks.push(track);
		this.setState({ playlistTracks: tracks });
	}

	// Filters tracks that already are on the playlist
	// Uses the track’s id property to filter it out of playlistTracks
	// Sets the new state of the playlist

	removeTrack(track) {
		let newPlaylist = this.state.playlistTracks.filter(
			(savedTrack) => savedTrack.id !== track.id
		);
		this.setState({ playlistTracks: newPlaylist });
	}

	//   Accepts a name argument
	//  Sets the state of the playlist name to the input argument

	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}

	savePlaylist() {
		const trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({
				playlistName: "New Playlist",
				playlistTracks: [],
			});
		});
	}

	search(term) {
		Spotify.search(term).then((searchResults) => {
			this.setState({ searchResults: searchResults });
		});
	}

	handleKeyPress(event) {
		if (event.key === "Enter") {
			this.props.onSearch(this.state.term);
			this.search();
		}
	}

	render() {
		return (
			<div>
				<h1>
					Yama<span className="highlight">jam</span>jam
				</h1>
				<div className="App">
					<SearchBar onSearch={this.search} onKeyDown={this.handleKeyPress} />
					<div className="App-playlist">
						<SearchResults
							searchResults={this.state.searchResults}
							onAdd={this.addTrack}
						/>
						<Playlist
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
							onRemove={this.removeTrack}
							onNameChange={this.updatePlaylistName}
							onSave={this.savePlaylist}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
