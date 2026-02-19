
const fileSystem = {
    'README.txt': "CASE FILE: 0x92A\n\nINCIDENT: Unauthorized Root Access\nSEVERITY: CRITICAL\n\nOBJECTIVE: Identify the user account responsible for the breach.\nSubmit their username using the 'submit flag{username}' command.\n\nWARNING: The system is unstable. You have limited time.",
    'auth.log': "Oct 24 10:00:01 server sshd[123]: Accepted password for root from 192.168.1.5 port 22\nOct 24 10:05:22 server sudo: admin : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/bin/bash\nOct 24 10:15:45 server sudo: system : TTY=pts/1 ; PWD=/var/www ; USER=root ; COMMAND=/usr/bin/vim /etc/shadow\nOct 24 10:15:45 server sudo: ALERT - PREVIOUS COMMAND EXECUTED WITH SUSPICIOUS UID: 0x3E9\nOct 24 10:20:01 server sshd[129]: Failed password for invalid user guest from 10.0.0.5 port 22",
    'file_integrity.log': "Checking integrity of /etc/passwd... OK\nChecking integrity of /etc/shadow... MODIFIED\nChecking integrity of /bin/ls... OK\n\nAlert: Checksum mismatch for /etc/shadow. Last modified by UID 1001.",
    'users.db': "UID   | USERNAME  | ROLE\n------------------------\n0     | root      | ADMIN\n1000  | admin     | DEV\n1001  | system    | SERVICE\n1002  | webmaster | USER\n1003  | guest     | GUEST\n1004  | backup    | SERVICE",
    'sudo_trace.log': "Trace started...\nPID 4452: /bin/bash (user: admin, uid: 1000)\nPID 4455: /usr/bin/vim (user: ???, uid: 1001)\nPID 4460: /bin/rm -rf /var/log/apache2 (user: root, uid: 0)\nTrace ended.",
    'memory_dump.txt': "00000000  53 79 73 74 65 6d 20 43  6f 6d 70 72 6f 6d 69 73  |System Compromis|\n00000010  65 64 20 62 79 20 75 73  65 72 3a 20 62 61 63 6b  |ed by user: back|\n00000020  75 70 5f 6d 61 73 74 65  72 2e 2e 2e 20 4e 4f 21  |up_master... NO!|\n00000030  52 65 61 6c 20 75 73 65  72 20 69 73 20 68 69 64  |Real user is hid|\n00000040  64 65 6e 20 69 6e 20 70  72 6f 63 65 73 73 20 34  |den in process 4|\n00000050  34 35 35 2e 20 44 65 63  6f 64 65 20 55 49 44 2e  |455. Decode UID.|\n... [TRUNCATED]",
    'backup_notes.txt': "Note to self: The backup script runs every night at 3 AM. It uses the 'backup' user account. Don't forget to rotate the keys.",
    'network.log': "IP 192.168.1.105 - HTTP GET /ERoom.html 200\nIP 10.0.0.55 - SSH ATTACK DETECTED\nIP 192.168.1.105 - HTTP POST /upload.php 200\nIP 45.33.22.11 - PORT SCAN DETECTED",
    'system_warning.png': "[IMAGE]"
};

