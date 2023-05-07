javascript: (function () {
    const promptText = `Act as a text loader, memorizing subsequent documents. Multiple files exist, labeled ### DOCUMENT NAME. Chunks are sent with ||START CHUNK x/TOTAL|| and ||END CHUNK x/TOTAL||. Respond only OK: "CHUNK: x/TOTAL" for each message. No other replies or explanations. Start:`;

    const input = prompt('Enter your text:');
    if (input) {
        const fullText = promptText + input;
        const chunkSize = 8000;
        const chunks = [];

        for (let i = 0, count = 1; i < fullText.length; i += chunkSize, count++) {
            const chunk = fullText.slice(i, i + chunkSize);
            const totalChunks = Math.ceil(fullText.length / chunkSize);
            const formattedChunk = `||START CHUNK ${count}/${totalChunks}||` + chunk + `||END CHUNK ${count}/${totalChunks}||`;
            chunks.push(formattedChunk);
        }

        let currentChunk = 0;

        function showChunk() {
            closeChunkWindow();

            const chunkWindow = document.createElement('div');
            chunkWindow.id = 'chunk-window';
            Object.assign(chunkWindow.style, {
                position: 'fixed',
                top: '10px',
                left: '50%',
                width: '50%',
                height: '50%',
                zIndex: 9999,
                overflow: 'auto',
                backgroundColor: 'white',
                border: '1px solid black',
                padding: '10px'
            });
            document.body.appendChild(chunkWindow);

            const chunkTextArea = document.createElement('textarea');
            chunkTextArea.id = 'chunk-textarea';
            chunkTextArea.value = chunks[currentChunk];
            Object.assign(chunkTextArea.style, {
                width: '100%',
                height: 'calc(100% - 50px)',
                resize: 'none'
            });
            chunkWindow.appendChild(chunkTextArea);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';
            chunkWindow.appendChild(buttonContainer);

            const buttonStyles = {
                padding: "4px 10px",
                border: "1px solid #ccc",
                margin: "0 8px 0 0",
                cursor: "pointer"
            };

            const copyButton = document.createElement('button');
            Object.assign(copyButton.style, buttonStyles);
            copyButton.id = 'copy-button';
            copyButton.textContent = 'Copy';
            copyButton.onclick = function () {
                this.style.backgroundColor = '#4CAF50';
                this.textContent = 'Copied!';
                chunkTextArea.select();
                document.execCommand('copy');
            };
            buttonContainer.appendChild(copyButton);

            if (currentChunk > 0) {
                const prevButton = document.createElement('button');
                Object.assign(prevButton.style, buttonStyles);
                prevButton.id = 'prev-button';
                prevButton.textContent = 'Previous';
                prevButton.onclick = function () {
                    if (currentChunk > 0) {
                        currentChunk--;
                        showChunk();
                    }
                };
                buttonContainer.appendChild(prevButton);
            }

            const nextButton = document.createElement('button');
            Object.assign(nextButton.style, buttonStyles);
            nextButton.id = 'next-button';
            nextButton.textContent = currentChunk === chunks.length - 1 ? 'Close' : 'Next';
            nextButton.onclick = function () {
                if (currentChunk < chunks.length - 1) {
                    currentChunk++;
                    showChunk();
                } else {
                    closeChunkWindow();
                }
            };
            buttonContainer.appendChild(nextButton);
        }

        function closeChunkWindow() {
            const chunkWindow = document.getElementById('chunk-window');
            if (chunkWindow) {
                document.body.removeChild(chunkWindow);
            }
        }

        showChunk();
    } else {
        alert('No text entered. Please try again.');
    }
})();
