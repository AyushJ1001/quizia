import meow from "meow";
import { App } from "./main.js";

// Disable Ink devtools explicitly
process.env.INK_NO_DEVTOOLS = "1";
process.env.DEV = "false";
process.env.NODE_ENV = process.env.NODE_ENV ?? "production";

// React DevTools backend expects `self` in some environments; polyfill to Node global
// Only polyfill if not already defined, to avoid unintended side effects.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (globalThis as any).self === "undefined") {
	(globalThis as any).self = globalThis as any;
}

const { render } = await import("ink");

meow(
	`
Usage
	$ quizia
`,
	{
		importMeta: import.meta,
	}
);

render(<App />);
