import * as actionTypes from './actionTypes';

const INITIAL_STATE = {

    cartItems:[]
   
}
export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {




        case actionTypes.RESET_CART:
            return {
                ...state,
                cartItems: []
            }



        default:
            return state;
    }

}