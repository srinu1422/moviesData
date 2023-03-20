const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
let db;
const dbpath = path.join(__dirname, "moviesData.db");
const initializeDB = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server is Running At ........");
    });
  } catch (e) {
    console.log("DB:Error");
  }
};
initializeDB();
convertarrayobj = (object) => {
  return {
    movieId: object.movie_id,
    directorId: object.director_id,
    movieName: object.movie_name,
    leadActor: object.lead_actor,
    directorName: object.director_name,
  };
};
//api1
app.get("/movies/", async (request, response) => {
  let dbquery = `SELECT movie_name from movie`;
  const movieArray = await db.all(dbquery);

  const updatedArray = movieArray.map((eachObj) => {
    return convertarrayobj(eachObj);
  });
  response.send(updatedArray);
});
// api 2 post method

app.post("/movies/", async (request, response) => {
  const moviedetails = request.body;
  const { directorId, movieName, leadActor } = moviedetails;
  const dbquery = `INSERT INTO 
                            movie(director_id,movie_name,lead_actor) 
                            VALUES(${directorId},"${movieName}" ,"${leadActor}")`;

  const dbresponse = await db.run(dbquery);
  response.send("Movie Successfully Added");
});

// api3  getting movie on movie_id

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const dbquery = `SELECT * 
                    FROM 
                    movie 
                    WHERE movie_id = ${movieId};`;
  const dbresponse = await db.get(dbquery);
  //console.log(dbresponse);

  response.send(convertarrayobj(dbresponse));
});

// api4 update ovie details
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const moviedetails = request.body;
  const { directorId, movieName, leadActor } = moviedetails;
  const dbquery = `UPDATE movie 
                        SET 
                        director_id = ${directorId},
                        movie_name = "${movieName}",
                        lead_actor = "${leadActor}"
                        WHERE
                         movie_id = ${movieId};`;
  const dbresponse = await db.run(dbquery);
  response.send("Movie Details Updated");
});

// delete movie

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const dbquery = `DELETE 
                         FROM 
                         movie 
                         WHERE movie_id = ${movieId} ;`;
  const dbresponse = await db.run(dbquery);
  response.send("Movie Removed");
});

// director table full
app.get("/directors/", async (request, response) => {
  const { directorId } = request.params;
  const dbquery = `SELECT director_id,director_name
                    FROM 
                    director;`;

  const dbresponse = await db.all(dbquery);
  const array1 = dbresponse.map((eachobj) => {
    return convertarrayobj(eachobj);
  });
  response.send(array1);
});

// api7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  console.log(directorId);
  const dbquery = `SELECT 
                      movie_name 
                      FROM 
                        movie
                       where director_id = ${directorId}
                      ;`;
  const dbresponse = await db.all(dbquery);
  console.log(dbresponse);
  const directerarray = dbresponse.map((eachobj) => {
    return convertarrayobj(eachobj);
  });
  response.send(directerarray);
});

module.exports = app;
