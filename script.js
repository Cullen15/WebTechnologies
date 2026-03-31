$(document).ready(function () {

  $.getJSON("data.json", function (data) {

    data.movies.forEach(function (movie) {
      $("#movieContainer").append(`
        <div class="movieCard">
          <h3>${movie.title}</h3>
          <p><strong>Year:</strong> ${movie.year}</p>
          <p><strong>Genre:</strong> ${movie.genre}</p>
        </div>
      `);
    });

    $(".movieCard").highlightCard();

  }).fail(function () {
    $("#movieContainer").html("<p>Could not load the JSON file. Try opening the project with Live Server.</p>");
  });

});

$.fn.highlightCard = function () {
  return this.each(function () {
    $(this).hover(
      function () {
        $(this).css({
          background: "#dfe6ff",
          transform: "scale(1.05)"
        });
      },
      function () {
        $(this).css({
          background: "white",
          transform: "scale(1)"
        });
      }
    );
  });
};