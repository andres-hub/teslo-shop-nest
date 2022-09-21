import { AfterInsert, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {unique: true})
    email: string;

    @Column('text', {select: false})
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {default: true})
    isActive: boolean;

    @Column('text', {array: true, default:['User']})
    roles: string[];

    @OneToMany(
        ()=> Product,
        (product) => product.user
    )
    Product: Product;

    @BeforeInsert()
    @BeforeUpdate()
    checkFiekdsBefore(){
        this.email = this.email.toLocaleLowerCase().trim();
    }


}
