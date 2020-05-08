import Stripe from 'stripe';
import Link from 'next/link';
import { GetStaticProps } from 'next';

import stripeCofig from '../config/stripe';

interface Props {
  skus: Stripe.Sku[];
}


export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(stripeCofig.secretKey, {
    apiVersion: '2020-03-02',
  });

  const skus = await stripe.skus.list();


  return {
    props: {
      skus: skus.data
    }
  };
};

const HomePage: React.FC<Props> = ({ skus }) => {
  return (
    <>
    
      <h1>Single Stripe Store</h1>

      <hr/>
      
      {skus.map(sku => (
        <div key={sku.id}>

<h1>{sku.attributes.name}</h1>
      {sku.image && <img
        style={{
          width: '100px',
        }}
        src={sku.image} />}
      <h2>
        Preço: {Number(sku.price / 100).toFixed(2)}
        {sku.currency.toUpperCase()}</h2>
        <Link href={'/'+ sku.id}> Detalhes </Link>

          <hr />
        </div>
      ))}
    </>
  );
}

export default HomePage;