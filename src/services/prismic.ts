import Prismic from "@prismicio/client";

export function getPrismicCliente(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRIME_ACESS_TOKEN,
  });
  return prismic;
}
