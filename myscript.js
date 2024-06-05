var score = 0;
var life = 3;
var mv = 100;
var isJumping = false; // 마리오가 점프 중인지 확인하는 플래그

$(function() {
    $(document).on("keypress", function(key) {
        if(key.which == 32) { jump(); }         
    });
    
    $(document).on("keypress", function(key) {
        if(key.which == 68) { moveRight(); }         
    });

    moveMushroom();
});

function jump() {
    if (isJumping) return; // 이미 점프 중이면 점프하지 않음
    isJumping = true;
    
    $("#mario").animate({
        top: '200px'
    }, 200, function() {
        $(this).animate({
            top: '410px'
        }, 500, function() {
            isJumping = false; // 점프가 끝나면 플래그를 다시 false로 설정
        });
    });
}

function moveRight() {
    var windowWidth = $(window).width();
    var mario = $("#mario");
    var marioWidth = mario.width();
    var marioPos = mario.position().left;

    mv += 50;

    if (mv >= windowWidth) {
        // Reset Mario's position to the beginning when he reaches the end of the screen
        mv = 0;
        mario.css({ left: mv + 'px' });
    } else {
        // Move Mario to the right
        mario.animate({
            left: mv + 'px'
        }, 100);
    }
}

function moveMushroom() {
    var mushroom = $("#mushroom");
    var windowWidth = $(window).width();

    // Start the continuous movement
    mushroom.css({ left: windowWidth + 'px' });  // Reset the position to the right side
    animateMushroom();
}

function animateMushroom() {
    var mushroom = $("#mushroom");
    var mario = $("#mario");
    var gameOver = $("#gameOver"); // 게임 오버 이미지 div에 대한 참조

    mushroom.animate({
        left: '-=50px'
    }, 100, function() {
        // 마리오와의 충돌을 확인합니다
        var mushroomPos = mushroom.position().left;
        var marioPos = mario.position().left;
        var marioTop = mario.position().top;

        if (mushroomPos <= marioPos + mario.width() && mushroomPos + mushroom.width() >= marioPos) {
            if (marioTop >= 410) {
                // 마리오가 땅에 있을 때 충돌 감지
                life -= 1; // 생명을 하나 감소시킵니다
                $("#lifeDisplay").text(life); // 목숨을 화면에 업데이트합니다
                if (life <= 0) {
                    // 생명이 0이 되었을 때 게임 오버
                    gameOver.show(); // 게임 오버 이미지를 표시합니다
                    mario.hide();
                    mushroom.hide();
                    return; // 게임 오버이므로 더 이상 애니메이션을 계속하지 않습니다
                }
                mushroom.css({ left: $(window).width() + 'px' }); // 버섯을 오른쪽 끝으로 재설정합니다
            }
        } else if (mushroom.position().left <= -mushroom.width()) {
            // 버섯이 화면 왼쪽 끝으로 이동하면 위치를 오른쪽으로 재설정하고 점수를 증가시킵니다
            mushroom.css({ left: $(window).width() + 'px' });
            score += 1; // 점수를 하나 증가시킵니다
            $("#scoreDisplay").text(score); // 점수를 화면에 표시합니다
        }

        // 이동을 계속합니다
        animateMushroom();
    });
}