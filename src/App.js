import React, {useState, useEffect, useCallback} from 'react';
import AddMovie  from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [showMovies, setShowMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  
  const ShowMoviesHandler = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try{
      
      const response = await fetch('https://react-http-83429-default-rtdb.firebaseio.com/movies.json')
      if (!response.ok) {
        throw new Error("Something went wrong")
      }
      const data = await response.json()
      const loadedMovies = [];

      for( const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
      setShowMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
    
  }, [])
  
  useEffect(() => {
   ShowMoviesHandler()
  },[ShowMoviesHandler])

  const addMovieHandler = async(movie) => {

    try{

      const response = await fetch('https://react-http-83429-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'content-type': 'application/json'
        }
      })

      if(!response.ok) {
        throw new Error('oops! something went wrong')
      }

      const data = await response.json()
      console.log(data)
    } catch(error) {
      setError(error.message)
    }
    }
    
let content;

if(!isLoading && showMovies.length === 0 && !error) {
  content=<p>no movies found</p>
}

if (!isLoading && showMovies.length > 0) {
  content=<MoviesList movies={showMovies} />
}

  if (isLoading) {
    content = <p>loading...</p>
  }

  return (
    <React.Fragment>
      <section>
      <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={ShowMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;