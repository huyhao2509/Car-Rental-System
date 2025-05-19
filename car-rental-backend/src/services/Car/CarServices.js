import Xe from "../../models/Xe.js";
import { v4 as uuidv4 } from 'uuid';

class CarServices {
    constructor() {
        this.car = Xe;
    }

    // Phương thức instance
    async createCar(carData) {
        carData.maXe = uuidv4();
        const car = await this.car.create(carData);
        console.log(car);
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

// Export một instance của CarServices
export default new CarServices();
