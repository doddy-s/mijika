const { Prisma } = require('@prisma/client');
const BadRequestError = require('../../errors/BadRequestError');
const LinkService = require('../LinkService');
const { prismaMock } = require('../__mocks__/MockedPrisma');
const ServerError = require('../../errors/ServerError');
const NotFoundError = require('../../errors/NotFoundError');
const PasswordUtil = require('../../utils/PasswordUtil');
const UnauthorizedError = require('../../errors/UnauthorizedError');

jest.mock('../../utils/PasswordUtil');

describe('LinkService', () => {
    let linkService;

    beforeAll(() => {
        linkService = LinkService.getInstance();
    });

    describe('createLink method', () => {
        const linkData = {
            short: 'abc123',
            long: 'https://example.com',
            password: 'secret'
        };

        it('should create a link', async () => {
            prismaMock.link.create.mockResolvedValue(linkData);
            const createdLink = await linkService.createLink(linkData);

            expect(linkService.prisma.link.create).toHaveBeenCalledWith({
                data: linkData
            });
            expect(createdLink).toBe(linkData);
        });

        it('should throw BadRequestError when short link is already exist', async () => {
            prismaMock.link.create.mockImplementationOnce(() => {
                throw new Prisma.PrismaClientKnownRequestError('P2002', { code: 'P2002' });
            });

            await expect(
                linkService.createLink(linkData),
            ).rejects.toThrow(BadRequestError);
        });

        it('should throw ServerError when an unexpected error occurs', async () => {
            prismaMock.link.create.mockImplementationOnce(() => {
                throw new Error();
            });

            await expect(
                linkService.createLink(linkData),
            ).rejects.toThrow(ServerError);
        });
    });

    describe('readLink method', () => {
        const shortLink = 'abc123';
        const longLink = 'https://example.com'

        it('should return a link', async () => {
            prismaMock.link.findUnique.mockResolvedValue(longLink);

            const link = await linkService.readLink(shortLink);

            expect(linkService.prisma.link.findUnique).toHaveBeenCalledWith({
                where: {
                    short: shortLink
                }
            });
            expect(link).toBe(longLink);
        });

        it('should throw NotFoundError when link is not found', async () => {
            prismaMock.link.findUnique.mockResolvedValue(null);

            await expect(
                linkService.readLink(shortLink),
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw ServerError when an unexpected error occurs', async () => {
            prismaMock.link.findUnique.mockImplementationOnce(() => {
                throw new Error();
            });

            await expect(
                linkService.readLink(shortLink),
            ).rejects.toThrow(ServerError);
        });
    });

    describe('deleteLink method', () => {
        const shortLink = 'abc123';
        const linkData = {
            short: 'abc123',
            long: 'https://example.com',
            password: '$2b$10$wVU02HF6xMnz0Hg6pc/L5Ob2V8F.ov.W.77bDfuVucX0l.2oCNg62'
        };

        it('should delete a link', async () => {
            prismaMock.link.findUnique.mockResolvedValue(linkData);

            const link = await linkService.deleteLink(shortLink, 'secret');

            expect(link).toBe(linkData);
        });

        it('should throw UnauthorizedError when password is incorrect', async () => {
            prismaMock.link.findUnique.mockResolvedValue(linkData);

            await expect(
                linkService.deleteLink(shortLink, 'wrong password'),
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should throw NotFoundError when link is not found', async () => {
            prismaMock.link.findUnique.mockResolvedValue(null);

            await expect(
                linkService.deleteLink(shortLink),
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw ServerError when an unexpected error occurs', async () => {
            prismaMock.link.findUnique.mockImplementationOnce(() => {
                throw new Error();
            });

            await expect(
                linkService.deleteLink(shortLink),
            ).rejects.toThrow(ServerError);
        });
    });
});
