var weDATA = [{ weName: "FREE 30%", weCode: "WEBENGAGE100", weWin: "yes", color: "#7ADE57", wePercWght: 25 }, { weName: "20% OFF", weCode: "WEBENGAGE200", weWin: "yes", color: "#D459FF", wePercWght: 25 }, { weName: "30% OFF", weCode: "WEBENGAGE300", weWin: "no", color: "#40E8FF", wePercWght: 25 }, { weName: "10% OFF", weCode: "WEBENGAGE400", weWin: "no", color: "#FF6C62", wePercWght: 25 }];
var canvas = document.getElementById("wheel");
var ctx = canvas.getContext("2d");
var totalSlices = weDATA.length;
var startAngle = 0;
var arcSize = (2 * Math.PI) / totalSlices;
var spinTimeout;
var spinAngle = 0;
var spinSpeed = 0;
var isSpinning = false;
var spinsLeft = 4;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    for (var i = 0; i < totalSlices; i++) {
        var sliceAngle = startAngle + i * arcSize;
        
        // Draw slice
        ctx.beginPath();
        ctx.fillStyle = weDATA[i].color;
        ctx.moveTo(175, 175);
        ctx.arc(175, 175, 175, sliceAngle, sliceAngle + arcSize);
        ctx.lineTo(175, 175);
        ctx.fill();

        // Add text
        ctx.save();
        ctx.translate(175, 175);
        ctx.rotate(sliceAngle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#555";
        ctx.font = "bold 18px Arial";
        ctx.fillText(weDATA[i].weName, 110, 10); // Position text
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning || spinsLeft <= 0) return;

    isSpinning = true;
    spinsLeft--;
    document.getElementById("spins-left").innerText = "Spins Left: " + spinsLeft;

    spinSpeed = Math.random() * 10 + 10;
    rotateWheel();
}

function rotateWheel() {
    spinAngle += spinSpeed;
    spinSpeed *= 0.98;
    if (spinSpeed < 0.02) {
        spinSpeed = 0;
        calculateResult();
        return;
    }
    drawWheel();
    startAngle += spinAngle * Math.PI / 180;
    spinTimeout = requestAnimationFrame(rotateWheel);
}

function calculateResult() {
    var winningIndex = Math.floor((startAngle % (2 * Math.PI)) / arcSize);
    if (winningIndex < 0) winningIndex += totalSlices;

    var result = weDATA[winningIndex];
    var resultText = result.weWin === "yes" ? "CONGRATS! You won the " : "SORRY! You lost the ";
    document.getElementById("result").innerText = resultText + " Coupon: " + result.weCode;
    localStorage.setItem("winnerCoupon", result.weCode);

    isSpinning = false;

    if (spinsLeft <= 0) {
        var spinBtn = document.getElementById("spin-btn");
        spinBtn.disabled = true;
        spinBtn.style.backgroundColor = "#2632386e";
    }
}
document.getElementById("spin-btn").addEventListener("click", spinWheel);
document.getElementById("continue-shopping-btn").addEventListener("click", function() {
    window.location.href = "https://www.webengage.com";
});
document.getElementById("respin-btn").addEventListener("click", function() {
    spinsLeft = 4;
    document.getElementById("spins-left").innerText = "Spins Left: " + spinsLeft;
    var spinBtn = document.getElementById("spin-btn");
    spinBtn.disabled = false;
    spinBtn.style.backgroundColor = "#5D4037";
    document.getElementById("result").innerText = "Click Spin to start!";
    startAngle = 0;
    spinAngle = 0;
    spinSpeed = 0;
    drawWheel();
});
drawWheel();
