import { getCurrentUser } from "@/features/users/actions";
import { Icons } from "@/components/layouts/icons";
import { Shell } from "@/components/layouts/Shell";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  CollectionCardFragment,
  CollectionsCard,
  CollectionsCardSkeleton,
} from "@/features/collections";
import {
  ProductCard,
  ProductCardFragment,
  ProductCardSkeleton,
} from "@/features/products";
import { DocumentType, gql } from "@/gql";
import { getClient } from "@/lib/urql";
import { cn, keytoUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const LandingRouteQuery = gql(/* GraphQL */ `
  query LandingRouteQuery($user_id: UUID) {
    products: productsCollection(
      filter: { featured: { eq: true } }
      first: 4
      orderBy: [{ created_at: DescNullsLast }]
    ) {
      edges {
        node {
          id
          ...ProductCardFragment
        }
      }
    }

    wishlistCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          product_id
        }
      }
    }

    cartsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          product_id
          quantity
        }
      }
    }

    collectionScrollCards: collectionsCollection(
      first: 6
      orderBy: [{ order: DescNullsLast }]
    ) {
      edges {
        node {
          id
          ...CollectionCardFragment
        }
      }
    }
  }
`);

export default async function Home() {
  const currentUser = await getCurrentUser();

  const { data } = await getClient().query(LandingRouteQuery, {
    user_id: currentUser?.id,
  });

  if (data === null) return notFound();

  return (
    <main>
      <HeroSection />

      <Shell>
        {data.products && data.products.edges ? (
          <ProductSubCollectionsCircles
            collections={data.collectionScrollCards.edges}
          />
        ) : null}

        {data.products && data.products.edges ? (
          <FeaturedProductsCards products={data.products.edges} />
        ) : null}

        <CollectionGrid />

        <DifferentFeatureCards />

        <LessIsMoreCard />
      </Shell>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="w-full h-screen md:h-[800px] mx-auto flex justify-center">
      <div className="relative w-full h-full md:h-[800px]">
        <Image
          alt="Furniture"
          src="https://hiyori-backpack.s3.us-west-2.amazonaws.com/public/hero-image.jpg"
          width={1920}
          height={1200}
          priority={true}
          className="h-full w-full object-cover "
        />
      </div>

      <div className="container absolute py-8 h-screen md:h-[800px] w-full">
        <div className="flex flex-col justify-center z-30 h-full">
          <p className="text-sm md:text-md uppercase tracking-widest text-white ">
          SmartMart
          </p>
          <h1 className="text-5xl md:text-9xl font-bold text-white my-4 shadow-md">
            Discover quality
            <br />
            for everyday:
          </h1>

          <div className="flex space-x-4 mt-5 max-w-screen">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-2 border-white text-white rounded px-8 py-3 ",
                "md:px-16 md:py-6",
                "hover:text-zinc-600 hover:bg-white",
              )}
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedProductsCards {
  products: { node: DocumentType<typeof ProductCardFragment> }[];
}
interface CollectionsCardsProps {
  collections: { node: DocumentType<typeof CollectionCardFragment> }[];
}

function ProductSubCollectionsCircles({ collections }: CollectionsCardsProps) {
  return (
    // <div>hi</div>
    <section className="flex justify-start items-center gap-x-10 overflow-auto py-12">
      {collections.map(({ node }) => (
        <Link
          href={`/collections/${node.slug}`}
          key={`collection_circle_${node.id}`}
        >
          <div
            className={cn(
              "relative bg-secondary rounded-full flex justify-center items-center",
              "w-[280px] h-[280px]",
              // "md:w-[320px] md:h-[320px]"
              // "lg:w-[360px] lg:h-[360px]"
            )}
          >
            <Image
              src={keytoUrl(node.featuredImage.key)}
              alt={node.featuredImage.alt}
              width={320}
              height={320}
              className={cn(
                "object-center object-cover hover:scale-105 transition-all duration-500",
                "w-[240px] h-[240px]",
                // "md:w-[280px] md:h-[280px]",
                // "lg:w-[320px] lg:h-[320px]"
              )}
            />
          </div>
          <p className="text-black text-center mt-3 font-semibold">
            {node.label === "Kids"
              ? "Kids"
              : node.label === "Jewellery"
              ? "Jewellery"
              : node.label === "Women"
              ? "Women"
              : node.label === "Mens"
              ? "Mens"
              : node.label}
              {/* {node.label} */}
          </p>
        </Link>
      ))}
    </section>
  );
}

interface FeaturedProductsCardsProps {
  products: { node: DocumentType<typeof ProductCardFragment> }[];
}

function FeaturedProductsCards({ products }: FeaturedProductsCardsProps) {
  return (
    <section className="container mt-12">
      <div className="">
        <h2 className="font-semibold text-2xl md:text-3xl mb-1 md:mb-3">
          Step into Style
        </h2>
        
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 py-5 overflow-auto">
        <Suspense
          fallback={[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={`Product-Skeleton-${index}`} />
          ))}
        >
          {products.map(({ node }) => (
            <ProductCard key={`product-card-${node.id}`} product={node} />
          ))}
        </Suspense>
      </div>
    </section>
  );
}

