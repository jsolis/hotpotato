$('#search').on('click', function(e) {
  $.ajax('/hotpotato/search/' + $('#movieTitle').val()).done(function (data) {
    console.log('search', data);
    $('#searchResults').empty();

    for (let movie of data.movies) {
      let genres = '';
      for (let genre of movie.genres) {
        genres += `${genre}&nbsp;`;
      }

      let status = 'Not in Queue or Library';
      if (movie.in_library) {
        status = 'In Library';
      }
      if (movie.in_wanted) {
        status = 'In Queue';
      }

      let button = '';
      if (!movie.in_library && !movie.in_wanted) {
        button = `
          <button class="btn btn-warning" type="button" onClick="addMovie('${movie.imdb}','${movie.original_title}')">
            Add to Queue
          </button>
        `;
      }

      $('#searchResults').append(`
        <li class="media border rounded mb-2">
          <img class="mr-3" src="${movie.images.poster[0]}" xclass="img-fluid" alt="${movie.original_title}">
          <div class="media-body pt-2">
            <h5 class="mt-0 mb-1">${movie.original_title} (${movie.year})</h5>
            <p style="color: green"><b>${status}</b></p>
            <p><b>${genres}</b></p>
            <p>${movie.plot}</p>
            <p><a href="https://www.imdb.com/title/${movie.imdb}/">IMDB</a></p>
            <p>${button}</p>
            <p id="notification-${movie.imdb}"></p>
          </div>
        </li>
      `);
    }
  });
});

function addMovie(imdb, title) {
  $.ajax('/hotpotato/movie.add/' + imdb + '/' + title).done(function (data) {
    console.log('movie.add', data);
    if (data.success) {
      $(`#notification-${imdb}`).replaceWith(`
        <div class="alert alert-success" role="alert">${title} added to queue</div>
      `);
    } else {
      $(`#notification-${imdb}`).replaceWith(`
        <div class="alert alert-danger" role="alert">Failed to add ${title} to queue</div>
      `);
    }
  });
}