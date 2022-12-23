import Image from 'next/future/image';

import {
  ImageContainer,
  ProductContainer,
  ProductDetails
} from '../../styles/pages/product';

import { useContext, useState } from 'react';

import { PurchaseContext } from '../../providers/Purchase';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import Stripe from 'stripe';
import { stripe } from '../../lib/stripe';
import { useRouter } from 'next/router';

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  const { cart, addToCart } = useContext(PurchaseContext);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  // if fallback: true
  const { isFallback } = useRouter();
  if (isFallback) {
    // Aqui você pode carregar um componente skeleton-layout por exemplo
    return (<p>Screen loading...</p>)
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt={product.name}
            priority={true}
          />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>
          <button
            onClick={handleAddToCart}
            disabled={isCreatingCheckoutSession}
          >
            Adicionar ao Carrinho
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'prod_N2KA0IQtC8t9zr' } }],
    fallback: true, //false = screen if paths | true = screen params paths | 'blocking' screen to load
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