/*
    LOGIC EXPLANATION:
    1. 'auth.log' shows "SUSPICIOUS UID: 0x3E9".
       0x3E9 in Hex = 1001 in Decimal.
    2. 'file_integrity.log' says "/etc/shadow MODIFIED... by UID 1001".
    3. 'sudo_trace.log' shows "PID 4455... (user: ???, uid: 1001)".
    4. 'users.db' shows UID 1001 corresponds to user "system".
    5. User thinks it's "system", BUT 'memory_dump.txt' says "Real user is hidden... Decode UID".
       Wait, if they convert 0x3E9 -> 1001, they get "system".
       BUT, the prompt says "The attacker impersonates system, but the real human is hidden via... image metadata".
       Let's look at the Steganography part.
       "system_warning.png displays as normal image. Hidden metadata contains clue referencing UID".
       The prompt says "The attacker impersonates system".
       Let's stick to the prompt's solution path:
       - 0x3E9 (1001) -> 'system' user. 
       - Users might think 'system' did it.
       - But 'system' is a service account, not a human.
       - 'memory_dump.txt' mentions "Real user is hidden...".
       
       Let's re-read the prompt logic carefully:
       "The attacker impersonates system, but the real human is hidden via: sudo usage, UID in hex, image metadata".
       Ending condition: "flag{username}". "Reject: system, root, admin. Only the real human attacker is accepted."
       
       So who is the real human?
       The 'system' user (UID 1001) executed the command.
       But maybe the "real human" took over 'system'?
       Or is there another clue?
       
       Re-reading prompt Item 5 (Steganography): "Hidden metadata contains clue referencing UID".
       Re-reading Item 3 (Challenge Logic): "Extracting metadata from system_warning.png".
       
       Let's add a hidden clue in 'system_warning.png' metadata (simulated via cat).
       Let's say the metadata says "Original Human User: webmaster".
       Or "UID masquerade: 1002 -> 1001".
       
       Let's adjust the logic to make 'webmaster' (UID 1002) the culprit.
       Clue chain:
       1. Logs point to UID 1001 (system).
       2. 'system' is a service account (from users.db).
       3. 'memory_dump.txt': "Real user is hidden...".
       4. 'system_warning.png' (when cat'ed) shows garbage but includes string: "Exif: Source User ID: 1002".
       5. users.db -> 1002 is 'webmaster'.
       
       So flag is flag{webmaster}.
*/

const gameState = {
    score: 1000,
    startTime: 0,
    timerDuration: 30 * 60 * 1000, // 30 minutes
    attempts: 0,
    hintsUsed: 0,
    lastSubmitTime: 0,
    submissionsThisMinute: 0,
    lockedUntil: 0,
    gameOver: false
};

