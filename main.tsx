import BigText from "ink-big-text";
import Gradient from "ink-gradient";
import { Quiz } from "./components/quiz";

export function App() {
	return (
		<>
			<Gradient name="passion">
				<BigText text="Quizia" align="center" />
			</Gradient>
			<Quiz />
		</>
	);
}
