import { useTypedSelector } from "./useTypedSelector";

export const useCumulativeCode = (id: string) => {
  return useTypedSelector(state => {
		const { data, ids } = state.cells;

		const orderedCells = ids.map(id => data[id]);

		// why "var show"? -> vid 250
		const showFunc = `
		import _React from 'react';
		import _ReactDOM from 'react-dom';

		var show = value => {
			console.log('hooks | useCumulativeCode | showFunc | value ->',value);

			const root = document.querySelector('#root');
			
			if(typeof value === 'object') {
				// check if value is an JSX element
				if(value.$$typeof && value.props) {
					_ReactDOM.render(value, root);
				}else {
					root.innerHTML = JSON.stringify(value);
				}
			}else {
				root.innerHTML = value;
			}
		};
	`;

		const emptyShowFunc = 'var show = () => {}';

		const cumulativeCells = [];

		for(let c of orderedCells) {
			if(c.type === 'code') {
				if(c.id === id) {
					cumulativeCells.push(showFunc);
				}else {
					cumulativeCells.push(emptyShowFunc);
				}

				cumulativeCells.push(c.content);
			}

			if(c.id === id) {
				break;
			}
		}

		return cumulativeCells.join('\n');
	});
};