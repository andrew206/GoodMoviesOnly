/**
 * NAME: Andrew Lim
 * DATE: 07/27/2019
 * SECTION/TA: AC/Hudson
 * Adds an event listener to the Discover! button that initiates the fetch.
 * Fetches lists of movies filtered by genre, page number and ratingsfrom 
 * The Movie Database API and displays the results onto the index.html page.
 */

"use strict";
(function() {

  const movieDB_URL = "https://api.themoviedb.org/3/discover/movie?api_key=643b1e628b32df79d8cc6e9551123fb4&language=en-US&include_adult=false&include_video=false&vote_average.gte=7&vote_average.lte=10";
  const genreQuery = "&with_genres=";
  const pageQuery = "&page=";
  const images_URL = "https://image.tmdb.org/t/p/w500/";

  window.addEventListener("load", init);

  /**
   * Adds an event listener to the Discover! button that initiates the fetch.
   */
  function init() {
    qs("button").addEventListener("click", discover);
  }

  /**
   * Fetches movies based on genre
   */
  function discover() {
    let genre = qs("select").value;
    fetch(movieDB_URL + genreQuery + genre)
      .then(checkStatus)
      .then(response => response.json())
      .then(randomPage)
      .catch(console.error);
  }

  /**
   * Fetches movies from a random page of the results of the selected genre.
   * @param {object} list JSON object of the response. Contains page number, total results,
   *                      total pages and results.
   */
  function randomPage(list) {
    qs("body").removeChild(id("movies"));
    let div = gen("div");
    div.id = "movies";
    qs("body").appendChild(div);
    let genre = qs("select").value;
    let totalPages = list["total_pages"];
    let randomPage = Math.floor(Math.random() * totalPages);
    fetch(movieDB_URL + genreQuery + genre + pageQuery + randomPage)
      .then(checkStatus)
      .then(response => response.json())
      .then(displayMovies)
      .catch(console.error);
  }

  /**
   * Displays the discovered moves onto the index.html page with the movie poster and description.
   * @param {object} movies JSON object of the response. Contains page number, total results,
   *                        total pages and results.
   */
  function displayMovies(movies) {
    for (let i = 0; i < 8; i++) {
      let flipCard = gen("div");
      flipCard.classList.add("flip-card");
      let flipCardInner = gen("div");
      flipCardInner.classList.add("flip-card-inner")
      let flipCardFront = gen("div");
      flipCardFront.classList.add("flip-card-front");
      let img = gen("img");
      img.src = images_URL + movies.results[i]["poster_path"];
      flipCardFront.appendChild(img);
      flipCardInner.appendChild(flipCardFront);
      let flipCardBack = gen("div");
      flipCardBack.classList.add("flip-card-back");
      let overview = gen("p");
      overview.textContent = movies.results[i]["overview"];
      flipCardBack.appendChild(overview);
      flipCardInner.appendChild(flipCardBack);
      flipCard.appendChild(flipCardInner);
      id("movies").appendChild(flipCard);
    }
  }
  
  /** ------------------------------ Helper Shorthand Functions ------------------------------ */

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query (empty if none).
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector string.
   * @returns {object} first element matching the selector in the DOM tree (null if none)
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tagname.
   * @param {string} tagName - name of element to create and return.
   * @returns {object} new DOM element with the given tagname.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();