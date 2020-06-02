//Import statements
import React, { Component } from 'react';
import "../App.css"

// Allows other components to import this one
export default class ArtistsTopSong extends Component {

    render() {
        return (
            //This creates the list item that is used in the unique lists in the artist component and the searchedArtist component
            //All it does is print out the album's name which links to the Last FM page for the song
            //However, if the artist that should be passed in doesn't exist, it outputs "This song can't be displayed. Sorry!"
             <li>
                {this.props.topSong ? <a href = {this.props.topSong.url} target="_blank">{this.props.topSong.name}</a>: 'This song can\'t be displayed. Sorry!'}       
            </li>

        )
    }
}