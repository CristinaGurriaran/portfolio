const { errors: {
    DuplicityError,
    ContentError,
    AuthError,
    ExistenceError,
    PermitError
} } = require('com')

module.exports = callback => {
    return (req, res) => {
        try {
            const promise = callback(req, res)

                ; (async () => {
                    try {
                        await promise
                    } catch (error) {
                        respondError(error, res)
                    }
                })()
        } catch (error) {
            respondError(error, res)
        }
    }
}

function respondError(error, res) {
    let status = 500

    if (error instanceof DuplicityError)
        status = 409
    else if (error instanceof ExistenceError)
        status = 404
    else if (error instanceof AuthError)
        status = 401
    else if (error instanceof PermitError)
        status = 401
    else if (error instanceof TypeError || error instanceof ContentError || error instanceof RangeError)
        status = 406

    res.status(status).json({ message: error.message, type: error.constructor.name })
}



