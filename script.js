window.onload = function () {
    var canvasWidth = 900;
    var canvasHeigth = 600;
    var blockSize = 30;
    var ctx;
    var delay = 150;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heigthInBlocks = canvasHeigth / blockSize;
    var score;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeigth / 2;
    var timeOut;
    var changeV = 1000;
    init();

    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeigth;
        canvas.style.border = "13px solid grey";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "rigth");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }
  
    function refreshCanvas() {
        var isColl = snakee.checkCollision();
        if (isColl) {
            gameOver();
        }
        else {
            var isEat = snakee.isEatingApple(applee);
            if (isEat) {
                //Le serpent a mangé la pomme
                score++;
                setTimeout(changerVitesse, changeV);
                function changerVitesse() {
                    delay -= 5;
                }
                
                snakee.eatApple = true;
                do {
                    applee.setNewPosition();
                    snakee.advance();
                
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeigth);
            snakee.draw();
            snakee.advance();
            applee.drawApple();
            drawScore()
            timeOut = setTimeout(refreshCanvas, delay);
        }
       
    }
    function gameOver() {
        ctx.save();
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.fillText("Game over", centreX, canvasHeigth - 180);
         ctx.fillText("Appuyer sur la tuche espace pour rejouer", centreX, canvasHeigth - 150);
        document.body.style.textAlign = "center";
        ctx.restore();
    }
    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "rigth");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }
    function drawScore()
    {
        ctx.save();
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 200px sans-serif";
        ctx.fillText(score.toString(), centreX, canvasHeigth - centreY);
        ctx.restore();
    }

    function drawBlock (ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function Snake(body,direction) {
        this.body = body;
        this.direction = direction;
        this.draw = () => {
            ctx.save();
            ctx.fillStyle = "red";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i])
            }
            ctx.restore();
            
        };
        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch (this.direction)
            {
                case "left":
                    nextPosition[0] -= 1
                    break;
                case "rigth":
                    nextPosition[0] += 1
                    break;
                case "down":
                    nextPosition[1] += 1
                    break;
                case "up":
                    nextPosition[1] -= 1
                    break;
                default:
                    throw ("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.eatApple)
                this.body.pop();
            else
                this.eatApple = false;
        }
        this.setDirection = function(newDirection)
        {
            var allowedDirection;
            switch (this.direction) {
                case "left": 
                case "rigth":
                    allowedDirection = ["up", "down"];
                    break;
                case "down": 
                 case "up":
                    allowedDirection = ["left", "rigth"];
                    break;
                default:
                        throw ("invalid direction");
            }
            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        }
        this.checkCollision = function ()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heigthInBlocks - 1;
            var isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWall || isNotBetweenVerticalWall)
            {
                wallCollision = true;
            }
            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
                
            }
            return wallCollision || snakeCollision;
        }
        this.isEatingApple = function(appleeToEat)
        {
            var head = this.body[0];
            if (head[0] === appleeToEat.position[0] && head[1] == appleeToEat.position[1])
            {
                return true;
            }
            else {
                return false;
            }
        }
    }
    function Apple (position) {
        this.position = position;
        this.eatApple = false;
        this.drawApple = function () {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "green";
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            // var x = Math.round(Math.random() * 100);
            // var y = Math.round(Math.random() * 100);
            ctx.arc(x,y, radius, 0 ,7, false);
            ctx.fill();
            ctx.restore();

  
        };
        this.setNewPosition = function ()
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heigthInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function (snakeTOCheck)
        {
            var isOnSnake = false;
            for (let index = 0; index < snakeTOCheck.body.length; index++) {
                if (this.position[0] === snakeTOCheck.body[index][0] && this.position[1] === snakeTOCheck.body[index][1])
                {
                    isOnSnake = true;
                }
                return isOnSnake;
            }
        }
    };
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                  newDirection = "rigth"
                break;
            case 40:
                newDirection = "down"
                break;
            case 32:
                restart();
                return
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
}
