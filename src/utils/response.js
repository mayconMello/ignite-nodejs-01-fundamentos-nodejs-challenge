export const Response = (res, statusCode, paylod = {}) => {
    if (statusCode >= 400) {
        const message = {...paylod, status_code: statusCode}
        return res
            .writeHead(statusCode)
            .end(JSON.stringify(message))
    }

    if (Object.keys(paylod).length > 0) {
        return res
            .writeHead(statusCode)
            .end(JSON.stringify(paylod))
    }

    return res.writeHead(statusCode)
}