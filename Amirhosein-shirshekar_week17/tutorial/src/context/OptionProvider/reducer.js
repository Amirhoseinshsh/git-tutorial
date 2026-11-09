const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    default:
      return state;
  }
};

export default reducer;
