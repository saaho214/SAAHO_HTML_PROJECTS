    let scanTimer;
    let progress = 440; // Dashoffset
    let progressInterval;
    
    const system = document.getElementById('system');
    const msg = document.getElementById('msg');
    const circle = document.querySelector('.progress-ring__circle');
    const content = document.getElementById('hidden-content');

    function startScan() {
        if (system.classList.contains('granted')) return;

        system.classList.remove('glitch');
        system.classList.add('is-scanning');
        msg.innerText = "READING DATA...";
        msg.style.color = "var(--cyan)";

        // Progress Ring Animation
        progress = 440;
        progressInterval = setInterval(() => {
            progress -= 4.4; // Steps to reach 0 in 3 seconds
            circle.style.strokeDashoffset = progress;
        }, 30);

        scanTimer = setTimeout(() => {
            completeScan();
        }, 3000);
    }

    function resetScan() {
        if (system.classList.contains('granted')) return;
        
        clearInterval(progressInterval);
        clearTimeout(scanTimer);
        
        system.classList.remove('is-scanning');
        system.classList.add('glitch');
        
        progress = 440;
        circle.style.strokeDashoffset = 440;
        
        msg.innerText = "ACCESS DENIED - RETRY";
        msg.style.color = "var(--red)";
    }

    function completeScan() {
        clearInterval(progressInterval);
        system.classList.remove('is-scanning');
        system.classList.add('granted');
        
        msg.innerText = "USER VERIFIED";
        msg.style.color = "var(--green)";
        document.getElementById('main-title').innerText = "ACCESS GRANTED";
        document.getElementById('main-title').style.color = "var(--green)";
        content.style.display = "block";
    }
