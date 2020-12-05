const MovieReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MOVIE':
            return {
                ...state,
                movie: action.payload,
            };
        case 'SET_MOVIE_CREDITS':
            return {
                ...state,
                movieCredits: action.payload,
            };
        default:
            break;
    }
};

export default MovieReducer;
