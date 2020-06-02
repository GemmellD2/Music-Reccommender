//Import statements
import React, { Component } from 'react';
import "../App.css"
import ArtistResultSummary from './artistResultSummary.component';

//Allows other components to import this one
export default class Results extends Component {

    //The constructor: This intialises the variables on the state
    //One of them is the similar artists from the home component
    //The other is mainMessage which will always be one of two things
    //The first is an error which is "You have beat me! I can't think of anyone to recommend, please go home and search again!!"
    //The other is the actual message which should always be displayed unless there is no similar artists
    //The message is "Here are some artists you may like!!"
    //The statement "this.goHome = this.goHome.bind(this);" is used so "this" can be accessed within the method
    constructor(props) {
        super(props);

        this.state = {
            similarArtists: this.props.location.state ? this.props.location.state.similarArtists : '',
            mainMessage: 'Here are some artists you may like!!'
        }

        this.goHome = this.goHome.bind(this);
    }

    //This is the first method that is accessed after the constructor
    //This checks if there similarArtists exists
    //Then it checks if there similarArtists is populated with data
    //If it's not then the mainMessage gets set to the error message
    //Otherwise nothing happens 
    componentDidMount() {
        if (this.props.location.state && this.props.location.state.similarArtists) {
            if (this.state.similarArtists.artist.length === 0) {
                this.setState({
                    mainMessage: 'You have beat me! I can\'t think of anyone to recommend, please go home and search again!!'
                })
            }
        }
    }

    //This just allows the user to go to the home page on a button click
    goHome() {
        this.props.history.push('/');
    }

    //First off the mainMessage will be displayed for the user to see.
    //Second this renders the similarArtists found on the Home page by using the slice and map function 
    //Where i learned about map: https://reactjs.org/docs/lists-and-keys.html & https://www.youtube.com/watch?v=It9iL4EXFWc
    //All Slice does is it take the results and(what I have done) starts at 0 and Slices everything off after the 10th result
    //Map is used to create the list items. In this instance, the artist and the key gets passed in to ArtistResultSummary
    //And returns that component 10 times because of the slice function
    //Finally the button uses the goHome method to allow the user an easy way to go back to the home page rather than pressing the back button
    render() {
        return (
            <div>
                <p>{this.state.mainMessage}</p>
                <ul className="lists">
                    {this.props.location.state.similarArtists.artist.slice(0, 10).map((artist, key) => {
                        return <ArtistResultSummary artist={artist} />
                    })}
                </ul>
                        {<button id="btn-search" className="btn btn-primary btn-center " onClick={this.goHome} type="submit">Search again!</button>}
                </div>
        )
    }
}