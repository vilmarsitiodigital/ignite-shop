import { ImageContainer, SuccessContainer } from '../styles/pages/success';

import { GetServerSideProps } from 'next';
import Image from 'next/future/image';
import Head from 'next/head';
import Link from 'next/link';

import { stripe } from '../lib/stripe';

interface SuccessProps {
  customerName: string;
  products: {
    name: string;
    images: string;
  }[];
}

export default function Success({ customerName, products }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <h1>Compra Efetuada!</h1>

        {products.map((product) => {
          return (
            <ImageContainer key={product.name}>
              <Image
                src={product.images[0]}
                width={120}
                height={110}
                alt={product.name}
              />
            </ImageContainer>
          );
        })}

        <p>
          Uhuul <strong>{customerName}</strong>, suas compras já estão a caminho
          da sua casa!
        </p>

        <Link href="/">Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  const customerName = session.customer_details.name;

  const products = session.line_items.data.map((product) => {
    return product.price.product;
  });

  return {
    props: {
      customerName,
      products,
    },
  };
};
