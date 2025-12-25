const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const snapBtn = document.getElementById('snap');
const statusEl = document.getElementById('status-bubble');
const countdownEl = document.getElementById('countdown');
const flashEl = document.getElementById('flash');
const downloadLink = document.getElementById('download-link');
const bwToggle = document.getElementById('bw-toggle'); 

const ctx = canvas.getContext('2d');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        statusEl.innerText = "Camera access denied. 🎀";
    }
}

bwToggle.addEventListener('change', () => {
    if (bwToggle.checked) {
        video.classList.add('bw-filter');
    } else {
        video.classList.remove('bw-filter');
    }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

snapBtn.addEventListener('click', async () => {
    snapBtn.disabled = true;
    downloadLink.style.display = 'none';
    photo.src = ""; 
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 4; i++) {
        statusEl.innerText = `Photo ${i + 1}/4`;
        
        for (let c = 3; c > 0; c--) {
            countdownEl.innerText = c;
            await delay(1000);
        }
        
        countdownEl.innerText = "";
        statusEl.innerText = "Smile!!! ✨"; 
        
        captureFrame(i); 
        await delay(1200); 
    }

    statusEl.innerText = "☾ ⋆*･ﾟYour photostrip is ready! ⋆*･ﾟ";
    const finalImage = canvas.toDataURL('image/png');
    photo.src = finalImage;
    downloadLink.href = finalImage;
    downloadLink.style.display = 'inline-block';
    snapBtn.disabled = false;
});

function captureFrame(index) {
    flashEl.classList.add('flash-active');
    setTimeout(() => flashEl.classList.remove('flash-active'), 400);

    const padding = 20;
    const imgW = 360;
    const imgH = 270;
    const x = 20;
    const y = padding + (index * (imgH + padding));

    ctx.save();

    if (bwToggle.checked) {
        ctx.filter = 'grayscale(100%) contrast(1.2)';
    } else {
        ctx.filter = 'none';
    }

    ctx.translate(x + imgW, y);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, imgW, imgH);
    ctx.restore();
}

startCamera();