const auth = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const { User } = require('../models');

jest.mock('../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('cloudinary');

const mockRequest = (body = {}) => {
  return { body };
};
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('register function', () => {


  test('should 201 if success create user account', async () => {
    const req = mockRequest({
      first_name: 'binar',
      last_name: 'academy',
      email: 'binar103@gmail.com',
      username: 'binar103',
      password: 123456,
      avatar_public_id: 'null',
      avatar_url: 'null',
    });

    await cloudinary.v2.uploader.upload.mockResolvedValue({});

    User.create.mockResolvedValueOnce({
      first_name: 'binar',
      last_name: 'academy',
      email: 'binar103@gmail.com',
      username: 'binar103',
    });

    const res = mockResponse();
    await auth.register(req, res);

//Berhasil
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      result: 'Success',
      message: 'User Has Been Successfully Created',
      data: {
        first_name: 'binar',
        last_name: 'academy',
        email: 'binar103@gmail.com',
        username: 'binar103',
      },
    });
  });
});

describe('login function', () => {
  test('should 404 if user not found', async () => {
    const req = mockRequest({
      username: 'binarian',
    });
    const res = mockResponse();

    await User.findOne.mockResolvedValueOnce();

    await auth.login(req, res);

    //Berhasil

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: 'Failed',
      message: 'User Not Found',
    });
  });

  test('should 401 with message if passed password does not match store password', async () => {
    const req = mockRequest({
      password: '123456',
    });

    const res = mockResponse();

    User.findOne.mockResolvedValueOnce({
      password: '123456',
    });

    await auth.login(req, res);

    //Berhasil
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      result: 'Failed',
      message: 'Please enter a valid username or password',
    });
  });

  test('should 200 if login success and generate token', async () => {
    const req = mockRequest({
      username: 'binarian',
      password: '123456',
    });

    const res = mockResponse();

    User.findOne.mockReturnValueOnce({
      id: 1,
      first_name: 'binar',
      last_name: 'academy',
      email: 'binar@gmail.com',
      username: 'binarian',
      password: '123456',
      accessToken: '12121213',
    });

    bcrypt.compareSync.mockReturnValueOnce(true);
    jwt.sign.mockReturnValueOnce('12121213');

    await auth.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: 'success',
      message: 'Login Successfully',
      data: {
        id: 1,
        first_name: 'binar',
        last_name: 'academy',
        email: 'binar@gmail.com',
        username: 'binarian',
        accessToken: '12121213',
      },
    });
  });
});
