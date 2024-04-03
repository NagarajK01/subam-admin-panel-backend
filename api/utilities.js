function getSlug(str) {
    if (str) {
        let String = str.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
        return String
    } else {
        return ''
    }
}

module.exports = {
    getSlug: getSlug,
};
