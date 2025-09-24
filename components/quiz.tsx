import { Box, Text, useApp } from "ink";
import SelectInput, { type ItemProps } from "ink-select-input";

import ww1 from "../data/ww1.json";
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
