import { ArrowIcon, HomeContainer, Product } from '../styles/pages/home';

import { useKeenSlider } from 'keen-slider/react';
import { stripe } from '../lib/stripe';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import Stripe from 'stripe';

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 48,
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  function Arrow(props: {
    disabled: boolean
    left?: boolean
    onClick: (e: any) => void
  }) {
    const disabled = props.disabled ? true : false
    return (
      <ArrowIcon
        type={props.left ? 'left' : 'right'}
        onClick={props.onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        isDisabled={disabled}
      >
        {props.left ?
          (<path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />) :
          (<path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />)}
      </ArrowIcon>
    )
  }

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => (
          /* prefetch por padrão fica observando todos links gerados
          *  para que a página seja carregada somente no hover do link
          *  utilizamos prefetch = false
          */
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            prefetch={false}
          >
            <Product className="keen-slider__slide">
              <Image
                src={product.imageUrl}
                width={520}
                height={480}
                alt={product.name}
                priority={true}
              />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))}
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 3
              }
            />
          </>
        )}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const resp = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = resp.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, //2 hours
  };
};
