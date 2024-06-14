import React from "react";
import { Code } from "./Code/index";
import { Text } from "./Text";
import { Cell as reduxCell } from "../../redux";
import ActionBar from "./Bar";
import "./cell.css";

interface CellProps {
	cell: reduxCell;
}

const Cell: React.FC<CellProps> = ({ cell }) => {
	let cellType: JSX.Element;

	if (cell.type === "code") {
		cellType = <>
			<div className='action-bar-wrapper'>
				<ActionBar id={cell.id} />
			</div>
			<Code cell={cell} />
		</>;
	} else {
		// why is ActionBar below the text cell? -> vid 209
		cellType = <>
			<Text cell={cell} />
			<ActionBar id={cell.id} />
		</>;
	}

	return (
		<div className="cell">
			{cellType}
		</div>
	);
};

export default Cell;
