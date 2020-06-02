//Import statements
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

// Allows other components to import this one
export default class ArtistResultSummary extends Component {

    render() {
        return (
            //This creates the list item that is used in the unique lists in the results and artist component(it is used for the similar artist map)
            //All it does is print out the artists' name which links to /artist/the artists' mbid
            //However, if the artist that should be passed in doesn't exist, it outputs "This artist can't be displayed. Sorry!"
            <li key={this.props.artist.mbid}>
               {this.props.artist ? <Link to={"/artist/" + this.props.artist.mbid}>{this.props.artist.name}</Link> : 'This artist can\'t be displayed. Sorry!'}      
            </li>

        )
    }
}