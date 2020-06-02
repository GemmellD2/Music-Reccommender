//Import statements
//where I learned about axios
//https://www.npmjs.com/package/axios
import React, { Component } from 'react';
import "../App.css"
import axios from 'axios';
import { LAST_FM_KEY } from '../App'


// Allows other components to import this one
export default class Home extends Component {

    //The constructor: Just intialises the variable "choice1" on the state
    //It's called choice 1 because originally I had planned for the user to put in 3 selections and get a certain amount of results 
    //from each of them. However, when I started developing this, I chose to start off with one choice and then go to two and then three
    //I have ran out of time to add the other two choices but I implemented a search function which allow the user to search for a specific
    //and be taken to their page if it's available
    constructor(props) {
        super(props);

        //This was used to test the API key: console.log(LAST_FM_KEY)
        //I did so to ensure that the API key was getting imported correctly

        this.state = {
            choice1: ''
        }
    }

    //This updates the state every time the user types in the input box
    handleChoice1Change = (event) => {
        this.setState({
            choice1: event.target.value
        })
    }

    //This is the first instance of me using Last FM's API. This calls the API and uses the getSimilar method to find similar artists
    //Using the user's input from the input box. 
    //Once the API call has been used the results are set equal to a constant variable(These can't be changed)
    //Then the url is updated and the const is pushed through to the results component
    getSimilarArtists = () => {
        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + this.state.choice1 + '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                //console.dir - redirects the JSON object to the chrome console so you can look into it
                //console.dir(res);

                if (!res.data.similarartists) {
                    alert("There is no similar artists for the artist you searched");
                } else {
                    const similarArtists = res.data.similarartists;

                    this.props.history.push({ pathname: '/results', state: { similarArtists: similarArtists } })
                }

                // console.log - prints out a simple attribute value
                //console.log(res.data.similarartists.artist[0].name);
            });
    }

    //This renders a small bit of information for the user to read and know what the website is about
    //There is an instruction as well so the user knows how to operate the website as well
    //Underneath the instruction there is an input box for the user to type in their artist
    //And to the side of that there is a button which will perform the getSimilarArtists method once it has been clicked
    render() {
        return (
            <div>
                <h1>Welcome to music recommender!!</h1>
                <p>Please put in an artist you like. This will get you some artists that you may like!</p>
                <div className="center-data">
                    <label className='users-choice'>Your artist:</label>
                    <input
                        type="text"
                        value={this.state.choice1}
                        onChange={this.handleChoice1Change}
                    />
                    {/* This button is always disabled if the input box is empty and the only way to enable it is if the input box gets a single character in it */}
                    <button id="SearchArtists" className="btn btn-primary" type="submit" onClick={this.getSimilarArtists} disabled={!this.state.choice1}>Search</button>
                </div>
            </div>
        )
    }
}