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

        res.status(201).json({
            status: "success",
            message: "Link created",
            data: createdLink,
        
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = { createLink };