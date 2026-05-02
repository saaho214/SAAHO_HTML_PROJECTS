        function startMassiveTrace() {
            const gate = document.getElementById('gatekeeper');
            const dash = document.getElementById('dash');
            const stream = document.getElementById('stream');

            gate.classList.add('scanning');

            setTimeout(() => {
                gate.style.display = "none";
                dash.style.display = "grid";
                dash.classList.add('revealed');
                
                let sec = 0;
                setInterval(() => {
                    sec++;
                    let m = Math.floor(sec/60).toString().padStart(2, '0');
                    let s = (sec%60).toString().padStart(2, '0');
                    document.getElementById('timer').innerText = `00:${m}:${s}`;
                }, 1000);

                setInterval(() => {
                    const actions = ["DECRYPTING", "FETCHING", "PINGING", "HASHING", "MAPPING"];
                    const targets = ["SECURE_SERVER", "NODE_72", "SOCIAL_GRAPH", "ACADEMIC_LOG", "USER_CACHE"];
                    const log = `[${new Date().toLocaleTimeString()}] ${actions[Math.floor(Math.random()*actions.length)]} ${targets[Math.floor(Math.random()*targets.length)]}... DONE`;
                    stream.innerHTML += `<br>${log}`;
                    stream.scrollTop = stream.scrollHeight;
                }, 1800);
            }, 2500);
        }
