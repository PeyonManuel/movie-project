const TvReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TV':
            return {
                ...state,
                tv: action.payload,
            };
        case 'SET_TV_CREDITS':
            return {
                ...state,
                tvCredits: action.payload,
            };
        default:
            break;
    }
};

export default TvReducer;
