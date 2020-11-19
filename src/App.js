import React from 'react';
import Header from './Components/Header';
import MovieTvList from './Components/Movie_tvlist';
import PeopleList from './Components/PeopleList';
import { useReducer, createContext } from 'react';
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
        <GlobalContext.Provider value={{ dispatch: dispatch, state: state }}>
            <Header />
            <MovieTvList />
            <PeopleList />
        </GlobalContext.Provider>
    );
}

export default App;
