import React from 'react';
import Header from './Components/Header';
import MovieList from './Components/MovieList';
import { useReducer, createContext } from 'react';
import GlobalReducer from './GlobalReducer';

export const GlobalContext = createContext();

function App() {
    const defaultState = {
        searchQuery: '',
        results: [],
    };

    const [state, dispatch] = useReducer(GlobalReducer, defaultState);

    return (
        <GlobalContext.Provider value={(dispatch, state)}>
            <Header />
            <MovieList />
        </GlobalContext.Provider>
    );
}

export default App;
