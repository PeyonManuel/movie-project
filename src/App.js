import React from 'react';
import Header from './Components/Header';
import MovieTvList from './Components/Movie_tvlist';
import PeopleList from './Components/PeopleList';
import Movie from './Components/Movie';
import Tv from './Components/Tv';
import Error from './Components/Error';
import { useReducer, createContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GlobalReducer from './GlobalReducer';

export const GlobalContext = createContext();

function App() {
    const defaultState = {
        searchQuery: '',
        movies: [],
        tv: [],
        people: [],
    };

    const [state, dispatch] = useReducer(GlobalReducer, defaultState);

    return (
        <Router>
            <GlobalContext.Provider
                value={{ dispatch: dispatch, state: state }}
            >
                <Header />
                <Switch>
                    <Route exact path='/'>
                        <MovieTvList />
                        <PeopleList />
                    </Route>
                    <Route path='/movies/:id' children={<Movie />}></Route>
                    <Route path='/tv/:id' children={<Tv />}></Route>
                    <Route path='*'>
                        <Error />
                    </Route>
                </Switch>
            </GlobalContext.Provider>
        </Router>
    );
}

export default App;
