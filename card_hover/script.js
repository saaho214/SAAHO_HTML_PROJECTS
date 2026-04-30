   document.querySelectorAll(".box").forEach((box) => {
            box.addEventListener('mousemove', (e) => {
                // Get mouse position relative to the box itself
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Find the specific span inside THIS box only
                const span = box.querySelector("span");
                span.style.left = x + 'px';
                span.style.top = y + 'px';
            });
        });