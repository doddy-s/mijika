const { mockDeep, mockReset } = require('jest-mock-extended')
const prisma = require('../PrismaClient')

const prismaMock = prisma

jest.mock('../PrismaClient', () => mockDeep())

beforeEach(() => {
    mockReset(prismaMock)
})

module.exports = { prismaMock }