import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { dataPersistenceMiddleware } from "./middlewares/dataPersistenceMiddleware";
import reducers from "./reducers";
// import { ActionType } from "./actionTypesEnum";

export const store = createStore(
	reducers, 
	{}, 
	applyMiddleware(thunk, dataPersistenceMiddleware)
);

console.log('\nstore.ts | store.getState() ->',store.getState());

// manually test redux store 
// store.dispatch({
// 	type: ActionType.INSERT_CELL_AFTER,
// 	payload: {
// 		id: null,
// 		type: "code"
// 	}
// });

// store.dispatch({
// 	type: ActionType.INSERT_CELL_AFTER,
// 	payload: {
// 		id: null,
// 		type: "text"
// 	}
// });
