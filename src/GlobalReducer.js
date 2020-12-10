const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
      };
    case "SET_TV":
      return {
        ...state,
        tv: action.payload,
      };
    case "SET_PEOPLE":
      return {
        ...state,
        people: action.payload,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };
    default:
      break;
  }
};

export default Reducer;
