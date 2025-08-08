const robot = require('robotjs');

// =========================
// Debug mode setting
const DEBUG = true; // Set to true for debug mode (run after 2 seconds), false for actual date/time
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
    // Ensure delay is not negative, as setTimeout would execute immediately
    if (ms < 0) ms = 0;
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a Date object for display.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDateTime(date) {
    // Pad the milliseconds to always have 3 digits
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    // Use built-in functions for formatting to avoid manual slicing issues
    return date.toLocaleString('sv').replace(' ', 'T').slice(0, 19) + '.' + ms;
}

async function main() {
    let targetDate;

    if (DEBUG) {
        const debugSeconds = 2;
        targetDate = new Date(Date.now() + debugSeconds * 1000);
        console.log(`[DEBUG MODE] Target time set to ${debugSeconds} seconds from now.`);
    } else {
        // Note: JavaScript months are 0-indexed (0 for January, 11 for December)
        targetDate = new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE, SECOND, MILLISECOND);
    }

    const currentTime = new Date();
    const delay = targetDate.getTime() - currentTime.getTime();

    // Use a custom formatter that handles local time better
    const customFormat = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;

    console.log(`Current time: ${customFormat(currentTime)}`);
    console.log(`Target time:  ${customFormat(targetDate)}`);

    if (delay > 0) {
        // **FIXED THIS LINE**: Changed Python formatting to JavaScript's .toFixed() method
        console.log(`Waiting for ${(delay / 1000).toFixed(2)} seconds (about ${(delay / 1000 / 60).toFixed(2)} minutes)...`);
        await sleep(delay);

        // Perform initial single click
        console.log(`Performing initial click at (${INITIAL_CLICK_X}, ${INITIAL_CLICK_Y})...`);
        robot.moveMouse(INITIAL_CLICK_X, INITIAL_CLICK_Y);
        robot.mouseClick();
        console.log("Initial click done.");

        // Perform spam click for a set duration at the second location
        const spamDuration = 5000; // 1 second in milliseconds
        console.log(`Performing spam click at (${SPAM_CLICK_X}, ${SPAM_CLICK_Y}) for ${spamDuration / 1000} seconds...`);

        const startTime = Date.now();
        let clicks = 0;
        robot.moveMouse(SPAM_CLICK_X, SPAM_CLICK_Y); // Move mouse to position first

        while (Date.now() < startTime + spamDuration) {
            robot.mouseClick();
            clicks++;
        }

        console.log(`Spam clicking finished after ${spamDuration / 1000} seconds.`);
        console.log(`Performed approximately ${clicks} clicks at coordinates (${SPAM_CLICK_X}, ${SPAM_CLICK_Y})`);
    } else {
        console.log("The target time is in the past. Please set a future time.");
    }
}

// Run the main function
main();