const bcrypt = require('bcrypt');
const PasswordUtil = require('../PasswordUtil');

// Mock bcrypt functions
jest.mock('bcrypt');

describe('PasswordUtil', () => {
    let passwordUtil;

    beforeEach(() => {
        passwordUtil = new PasswordUtil();
    });

    describe('hashPassword', () => {
        it('should hash the password successfully', async () => {
            // Arrange
            const password = 'password123';
            const saltRounds = 10;
            const salt = 'mockedSalt';
            const hashedPassword = 'mockedHash';

            bcrypt.genSalt.mockResolvedValue(salt);
            bcrypt.hash.mockResolvedValue(hashedPassword);

            // Act
            const result = await passwordUtil.hashPassword(password);

            // Assert
            expect(result).toEqual(hashedPassword);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(saltRounds);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
        });
    });

    describe('verifyPassword', () => {
        it('should verify the password successfully', async () => {
            // Arrange
            const inputPassword = 'password123';
            const hashedPassword = 'mockedHash';
            const isVerified = true;

            bcrypt.compare.mockResolvedValue(isVerified);

            // Act
            const result = await passwordUtil.verifyPassword(inputPassword, hashedPassword);

            // Assert
            expect(result).toEqual(isVerified);
            expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, hashedPassword);
        });
    });

    it('should reject an incorrect password', async () => {
        // Arrange
        const inputPassword = 'incorrectPassword';
        const hashedPassword = 'mockedHash';
        const isVerified = false;
  
        bcrypt.compare.mockResolvedValue(isVerified);
  
        // Act
        const result = await passwordUtil.verifyPassword(inputPassword, hashedPassword);
  
        // Assert
        expect(result).toEqual(isVerified);
        expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, hashedPassword);
      });
});
