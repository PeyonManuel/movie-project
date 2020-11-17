const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_RESULTS':
            return {
                ...state,
                results: action.payload,
            };
        default:
            break;
    }
};

export default Reducer;
