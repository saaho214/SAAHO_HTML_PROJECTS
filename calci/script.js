
        let currentInput = '0';
        let previousInput = '';
        let operator = null;
        let shouldResetScreen = false;
        let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

        const displayInput = document.querySelector('.display-input');
        const displayOutput = document.querySelector('.display-output');
        const historyList = document.getElementById('history-list');

        // Theme switching
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });

        // Calculator functionality
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.textContent;

                if (action === 'number') {
                    handleNumber(value);
                } else if (action === 'operator') {
                    handleOperator(value);
                } else if (action === 'decimal') {
                    handleDecimal();
                } else if (action === 'clear') {
                    clear();
                } else if (action === 'backspace') {
                    handleBackspace();
                } else if (action === 'calculate') {
                    calculate();
                }
            });
        });

        function handleNumber(number) {
            if (shouldResetScreen) {
                displayOutput.textContent = '0';
                shouldResetScreen = false;
            }
            if (displayOutput.textContent === '0') {
                displayOutput.textContent = number;
            } else {
                displayOutput.textContent += number;
            }
        }

        function handleOperator(op) {
            if (operator !== null) calculate();
            previousInput = displayOutput.textContent;
            operator = op;
            displayInput.textContent = `${previousInput} ${operator}`;
            shouldResetScreen = true;
        }

        function handleDecimal() {
            if (shouldResetScreen) {
                displayOutput.textContent = '0.';
                shouldResetScreen = false;
                return;
            }
            if (!displayOutput.textContent.includes('.')) {
                displayOutput.textContent += '.';
            }
        }

        function clear() {
            displayOutput.textContent = '0';
            displayInput.textContent = '';
            previousInput = '';
            operator = null;
        }

        function handleBackspace() {
            if (displayOutput.textContent.length === 1) {
                displayOutput.textContent = '0';
            } else {
                displayOutput.textContent = displayOutput.textContent.slice(0, -1);
            }
        }

        function calculate() {
            const current = parseFloat(displayOutput.textContent);
            const previous = parseFloat(previousInput);
            let result;

            switch (operator) {
                case '+':
                    result = previous + current;
                    break;
                case '-':
                    result = previous - current;
                    break;
                case '×':
                    result = previous * current;
                    break;
                case '÷':
                    result = previous / current;
                    break;
                case '%':
                    result = previous % current;
                    break;
                default:
                    return;
            }

            const historyItem = {
                id: Date.now(),
                expression: `${previousInput} ${operator} ${current}`,
                result: result
            };

            history.unshift(historyItem);
            localStorage.setItem('calculatorHistory', JSON.stringify(history));
            updateHistory();

            displayOutput.textContent = result;
            displayInput.textContent = '';
            operator = null;
            shouldResetScreen = true;
        }

        // Converter functionality
        const conversionRates = {
            meters: 1,
            kilometers: 0.001,
            miles: 0.000621371,
            feet: 3.28084
        };

        function convert() {
            const input = parseFloat(document.getElementById('converter-input').value);
            const fromUnit = document.getElementById('converter-from').value;
            const toUnit = document.getElementById('converter-to').value;

            if (isNaN(input)) {
                alert('Please enter a valid number');
                return;
            }

            const meters = input / conversionRates[fromUnit];
            const result = meters * conversionRates[toUnit];

            const historyItem = {
                id: Date.now(),
                expression: `${input} ${fromUnit} to ${toUnit}`,
                result: `${result.toFixed(4)} ${toUnit}`
            };

            history.unshift(historyItem);
            localStorage.setItem('calculatorHistory', JSON.stringify(history));
            updateHistory();

            document.getElementById('converter-result').textContent = `${input} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
        }

        // History
        function updateHistory() {
            historyList.innerHTML = '';
            history.forEach(item => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `
                    <div>${item.expression} = ${item.result}</div>
                `;
                historyList.appendChild(div);
            });
        }

        function clearHistory() {
            history = [];
            localStorage.removeItem('calculatorHistory');
            updateHistory();
        }

        // Initialize
        updateHistory();