function CollectionGrid() {
  return (
    <div>.</div>
    // <section cla3ssName="relative lg:space-x-5 space-y-5 lg:space-y-0 grid grid-cols-1 lg:grid-cols-3 max-h-[840px]">
    //   {/* <div className="relative col-span-2 w-full h-[840px]">
    //     <Image
    //       src={keytoUrl("bathroom.webp")}
    //       width={1080}
    //       height={1080}
    //       className="object-cover w-full h-full"
    //       alt="1"
    //     />
    //     <div className="bg-zinc-800/20 flex justify-center items-center flex-col absolute w-full h-full top-0 left-0 text-white">
    //       <p className="text-5xl mb-3">Bath Room</p>
    //       <p className=" font-light mb-8">SmartMart for bathroom elegance</p>
    //       <Link
    //         className={cn(buttonVariants({ size: "lg" }), "text-xl py-8 px-10")}
    //         href={"/collections/bathroom"}
    //       >
    //         Explore the Bath Collection
    //       </Link>
    //     </div>
    //   </div>

    //   <div className="flex flex-col w-full space-y-5 h-[840px]">
    //     <div className="relative w-full h-[340px]">
    //       <Image
    //         src={keytoUrl("bathroom2.webp")}
    //         width={800}
    //         height={900}
    //         className="object-cover w-full h-full"
    //         alt="1"
    //       />
    //     </div>

    //     <div className="relative overflow-hidden">
    //       <Image
    //         src={keytoUrl("bathroom2.jpg")}
    //         width={800}
    //         height={900}
    //         className="object-cover w-full h-full"
    //         alt="1"
    //       />
    //     </div>
    //   </div> */}
    // </section>
  );
}

function CollectionRectCard({ collections }: CollectionsCardsProps) {
  return (
    <ScrollArea className="whitespace-nowrap relative container">
      <div className="flex w-max space-x-10 py-5 overflow-auto">
        <Suspense
          fallback={[...Array(6)].map((_, index) => (
            <CollectionsCardSkeleton key={`Collections-sekelton-${index}`} />
          ))}
        >
          {collections.map(({ node }) => (
            <CollectionsCard collection={node} key={node.id} />
          ))}
        </Suspense>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function DifferentFeatureCards() {
  const features = [
    {
      Icon: Icons.cart,
      title: "Curated Designs",
      description:
        "SmartMart selects the finest designs for your everyday life.",
    },
    {
      Icon: Icons.tag,
      title: "Competitive Pricing",
      description:
        "We believe in fair prices without compromising on quality. See SmartMart's value.",
    },
    {
      Icon: Icons.package,
      title: "Sustainable Choices",
      description:
        "SmartMart is committed to sourcing eco-friendly products.",
    },
    {
      Icon: Icons.award,
      title: "Customer Satisfaction",
      description:
        "Your happiness is SmartMart's priority. We are here to serve you.",
    },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-5 gap-y-8 gap-x-5 md:gap-x-12 mx-auto">
      {features.map(({ Icon, title, description }, index) => (
        <div
          className="text-center  max-w-[18rem]"
          key={`FeatureCards_${index}`}
        >
          <div className="flex justify-center items-center p-5">
            <Icon
              width={45}
              height={45}
              className="mb-5 text-zinc-400 font-light"
            />
          </div>

          <h4 className="text-xl font-serif font-extralight mb-3">{title}</h4>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      ))}
    </section>
  );
}

function LessIsMoreCard() {
  return (
    <section className="max-w-[1920px] mx-auto h-[620px] md:h-[580px] bg-[#FFF8EE] grid grid-cols-12 my-16">
      <div className="relative w-full h-[340px] md:h-[580px] col-span-12 md:col-span-8 overflow-hidden">
        <Image
          src={"/assets/cutingcardImage.jpg"}
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="col-span-12 md:col-span-4 pb-6 md:py-20 px-6 md:px-16">
        <h2 className="text-xl md:text-3xl font-semibold mb-3">
          Simple. Minimal. SmartMart.
        </h2>
        <p className="text-xs leading-[1.5] md:text-lg tracking-tight mb-5 md:mb-12 text-left max-w-md">
          At SmartMart, we believe in bringing you the best without breaking the
          bank. Our products meet the highest standards of quality and
          sustainability, designed to be both elegant and affordable.
        </p>
        <Link
          href="/shop"
          className={cn(buttonVariants(), "rounded-full text-xs md:text-md")}
        >
          Explore SmartMart
        </Link>
      </div>
    </section>
  );
}
