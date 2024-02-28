import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(null, null, null);
    usersController = new UsersController(usersService);
  });

  describe('User - Controller and Service', () => {
    it('should be defined', () => {
      expect(usersController).toBeDefined();
      expect(usersService).toBeDefined();
    });
  });
});

// describe('UsersController', () => {
//   let controller: UsersController;
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: {
//             findAll: jest.fn().mockResolvedValue([
//               {
//                 first_name: "Tama",
//                 last_name: "Riyadi",
//                 email: "tamariyadi@email.com",
//                 birthdate: "1975-12-28",
//                 location: "Asia/Jakarta"
//               },
//               {
//                 first_name: "John",
//                 last_name: "Kramer",
//                 email: "kramer@email.com",
//                 birthdate: "1969-12-30",
//                 location: "America/Toronto"
//               },
//               {
//                 first_name: "Saul",
//                 last_name: "Goodman",
//                 email: "bettercallsaul@email.com",
//                 birthdate: "1979-12-31",
//                 location: "America/Toronto"
//               }
//             ]),
//             findOne: jest.fn().mockImplementation((id: number) =>
//               Promise.resolve({
//                 id,
//                 name: `Test User ${id}`,
//                 email: `test${id}@example.com`,
//               }),
//             ),
//             create: jest.fn().mockImplementation((user) =>
//               Promise.resolve({ id: Date.now(), ...user }),
//             ),
//             update: jest.fn().mockImplementation((id, user) =>
//               Promise.resolve({ id, ...user }),
//             ),
//             remove: jest.fn().mockResolvedValue({ deleted: true }),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

  // describe('findAll', () => {
  //   it('should return an array of users', async () => {
  //     await expect(controller.findAll()).resolves.toEqual([
  //       { id: 1, name: 'Test User 1', email: 'test1@example.com' },
  //       { id: 2, name: 'Test User 2', email: 'test2@example.com' },
  //     ]);
  //     expect(service.findAll).toHaveBeenCalled();
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return a single user', async () => {
  //     const id = "1";
  //     await expect(controller.findOne(id)).resolves.toEqual({
  //       id,
  //       name: `Test User ${id}`,
  //       email: `test${id}@example.com`,
  //     });
  //     expect(service.findOne).toHaveBeenCalledWith(id);
  //   });
  // });

  // describe('create', () => {
  //   it('should create a new user', async () => {
  //     const newUser =
  //       {
  //         first_name: "New",
  //         last_name: "User",
  //         email: "new@example.com",
  //         birthdate: new Date(Date.now()),
  //         location: "Asia/Jakarta", 
  //       }
  //     await expect(controller.create(newUser)).resolves.toHaveProperty('id');
  //     expect(service.create).toHaveBeenCalledWith(newUser);
  //   });
  // });

  // describe('update', () => {
  //   it('should update a user', async () => {
  //     const updatedUser = { first_name: 'Updated Name', email: 'updated@example.com' };
  //     const id = 1;
  //     await expect(controller.update({ id }, updatedUser)).resolves.toEqual({
  //       id,
  //       ...updatedUser,
  //     });
  //     expect(service.update).toHaveBeenCalledWith(id, updatedUser);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a user', async () => {
  //     const id = 1;
  //     await expect(controller.remove({ id })).resolves.toEqual({ deleted: true });
  //     expect(service.remove).toHaveBeenCalledWith(id);
  //   });
  // });
// });
