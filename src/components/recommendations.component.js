//Import statements
import React, { Component } from 'react';
import "../App.css";
import { LAST_FM_KEY, LIKES_JSON, DISLIKES_JSON } from '../App';
import fs from "browserify-fs";
import axios from 'axios';
import GetRecommendation from '../components/getRecommendation.component';

//Allows other components to import this one
export default class Recommendations extends Component {

    //The constructor: This intialises the variables on the state
    //All of these are created in this component
    //The statement "this.myMethod = this.myMethod.bind(this)"" is used so "this" can be accessed within that method 
    constructor(props) {
        super(props);

        this.state = {
            userFavourites: [],
            userDislikes: [],
            recommendations: []
        }

        this.getLikes = this.getLikes.bind(this);
        this.getDislikes = this.getDislikes.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        this.checkRecommendations = this.checkRecommendations.bind(this);
        this.getRandomNumber = this.getRandomNumber.bind(this);
    }

    //This is the first method that is accessed after the constructor
    //Calls getLikedArtists
    componentDidMount() {
        this.getLikes();
    }

    //This reads in the likes file
    //Once it's read in the data gets put into an array which is then set on the state 
    //so it can be accessed anywhere in this component
    //It then calls getDislikes
    getLikes = () => {
        fs.readFile(LIKES_JSON, 'utf-8', (err, LikedArtists) => {
            let likes = JSON.parse(LikedArtists);

            if (likes.artists.length > 0) {
                this.setState({
                    userFavourites: likes.artists
                })
                
                this.getDislikes();
            }
            
        })
    }

    //This reads in the dislikes file
    //Once it's read in the data gets put into an array which is then set on the state 
    //so it can be accessed anywhere in this component
    //It then calls getRecommendations
    getDislikes = () => {
        fs.readFile(DISLIKES_JSON, 'utf-8', (err, DislikedArtists) => {
            let dislikes = JSON.parse(DislikedArtists);

            if (dislikes.artists.length > 0) {
                this.setState({
                    userDislikes: dislikes.artists
                })
            }
            this.getRecommendations();
        })
    }

    //https://stackoverflow.com/questions/45175836/random-number-using-react-js This is where i learned how to create a random number generator
    //This creates a random rumber between 0 and whatever the userFavourites array length is
    getRandomNumber = () => {
        let min = 0;
        let max = this.state.userFavourites.length - 1
        let rand = min + Math.random() * (max - min);
        
        return Math.round(rand); 
    }

    //Calls getRandomNumber
    //This random number is used to determine which artist from the userfavourites array gets used
    //Last FM's API is then used
    //I use the getSimilar method here to find similar artists to the random one that has been chosen with the random number
    //The results from the method are set in an array on the state so it can be accessed elsewhere in this component
    getRecommendations = () => {
        let rand = this.getRandomNumber();
        let randomArtist = this.state.userFavourites[rand].name;
        
        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + randomArtist+ '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                let similarArtists = res.data.similarartists.artist

                this.setState({
                    recommendations : similarArtists
                })
            })
    }

    //This is supposed to check and see if any of the recommendations array is the same as the dislikes array
    //If there is any overlap these should be taken out and either removed entirely from the recommendations array 
    //Or replaced with a new artist
    checkRecommendations = () => {

    }

    //This is what the user will see
    //Firstly they will see the text which will just explain what this page is about
    //Underneath that they will see a list of the reccommendations
    render() {
        return (
            <div>
                <h1>Your Recommendations!!</h1>
                <p>This will show you an assortment of artists for you to browse without searching!!<br />Hopefully you'll find the next band you love!!</p>

                <ul className="lists">
                    {this.state.recommendations.slice(0, 30).map((artist) => {
                                return <GetRecommendation artist={artist} />
                            })}
                </ul>
            </div>
        )
    }
}