const welcome = (req, res) => {
    res.send(`Welecome to the party ${req.session.user.username}`)
}

module.exports = {
    welcome,
}