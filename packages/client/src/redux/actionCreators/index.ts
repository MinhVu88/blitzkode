import { Dispatch } from 'redux';
import axios from 'axios';
import { ActionType } from "../actionTypesEnum";
import { Cell, CellTypes, CellDirections } from "../cell";
import { startService } from '../../bundler/esbuild/index';
import {
	Action,
	DeleteCellAction,
	InsertCellAfterAction,
	MoveCellAction,
	UpdateCellAction
} from "../actions";
import { RootState } from '..';

export const insertCellAfter = (
	id: string | null, 
	cellType: CellTypes
): InsertCellAfterAction => {
	return {
		type: ActionType.INSERT_CELL_AFTER,
		payload: { id, type: cellType }
	};
};

export const updateCell = (
	id: string, 
	content: string
): UpdateCellAction => {
	return {
		type: ActionType.UPDATE_CELL,
		payload: { id, content }
	};
};

export const deleteCell = (id: string): DeleteCellAction => {
	return {
		type: ActionType.DELETE_CELL,
		payload: id
	};
};

export const moveCell = (
	id: string, 
	direction: CellDirections
): MoveCellAction => {
	return {
		type: ActionType.MOVE_CELL,
		payload: { id, direction }
	};
};

export const fetchApiCells = () => {
	return async (dispatch: Dispatch<Action>) => {
		dispatch({ 
			type: ActionType.FETCH_API_CELLS, 
			payload: undefined 
		});

		try {
			const { data }: { data: Cell[] } = await axios.get('/cells');

			console.log('packages/client/redux/actionCreators/index.ts | fetchApiCells | data ->',data);

			dispatch({
				type: ActionType.FETCH_API_CELLS_SUCCESS,
				payload: data
			});
		} catch (error: any) {
			dispatch({
				type: ActionType.FETCH_API_CELLS_ERROR,
				payload: error.message
			});
		}
	};
};

export const persistCells = () => {
	return async (
		dispatch: Dispatch<Action>,
		getState: () => RootState
	) => {
		const { cells: { data, ids } } = getState();

		const persistedCells = ids.map(id => data[id]);
		
		try {
			await axios.post('/cells', { cells: persistedCells });	
		} catch (error: any) {
			dispatch({
				type: ActionType.PERSIST_CELLS_ERROR,
				payload: error.message
			});
		}
	};
};

export const bundle = (id: string, userInput: string) => {
	return async (dispatch: Dispatch<Action>) => {
		dispatch({
			type: ActionType.START_BUNDLING,
			payload: id
		});

		const { code, error } = await startService(userInput);

		dispatch({
			type: ActionType.COMPLETE_BUNDLING,
			payload: {
				id,
				output: { code, error }
			}
		});
	};
};