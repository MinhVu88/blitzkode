import { useEffect } from "react";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Resizable } from "../../Resizable";
import { Cell } from "../../../redux";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useCumulativeCode } from "../../../hooks/useCumulativeCode";
import './codeCell.css';

interface CodeCellProps {
	cell: Cell;
}

export const Code: React.FC<CodeCellProps> = ({ cell }): JSX.Element => {
	const { updateCell, bundle } = useActions();

	const bundledOutput = useTypedSelector(state => state.bundledOutput[cell.id]);

	const cumulativeBundledOutput = useCumulativeCode(cell.id);

	console.log('Cell | Code | index.tsx | cumulativeBundledOutput ->',cumulativeBundledOutput);

	useEffect(() => {
		if(!bundledOutput) {
			// bundle(cell.id, cell.content);

			bundle(cell.id, cumulativeBundledOutput);

			return;
		}

		const timer = setTimeout(async () => {
			// bundle(cell.id, cell.content);

			bundle(cell.id, cumulativeBundledOutput);
		}, 750);

		return () => {
			clearTimeout(timer);
		};

		 // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bundle, cumulativeBundledOutput, cell.id]);

	return (
		<Resizable direction="vertical">
			<div 
				style={{ 
					display: "flex", 
					flexDirection: "row", 
					height: "calc(100% - 10px)" 
				}}
			>
				<Resizable direction="horizontal">
					<Editor 
						initialValue={cell.content} 
						onChange={value => updateCell(cell.id, value)} 
					/>
				</Resizable>
				<div className="progress-wrapper-1">
					{
						!bundledOutput || bundledOutput.isBundling ? 
						(
							<div className='progress-wrapper-0'>
								<progress 
									max='100' 
									className='progress is-primary is-small'
								>
									Loading
								</progress>
							</div>
						) : 
						<Preview 
							bundledCode={bundledOutput.code} 
							status={bundledOutput.error} 
						/>
					}
				</div>
			</div>
		</Resizable>
	);
};
