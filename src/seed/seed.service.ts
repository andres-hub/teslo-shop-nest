import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {


  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'executed seed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUserd = initialData.users;

    const users: User[] = [];

    seedUserd.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUser = await this.userRepository.save(seedUserd);
    return dbUser[0];

  }

  private async insertNewProducts(user:User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;

  }

}
