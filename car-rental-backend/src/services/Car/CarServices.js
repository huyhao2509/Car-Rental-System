const { Xe } = require('../../models');
const { v4: uuidv4 } = require('uuid');

class CarServices {
    constructor() {
        this.car = Xe;
    }

    async createCar(carData) {
        const car = await this.car.create({
            ...carData,
            maXe: uuidv4(),
        });
        return car;
    }

    async updateCar(id, carData) {
        const car = await this.car.findByPk(id);
        if (!car) {
            throw new Error('Không tìm thấy xe');
        }
        await car.update(carData);
        return car;
    }

    async getAllCars() {
        const cars = await this.car.findAll();
        return cars;
    }

    async getCarById(id) {
        const car = await this.car.findByPk(id);
        if (!car) {
            throw new Error('Không tìm thấy xe');
        }
        return car;
    }

    async deleteCar(id) {
        const car = await this.car.findByPk(id);
        if (!car) {
            throw new Error('Không tìm thấy xe');
        }
        await car.destroy();
        return true;
    }
}

module.exports = new CarServices();
