const robot = require('robotjs');

console.log("Starting coordinate finder...");
console.log("Move your mouse to the desired location.");
console.log("Press CTRL + C in this terminal to stop the script.");
console.log("-------------------------------------------------");

// Set an interval to report the mouse position every 250 milliseconds.
const intervalId = setInterval(() => {
    // Get the current mouse position.
    const mouse = robot.getMousePos();

    // The process.stdout.write and \r allows us to overwrite the same line in the terminal.
    // This provides a clean, single-line display that updates in place.
    process.stdout.write(`Current Mouse Position:  X: ${mouse.x}  Y: ${mouse.y}   \r`);
}, 100); // Update every 100 milliseconds for a smooth experience

// Gracefully handle stopping the script with CTRL+C
process.on('SIGINT', () => {
    clearInterval(intervalId); // Stop the loop
    console.log("\n-------------------------------------------------");
    console.log("Coordinate finder stopped.");
    process.exit();
});