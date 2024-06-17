import * as bcrypt from 'bcrypt';

import { AuthHelpers } from './auth.helpers';

describe('AuthHelpers', () => {
  describe('hashPassword', () => {
    it('should hash the password', () => {
      const password = 'testpassword';
      const hashedPassword = AuthHelpers.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
    });

    it('should call bcrypt functions', () => {
      const genSaltSyncSpy = jest.spyOn(bcrypt, 'genSaltSync');
      const hashSyncSpy = jest.spyOn(bcrypt, 'hashSync');

      const password = 'testpassword';
      AuthHelpers.hashPassword(password);

      expect(genSaltSyncSpy).toHaveBeenCalled();
      expect(hashSyncSpy).toHaveBeenCalledWith(password, expect.any(String));
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', () => {
      const password = 'testpassword';
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

      const result = AuthHelpers.validatePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for an invalid password', () => {
      const password = 'testpassword';
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

      const result = AuthHelpers.validatePassword(
        'wrongpassword',
        hashedPassword,
      );
      expect(result).toBe(false);
    });
  });
});
