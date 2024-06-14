import React, { useEffect } from "react";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import Cell from "./Cell";
import CellCreation from "./CellCreation";
import './cells.css';

const Cells: React.FC = () => {
	const { fetchApiCells } = useActions();

	const orderedCells = useTypedSelector(({ cells: { ids, data } }) => {
		return ids.map(id => {
			return data[id];
		});
	});

	const renderedCells = orderedCells.map(cell => 
		<React.Fragment key={cell.id}>
			<Cell cell={cell} />
			<CellCreation previousCellId={cell.id} />
		</React.Fragment>
	);

	useEffect(() => {
		fetchApiCells();
	}, [fetchApiCells]);

	return (
		<div className="cells">
			<CellCreation 
				previousCellId={null} 
				forcedVisibility={renderedCells.length === 0} 
			/>
			{renderedCells}
		</div>
	);
};

export default Cells;
