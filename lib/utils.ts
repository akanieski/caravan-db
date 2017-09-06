
export var DEBUG = (message) => {
    if (global['debug']) {
        message = typeof message !== 'string' ? JSON.stringify(message) : message
        console.info(`[DEBUG] [${new Date().toString().split(' ')[4]}]   ${message}\n`)
    }
}

export var INFO = (message) => {
    message = typeof message !== 'string' ? JSON.stringify(message) : message
    console.info(`[INFO] [${new Date().toString().split(' ')[4]}]   ${message}\n`)
}

export var ERROR = (message) => {
    if (message.stack) {
        console.error(`[ERROR] [${new Date().toString().split(' ')[4]}]   ${message.stack}\n`)
    } else {
        message = typeof message !== 'string' ? JSON.stringify(message) : message
        console.error(`[ERROR] [${new Date().toString().split(' ')[4]}]   ${message}\n`)
    }
}