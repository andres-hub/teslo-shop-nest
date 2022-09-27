import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({name: 'products' })
export class Product {

    @ApiProperty({
        example:'67df8f08-d832-470c-aef2-a9f0a68044d5',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {unique: true})
    title: string;

    @ApiProperty({
        example:0,
        description: 'Product Price',
    })
    @Column('float', {default: 0})
    price: number;

    @ApiProperty({
        example:'Anim gdfgdfg sdfdfgghgf',
        description: 'Product Description',
    })
    @Column({ type: 'text', nullable: true})
    description: string;

    @ApiProperty({
        example:'T-Shirt Teslo',
        description: 'Product SLUG - for SEO',
    })
    @Column({ type: 'text', unique: true})
    slug: string;
   
    @ApiProperty({
        example:10,
        description: 'Product Stock',
        default:0
    })
    @Column({ type: 'int', default: 0})
    stock: number;

    @ApiProperty({
        example:['M', 'XL', 'XXL'],
        description: 'Product Sizes',
    })
    @Column({ type: 'text', array: true})
    sizes: string[];

    @ApiProperty({
        example:'women',
        description: 'Product gender',
    })
    @Column({ type: 'text',})
    gender: string;

    @ApiProperty()
    @Column({ type: 'text', array: true, default: []})
    tags: string[];

    @ApiProperty()
    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )

    @ApiProperty()
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user)=> user.Product,
        {eager: true}
    )
    user: User    

    @BeforeInsert()
    @BeforeUpdate()
    checkSlug(){
        this.slug = (!this.slug)? this.title :this.slug;
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", ''); 
    }
    
}
