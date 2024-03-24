const bcrypt = require('bcrypt')

class PasswordUtil {
    /**
     * Gets the instance of the PasswordUtil class. If an instance already exists,
     * returns the existing instance; otherwise, initializes a new instance.
     * @returns {PasswordUtil} The PasswordUtil instance.
     */
    static getInstance() {
        if (!PasswordUtil.INSTANCE) {
            PasswordUtil.INSTANCE = new PasswordUtil();
        }

        return PasswordUtil.INSTANCE;
    }

    /**
     * Asynchronously generates a hashed password using bcrypt.
     *
     * @param {string} password - The password to be hashed.
     * @returns {Promise<string>} A Promise that resolves to the hashed password.
     * @throws {Error} If there is an issue generating the salt or hashing the password.
     */
    async hashPassword(password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    /**
     * Asynchronously verifies a password against a hashed password using bcrypt.
     *
     * @param {string} inputPassword - The password to be verified.
     * @param {string} hashedPassword - The hashed password to compare against.
     * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the password is verified.
     * @throws {Error} If there is an issue comparing the passwords.
     */
    async verifyPassword(inputPassword, hashedPassword) {
        const isVerified = await bcrypt.compare(inputPassword, hashedPassword);
        return isVerified;
    }
}

module.exports = PasswordUtil;