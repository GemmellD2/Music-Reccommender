//Import statements
import React, { Component } from 'react';
import "../App.css"
import { LAST_FM_KEY, LIKES_JSON, DISLIKES_JSON } from '../App'
import axios from 'axios';
import ArtistResultSummary from './artistResultSummary.component';
import ArtistTopAlbum from './artistTopAlbum.component';
import ArtistTopSong from './artistTopSong.component';
import fs from "browserify-fs";

//Allows other components to import this one
export default class SearchedArtist extends Component {

    //The constructor: This intialises the variables on the state
    //All of these are created in this component
    //The statement "this.myMethod = this.myMethod.bind(this)" is used so "this" can be accessed within that method
    constructor(props) {
        super(props);

        this.state = {
            foundArtist: this.props.location.state ? this.props.location.state.foundArtist : '',
            mainArtist: {},
            artistId: '',
            artistName: '',
            artistBio: '',
            similarArtists: [],
            similarArtistInfo: [],
            topAlbums: [],
            topSongs: [],
            isInLikes: false,
            isInDislikes: false
        }

        this.getMainArtistInfo = this.getMainArtistInfo.bind(this);
        this.getSimilarArtistInfo = this.getSimilarArtistInfo.bind(this);
        this.getTopFiveAlbums = this.getTopFiveAlbums.bind(this);
        this.getTopFiveSongs = this.getTopFiveSongs.bind(this);
        this.goHome = this.goHome.bind(this);
        this.addToLikes = this.addToLikes.bind(this);
        this.addToDislikes = this.addToDislikes.bind(this);
        this.checkIfInLikes = this.checkIfInLikes.bind(this);
        this.checkIfInDislikes = this.checkIfInDislikes.bind(this);
    } 

    //This is the first method that is accessed after the constructor
    //Calls getMainArtistInfo
    componentDidMount() {
        this.getMainArtistInfo();
    }

    //This is Last FM's API getting called again
    //However, I am using a different method from Last FM
    //I am using the getInfo which requires the artist's name or their mbid
    //Once the get request has occured I am setting some of the things I can onto the state
    //So I can use their values elsewhere
    //After the state gets set, getTopFiveAlbums and getTopFiveSongs get called as well
    //It performs a check before calling getSimilarArtistInfo because some artist's don't have any that are similar to them
    getMainArtistInfo = () => {
        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + this.state.foundArtist + '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                this.setState({
                    artistName: res.data.artist.name,
                    artistId: res.data.artist.mbid,
                    artistBio: res.data.artist.bio.summary.replace("<a href", '<a target="_blank" href'),
                    similarArtists: res.data.artist.similar.artist
                })

                this.checkIfInLikes();
                this.getTopFiveAlbums();
                this.getTopFiveSongs();

                if (this.state.similarArtists.length > 0) {
                    this.getSimilarArtistInfo();
                }
            }
            )
    }

    //This checks the likes file for the current artist's Id
    //If the current artist Id is in the likes file then the Like btn will be disabled so the user cannot like them again
    //If it is not in the file though it will make sure the button is enabled
    checkIfInLikes = () => {
        var i;
        if (this.state.artistId) {
            fs.readFile(LIKES_JSON, 'utf-8', (err, likeData) => {
                let likes = JSON.parse(likeData);
                for (i = 0; i < likes.artists.length; i++) {
                    if (likes.artists[i].mbid === this.state.artistId) {
                        this.setState({
                            isInLikes: true,
                            isInDislikes: true
                        })
                        break;
                    }
                }
                if (this.state.isInLikes === false) {
                    this.checkIfInDislikes();
                }
            })   
        }
    }
    

//This checks the dislikes file for the current artist's Id
//If the current artist Id is in the dislikes file then the Dislike btn will be disabled so the user cannot dislike them again
//If it is not in the file though it will make sure the button is enabled
checkIfInDislikes = () => {
    var i;
    if (this.state.artistId) {
        fs.readFile(DISLIKES_JSON, 'utf-8', (err, dislikeData) => {
            let dislikes = JSON.parse(dislikeData);
            for (i = 0; i < dislikes.artists.length; i++) {
                if (dislikes.artists[i].mbid === this.state.artistId) {
                    this.setState({
                        isInLikes: true,
                        isInDislikes: true
                    })
                    break;
                }
            }
        })
    }
}

    //This is Last FM's API getting called again
    //However, I am using a different method from Last FM
    //I am using the getTopAlbums which requires the artist's name or their mbid
    //Because of getMainArtistInfo, I am able to use the artist name because getInfo gave that information
    //In order for me to get the top five albums I used a for loop to push the first five results on to an
    //Array. This array is then set to topAlbums on the state so it can be accessed elsewhere in the component
    getTopFiveAlbums = () => {

        var i;
        var topFiveAlbums = [];

        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + this.state.artistName + '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                for (i = 0; i < 5; i++) {
                    topFiveAlbums.push(res.data.topalbums.album[i])
                }


                this.setState({
                    topAlbums: topFiveAlbums
                })
            })
    }

    //This is Last FM's API getting called again
    //However, I am using a different method from Last FM
    //I am using the getTopTracks which requires the artist's name or their mbid
    //Because of getMainArtistInfo, I am able to use the artist name because getInfo gave that information
    //In order for me to get the top five tracks I used a for loop to push the first five results on to an
    //Array. This array is then set to topSongs on the state so it can be accessed elsewhere in the component
    getTopFiveSongs = () => {
        var i;
        var topFiveSongs = [];

        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + this.state.artistName + '&api_key=' + LAST_FM_KEY + '&format=json')
            .then(res => {

                for (i = 0; i < 5; i++) {
                    topFiveSongs.push(res.data.toptracks.track[i])
                }

                this.setState({
                    topSongs: topFiveSongs
                })
            })
    }

    //This is Last FM's API getting called again
    //However, I am using a different method from Last FM
    //I am using the getInfo which requires the artist's name or their mbid
    //Because of getMainArtistInfo, I was able to set an array up of the similar artists
    //I am using getInfo so I can set an array up of all the similar artists' info
    getSimilarArtistInfo = () => {
        var i;
        var similarArtistData = [];

        for (i = 0; i < 5; i++) {
            axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + this.state.similarArtists[i].name + '&api_key=' + LAST_FM_KEY + '&format=json')
                .then(res => {
                    similarArtistData.push(res.data.artist)

                    this.setState({
                        similarArtistInfo: similarArtistData
                    })
                })
        }
    }

    //This just allows the user to go to the home page on a button click
    goHome() {
        this.props.history.push('/');
    }

    //This is used to add the artits(whose page you are on) to the likes file
    //So they will appear in the likes component and will be used to find recommendations in then recommendations component
    //It checks first to see if the artist has an Id because some artists do not
    //If they don not have an Id an errorr message will tell the user that the artist could not be added to the likes file
    //It then reads the likes file into an array, which allows the variable currentArtistId to be pushed on to it
    //It then writes this array back to the likes file
    addToLikes = () => {

        if (this.state.artistId) {
            let currentArtistId = { "mbid": "" + this.state.artistId + "", "name": "" + this.state.artistName };
            fs.readFile(LIKES_JSON, 'utf-8', (err, likeData) => {
                let likes = JSON.parse(likeData);

                likes.artists.push(currentArtistId)

                fs.writeFile(LIKES_JSON, JSON.stringify(likes), (err) => {
                    if (err) {
                        console.dir(err);
                    } else {
                        this.setState({
                            isInLikes: true,
                            isInDislikes: true
                        })
                    }
                })
            });
        } else {
            alert("This artist can't be added to your likes. Sorry for this, please enjoy searching the music reccomender!!");
        }
    }

