import Link from 'next/link';
import React from 'react';
import Stripe from 'stripe';
import { GetStaticPaths, GetStaticProps } from 'next';
import CheckoutButton from '../components/CheckoutButton';

import stripeCofig from '../config/stripe';

interface Props {

  sku: Stripe.Sku;

};

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(stripeCofig.secretKey, {
    apiVersion: '2020-03-02',
  });

  const skus = await stripe.skus.list();
  console.log(skus);
  const paths = skus.data.map((sku) => ({
    params: {
      skuId: sku.id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(stripeCofig.secretKey, {
    apiVersion: '2020-03-02',
  });
  const { skuId } = params;

  const sku = await stripe.skus.retrieve(skuId as string)

  console.log(sku);
  return {
    props: {
      sku,
    },
  };
};

const Product: React.FC<Props> = ({ sku }) => {
  return (

    <div>
      <h1>{sku.attributes.name}</h1>
      {sku.image && <img
        style={{
          width: '100px',
        }}
        src={sku.image} />}
      
      <h2>
        Preço: {Number(sku.price / 100).toFixed(2)}
        {sku.currency.toUpperCase()}</h2>
        <CheckoutButton skuId={sku.id} itemName={sku.attributes.name} />
        <br/>
        <br/>
      <Link href='/'> Voltar </Link>
    </div>
  );
};
export default Product;