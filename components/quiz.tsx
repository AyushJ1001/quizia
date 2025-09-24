import { Box, Text, useApp } from "ink";
import SelectInput, { type ItemProps } from "ink-select-input";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
	useState,
	useEffect,
	type Dispatch,
	type FC,
	type SetStateAction,
	useRef,
} from "react";

type CustomItemProps = ItemProps & {
	isCorrect?: boolean;
};

// Load quiz data from JSON at runtime to avoid JSON import assertions in Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ww1Path = resolve(__dirname, "../data/ww1.json");
const ww1 = JSON.parse(readFileSync(ww1Path, "utf8")) as Array<{
	question: string;
	choices: { A: string; B: string; C: string; D: string };
	correct: "A" | "B" | "C" | "D";
}>;

function Questions({
	setScore,
}: {
	setScore: Dispatch<SetStateAction<number>>;
}) {
	const { exit } = useApp();
	const [questionIdx, setQuestionIdx] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isLockedRef = useRef(false);

	useEffect(() => {
		if (questionIdx >= ww1.length) {
			const timer = setTimeout(() => {
				exit();
			}, 800);

			return () => clearTimeout(timer);
		}
	}, [questionIdx, exit]);

	// Cleanup timeout on unmount
	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			isLockedRef.current = false;
		},
		[]
	);

	const question = ww1[questionIdx];
	const correct = question?.correct;
	const items = [
		{
			label: question?.choices.A || "",
			value: "A",
			isCorrect: correct === "A",
		},
		{
			label: question?.choices.B || "",
			value: "B",
			isCorrect: correct === "B",
		},
		{
			label: question?.choices.C || "",
			value: "C",
			isCorrect: correct === "C",
		},
		{
			label: question?.choices.D || "",
			value: "D",
			isCorrect: correct === "D",
		},
	];

	const CustomItem: FC<CustomItemProps> = ({
		isSelected,
		label,
		isCorrect,
	}) => {
		if (isCorrect === undefined) {
			return <Text>{label}</Text>;
		}

		let color = "white";
		if (isSelected) {
			if (isCorrect) {
				color = "green";
			} else {
				color = "red";
			}
		}

		if (!isSelected && isCorrect) {
			color = "green";
		}

		return <Text color={color}>{label}</Text>;
	};

	return (
		<Box flexDirection="column" paddingY={1}>
			{questionIdx < ww1.length ? (
				<>
					<Text color="cyanBright" bold>
						{question?.question}
					</Text>
					<SelectInput
						key={questionIdx}
						items={
							showAnswer
								? items
								: items.map((item) => ({ ...item, isCorrect: undefined }))
						}
						limit={4}
						itemComponent={CustomItem}
						isFocused={!showAnswer}
						onSelect={(item) => {
							// Immediate re-entrancy guard to prevent double-scoring
							if (isLockedRef.current) {
								return;
							}

							isLockedRef.current = true;
							setShowAnswer(true);

							if (item.value === correct) {
								setScore((prev) => prev + 1);
							}

							// Clear any existing timeout before setting a new one
							if (timeoutRef.current) {
								clearTimeout(timeoutRef.current);
							}

							timeoutRef.current = setTimeout(() => {
								setQuestionIdx((prev) => prev + 1);
								setShowAnswer(false);
								isLockedRef.current = false;
								timeoutRef.current = null;
							}, 1000);
						}}
					/>
				</>
			) : (
				<Box flexDirection="column" alignItems="center" paddingY={2}>
					<Text color="green" bold>
						🎉 Quiz Complete! 🎉
					</Text>
					<Text color="white">Thanks for playing!</Text>
				</Box>
			)}
		</Box>
	);
}

export function Quiz() {
	const [score, setScore] = useState(0);

	return (
		<Box flexDirection="column">
			<Text bold italic color="blueBright">
				WW1
			</Text>
			<Text italic color="blue">
				Score: {score}/{ww1.length}
			</Text>
			<Questions setScore={setScore} />
		</Box>
	);
}
