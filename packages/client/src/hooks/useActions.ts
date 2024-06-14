import { useMemo } from 'react';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux";

export const useActions = () => {
	const dispatch = useDispatch();

	// vids 230 & 231
	return useMemo(() => {
		return bindActionCreators(actionCreators, dispatch);
	}, [dispatch]);
};
