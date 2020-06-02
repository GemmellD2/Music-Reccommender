//Import Statements
import React, { Component } from 'react';
import "../App.css"

// Allows other components to import this one
export default class ArtistsTopAlbum extends Component {

    render() {
        return (
            //This creates the list item that is used in the unique lists in the artist component and the searchedArtist component
            //All it does is print out the album's name which links to the Last FM page for the album
            //It also shows the album cover
            //However, if the artist that should be passed in doesn't exist, it outputs "This album can't be displayed. Sorry!"
            <li>
                {this.props.topAlbum ?
                    <div>
                        <div>
                            <img src={this.props.topAlbum.image[1]["#text"]}></img>
                        </div>
                        <div>
                            <a href={this.props.topAlbum.url} target="_blank">{this.props.topAlbum.name}</a>
                        </div>
                        
                    </div>
                    :
                    'This album can\'t be displayed. Sorry!'}
            </li>

        )
    }
}