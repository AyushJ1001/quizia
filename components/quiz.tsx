import { Box, Text, useApp } from "ink";
import SelectInput, { type ItemProps } from "ink-select-input";

import ww1 from "../data/ww1.json";
import {
	useState,
	useEffect,
	type Dispatch,
	type FC,
	type SetStateAction,
} from "react";

type CustomItemProps = ItemProps & {
	isCorrect?: boolean;
};

function Questions({
	setScore,
}: {
	setScore: Dispatch<SetStateAction<number>>;
}) {
	const { exit } = useApp();
	const [questionIdx, setQuestionIdx] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (questionIdx >= ww1.length) {
			const timer = setTimeout(() => {
				exit();
			}, 800);

			return () => clearTimeout(timer);
		}
	}, [questionIdx, exit]);

	// Cleanup timeout on unmount or question change
	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

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
						items={
							showAnswer
								? items
								: items.map((item) => ({ ...item, isCorrect: undefined }))
						}
						limit={4}
						itemComponent={CustomItem}
						onSelect={(item) => {
							// Guard: return early if answer is already being shown
							if (showAnswer) {
								return;
							}

							setShowAnswer(true);
							if (item.value === correct) {
								setScore((prev) => prev + 1);
							}

							// Clear any existing timeout before setting a new one
							if (timeoutId) {
								clearTimeout(timeoutId);
							}

							const newTimeoutId = setTimeout(() => {
								setQuestionIdx((prev) => prev + 1);
								setShowAnswer(false);
								setTimeoutId(null);
							}, 1000);

							setTimeoutId(newTimeoutId);
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
				Score: {score}
			</Text>
			<Questions setScore={setScore} />
		</Box>
	);
}
