import { render } from "ink";
import meow from "meow";
import { App } from "./main";

meow(
	`
Usage
	$ quizia
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
