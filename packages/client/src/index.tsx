import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./redux/index";
import Cells from "./components/Cell/Cells";

const App = (): JSX.Element => {
	return (
		<Provider store={store}>
			<div className="App">
				<Cells />
			</div>
		</Provider>
	);
};

export default App;

ReactDOM.render(
	<React.Fragment>
		<App />
	</React.Fragment>,
	document.getElementById("root")
);
