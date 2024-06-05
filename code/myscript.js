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
        // 마리오가 화면 끝에 도달했을 때 위치를 처음으로 재설정
        mv = 0;
        mario.css({ left: mv + 'px' });
    } else {
        // 마리오를 오른쪽으로 이동
        mario.animate({
            left: mv + 'px'
        }, 100);
    }
}

function moveMushroom() {
    var mushroom = $("#mushroom");
    var windowWidth = $(window).width();

    // 연속적인 움직임을 시작
    mushroom.css({ left: windowWidth + 'px' });  // 위치를 오른쪽으로 재설정
    animateMushroom();
}

function animateMushroom() {
    var mushroom = $("#mushroom");
    var mario = $("#mario");
    var gameOver = $("#gameOver"); // 게임 오버 이미지 div에 대한 참조

    mushroom.animate({
        left: '-=50px'
    }, 100, function() {
        // 마리오와의 충돌을 확인
        var mushroomPos = mushroom.position().left;
        var marioPos = mario.position().left;
        var marioTop = mario.position().top;

        if (mushroomPos <= marioPos + mario.width() && mushroomPos + mushroom.width() >= marioPos) {
            if (marioTop >= 410) {
                // 마리오가 땅에 있을 때 충돌 감지
                life -= 1; // 생명을 하나 감소
                $("#lifeDisplay").text(life); // 목숨을 화면에 업데이트
                if (life <= 0) {
                    // 생명이 0이 되었을 때 게임 오버
                    gameOver.show(); // 게임 오버 이미지를 표시
                    mario.hide();
                    mushroom.hide();
                    return; // 게임 오버이므로 더 이상 애니메이션을 계속하지 않음
                }
                mushroom.css({ left: $(window).width() + 'px' }); // 버섯을 오른쪽 끝으로 재설정
            }
        } else if (mushroom.position().left <= -mushroom.width()) {
            // 버섯이 화면 왼쪽 끝으로 이동하면 위치를 오른쪽으로 재설정하고 점수를 증가
            mushroom.css({ left: $(window).width() + 'px' });
            score += 1; // 점수를 하나 증가
            $("#scoreDisplay").text(score); // 점수를 화면에 표시
        }

        // 계속 이동
        animateMushroom();
    });
}
