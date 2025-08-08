const robot = require('robotjs');

// =========================
// Debug mode settings
const DEBUG_MODE = true;         // Set to true for a short countdown, false for the configured date/time
const DEBUG_SINGLE_CLICK = true; // If true, performs a single click instead of spam clicking
// =========================

// User-configurable settings
// =========================
// Set the target date and time for when the click should happen
const YEAR = 2025;
const MONTH = 8;      // 1-12 (January = 1, December = 12)
const DAY = 8;        // 1-31 (day of the month)
const HOUR = 15;      // 0-23 (24-hour format)
const MINUTE = 38;    // 0-59
const SECOND = 20;    // 0-59
const MILLISECOND = 0;  // 0-999

// Set the screen coordinates for the INITIAL click
const INITIAL_CLICK_X = 932;
const INITIAL_CLICK_Y = 211;

// Set the screen coordinates for the subsequent SPAM click
const SPAM_CLICK_X = 1441;
const SPAM_CLICK_Y = 1319;
// =========================

/**
 * Pauses the execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    if (ms < 0) ms = 0;
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a Date object into a 'YYYY-MM-DD HH:MM:SS.ms' string.
 * @param {Date} d - The date to format.
 * @returns {string} The formatted date string.
 */
const customFormat = (d) => {
    const pad = (num, size = 2) => String(num).padStart(size, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

/**
 * Formats a duration in milliseconds to a 'HH:MM:SS.ms' string.
 * @param {number} ms - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
function formatDuration(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(ms % 1000).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function main() {
    let targetDate;

    if (DEBUG_MODE) {
        const debugSeconds = 2;
        targetDate = new Date(Date.now() + debugSeconds * 1000);
        console.log(`[DEBUG MODE] Target time set to ${debugSeconds} seconds from now.`);
    } else {
        // Note: JavaScript months are 0-indexed (0 for January, 11 for December)
        targetDate = new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE, SECOND, MILLISECOND);
    }

    const currentTime = new Date();
    const delay = targetDate.getTime() - currentTime.getTime();

    console.log(`Current time: ${customFormat(currentTime)}`);
    console.log(`Target time:  ${customFormat(targetDate)}`);

    if (delay > 0) {
        console.log("\nStarting countdown...");
        // Real-time countdown loop
        while (Date.now() < targetDate.getTime()) {
            const remaining = targetDate.getTime() - Date.now();
            process.stdout.write(`\rTime remaining: ${formatDuration(remaining)}   `);
            await sleep(1); // Sleep for 1ms to prevent high CPU usage
        }
        process.stdout.write("\rCountdown finished.                \n\n");


        // Perform initial single click
        console.log(`Performing initial click at (${INITIAL_CLICK_X}, ${INITIAL_CLICK_Y})...`);
        robot.moveMouse(INITIAL_CLICK_X, INITIAL_CLICK_Y);
        robot.mouseClick();
        console.log("Initial click done.");

        // Conditionally perform spam click or single debug click
        robot.moveMouse(SPAM_CLICK_X, SPAM_CLICK_Y);

        if (DEBUG_SINGLE_CLICK) {
            console.log(`Performing single debug click at (${SPAM_CLICK_X}, ${SPAM_CLICK_Y})...`);
            robot.mouseClick();
            console.log(`Single debug click finished at coordinates (${SPAM_CLICK_X}, ${SPAM_CLICK_Y})`);
        } else {
            const spamDuration = 5000; // 5 seconds in milliseconds
            console.log(`Performing spam click at (${SPAM_CLICK_X}, ${SPAM_CLICK_Y}) for ${spamDuration / 1000} seconds...`);
            const startTime = Date.now();
            let clicks = 0;
            while (Date.now() < startTime + spamDuration) {
                robot.mouseClick();
                clicks++;
            }
            console.log(`Spam clicking finished after ${spamDuration / 1000} seconds.`);
            console.log(`Performed approximately ${clicks} clicks at coordinates (${SPAM_CLICK_X}, ${SPAM_CLICK_Y})`);
        }
    } else {
        console.log("The target time is in the past. Please set a future time.");
    }
}

// Run the main function
main();