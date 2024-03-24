const { Prisma } = require('@prisma/client');
const prisma = require('./PrismaClient');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const PasswordUtil = require('../utils/PasswordUtil');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

class LinkService {
    static #createInstace() {
        const instance = new LinkService();
        instance.prisma = prisma;
        return instance;
    }

    static getInstance() {
        if (!LinkService.INSTANCE) {
            LinkService.INSTANCE = this.#createInstace();
        }

        return LinkService.INSTANCE;
    }

    async createLink(link) {
        try {
            const passwordUtil = PasswordUtil.getInstance();
            link.password = await passwordUtil.hashPassword(link.password);

            const createdLink = await this.prisma.link.create({
                data: link
            })

            return createdLink
        } catch (error) {
            console.log(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestError('Short link already exists')
                }
            }
            throw new ServerError()
        }
    }

    async readLink(shortLink) {
        try {
            const link = await this.prisma.link.findUnique({
                where: {
                    short: shortLink
                }
            })

            if (!link) {
                throw new NotFoundError('Short link does not exist')
            }

            return link
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error
            }
            throw new ServerError()
        }
    }

    async deleteLink(shortLink, password) {
        try {
            const link = await this.prisma.link.findUnique({
                where: {
                    short: shortLink
                }
            })

            if (!link) {
                throw new NotFoundError('Short link does not exist')
            }

            const passwordUtil = PasswordUtil.getInstance()
            if (!passwordUtil.verifyPassword(password, link.password)) {
                throw new UnauthorizedError('Password is incorrect')
            }

            return link
        } catch (error) {
            if(error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error
            }
            throw new ServerError()
        }
    }
}

module.exports = LinkService;