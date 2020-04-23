let isRunning = false;

// run this in global scope of window or worker. since window.self = window, we're ok
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    // huzzah! a worker!
    self.onmessage = function(e) {
        calcPi(e.data, true);
    }
} else {
    // I'm a window... sad trombone.
}

/**
 * @see http://ajennings.net/blog/a-million-digits-of-pi-in-9-lines-of-javascript.html
 * @param {number} digits
 * @param {boolean} doSendMessage
 */
function calcPi(digits, doSendMessage = false) {
    if (isRunning) {
        return;
    }

    isRunning = true;
    let i = 1n;
    let x = 3n * (10n ** (BigInt(digits) + 20n));
    let pi = x;
    while (x > 0) {
        x = x * i / ((i + 1n) * 4n);
        pi += x / (i + 2n);
        i += 2n;
    }
    const pistr10 = (pi / (10n ** 20n)).toString(10);
    if (doSendMessage) {
        self.postMessage(pistr10);
    }
    isRunning = false;
    return pistr10;
}