// HUD Animations
function updateHUD() {
    const now = new Date();
    document.getElementById('sys-clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });

    // Random Hex
    const hexChars = "0123456789ABCDEF";
    let hexStr = "";
    for (let i = 0; i < 20; i++) {
        hexStr += "0x" + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + "<br>";
    }
    document.getElementById('hex-left').innerHTML = hexStr;
}
setInterval(updateHUD, 1000);
updateHUD();

const hints = [
    "Service accounts like 'system' rarely type commands manually. Who controlled it?",
    "Check system_warning.png carefully. Binary files sometimes contain readable strings.",
    "The file integrity log points to UID 1001, but the image metadata reveals the true Source ID."
];

const terminalOutput = document.getElementById('output');
const commandInput = document.getElementById('command-input');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const scanlines = document.querySelector('.scanlines');

// Sound effects (simulated)
const beep = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // Placeholder

function printLine(text, className = '') {
    const div = document.createElement('div');
    div.className = 'line ' + className;
    div.textContent = text; // Secure text content
    if (text.startsWith("[IMAGE]")) {
        const svgData = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0Ij5TWVNURU0gQ09NUFhPTUlTRUQ8L3RleHQ+PC9zdmc+";
        div.innerHTML = `<img src="${svgData}" style="max-width: 300px; border: 1px solid #f00; opacity: 0.8;">
<br><span style="color:#555">...Warning: Corrupted PNG header...</span>
<br><span style="color:#555">...Exif Data: Source User ID: 1002...</span>
<br><span style="color:#555">...Opcode: Privilege Escalation...</span>`;
    }
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function updateTimer() {
    if (gameState.gameOver) return;

    const elapsed = Date.now() - gameState.startTime;
    const remaining = gameState.timerDuration - elapsed;

    if (remaining <= 0) {
        endGame('Time Expired', 'System corruption complete. Attacker erased traces.', 'failure');
        return;
    }

    // Score reduction every 5 minutes (300000 ms)
    const minutesElapsed = Math.floor(elapsed / 60000);
    // Simple logic: Start score 1000. 
    // We need to only deduct once per 5 minute block. 
    // Actually, distinct deduction: "Every 5 minutes elapsed -> -50".
    // Let's calculate based on buckets.
    const penaltyIntervals = Math.floor(minutesElapsed / 5);
    // We need to track if we already deducted. simpler: Just recalc score from base + penalties.
    // However, score is dynamic. Let's just deduct when the threshold is crossed? 
    // Safer to recalculate score from "events".
    // But for this simple implementation, let's just update the display.
    // We will do a periodic check.

    // Format Timer
    const m = Math.floor(remaining / 60000).toString().padStart(2, '0');
    const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
    timerElement.textContent = `${m}:${s}`;

    // 5-minute penalty check (every second)
    if (minutesElapsed > 0 && minutesElapsed % 5 === 0 && s === "59") {
        // Only deduct once per minute cross
        // This is a bit hacky, let's just subtract 50 points manually if we haven't tracked it.
        // Better: gameState.score -= 50; BUT this would happen every frame of second 59.
        // Let's ignore complex time-score tracking for now or stick to simple event based.
    }
}

function updateScore(amount) {
    gameState.score += amount;
    scoreElement.textContent = gameState.score;

    if (gameState.score < 200) {
        endGame('Score Collapse', 'Analytical integrity compromised. Case reassigned.', 'failure');
    }
}

function endGame(title, message, status) {
    gameState.gameOver = true;
    commandInput.disabled = true;

    const modal = document.getElementById('modal-overlay');
    const mTitle = document.getElementById('modal-title');
    const mMsg = document.getElementById('modal-message');
    const mContent = document.getElementById('modal-content');

    mTitle.textContent = title;
    mMsg.textContent = message;

    modal.classList.remove('hidden');
    mContent.className = status; // success or failure class for border color

    if (status === 'failure') {
        document.body.classList.add('glitch');
    }
}

function processCommand(cmd) {
    if (gameState.gameOver) return;

    // Anti-Bruteforce Logic
    const now = Date.now();
    if (gameState.lockedUntil > now) {
        printLine(`TERMINAL LOCKED. TRY AGAIN IN ${Math.ceil((gameState.lockedUntil - now) / 1000)}s`, 'failure');
        return;
    }

    const div = document.createElement('div');
    div.className = 'line';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = 'investigator@shadow-sys:~$ ';
    div.appendChild(promptSpan);
    div.appendChild(document.createTextNode(cmd));
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    const parts = cmd.trim().split(' ');
    const mainCommand = parts[0].toLowerCase();
    const arg = parts[1];

    switch (mainCommand) {
        case 'help':
            printLine("Available commands:");
            printLine("  ls              - List available files");
            printLine("  cat <filename>  - Display file content");
            printLine("  submit <flag>   - Submit solution (Format: flag{username})");
            printLine("  hint            - Request a hint (Cost: 75 pts)");
            printLine("  clear           - Clear terminal");
            break;

        case 'ls':
            Object.keys(fileSystem).forEach(file => printLine(file));
            break;

        case 'cat':
            if (!arg) {
                printLine("Usage: cat <filename>", "warning");
            } else if (fileSystem[arg]) {
                printLine(fileSystem[arg]);
            } else {
                printLine(`File not found: ${arg}`, "failure");
            }
            break;

        case 'clear':
            terminalOutput.innerHTML = '';
            break;

        case 'hint':
            if (gameState.hintsUsed >= 3) {
                printLine("No more hints available.", "warning");
            } else {
                printLine(`HINT ${gameState.hintsUsed + 1}: ${hints[gameState.hintsUsed]}`, "warning");
                gameState.hintsUsed++;
                updateScore(-75);
            }
            break;

        case 'submit':
            if (!arg) {
                printLine("Usage: submit flag{username}", "warning");
                return;
            }

            // Bruteforce Check
            if (now - gameState.lastSubmitTime < 12000) { // 12 seconds (~5 per min)
                gameState.submissionsThisMinute++;
            } else {
                gameState.submissionsThisMinute = 1;
            }
            gameState.lastSubmitTime = now;

            if (gameState.submissionsThisMinute > 5) {
                gameState.lockedUntil = now + 60000;
                updateScore(-150);
                printLine("RATE LIMIT EXCEEDED. TERMINAL LOCKED FOR 60s. PENALTY -150.", "failure");
                return;
            }

            // Answer Check
            // Valid solution: flag{webmaster}
            const cleanArg = arg.toLowerCase().trim();

            if (cleanArg === 'flag{webmaster}') {
                // Success
                const timeRemaining = (gameState.timerDuration - (Date.now() - gameState.startTime)) / 60000;
                if (gameState.score > 700 && timeRemaining > 15) {
                    endGame('Elite Analyst Status', 'Incident neutralized. Promotion recommended.', 'success');
                } else {
                    endGame('Investigation Successful', 'Attacker identified. System secured.', 'success');
                }
            } else {
                // Failure
                gameState.attempts++;
                updateScore(-100);
                printLine("INCORRECT KEY. ACCESS DENIED.", "failure");

                if (cleanArg.includes('system') || cleanArg.includes('root') || cleanArg.includes('admin')) {
                    printLine("Security Alert: System accounts verified. Look closer.", "warning");
                }

                if (gameState.attempts >= 10) {
                    endGame('Security Lockdown', 'Intrusion detection triggered. Investigation terminated.', 'failure');
                }
            }
            break;

        default:
            printLine(`Command not found: ${mainCommand}`, "failure");
    }
}

// Command Input Listener
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = commandInput.value;
        commandInput.value = '';
        if (cmd) processCommand(cmd);
    }
});

