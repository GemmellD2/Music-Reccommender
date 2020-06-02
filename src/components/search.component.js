//Import Statements
import React, { Component } from 'react';
import "../App.css"
import axios from 'axios';
import { LAST_FM_KEY } from '../App'

//Allows other components to import this one
export default class Search extends Component {

    //The constructor: This intialises the variables on the state
    //All of these are created in this component
    //The statement "this.myMethod = this.myMethod.bind(this)"" is used so "this" can be accessed within that method
    constructor(props) {
        super(props);

        this.state = {
            choice: '',
            foundArtist: ''
        }
    }

    //This updates the state every time the user types in the input box
    handleChoiceChange = (event) => {
        this.setState({
            choice: event.target.value
        })
    }

    //This creates a local variable called foundArtist which will then be set on the state
    //It then performs a get request to see if that artist exists or not
    //If the artist doesn't exist then an error message will appear
    //Otherwise the searchedArtist component will be loaded
    getArtist = () => {
        const foundArtist = this.state.choice

        this.setState({
            foundArtist: this.state.choice
        })

        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + foundArtist + '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                if (!res.data.artist) {
                    alert("The artist you searched for could not be found. Please search again!");
                } else {
                    this.props.history.push({ pathname: '/searchedArtist', state: { foundArtist: foundArtist } })
                }
            }
            )
    }

    //This renders a small bit of information for the user to read and know what the website is about
    //There is an instruction as well so the user knows how to operate the search as well
    render() {
        return (
            <div>
                <h1>Search!</h1>
                <p>Please search for an artist!</p>
                <div className="center-data">
                    <label className="users-choice">Your artist:</label>
                    <input
                        type="text"
                        value={this.state.choice}
                        onChange={this.handleChoiceChange}
                    />
                    <button id="SearchArtists" className="btn btn-primary " type="submit" onClick={this.getArtist} disabled={!this.state.choice}>Search</button>
                </div>
            </div>
        )
    }
}