//This is used to add the artits(whose page you are on) to the dislikes file
//So they will appear in the dislikes component
//It checks first to see if the artist has an Id because some artists do not
//If they don not have an Id an errorr message will tell the user that the artist could not be added to the dislikes file
//It then reads the dislikes file into an array, which allows the variable currentArtistId to be pushed on to it
//It then writes this array back to the dislikes file
addToDislikes = () => {

    if (this.state.artistId) {
        let currentArtistId = { "mbid": "" + this.state.artistId + "", "name": "" + this.state.artistName };

        fs.readFile(DISLIKES_JSON, 'utf-8', (err, dislikeData) => {
            let dislikes = JSON.parse(dislikeData);

            dislikes.artists.push(currentArtistId)

            fs.writeFile(DISLIKES_JSON, JSON.stringify(dislikes), (err) => {
                if (err) {
                    console.dir(err);
                } else {
                    this.setState({
                        isInDislikes: true,
                        isInLikes: true
                    })
                }
            })
        });
    } else {
        alert("This artist can't be added to your dislikes. Sorry for this, please enjoy searching the music reccomender!!");
    }

}

//This is what the user will see
//First off, in the top and middle of the screen there will be the artists' name and just underneath is the like and dislike buttons
//The buttons use the onClick methods of addToLikes and AddToDislikes respectively
//Underneath that there is a short paragraph that is about the artist
//After this there is a row with 3 columns. The columns are the artist's top albums, top songs and then their similar artists
//Map is used to create the list items. In this instance, the topAlbum gets passed in to ArtistTopAlbum
//In this instance, the topSong gets passed in to ArtistTopSong
//In this instance, the similarArtist gets passed in to ArtistResultSummary. If there is no similar artist at all it just displays:
//"This artist has no similar artists, sorry!!"
//Finally the button uses the goHome method to allow the user an easy way to go back to the home page rather than pressing the back button
render() {
    return (
        <div>
            <div class="col-sm-12">
                <h1>{this.state.artistName}</h1>
                <div className="center-data">
                    {<button id="Like" className="btn btn-primary" onClick={this.addToLikes} type="submit" disabled={this.state.isInLikes}>Like!</button>}
                    {<button id="Dislike" className="btn btn-primary" onClick={this.addToDislikes} type="submit" disabled={this.state.isInDislikes}>Dislike!</button>}
                </div>
            </div>
            <p dangerouslySetInnerHTML={{ __html: this.state.artistBio }} />
            <div class="row">
                <div class="col-sm-4">
                    <h3 className="center-data">Top five albums:</h3>
                    <ul className="lists">
                        {this.state.topAlbums.map((topAlbum) => {
                            return <ArtistTopAlbum topAlbum={topAlbum} />
                        })}
                    </ul>
                </div>
                <div class="col-sm-4">
                    <h3 className="center-data">Top five songs:</h3>
                    <ul className="lists">
                        {this.state.topSongs.map((topSong) => {
                            return <ArtistTopSong topSong={topSong} />
                        })}
                    </ul>
                </div>
                <div class="col-sm-4">
                    <h3 className="center-data">Similar artists:</h3>
                    {
                        this.state.similarArtistInfo.length > 0 ?
                            <ul className="lists">
                                {this.state.similarArtistInfo.map((artist) => {
                                    return <ArtistResultSummary artist={artist} />
                                })}
                            </ul>
                            : 'This artist has no similar artists, sorry!!'
                    }
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <span>
                        <button id="btn-search" className="btn btn-primary btn-float-right " onClick={this.goHome} type="submit" >Search again!</button>
                    </span>
                </div>
            </div>
        </div>
    )
}
}