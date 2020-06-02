//Import statements
import React, { Component } from 'react';
import "../App.css";
import { LIKES_JSON } from '../App';
import GetFavourite from "./getFavourite.component";
import fs from "browserify-fs";


//Allows other components to import this one
export default class Favourites extends Component {
    
    //The constructor: This intialises the variables on the state
    //All of these are created in this component
    //The statement "this.myMethod = this.myMethod.bind(this)"" is used so "this" can be accessed within that method 
    constructor(props) {
        super(props);

        this.state = {
            userFavourites: [],
            mainMessage: 'Here are your favourite artists!!'
        }

        this.getLikedArtists = this.getLikedArtists.bind(this);
    }

    //This is the first method that is accessed after the constructor
    //Calls getLikedArtists
    componentDidMount() {
        this.getLikedArtists()
    }

    //This method reads in the Likes file from local storage
    //Once it's been read, if the Likes file is bigger than 0(this was added to stop errors)
    //The data from the file is put into an array
    //And the array gets put onto the state so it can accessed elsewhere
    //Or is there is nothing in the file, the mainMessage will be updated to :
    //"You have not liked any artists. Please like some so you can easily find them here!!"
    getLikedArtists = () => {
        fs.readFile(LIKES_JSON, 'utf-8', (err, LikedArtists) => {

            let likes = JSON.parse(LikedArtists);

            if (likes.artists.length > 0) {
                this.setState({
                    userFavourites: likes.artists
                })
            }else{
                this.setState({
                    mainMessage: 'You have not liked any artists!!'
                })
            }

        }
        )
    }

    //This is what the user will see
    //Firstly, they will see either "Here are your favourite artists!!" 
    //or   
    //"You have not liked any artists. Please like some so you can easily find them here!!"
    //This depends if the user has liked an artist
    //If the user has liked artists, the artists they have liked will appear underneath the message in a list
    //Map is used to create the list items. In this instance, the userFavourite gets passed in to GetFavourite
    //They will all be links to their specific artist page so the user can see their page again and 
    //Find people Similar to that particular artist
    render() {
        return (
            <div>
                <h2>{this.state.mainMessage}</h2>

                <ul className="lists">
                    {this.state.userFavourites.map((userFavourite) => {
                        return <GetFavourite userFavourite={userFavourite} />
                    })}
                </ul>

            </div>
        )
    }
}