// Start Button Logic
document.getElementById('intro-btn').addEventListener('click', playIntroSequence);

const ASCIILogo = `
============+=++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
============++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
===========+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
=========+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
=======+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
======++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
==+=++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
=+++++++++++++++++++++++++++++++++++++++++++++++*##**+++++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++*%%%%%%%%*+++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++++#%%@@@%%%%%#*+++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++*#%@@@@@@@%%#*+++*#%@%#*++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++*#%@@@@@@@%%#*++++*%@@@@@@@#*++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++*#@@@@@@@@@%#+++****+++#%@@%%*+++***++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++*%@@@@@@@@@%*++++*%@@@@%*+++++++++#@@@@@%*+++++++++++++++++++++++++++++
++++++++++++++++++++++++++*%@@@@@@@@@%*++++*%@@@@@@@@@%#++++*#@@@@@@@@@%*++++++++++++++++++++++++++
+++++++++++++++++++++++#%@@@@@@@@%#**++*#%#*+++*#%@@@@@@@@%#*+++*#%@@@@@@@%%*+++++++++++++++++++++++
+++++++++++++++++++*#%@@@@@@@@%#*+++*#%@@@@@%#*+++*#%@@@@@@@@%#*+++*#%@@@@@@@%#**+++++++++++++++++++
++++++++++++++++++%@@@@@@@@%#*++**#%@@@@@@@%%*+++**+++*%%@@@@@@@%#*+++*#%%@@@%%%%%++++++++++++++++++
++++++++++++++++++@@@@@@%#+++**%@@@@@@@@%%*+++**%@@%**+++*%@@@@@@@%%#*++++*%%%%%%%++++++++++++++++++
++++++++++++++++++@@@@@#+++*%@@@@@@@@@#*++++#%@@@@@@@%%*++++*#@@@@%%%%%#++++*%%%%%++++++++++++++++++
++++++++++++++++++@@@@@#++#@@@@@@@@#*+++*#%@@@@@@@@%#*+++*#*+++*#%@%#**+++++*%%%%%++++++++++++++++++
++++++++++++++++++%@@@@#++%@@@@@#*+++*#%@@@@@@@@%#*+++*#%@@@%#*+++*++++*##++*%%%%%++++++++++++++++++
+++++++++++++++++++*#%@#++%@@@@%++++*%@@@@@@@%#*+++++*%@@@@@@@@%#*++*%@@@#++*%%#*+++++++++++++++++++
++++++++++++++++++**++**++%@@@@%+++*+++*%@%#++++++++++++*%@@@@@%%*++%@@@@#++**+++*++++++++++++++++++
++++++++++++++++++@@%*++++#@@@@%++*@@#+++++++++++++++++++++*@@@%%*++%@@@%*+++++#@%++++++++++++++++++
++++++++++++++++++@@@@%*++#@@@@%++*@@@@%*++++++++++++++++++*@@@%%*++%%**++++*@@@@%++++++++++++++++++
++++++++++++++++++@@@@@#++#@@@@%++*@@@@@*++++++++++++++++++*@@@%%*++++++**++*@@@@%++++++++++++++++++
++++++++++++++++++*#%@@#++#@@@@%+++*#%@%*++++++++++++++++++*@@%#*++++##%%#++*@@%#*++++++++++++++++++
+++++++++++++++++++++*#*++#@@@@%++++++*#*++++++++++++++++++*#*++++++%@@%%#++*#*+++++++++++++++++++++
++++++++++++++++++@%*+++++#@@@@%++*@#*++++++++++++++++++++++++*#%*++%@@%%#+++++*#%++++++++++++++++++
++++++++++++++++++@@@@%*++++*%@%++*@@@@#++++++++++++++++++++#@@@@*++%@@%%#++*%@@@%++++++++++++++++++
++++++++++++++++++@@@@@#++*+++**++*@@@@@*++*++++++++++++*++*@@@@@*++%@@%%#++*@@@@%++++++++++++++++++
++++++++++++++++++@@@@@#++#@%#*++++#%@@%*++%@%#*+++++*#%%++*@@@%#+++%@@%%#++*@@@@%++++++++++++++==
++++++++++++++++++@@@@@#++#@@@@#+++++*#%*++%@@@@%#*#%@@%%++*%#*+++*#%@@%%#++*@@@@%++++++++++++++====
++++++++++++++++++@@@@@#++#@@@@%++*#*++++++%@@@@@@@@@@%%%++++++*#%@@@@@%%#++*@@@@%++++++++++++======
++++++++++++++++++@@@@@#+++*%@@%++*@@@#*++++#@@@@@@@@@%#+++++#@@@@@@@@@%*+++*@@@@%++++++++++========
++++++++++++++++++@@@@@@%#++++**++*@@@@@@%*+++**%@@%**+++++*@@@@@@@@#*++++++*@@@@%+++++++++=========
++++++++++++++++++%@@@@@@@@%#*++++*@@@@@@@@%#*+++**+++*#%++*@@@@@#*++++*%#++*@@@@%++++++++==========
+++++++++++++++++++*#%@@@@@@@%%*++++*#%@@@@@@@%#*++*#@@@%++*@%#*++++*%@@@#++*@%#+++++++=============
+++++++++++++++++++++++#%%@@@%%%+++*+++*#%@@@@%%#++#@@@@%+++*+++*+++%@@@@#+++++++++++===============
++++++++++++++++++++++++++*%%%%%++*@@#*++++*%%%%#++#@@@%#++++*#%%*++%@@@%*+++++++++=================
+++++++++++++++++++++++++++++*#%++*@@@@%*+++++*%#++#%*++++*#%%%%%*++%%*+++++++++++==================
++++++++++++++++++++++++++++++++++*@@@@%*++##++++++++++*%%@@@%%%%*++++++++++++++====================
+++++++++++++++++++++++++++++++++++*#%@@*++%@@%#*+++*%%@@@@@@%%#*+++++++++++++======================
++++++++++++++++++++++++++++++++++++++*#*++%@@@@@%%@@@@@@@%%#*++++++++++++++========================
+++++++++++++++++++++++++++++++++++++++++++%@@@@@@@@@@@@%#++++++++++++++++==========================
+++++++++++++++++++++++++++++++++++++++++++++*%@@@@@@%*+++++++++++++++++============================
++++++++++++++++++++++++++++++++++++++++++++++++*%%*+++++++++++++++++++=============================
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==============================
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++================================
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=================================--
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++================================----
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=================================-----
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=================================-------
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=================================---------`;

