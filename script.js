// set up the game board
let board = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

let score = 0;
let gameOver = false;
let hasWon = false;

// add a random tile to the board
function addRandomTile() {
	const emptyTiles = [];
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] === 0) {
				emptyTiles.push({ row, col });
			}
		}
	}
	if (emptyTiles.length === 0) return;
	const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
	board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// render the game board
function render() {
	const boardElement = document.getElementById("board");
	boardElement.innerHTML = "";
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			const tile = document.createElement("div");
			tile.className = "tile";
			if (board[row][col] !== 0) {
				tile.classList.add(`tile-${board[row][col]}`);
			}
			tile.innerText = board[row][col] === 0 ? "" : board[row][col];
			tile.style.top = `${row * 100 + 5}px`;
			tile.style.left = `${col * 100 + 5}px`;
			boardElement.appendChild(tile);
		}
	}
	updateScore();
}

// Update score display
function updateScore() {
	const scoreElement = document.getElementById("score");
	if (scoreElement) {
		scoreElement.innerText = score;
	}
}

// Slide and merge a single row/column array to the left
function slideAndMerge(line) {
	// Remove zeros
	let filtered = line.filter(val => val !== 0);
	let merged = [];
	let scoreGain = 0;

	for (let i = 0; i < filtered.length; i++) {
		if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
			// Merge tiles
			merged.push(filtered[i] * 2);
			scoreGain += filtered[i] * 2;
			i++; // Skip the next tile since it's merged
		} else {
			merged.push(filtered[i]);
		}
	}

	// Pad with zeros to maintain length
	while (merged.length < 4) {
		merged.push(0);
	}

	return { result: merged, scoreGain };
}

// Check if two arrays are equal
function arraysEqual(a, b) {
	return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Move tiles in a direction
function move(direction) {
	let moved = false;
	let totalScoreGain = 0;

	if (direction === "left") {
		for (let row = 0; row < 4; row++) {
			const original = [...board[row]];
			const { result, scoreGain } = slideAndMerge(board[row]);
			board[row] = result;
			totalScoreGain += scoreGain;
			if (!arraysEqual(original, result)) moved = true;
		}
	} else if (direction === "right") {
		for (let row = 0; row < 4; row++) {
			const original = [...board[row]];
			const reversed = [...board[row]].reverse();
			const { result, scoreGain } = slideAndMerge(reversed);
			board[row] = result.reverse();
			totalScoreGain += scoreGain;
			if (!arraysEqual(original, board[row])) moved = true;
		}
	} else if (direction === "up") {
		for (let col = 0; col < 4; col++) {
			const original = [board[0][col], board[1][col], board[2][col], board[3][col]];
			const { result, scoreGain } = slideAndMerge(original);
			totalScoreGain += scoreGain;
			for (let row = 0; row < 4; row++) {
				board[row][col] = result[row];
			}
			if (!arraysEqual(original, result)) moved = true;
		}
	} else if (direction === "down") {
		for (let col = 0; col < 4; col++) {
			const original = [board[0][col], board[1][col], board[2][col], board[3][col]];
			const reversed = [...original].reverse();
			const { result, scoreGain } = slideAndMerge(reversed);
			const finalResult = result.reverse();
			totalScoreGain += scoreGain;
			for (let row = 0; row < 4; row++) {
				board[row][col] = finalResult[row];
			}
			if (!arraysEqual(original, finalResult)) moved = true;
		}
	}

	score += totalScoreGain;
	return moved;
}

// Check for win condition
function checkWin() {
	if (hasWon) return false;
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 2048) {
				hasWon = true;
				return true;
			}
		}
	}
	return false;
}

// Check if any moves are possible
function canMove() {
	// Check for empty cells
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 0) return true;
		}
	}

	// Check for adjacent equal cells
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			const current = board[row][col];
			// Check right neighbor
			if (col < 3 && board[row][col + 1] === current) return true;
			// Check bottom neighbor
			if (row < 3 && board[row + 1][col] === current) return true;
		}
	}

	return false;
}

// Check for game over
function checkGameOver() {
	if (!canMove()) {
		gameOver = true;
		setTimeout(() => {
			alert(`Game Over! Your score: ${score}`);
		}, 100);
		return true;
	}
	return false;
}

// Handle a move in any direction
function handleMove(direction) {
	if (gameOver) return;

	const moved = move(direction);
	if (moved) {
		addRandomTile();
		render();

		if (checkWin()) {
			setTimeout(() => {
				alert("Congratulations! You reached 2048!");
			}, 100);
		}

		checkGameOver();
	}
}

// handle key presses
function handleKeyPress(event) {
	if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
		event.preventDefault();
	}

	switch (event.key) {
		case "ArrowUp":
			handleMove("up");
			break;
		case "ArrowDown":
			handleMove("down");
			break;
		case "ArrowLeft":
			handleMove("left");
			break;
		case "ArrowRight":
			handleMove("right");
			break;
	}
}

// Reset the game
function resetGame() {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	score = 0;
	gameOver = false;
	hasWon = false;
	addRandomTile();
	addRandomTile();
	render();
}

// start the game
addRandomTile();
addRandomTile();
render();
window.addEventListener("keydown", handleKeyPress);

// Listen for buttons pressed
const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");
const resetBtn = document.getElementById("reset");

up.addEventListener("click", () => handleMove("up"));
down.addEventListener("click", () => handleMove("down"));
left.addEventListener("click", () => handleMove("left"));
right.addEventListener("click", () => handleMove("right"));

if (resetBtn) {
	resetBtn.addEventListener("click", resetGame);
}
