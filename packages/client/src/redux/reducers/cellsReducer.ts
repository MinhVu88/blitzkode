import produce from "immer";
import { ActionType } from "../actionTypesEnum";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
	isLoading: boolean;
	error: string | null;
	ids: string[];
	data: {
		[id: string]: Cell;
	};
}

const initialState: CellsState = {
	isLoading: false,
	error: null,
	ids: [],
	data: {}
};

// vid 196
const getRandomId = () => Math.random().toString(36).substr(2, 5);

const cellsReducer = produce(
	(
		state: CellsState = initialState, 
		action: Action
	): CellsState | undefined => {
		console.log("\ncellsReducer.ts | action.payload ->", action.payload, "\n");

		switch (action.type) {
			case ActionType.INSERT_CELL_AFTER: {
				const { id } = action.payload;

				const newlyInsertedCell: Cell = {
					id: getRandomId(),
					type: action.payload.type,
					content: ""
				};

				state.data[newlyInsertedCell.id] = newlyInsertedCell;

				const currentCellIndex = state.ids.findIndex(cell_id => cell_id === id);

				// vid 220 - refactoring the redux side
				// state.ids.push() -> state.ids.unshift()
				// state.ids.splice(currentCellIndex, ..., ...) -> splice(currentCellIndex + 1, ..., ...)
				if (currentCellIndex < 0) {
					state.ids.unshift(newlyInsertedCell.id);
				} else {
					state.ids.splice(currentCellIndex + 1, 0, newlyInsertedCell.id);
				}

				return state;
			}
			case ActionType.UPDATE_CELL: {
				const { id, content } = action.payload;

				// vid 192
				// return {
				// 	...state,
				// 	data: {
				// 		...state.data,
				// 		[id]: { ...state.data[id], content }
				// 	}
				// };

				// using immer to update a cell's content
				state.data[id].content = content;

				return state;
			}
			case ActionType.DELETE_CELL: {
				const id = action.payload;

				// remove a cell by its id in state's data property/object
				delete state.data[id];

				// remove a cell by its id in state's ids property/array
				state.ids = state.ids.filter(cell_id => cell_id !== id);

				return state;
			}
			case ActionType.MOVE_CELL: {
				const { id, direction } = action.payload;

				// vid 195
				const currentCellIndex = state.ids.findIndex(cell_id => cell_id === id);

				const newCellIndex = direction === "up" ? currentCellIndex - 1 : currentCellIndex + 1;

				if (newCellIndex < 0 || newCellIndex > state.ids.length - 1) {
					return state;
				}

				state.ids[currentCellIndex] = state.ids[newCellIndex];

				state.ids[newCellIndex] = action.payload.id;

				return state;
			}
			case ActionType.PERSIST_CELLS_ERROR: {
				state.error = action.payload;
				
				return state;
			}
			case ActionType.FETCH_API_CELLS: {
				state.isLoading = true;

				state.error = null;

				return state;
			}
			case ActionType.FETCH_API_CELLS_SUCCESS: {
				state.isLoading = false;

				state.ids = action.payload.map(cell => cell.id);

				state.data = action.payload.reduce((accumulator, cell) => {
					accumulator[cell.id] = cell;

					return accumulator;
				}, {} as CellsState['data']);
				
				return state;
			}
			case ActionType.FETCH_API_CELLS_ERROR: {
				state.isLoading = false;

				state.error = action.payload;

				return state;
			}
			default:
				return state;
		}
	},
	// vid 201
	initialState
);

export default cellsReducer;
