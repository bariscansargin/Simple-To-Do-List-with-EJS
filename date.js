exports.getDate = () => {
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    return new Date().toLocaleDateString("en-US", options)
}


