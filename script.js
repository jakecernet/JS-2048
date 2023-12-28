// set up the game board
const board = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

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
	const { row, col } =
		emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
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
			tile.classList.add(`tile-${board[row][col]}`);
			tile.innerText = board[row][col] === 0 ? "" : board[row][col];
			tile.style.top = `${row * 100}px`;
			tile.style.left = `${col * 100}px`;
			boardElement.appendChild(tile);
		}
	}
}

// move tiles on the board
function moveTiles(direction) {
	let moved = false;
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] !== 0) {
				switch (direction) {
					case "up":
						if (row > 0 && board[row - 1][col] === 0) {
							board[row - 1][col] = board[row][col];
							board[row][col] = 0;
							moved = true;
						}
						break;
					case "down":
						if (
							row < board.length - 1 &&
							board[row + 1][col] === 0
						) {
							board[row + 1][col] = board[row][col];
							board[row][col] = 0;
							moved = true;
						}
						break;
					case "left":
						if (col > 0 && board[row][col - 1] === 0) {
							board[row][col - 1] = board[row][col];
							board[row][col] = 0;
							moved = true;
						}
						break;
					case "right":
						if (
							col < board[row].length - 1 &&
							board[row][col + 1] === 0
						) {
							board[row][col + 1] = board[row][col];
							board[row][col] = 0;
							moved = true;
						}
						break;
				}
			}
		}
	}
	return moved;
}

// merge tiles on the board
function mergeTiles(direction) {
	let merged = false;
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] !== 0) {
				switch (direction) {
					case "up":
						if (
							row > 0 &&
							board[row - 1][col] === board[row][col]
						) {
							board[row - 1][col] *= 2;
							board[row][col] = 0;
							merged = true;
						}
						break;
					case "down":
						if (
							row < board.length - 1 &&
							board[row + 1][col] === board[row][col]
						) {
							board[row + 1][col] *= 2;
							board[row][col] = 0;
							merged = true;
						}
						break;
					case "left":
						if (
							col > 0 &&
							board[row][col - 1] === board[row][col]
						) {
							board[row][col - 1] *= 2;
							board[row][col] = 0;
							merged = true;
						}
						break;
					case "right":
						if (
							col < board[row].length - 1 &&
							board[row][col + 1] === board[row][col]
						) {
							board[row][col + 1] *= 2;
							board[row][col] = 0;
							merged = true;
						}
						break;
				}
			}
		}
	}
	return merged;
}

// handle key presses
function handleKeyPress(event) {
	let moved = false;
	let merged = false;
	switch (event.key) {
		case "ArrowUp":
			moved = moveTiles("up");
			merged = mergeTiles("up");
			moveTiles("up");
			break;
		case "ArrowDown":
			moved = moveTiles("down");
			merged = mergeTiles("down");
			moveTiles("down");
			break;
		case "ArrowLeft":
			moved = moveTiles("left");
			merged = mergeTiles("left");
			moveTiles("left");
			break;
		case "ArrowRight":
			moved = moveTiles("right");
			merged = mergeTiles("right");
			moveTiles("right");
			break;
	}
	if (moved || merged) {
		addRandomTile();
		render();
	}
}

// start the game
addRandomTile();
addRandomTile();
render();
window.addEventListener("keydown", handleKeyPress);

//win
function win() {
	let win = false;
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length - 1; col++) {
			if (board[row][col] === 2048) {
				win = true;
			}
		}
	}
	if (win) {
		alert("You Win!");
	}
}

//listen for buttons pressed
const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");

up.addEventListener("click", () => {
	moveTiles("up");
	mergeTiles("up");
	moveTiles("up");
	addRandomTile();
	render();
	win();
});

down.addEventListener("click", () => {
	moveTiles("down");
	mergeTiles("down");
	moveTiles("down");
	addRandomTile();
	render();
	win();
});

left.addEventListener("click", () => {
	moveTiles("left");
	mergeTiles("left");
	moveTiles("left");
	addRandomTile();
	render();
	win();
});

right.addEventListener("click", () => {
	moveTiles("right");
	mergeTiles("right");
	moveTiles("right");
	addRandomTile();
	render();
	win();
});
