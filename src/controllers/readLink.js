const LinkService = require("../services/LinkService");

async function readLink(req, res, next) {
    const linkService = LinkService.getInstance();
    try {
        const { short } = req.params;
        const { redirect } = req.query;
        const link = await linkService.readLink(short);
        delete link.password;

        if(redirect === undefined || redirect === 'true') {
            res.status(201).send(`
                <meta http-equiv="Refresh" content="0; url='${link.long}'" />
            `);
        } else {
            res.status(200).json({
                status: "success",
                message: "Link found",
                data: link,
            });
        }
    }
    catch (error) {
        next(error);
    }
}

module.exports = { readLink };