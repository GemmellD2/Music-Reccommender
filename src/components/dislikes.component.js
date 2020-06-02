//Import statements
import React, { Component } from 'react';
import "../App.css";
import { DISLIKES_JSON } from '../App';
import GetDisliked from "./getDisliked.component"
import fs from "browserify-fs";

//Allows other components to import this one
export default class Dislikes extends Component {

    //The constructor: This intialises the variables on the state
    //All of these are created in this component
    //The statement "this.myMethod = this.myMethod.bind(this)"" is used so "this" can be accessed within that method 
    constructor(props) {
        super(props);

        this.state = {
            userDislikes: [],
            mainMessage: 'Here are your disliked artists!!'
        }

        this.getDislikedArtists = this.getDislikedArtists.bind(this);
    }

    //This is the first method that is accessed after the constructor
    //Calls getDislikedArtists
    componentDidMount() {
        this.getDislikedArtists()
    }

    //This method reads in the Dsisikes file from local storage
    //Once it's been read, if the Dislikes file is bigger than 0(this was added to stop errors)
    //The data from the file is put into an array
    //And the array gets put onto the state so it can accessed elsewhere
    //Or is there is nothing in the file, the mainMessage will be updated to :
    //"You have not disliked any artists. Your disliked artists will appear here for you to see and possibly change!!"
    getDislikedArtists = () => {
        fs.readFile(DISLIKES_JSON, 'utf-8', (err, DislikedArtists) => {

            let dislikes = JSON.parse(DislikedArtists);

            if (dislikes.artists.length > 0) {
                this.setState({
                    userDislikes: dislikes.artists
                })
            }else{
                this.setState({
                    mainMessage: 'You have not disliked any artists!!'
                })
            }

        }
        )
    }

    //This is what the user will see
    //Firstly, they will see either "Here are your disliked artists!!" 
    //or   
    //"You have not disliked any artists. Your disliked artists will appear here for you to see and possibly change!!"
    //This depends if the user has disliked an artist
    //If the user has disliked artists, the artists they have disliked will appear underneath the message in a list
    //Map is used to create the list items. In this instance, the userDislike gets passed in to GetDisliked
    //They will all be links to their specific artist page so the user can see their page again and 
    //Find people Similar to that particular artist
    render() {
        return (
            <div>
                <h2>{this.state.mainMessage}</h2>

                <ul className="lists">
                    {this.state.userDislikes.map((userDislike) => {
                        return <GetDisliked userDislike={userDislike} />
                    })}
                </ul>
            </div>
        )
    }
}