"use client";
import { DocumentType, gql } from "@/gql";
import { keytoUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

type BuyAgainCardProps = {
  products: DocumentType<typeof BuyAgainCardFragment>[];
};

export const BuyAgainCardFragment = gql(/* GraphQL */ `
  fragment BuyAgainCardFragment on productsEdge {
    node {
      id
      featured
      price
      name
      slug
      description
      featuredImage: medias {
        id
        key
        alt
      }
    }
  }
`);

function BuyAgainCard({ products }: BuyAgainCardProps) {
  return (
    <Card>
      <CardHeader className="px-6 py-3 flex flex-row justify-between items-center bg-zinc-100">
      <h2 className="text-lg">Buy again</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-5 py-5">
      {products.map(({ node }) => (
        <div
        key={node.id}
        className="grid grid-cols-5 items-center gap-2"
        >
        <div className="relative col-span-2 aspect-square">
          <Image
          src={keytoUrl(node.featuredImage.key)}
          alt={node.featuredImage.alt}
          className="object-cover rounded"
          fill
          sizes="(max-width: 768px) 20vw, 10vw"
          />
        </div>

        <div className="col-span-3 flex flex-col">
          <Link
          href={"/shop/" + node.slug}
          className="text-blue-500 line-clamp-1 hover:underline"
          >
          {node.name}
          </Link>
          <p className="text-red-700 font-semibold">${node.price}</p>
        </div>
        </div>
      ))}
      </CardContent>
    </Card>
  );
}

export default BuyAgainCard;
