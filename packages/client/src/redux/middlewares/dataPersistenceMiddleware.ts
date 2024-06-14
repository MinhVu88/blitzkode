import { Dispatch } from "redux";
import { RootState } from "..";
import { persistCells } from "../actionCreators";
import { Action } from "../actions";
import { ActionType } from "../actionTypesEnum";


export const dataPersistenceMiddleware = (
  {
    dispatch, 
    getState
  }: { 
    dispatch: Dispatch<Action>, 
    getState: () => RootState 
  }
) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);

      if(
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.DELETE_CELL,
          ActionType.INSERT_CELL_AFTER
        ].includes(action.type)
      ) {
        if(timer) {
          clearTimeout(timer);
        }
        
        timer = setTimeout(() => {
          persistCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};