import React from 'react';
import Header from './Components/Header';
import MovieTvList from './Components/Movie_tvlist';
import PeopleList from './Components/PeopleList';
import Movie from './Components/Movie-site/Movie';
import Tv from './Components/Tv-site/Tv';
import Person from './Components/Person';
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
        <Router forceRefresh={true}>
            <GlobalContext.Provider
                value={{ dispatch: dispatch, state: state }}
            >
                <Header />
                <Switch>
                    <Route key='home' exact path='/'>
                        <MovieTvList />
                        <PeopleList />
                    </Route>
                    <Route
                        key='movie'
                        path='/movie/:id'
                        children={<Movie />}
                    ></Route>
                    <Route key='tv' path='/tv/:id' children={<Tv />}></Route>
                    <Route
                        key='person'
                        path='/person/:id'
                        children={<Person />}
                    ></Route>
                    <Route key='*' path='*'>
                        <Error />
                    </Route>
                </Switch>
            </GlobalContext.Provider>
        </Router>
    );
}

export default App;
