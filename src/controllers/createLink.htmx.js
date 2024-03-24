const BadRequestError = require("../errors/BadRequestError");
const LinkService = require("../services/LinkService");

async function createLink(req, res, next) {

    const linkService = LinkService.getInstance();
    try {
        const { short, long, password } = req.body;
        if (!short || !long) {
            throw new BadRequestError("Missing required fields: short, long");
        }

        const link = {
            short,
            long,
            password
        };
        const createdLink = await linkService.createLink(link);

        return res.status(201).send(`
            <h2>Link created</h2>
            <p>Your short link: <a href="${createdLink.long}">${createdLink.short}</a></p>
        `);
    }
    catch (error) {
        if(error instanceof BadRequestError) {
            return res.status(201).send(`
                <h2>Link cannot created</h2>
                <p>Someone already uses it, try other shortlink.</p>
            `);
        }
        next(error);
    }
}

module.exports = { createLink };