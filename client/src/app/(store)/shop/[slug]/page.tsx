import BoughtTogether from "@/components/boughtTogether";
import CartItems from "@/components/cartItems";
import Header from "@/components/layouts/Header";
import { Shell } from "@/components/layouts/Shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddProductToCartForm } from "@/features/carts";
import {
  BuyNowButton,
  ProductImageShowcase,
} from "@/features/products";
import { AddToWishListButton } from "@/features/wishlists";
import { gql } from "@/gql";
import calculateDiscount from "@/lib/discount";
import { getClient } from "@/lib/urql";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecommendationProducts from "@/features/products/components/RecommendationProducts";
import TrackLastViewed from "@/components/TrackLastViewed";

type Props = {
  params: {
    slug: string;
  };
};


const ProductDetailPageQuery = gql(/* GraphQL */ `
  query ProductDetailPageQuery($productSlug: String) {
    productsCollection(filter: { slug: { eq: $productSlug } }) {
      edges {
        node {
          id
          name
          description
          rating
          price
          tags
          totalComments
          ...ProductImageShowcaseFragment
          commentsCollection(first: 5) {
            edges {
              node {
                ...ProductCommentsSectionFragment
              }
            }
          }
          collections {
            id
            label
            slug
          }
        }
      }
    }
  }
`);

async function ProductDetailPage({ params }: Props) {
  const { data, error } = await getClient().query(ProductDetailPageQuery, {
    productSlug: params.slug as string,
  });


  if (!data || !data.productsCollection || !data.productsCollection.edges)
    return notFound();

  const { id, name, description, price, commentsCollection, totalComments } =
    data.productsCollection.edges[0].node;

  return (
    <Shell>
      <TrackLastViewed productId={id} />
      <div className="grid grid-cols-12 gap-x-8">
        <div className="space-y-8 relative col-span-12 md:col-span-7">
          <ProductImageShowcase data={data.productsCollection.edges[0].node} />
        </div>

        <div className="col-span-12 md:col-span-5">
          <section className="flex justify-between items-start max-w-lg">
            <div>
              <h1 className="text-4xl font-semibold tracking-wide mb-3">
                {name}
              </h1>
              <span className="text-md line-through mb-1">{`${price}₹`}</span> <span>{` ${calculateDiscount(id).discountReason}`}</span>
              <p className="text-2xl font-semibold mb-3">{`${price - price * calculateDiscount(id).discountPercentage / 100}₹`}</p>
            </div>
            <AddToWishListButton productId={id} />
          </section>

          <section className="flex mb-8 items-end space-x-5">
            <Suspense>
              <AddProductToCartForm productId={id} />
            </Suspense>

            <BuyNowButton productId={id} />
          </section>

          <section>
            <p>{description}</p>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Ship & Returns</AccordionTrigger>
                <AccordionContent>
                  Shipping & Returns Spend $80 to receive free shipping for a
                  limited time. Oversized items require additional handling
                  fees. Learn more Except for furniture, innerwear, and food,
                  merchandise can be returned or exchanged within 30 days of
                  delivery. Learn more
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>

      <RecommendationProducts currentProductId={id} />



      <Header heading={`Continue where you left off...`} />
      <CartItems />

      <BoughtTogether currentProductId={id} />
    </Shell>
  );
}

export default ProductDetailPage;
