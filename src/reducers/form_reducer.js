function form_reducer(state, action) {
    switch (action.type) {
        case 'INPUT TEXT':
            return {
                ...state,
                [action.field]: action.payload,
            };
        case 'UPDATE EMPLOYEE':
            return action.payload;
        case 'RESET REDUCER':
            return action.payload;
        default:
            return state;
    }
}

export default form_reducer;