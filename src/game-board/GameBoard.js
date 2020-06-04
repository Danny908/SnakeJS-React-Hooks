import React, { useState, useEffect } from "react";
import "./GameBoard.scss";

function GameBoard({ onScore, onUpdateScreen, idMenu }) {
  let canvasRef;
  // Set canvas size on desired tiles numbers
  const tile = 25;
  // Set number of tiles on game board
  const tilesX = 40;
  const tilesY = 30;
  const width = tile * tilesX;
  const height = tile * tilesY;
  // Game tick speed on ms
  const tick = 200;
  // Game controls keycode
  const ctrls = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };
  // Snake initial state on the middle of the board
  const [snake, setSnake] = useState([
    { x: 17, y: 15 },
    { x: 18, y: 15 },
    { x: 19, y: 15 },
    { x: 20, y: 15 },
  ]);
  // Active control direction
  const [ctrl, setControl] = useState(ctrls.RIGHT);
  const [food, setFood] = useState(null);
  const [end, setEnd] = useState(false);

  const draw = () => {
    const ctx = canvasRef.getContext("2d");
    // Clean canvas on every update
    ctx.beginPath();
    ctx.fillStyle = "#262931";
    ctx.fillRect(0, 0, width, height);
    drawSnake(ctx);
    drawFood(ctx);
    if (end) {
      gameOver(ctx);
    }
  };

  const drawSnake = (ctx) => {
    // Draw snake on canvas
    snake.forEach((s, i) => {
      ctx.beginPath();
      ctx.fillStyle = i === snake.length - 1 ? "#57ba59" : "whitesmoke";
      ctx.strokeStyle = "#262931";
      const x = tile * s.x;
      const y = tile * s.y;
      ctx.fillRect(x, y, tile, tile);
      ctx.strokeRect(x, y, tile, tile);
    });
  };

  // Update snake head, apear on other side if board edge reached
  const snakeMove = (head) => {
    let { x, y } = head;
    switch (ctrl) {
      case ctrls.LEFT:
        x = x - 1 < 0 ? tilesX - 1 : x - 1;
        break;
      case ctrls.UP:
        y = y - 1 < 0 ? tilesY - 1 : y - 1;
        break;
      case ctrls.RIGHT:
        x = x + 1 > tilesX - 1 ? 0 : x + 1;
        break;
      case ctrls.DOWN:
        y = y + 1 > tilesY - 1 ? 0 : y + 1;
        break;
      default:
        x = x + 1 > tilesX - 1 ? 0 : x + 1;
        break;
    }
    return { x, y };
  };

  const updateSnake = () => {
    const _snake = snake.map((s, i) => {
      if (i + 1 < snake.length) {
        s = snake[i + 1];
      } else {
        s = snakeMove(s);
      }
      return s;
    });

    // End game if snake eats itself
    if (
      _snake.some((s, i) => {
        if (i !== _snake.length - 1) {
          return (
            JSON.stringify(_snake[_snake.length - 1]) === JSON.stringify(s)
          );
        }
        return false;
      })
    ) {
      setEnd(true);
    }
    setSnake(_snake);
  };

  const tickFn = () =>
    setInterval(() => {
      updateSnake();
    }, tick);

  const keyboardCtrls = (e) => {
    if (e.keyCode !== ctrl) {
      // Control limitations
      if (
        (e.keyCode === ctrls.LEFT && ctrl !== ctrls.RIGHT) ||
        (e.keyCode === ctrls.RIGHT && ctrl !== ctrls.LEFT) ||
        (e.keyCode === ctrls.UP && ctrl !== ctrls.DOWN) ||
        (e.keyCode === ctrls.DOWN && ctrl !== ctrls.UP)
      ) {
        setControl(e.keyCode);
      }
    }
  };

  const randomizer = (limit) => {
    // if limit = 10 will return (0 - 9)
    return Math.floor(Math.random() * limit);
  };

  const updateFood = () => {
    const x = randomizer(tilesX);
    const y = randomizer(tilesY);
    // 1 of 10 to be special food
    const special = randomizer(10) === 5 ? true : false;

    // If food generates on a tile use by the snake, generate food again
    if (snake.some((s) => JSON.stringify(s) === JSON.stringify({ x, y }))) {
      updateFood();
    }
    setFood({ x, y, special });
  };

  const drawFood = (ctx) => {
    let x;
    let y;

    // Check if food exist
    if (food) {
      x = tile * food.x;
      y = tile * food.y;
      ctx.beginPath();
      ctx.fillStyle = food.special ? "yellow" : "red";
      ctx.fillRect(x, y, tile, tile);
    }
  };

  // Detect is state A is hittin B
  const collition = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Check if food was eaten
  const isFoodEaten = () => {
    if (collition(snake[snake.length - 1], { x: food.x, y: food.y })) {
      // New snake instance
      const _snake = snake.map((s) => s);
      // Reset foold
      setFood(null);
      // Update Score
      onScore(food.special ? 5 : 1);
      // Update snake size
      _snake.unshift(_snake[0]);
      setSnake(_snake);
    }
  };

  // Game over message
  const gameOver = (ctx) => {
    const txt = "GAME OVER :(";
    ctx.beginPath();
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "whitesmoke";
    ctx.strokeStyle = "#262931";
    const { width: txtWidth } = ctx.measureText(txt);
    ctx.fillText(txt, width / 2 - txtWidth / 2, 400);
    ctx.strokeText(txt, width / 2 - txtWidth / 2, 400);

    // Return to main screen
    setTimeout(() => onUpdateScreen(idMenu), 1200);
  };

  useEffect(() => {
    // Generate food
    if (!food) {
      updateFood();
    }
  }, [food]);

  useEffect(() => {
    // Move snake if control direction change
    updateSnake();
  }, [ctrl]);

  useEffect(() => {
    let interval;
    if (!end) {
      // tickFn instance
      interval = tickFn();
    }
    // If food on the board check if eaten
    if (food) {
      isFoodEaten();
    }
    // Update canvas on each state change
    draw();
    return () => clearInterval(interval);
  });

  return (
    <canvas
      tabIndex="0"
      onKeyUp={(e) => keyboardCtrls(e)}
      ref={(ref) => {
        if (ref) {
          canvasRef = ref;
          canvasRef.focus();
        }
      }}
      width={width}
      height={height}
    ></canvas>
  );
}

export default GameBoard;
