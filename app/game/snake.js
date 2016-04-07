'use strict';

angular.module('snake', [])
    .controller('SnakeController', ['$scope', '$timeout', '$window', SnakeController]);

function SnakeController($scope, $timeout, $window) {

    var snake, apple, interval;

    const SIZE = 20,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        SNAKE = 'snake',
        APPLE = 'apple',
        BOARD = 'board';


    function initGame() {
        $scope.game = {};
        $scope.game.highScore = 0;
        resetGame();
    };

    function resetGame() {
        $scope.game.currentScore = 0;
        interval = 200;
        initSnake();
        initBoard();
        generateApple();
        // todo - show start game button
        $timeout(nextStep, interval);
    };

    function initBoard() {
        $scope.board = [];
        var i;
        for (i = 0; i < SIZE; i++) {
            $scope.board[i] = [];
            for (var j = 0; j < SIZE; j++) {
                $scope.board[i][j] = BOARD;
            }
        }
        for (i = 0; i < snake.body.length; i++) {

            $scope.board[snake.body[i].x][snake.body[i].y] = SNAKE;
        }

    };

    function initSnake() {
        snake = {
            body: [{x: 1, y: 0}, {x: 0, y: 0}],
            direction: RIGHT,
            pendingDirection: RIGHT
        };
    };

    // todo - refactor - use styles approach
    $scope.getColor = function (i, j) {
        if ($scope.board[i][j] == SNAKE) {
            return '#595241';
        }
        if ($scope.board[i][j] == APPLE) {
            return '#8A0917';
        }
        return '#ACCFCC';
    };

    function nextStep() {
        var newHead = getNextHead();
        if (checkHitWall(newHead)) {
            gameOver();
            return;
        }
        if (checkHitBody(newHead)) {
            gameOver();
            return;
        }
        snake.body.unshift(newHead);
        $scope.board[newHead.x][newHead.y] = SNAKE;
        if (checkHitApple(newHead)) {
            eatApple();
        }
        var tail = snake.body.pop();
        $scope.board[tail.x][tail.y] = BOARD;
        snake.direction = snake.pendingDirection;
        if (limitReached()) {
            win();
        } else {
            $timeout(nextStep, interval);
        }
    };

    function checkHitWall(point) {
        return point.x < 0 || point.y < 0 || point.x >= SIZE || point.y >= SIZE;
    };

    function checkHitBody(point) {
        for (var i = 0; i < snake.body.length; i++) {
            if (snake.body[i].x == point.x && snake.body[i].y == point.y) {
                return true;
            }

        }
        return false;
    };

    function checkHitApple(head) {
        return head.x == apple.x && head.y == apple.y;
    };

    function limitReached() {
        return snake.body.length == SIZE * SIZE;
    };

    function getNextHead() {
        var newHead = angular.copy(snake.body[0]);
        if (snake.pendingDirection == LEFT) {
            newHead.x--;
        } else if (snake.pendingDirection == RIGHT) {
            newHead.x++;
        } else if (snake.pendingDirection == UP) {
            newHead.y--;
        } else if (snake.pendingDirection == DOWN) {
            newHead.y++;
        }
        return newHead;
    };

    function eatApple() {
        $scope.game.currentScore++;
        var tail = angular.copy(snake.body[snake.body.length - 1]);
        snake.body.push(tail);
        interval -= 2;
        generateApple();
    };

    // todo - make generation by index from empty place to remove stack overflow
    function generateApple() {
        apple = {
            x: Math.floor(Math.random() * SIZE),
            y: Math.floor(Math.random() * SIZE)
        }
        if (checkHitBody(apple)) {
            generateApple();
        } else {
            $scope.board[apple.x][apple.y] = APPLE;
        }
    };

    function gameOver() {
        // todo - show game over screen
        if ($scope.game.currentScore > $scope.game.highScore) {
            $scope.game.highScore = $scope.game.currentScore;
        }
        resetGame();
    };

    function win() {
        // todo - show win over screen
        if ($scope.game.currentScore > $scope.game.highScore) {
            $scope.game.highScore = $scope.game.currentScore;
        }
        resetGame();
    };

    $window.addEventListener("keydown", function (e) {
        var keyCode = e.keyCode;
        if (keyCode == LEFT && snake.direction !== RIGHT) {
            snake.pendingDirection = LEFT;
        } else if (keyCode == UP && snake.direction !== DOWN) {
            snake.pendingDirection = UP;
        } else if (keyCode == RIGHT && snake.direction !== LEFT) {
            snake.pendingDirection = RIGHT;
        } else if (keyCode == DOWN && snake.direction !== UP) {
            snake.pendingDirection = DOWN;
        }
    });

    initGame();
}