// Libs
import { createDocument } from "zod-openapi";

// Mappers
import { SwaggerMapper } from "@/infra/docs/swagger-mapper";

// Schemas
import { registerSchema } from "@/infra/http/controllers/register";
import { updateUserSchema } from "@/infra/http/controllers/update-user";
import { verifyUserSchema } from "@/infra/http/controllers/verify-user";
import { authenticateSchema } from "@/infra/http/controllers/authenticate";
import { requestOtpSchema } from "@/infra/http/controllers/request-otp";
import { registerFarmSchema } from "@/infra/http/controllers/register-farm";
import { listFarmsSchema } from "@/infra/http/controllers/list-farms";
import { handleFarmStatusSchema } from "@/infra/http/controllers/handle-farm-status";
import { orderProductsSchema } from "@/infra/http/controllers/order-products";
import { listBoxesSchema } from "@/infra/http/controllers/list-boxes";
import { fetchBoxSchema } from "@/infra/http/controllers/fetch-box";
import { handleBoxStatusSchema } from "@/infra/http/controllers/handle-box-status";
import { offerProductsSchema } from "@/infra/http/controllers/offer-products";
import { updateOfferSchema } from "@/infra/http/controllers/update-offer";
import { deleteOfferSchema } from "@/infra/http/controllers/delete-offer";
import { searchCatalogsSchema } from "@/infra/http/controllers/search-catalogs";
import { fetchCatalogsSchema } from "@/infra/http/controllers/fetch-catalog";
import { fetchLastCatalogSchema } from "@/infra/http/controllers/fetch-last-catalog";
import { listBagsSchema } from "@/infra/http/controllers/list-bags";
import { fetchBagSchema } from "@/infra/http/controllers/fetch-bag";
import { handleBagSchema } from "@/infra/http/controllers/handle-bag";
import { printDeliveriesReportSchema } from "@/infra/http/controllers/print-deliveries-report";
import { listProductSchema } from "@/infra/http/controllers/list-products";
import { fetchCurrentBoxSchema } from "@/infra/http/controllers/fetch-current-box";
import { requestPasswordUpdateSchema } from "@/infra/http/controllers/request-password-update";

const tags = {
  users: "Usuários",
  auth: "Autenticação",
  farms: "Fazendas",
  orders: "Pedidos",
  boxes: "Caixas",
  offers: "Ofertas",
  catalogs: "Catálogos",
  bags: "Sacolas",
  cycles: "Ciclos",
  products: "Produtos",
};

