// Main app entry point that loads the basic framework and this also defines the routes so the components can be used.
//This is where I learned about react and how to use it:
//https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-1 
//My Dad and I worked on a react project before I started this so I used that experience to help me with this project as I was able to look back 
//And it helped me with some parts of this such as the routes and reusable components

//Import and Export statements
//where I learned about browserify-fs
//https://www.npmjs.com/package/browserify-fs
//This is used for local storage as browserify-fs makes it eaier to read nad write to
//Local storage is storage that is local to the browser
//Fore example, if I liked Ac/Dc on this PC and then went to a laptop, Ac/Dc would not be liked
//The LAST_FM_KEY is the API key I was given when I created my API account with Last FM
//This key is needed whenever I use one of the methods from Last FM
//For example, I will need it when I call getInfo in artist component and when I call 
//getSimilar in the Home component
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/home.component";
import results from "./components/results.component";
import artist from "./components/artist.component.js";
import recommendations from "./components/recommendations.component";
import favourites from "./components/favourites.component";
import dislikes from "./components/dislikes.component";
import Logo from "./Logo.png";
import Search from "./components/search.component";
import searchedArtist from "./components/searchedArtist.component";
import fs from "browserify-fs"
export const LAST_FM_KEY = '686acc4c7ab472a332f7944062df7518'
export const LIKES_AND_DISLIKES_DIR = '/LikesAndDislikes';
export const DISLIKES_JSON = LIKES_AND_DISLIKES_DIR + '/Dislikes.json';
export const LIKES_JSON = LIKES_AND_DISLIKES_DIR + '/Likes.json';

class App extends Component {

  //The constructor: this creates the likes and dislikes files in the LikesAndDislikes directory in local storage
  //This means that if a user closes the original page, and then goes back to it later, 
  //The likes and dislikes files are still in local storage
  //fs.stat is used to check if the file exist within the LikesAndDislikes folder
  //If they do exist then nothing happens
  //But if the files don't and empty array gets pushed onto them so the files have been intialised
  constructor(props) {
    super(props);

    fs.stat(LIKES_AND_DISLIKES_DIR, (err) => {

      // Intialise the files if they don't exist
      if (err) {

        fs.mkdir(LIKES_AND_DISLIKES_DIR, () => {

          let artists = {
            artists: []
          } 


          fs.writeFile(LIKES_JSON, JSON.stringify(artists), (err) => {
            if (err) {
              console.log("Failed to create Likes file");
            }
          });

          fs.writeFile(DISLIKES_JSON, JSON.stringify(artists), (err) => {
            if (err) {
              console.log("Failed to create Dislikes file");
            }
          });

        });
      }
    })
  }

//This is what gets shown on the website at all times.
//This is the Navbar and this shows the different pages users can go to from the start
//Some will be empty(Reccommendations, Favourites and dilikes) because the user will not have liked/disliked anyone
//So no reccomendations can be created, and the favourites/dilikes cannot be shown
//Based on the route, it will load the relevant components
  render() {
    return (
      <Router>
        <div className="container">
          <nav class="col-sm-12" className="navbar navbar-expand navbar-light navbar-center">
            <a className="navbar-item">
              <img className="Logo-spin" src={Logo} width="40" height="40" alt="Logo" />
            </a>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item mr-auto">
                  <Link to="/search" className="nav-link">Search</Link>
                </li>
                <li className="navbar-item mr-auto">
                  <Link to="/recommendations" className="nav-link">Recommendations</Link>
                </li>
                <li className="navbar-item mr-auto">
                  <Link to="/favourites" className="nav-link">Liked</Link>
                </li>
                <li className="navbar-item mr-auto">
                  <Link to="/dislikes" className="nav-link">Disliked</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
          <br />
          {/* This sets up the routes. These routes tell the website, what component to load when they are on a specific route.
          For example, if i was on the route "/" the Home component would be loaded onto the screen for the user to use */}
          <Route path="/" exact component={Home} />
          <Route path="/recommendations" component={recommendations} />
          <Route path="/favourites" component={favourites} />
          <Route path="/dislikes" component={dislikes} />
          <Route path="/results" component={results} />
          <Route path="/artist/:id" component={artist} />
          <Route path="/searchedArtist" component={searchedArtist} />
          <Route path="/search" component={Search} />

        </div>
      </Router>
    );
  }
}

//Allows other components to import this one
export default App;
