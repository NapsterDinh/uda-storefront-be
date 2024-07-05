import { User } from '../../models/user.model';
import { userService } from '../../services/user.service';
import { generateUserTest } from '../controllers/user.controller.spec';

describe('User Service', () => {
  let userSample: User | undefined;
  beforeAll(async () => {
    const userTest = generateUserTest(`uda-tsu-user-service-${Math.random()}`)
    userSample = await userService.createUser(userTest);
  });

  it('should return a list of users', async () => {
    const result = await userService.getAllUsers();
    expect(result?.length).toBeGreaterThan(0);
  });

  it('should return the correct users by id', async () => {
    if(!userSample) return
    const user = await userService.getUserById(userSample.id);
    expect(user?.id).toEqual(userSample.id);
  });
  
  it('should return the correct users by username', async () => {
    if(!userSample) return
    const user = await userService.getUser(userSample.username);
    expect(user?.username).toEqual(userSample.username);
  });

  it('should remove the user', async () => {
    // Create a new user
    const userTest = generateUserTest(`uda-tsu-user-service-${Math.random()}`)
    const testDeleteUser = await userService.createUser(userTest);
    if(!testDeleteUser?.id) return
    // Delete created user
    const isSuccess = await userService.deleteUserById(testDeleteUser.id);
    expect(isSuccess).toBeTrue();
  });
});