const docs = createDocument({
  openapi: "3.0.0",
  info: {
    title: "eCOO API",
    version: "1.0.0",
    description: "Documentação de API - eCOO",
  },
  tags: Object.values(tags).map((tag) => ({ name: tag })),
  paths: {
    // Usuários
    "/users": {
      post: {
        tags: [tags.users],
        responses: { "200": { description: "200 OK" } },
        description: "Cria um usuário.",
        ...SwaggerMapper.toDocs(registerSchema),
      },
      patch: {
        tags: [tags.users],
        responses: { "200": { description: "200 OK" } },
        description: "Atualiza o usuário.",
        ...SwaggerMapper.toDocs(updateUserSchema),
      },
    },
    "/users/verify": {
      get: {
        tags: [tags.users],
        responses: { "200": { description: "200 OK" } },
        description: "Verifica um usuário.",
        ...SwaggerMapper.toDocs(verifyUserSchema),
      },
    },
    "/users/password": {
      post: {
        tags: [tags.users],
        responses: { "200": { description: "200 OK" } },
        description: "Solicita a recuperação de senha. Se o usuário existir, ele recebe um email com um link para essa atualização.",
        ...SwaggerMapper.toDocs(requestPasswordUpdateSchema),
      }
    },
    "/me": {
      get: {
        tags: [tags.users],
        responses: { "200": { description: "200 OK" } },
        description: "Busca as informações do próprio perfil.",
      },
    },

    // Autenticação
    "/auth": {
      post: {
        tags: [tags.auth],
        responses: { "200": { description: "200 OK" } },
        description: "Se autentica na plataforma.",
        ...SwaggerMapper.toDocs(authenticateSchema),
      },
    },
    "/auth/otp": {
      post: {
        tags: [tags.auth],
        responses: { "200": { description: "200 OK" } },
        description:
          "Solicita uma senha aleatória de uso único que é enviada para o email do usuário.",
        ...SwaggerMapper.toDocs(requestOtpSchema),
      },
    },

    // Fazendas
    "/farms": {
      post: {
        tags: [tags.farms],
        responses: { "200": { description: "200 OK" } },
        description: "Cria uma fazenda.",
        ...SwaggerMapper.toDocs(registerFarmSchema),
      },
      get: {
        tags: [tags.farms],
        responses: { "200": { description: "200 OK" } },
        description: "Lista fazendas.",
        ...SwaggerMapper.toDocs(listFarmsSchema),
      },
    },
    "/farms/{farm_id}": {
      patch: {
        tags: [tags.farms],
        responses: { "200": { description: "200 OK" } },
        description: "Atualiza as informações de uma fazenda.",
        ...SwaggerMapper.toDocs(handleFarmStatusSchema),
      },
    },

    // Pedidos
    "/orders": {
      post: {
        tags: [tags.orders],
        responses: { "200": { description: "200 OK" } },
        description:
          "Cria um ou mais pedidos. Se for o primeiro pedido para o produtor no ciclo, cria uma nova caixa. Se for o primeiro pedido do usuário no ciclo, cria uma nova sacola. Pode ser passado o bag_id para adicionar os pedidos a uma sacola já existente. Sempre é buscado uma por uma sacola já existente para as configurações de entrega. Caso encontrado os pedidos são adicionados a essa sacola.",
        ...SwaggerMapper.toDocs(orderProductsSchema),
      },
    },

    // Caixas
    "/boxes": {
      get: {
        tags: [tags.boxes],
        responses: { "200": { description: "200 OK" } },
        description: "Lista caixas.",
        ...SwaggerMapper.toDocs(listBoxesSchema),
      },
    },
    "/boxes/{box_id}": {
      get: {
        tags: [tags.boxes],
        responses: { "200": { description: "200 OK" } },
        description: "Busca as informações de uma caixa.",
        ...SwaggerMapper.toDocs(fetchBoxSchema),
      },
      patch: {
        tags: [tags.boxes],
        responses: { "200": { description: "200 OK" } },
        description: "Atualiza o status de uma caixa.",
        ...SwaggerMapper.toDocs(handleBoxStatusSchema),
      },
    },
    "/boxes/current": {
      get: {
        tags: [tags.boxes],
        responses: { "200": { description: "200 OK" } },
        description: "Busca pela caixa atual da fazenda em um ciclo.",
        ...SwaggerMapper.toDocs(fetchCurrentBoxSchema),
      },
    },

    // Ofertas
    "/offers": {
      post: {
        tags: [tags.offers],
        responses: { "200": { description: "200 OK" } },
        description: "Cria uma oferta.",
        ...SwaggerMapper.toDocs(offerProductsSchema),
      },
    },
    "/offers/{offer_id}": {
      patch: {
        tags: [tags.offers],
        responses: { "200": { description: "200 OK" } },
        description: "Atualiza uma oferta.",
        ...SwaggerMapper.toDocs(updateOfferSchema),
      },
      delete: {
        tags: [tags.offers],
        responses: { "200": { description: "200 OK" } },
        description: "Deleta uma oferta.",
        ...SwaggerMapper.toDocs(deleteOfferSchema),
      },
    },

    // Catálogos
    "/catalogs": {
      get: {
        tags: [tags.catalogs],
        responses: { "200": { description: "200 OK" } },
        description: "Lista catálogos.",
        ...SwaggerMapper.toDocs(searchCatalogsSchema),
      },
    },
    "/catalogs/{catalog_id}": {
      get: {
        tags: [tags.catalogs],
        responses: { "200": { description: "200 OK" } },
        description: "Busca as informações de um catálogo.",
        ...SwaggerMapper.toDocs(fetchCatalogsSchema),
      },
    },
    "/catalogs/last/{cycle_id}": {
      get: {
        tags: [tags.catalogs],
        responses: { "200": { description: "200 OK" } },
        description: "Busca o ultimo catálogo do produtor em um ciclo.",
        ...SwaggerMapper.toDocs(fetchLastCatalogSchema),
      },
    },

    // Sacolas
    "/bags": {
      get: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Lista sacolas.",
        ...SwaggerMapper.toDocs(listBagsSchema),
      },
    },
    "/bags/{bag_id}": {
      get: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Busca as informações de uma sacola.",
        ...SwaggerMapper.toDocs(fetchBagSchema),
      },
      patch: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Atualiza o status de uma sacola.",
        ...SwaggerMapper.toDocs(handleBagSchema),
      },
    },
    "/bags/report/{cycle_id}": {
      get: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Gera o relatório de entrega de sacolas.",
        ...SwaggerMapper.toDocs(printDeliveriesReportSchema),
      },
    },

    // Ciclos
    "/cycles": {
      get: {
        tags: [tags.cycles],
        responses: { "200": { description: "200 OK" } },
        description: "Lista ciclos.",
      },
    },

    // Produtos
    "/products": {
      get: {
        tags: [tags.products],
        responses: { "200": { description: "200 OK" } },
        description: "Lista produtos.",
        ...SwaggerMapper.toDocs(listProductSchema),
      },
    },
  },
});

export { docs };