async function playIntroSequence() {
    const introScreen = document.getElementById('intro-screen');
    const startScreen = document.getElementById('start-screen');

    introScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    startScreen.innerHTML = ''; // Ensure empty

    // Helper for adding lines
    const appendLine = (text, className = '', isPre = false) => {
        const el = document.createElement(isPre ? 'pre' : 'div');
        el.className = className;
        if (isPre) {
            el.style.fontFamily = 'monospace';
            el.style.whiteSpace = 'pre';
            el.style.fontSize = '10px';
            el.style.lineHeight = '10px';
            el.style.color = '#0f0';
            el.style.display = 'inline-block';
            el.style.textAlign = 'center';
            el.style.width = '100%';
        }
        el.textContent = text;
        startScreen.appendChild(el);
        startScreen.scrollTop = startScreen.scrollHeight;
        return el;
    };

    // 0. Tool Execution Simulation
    const bootLines = [
        "root@shadow-sys:~# ./shadow_protocol.sh --init",
        "[+] Initializing Shadow Environment v2.4.1...",
        "[+] Allocating memory blocks... OK",
        "[+] Bypassing firewall rules (Port 8080)... OK",
        "[+] establishing encrypted connection to 192.168.X.X...",
        "[+] Connection established.",
        "[+] Loading modules: [FORENSICS, DECRYPTION, EXPLOIT]... 100%",
        "[!] WARNING: Unauthorized access detected!",
        "[+] Launching interface..."
    ];

    for (const line of bootLines) {
        const p = document.createElement('div');
        p.style.fontFamily = 'monospace';
        p.style.marginBottom = '5px';
        p.style.color = line.startsWith("[!]") ? '#ff3333' : '#33ff33';
        p.style.textShadow = '0 0 2px ' + p.style.color;

        if (line.startsWith("root@")) {
            p.style.color = "#ffaa00";
            p.textContent = line;
        } else {
            p.textContent = line;
        }

        startScreen.appendChild(p);
        startScreen.scrollTop = startScreen.scrollHeight;

        // Random typing delay for "realism"
        await new Promise(r => setTimeout(r, Math.random() * 300 + 100));
    }

    await new Promise(r => setTimeout(r, 800));
    startScreen.innerHTML = ''; // Clear boot sequence for clean logo display (optional, or keep it)
    // Actually, keeping it makes it look like a history buffer. Let's keep it but maybe add a separator or just clear if the user wants a "new screen" feel. 
    // The user said "make everything like starting a tool", usually tools clear screen or just scroll. 
    // I'll clear it to frame the ASCII Logo better, or maybe just add spacing.
    // Let's clear it for a "clean tool UI" launch effect.
    startScreen.innerHTML = '';

    // 1. Type ASCII Art (Fast)
    const asciiLines = ASCIILogo.split('\n');
    const artContainer = document.createElement('div');
    artContainer.style.textAlign = 'center';
    startScreen.appendChild(artContainer);

    for (let line of asciiLines) {
        const pre = document.createElement('pre');
        pre.style.fontFamily = 'monospace';
        pre.style.fontSize = '8px'; // Smaller to fit
        pre.style.lineHeight = '8px';
        pre.style.margin = '0';
        pre.style.color = '#0f0';
        pre.textContent = line;
        artContainer.appendChild(pre);
        startScreen.scrollTop = startScreen.scrollHeight;
        await new Promise(r => setTimeout(r, 10)); // Very fast typing
    }

    await new Promise(r => setTimeout(r, 500));

    await new Promise(r => setTimeout(r, 500));

    // 2. Type Title (Text)
    // Skipped ASCII title to prevent ReferenceError


    // Type Strings
    const typeString = async (text, style = '', tag = 'p') => {
        const p = document.createElement(tag);
        p.style.cssText = style;
        p.style.textAlign = 'center';
        startScreen.appendChild(p);

        let i = 0;
        const speed = 20;

        while (i < text.length) {
            p.textContent += text.charAt(i);
            i++;
            startScreen.scrollTop = startScreen.scrollHeight;
            await new Promise(r => setTimeout(r, speed));
        }
        await new Promise(r => setTimeout(r, 300));
    };

    await typeString("SHADOW IN THE SYSTEM", "font-size: 2.5rem; margin-bottom: 10px; text-shadow: 0 0 10px #0f0; color: #fff;", "h1");
    await typeString("Escape Room", "color: #ffaa00; font-size: 1.5rem; margin-bottom: 20px;", "h2");

    const flowContainer = document.createElement('div');
    flowContainer.style.maxWidth = '900px';
    flowContainer.style.margin = '0 auto';
    flowContainer.style.border = '2px solid #33ff33';
    flowContainer.style.padding = '40px';
    flowContainer.style.background = 'rgba(0, 20, 0, 0.8)';
    flowContainer.style.textAlign = 'left';
    flowContainer.style.fontSize = '1.5rem';
    flowContainer.style.lineHeight = '1.6';
    flowContainer.style.boxShadow = '0 0 20px rgba(51, 255, 51, 0.2)';
    startScreen.appendChild(flowContainer);

    const typeToContainer = async (text, isHtml = false) => {
        const p = document.createElement('div');
        p.style.marginBottom = '10px';
        p.style.fontFamily = 'monospace';
        flowContainer.appendChild(p);

        if (isHtml) {
            p.innerHTML = text;
        } else {
            let i = 0;
            while (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                startScreen.scrollTop = startScreen.scrollHeight;
                await new Promise(r => setTimeout(r, 15));
            }
        }
        await new Promise(r => setTimeout(r, 200));
    };

    await typeToContainer("MISSION BRIEFING:");
    await typeToContainer("We have detected unauthorized root access on server 0x92A. System integrity is compromised.");
    await typeToContainer("YOUR OBJECTIVE:");
    await typeToContainer("- Analyze system logs and artifacts.");
    await typeToContainer("- Identify the REAL user behind the attack.");
    await typeToContainer("- Submit the flag: flag{username}");
    await typeToContainer("WARNING: You have 30 minutes before the system is permanently corrupted.");

    // Button
    const btnBox = document.createElement('div');
    btnBox.style.marginTop = '20px';
    btnBox.style.textAlign = 'center';
    flowContainer.appendChild(btnBox);

    const btn = document.createElement('button');
    btn.textContent = 'INITIALIZE SESSION';
    btn.id = 'start-btn';
    btn.style.fontSize = '1.5rem';
    btn.style.padding = '15px 40px';
    btn.style.border = '2px solid #0f0';
    btn.style.background = '#002200';
    btn.style.color = '#0f0';
    btn.style.cursor = 'pointer';
    btnBox.appendChild(btn);

    btn.addEventListener('click', startGame);
    startScreen.scrollTop = startScreen.scrollHeight;
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    gameState.startTime = Date.now();

    // Initial Lines with delay for effect
    setTimeout(() => printLine("Initializing forensics environment..."), 100);
    setTimeout(() => printLine("Loading system logs... [OK]"), 600);
    setTimeout(() => printLine("Decrypting file system... [OK]"), 1200);
    setTimeout(() => printLine("Secure connection established."), 1800);
    setTimeout(() => {
        printLine(" ");
        printLine("WARNING: UNAUTHORIZED SYSTEM MODIFICATIONS DETECTED.", "welcome-msg");
        printLine("IDENTIFY THE INTRUDER BEFORE TOTAL SYSTEM CORRUPTION.", "welcome-msg");
        printLine(" ");
        printLine("Type 'help' for available commands.");
        printLine(" ");
        commandInput.focus();
    }, 2500);

    // Start Loops
    setInterval(updateTimer, 1000);

    // Score decay loop (every 5 mins)
    setInterval(() => {
        if (!gameState.gameOver) {
            updateScore(-50);
            printLine("Notice: Time penalty applied (-50 pts).", "warning");
        }
    }, 300000);
}
