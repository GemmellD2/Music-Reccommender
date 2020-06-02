//Import statements
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

//Allows other components to import this one
export default class GetDislike extends Component {

    render() {
        return (
            //This creates the list item that are used in the unique lists in dislikes component
            //All it does is print out the artist's name and links to the artist's page on the website
            <li>

                {<Link to={"/artist/" + this.props.userDislike.mbid}>{this.props.userDislike.name}</Link>}
            </li>

        )
    }
}