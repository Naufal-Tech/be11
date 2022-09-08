/* eslint-disable no-undef */
const game = require('../controllers/gameController');
const { Detail } = require('../models')

// membuat request & response palsu
// keduanya akan kita oper ke dalam fungsi controller
// tujuannya untuk memastikan fungsi controller berjalan sesuai kehendak kita
const mockRequest = (params = {}) => ({ params });

const mockResponse = () => {
    const res = {};

    // jest.fn() berfungsi untuk memalsukan pemanggilan fungsi
    // eslint-disable-next-line max-len
    // setelah dipalsukan, fungsi tersebut dapat dimodifikasi agar memberi return dengan nilai yang kita tentukan sendiri
    // eslint-disable-next-line max-len
    // Contoh, jika base controller memanggil fungsi res.json atau res.status, kedua fungsi tersebut akan memberi return berupa nilai dari res
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
};


jest.mock('../models');



// judul kumpulan test
describe('game.getLeaderboard function', () => {
    const detail = {
        nama: 'almas',
    }
    // judul & skenario test
    // gunakan async pada parameter kedua jika fungsi controller berupa fungsi async
    test('expected to return status 200 and return json ', async () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();
        Detail.findAll.mockResolvedValueOnce(detail);

        // gunakan await jika fungsi berupa fungsi async
        await game.getLeaderboard(req, res);
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith({
            result: "success",
            message: 'successfully retrieve data',
            data: {
                nama: 'almas',
            }
        });
    });
    test('expected to return status 400', async () => {
        const req = mockRequest({ id: "a" });
        const res = mockResponse();
        // gunakan await jika fungsi berupa fungsi async
        await game.getLeaderboard(req, res);

        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith({
            result: "failed",
            message: 'bad request',

        });
    });
    test('expected to return status 500', async () => {
        const req = mockRequest({ id: "1" });
        const res = mockResponse();
        Detail.findAll.mockImplementation(() => Promise.reject(new Error('eror')))

        // gunakan await jika fungsi berupa fungsi async
        await game.getLeaderboard(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(res.json).toBeCalledWith({
            result: "failed",
            message: 'some error occured while retrieving game',
            error: 'eror'
        });

    });
});
