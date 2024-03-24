const LinkService = require("../services/LinkService");

async function deleteLink(req, res, next) {
    const linkService = LinkService.getInstance();
    try {
        const { short } = req.params;
        const { password } = req.body;
        const deletedLink = await linkService.deleteLink(short, password);

        res.status(200).json({
            status: "success",
            message: "Link deleted",
            data: deletedLink,
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = { deleteLink };