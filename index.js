const async = require('async');
const express = require('express');
const request = require('request');

const app = express();

const APIKEY = process.env.APIKEY || 'd56eb7c75a83462fbca2f34ff385f30f';

app.use('/', express.static('public'));
app.use('/hotpotato', express.static('public'));

app.get('/hotpotato/search/:searchTerm', (req, res) => {
  const { searchTerm } = req.params;
  request(`http://localhost:5050/api/${APIKEY}/search/?q=${searchTerm}`, (error, resp, body) => {
    const searchResults = JSON.parse(body);
    async.each(searchResults.movies, (movie, callback) => {
      const imdb = movie.imdb;
      request(`http://www.omdbapi.com/?i=${imdb}&apikey=88fde882`, (error, resp, body) => {
        const movieInfo = JSON.parse(body);
        movie.rated = movieInfo.Rated;
        movie.runtime = movieInfo.Runtime;
        movie.imdbRating = movieInfo.imdbRating;
        movie.awards = movieInfo.Awards;
        callback();
      });
    }, (err) => {
      if (err) {
        res.json({error: true, reason: err});
      } else {
        res.json(searchResults);
      }
    });
  });
});

app.get('/hotpotato/movie.add/:id/:title', (req, res) => {
  const { id, title } = req.params;

  request(`http://localhost:5050/api/${APIKEY}/profile.list`, (error, resp, body) => {
    const profileList = JSON.parse(body);
    for (let profile of profileList.list) {
      if (profile.label === 'HD') {
        const profileId = profile._id;
        request(`http://localhost:5050/api/${APIKEY}/movie.add/?identifier=${id}&title=${title}&profile_id=${profileId}`,
          (error, resp, body) => {
            res.json(JSON.parse(body));
          });
      }
    }
  });
});

app.listen(3000, () => console.log('Hot Potato listening on port 3000'));
