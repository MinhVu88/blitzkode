import { ActionType } from "../actionTypesEnum";
import { Cell, CellTypes, CellDirections } from "../cell";

// UI CELLS
export interface InsertCellAfterAction {
	type: ActionType.INSERT_CELL_AFTER;
	payload: { id: string | null; type: CellTypes };
}

export interface UpdateCellAction {
	type: ActionType.UPDATE_CELL;
	payload: { id: string; content: string };
}

export interface DeleteCellAction {
	type: ActionType.DELETE_CELL;
	payload: string;
}

export interface MoveCellAction {
	type: ActionType.MOVE_CELL;
	payload: { id: string; direction: CellDirections };
}

// API CELLS
export interface FetchApiCellsAction {
	type: ActionType.FETCH_API_CELLS;
	payload: undefined;
}

export interface FetchApiCellsSuccessAction {
	type: ActionType.FETCH_API_CELLS_SUCCESS;
	payload: Cell[];
}

export interface FetchApiCellsErrorAction {
	type: ActionType.FETCH_API_CELLS_ERROR;
	payload: string;
}

export interface PersistCellsErrorAction {
	type: ActionType.PERSIST_CELLS_ERROR;
	payload: string;
}

// BUNDLING PROCESS
// specify payload for the bundling actions -> vid 225
export interface StartBundlingAction {
	type: ActionType.START_BUNDLING;
	payload: string;
}

export interface CompleteBundlingAction {
	type: ActionType.COMPLETE_BUNDLING;
	payload: {
		id: string;
		output: { code: string; error: string }
	};
}

export type Action = 
	InsertCellAfterAction | 
	UpdateCellAction | 
	DeleteCellAction | 
	MoveCellAction |
	PersistCellsErrorAction |
	FetchApiCellsAction |
	FetchApiCellsSuccessAction |
	FetchApiCellsErrorAction | 
	StartBundlingAction | 
	CompleteBundlingAction;
