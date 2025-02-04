// Libraries
import { createDocument } from "zod-openapi";

// Mappers
import { SwaggerMapper } from "@/infra/docs/swagger-mapper";

// Schemas
import { authenticateSchema } from "@/infra/http/controllers/authenticate";
import { createOfferSchema } from "@/infra/http/controllers/create-offer";
import { fetchBagSchema } from "@/infra/http/controllers/fetch-bag";
import { fetchBoxSchema } from "@/infra/http/controllers/fetch-box";
import { fetchCatalogsSchema } from "@/infra/http/controllers/fetch-catalog";
import { fetchCurrentBoxSchema } from "@/infra/http/controllers/fetch-current-box";
import { fetchCurrentCatalogSchema } from "@/infra/http/controllers/fetch-current-catalog";
import { fetchLastCatalogSchema } from "@/infra/http/controllers/fetch-last-catalog";
import { fetchPendingsSchema } from "@/infra/http/controllers/fetch-pendings";
import { handleBagSchema } from "@/infra/http/controllers/handle-bag";
import { handleBoxSchema } from "@/infra/http/controllers/handle-box";
import { handleFarmSchema } from "@/infra/http/controllers/handle-farm";
import { listBagsSchema } from "@/infra/http/controllers/list-bags";
import { listBoxesSchema } from "@/infra/http/controllers/list-boxes";
import { listCatalogsSchema } from "@/infra/http/controllers/list-catalogs";
import { listCategoriesSchema } from "@/infra/http/controllers/list-categories";
import { listCurrentBagsSchema } from "@/infra/http/controllers/list-current-bags";
import { listFarmsSchema } from "@/infra/http/controllers/list-farms";
import { listOwnBagsSchema } from "@/infra/http/controllers/list-own-bags";
import { listProductSchema } from "@/infra/http/controllers/list-products";
import { openPaymentSchema } from "@/infra/http/controllers/open-payment";
import { orderProductsSchema } from "@/infra/http/controllers/order-products";
import { registerSchema } from "@/infra/http/controllers/register";
import { registerFarmSchema } from "@/infra/http/controllers/register-farm";
import { registerPaymentSchema } from "@/infra/http/controllers/register-payment";
import { registerProductSchema } from "@/infra/http/controllers/register-product";
import { requestOtpSchema } from "@/infra/http/controllers/request-otp";
import { requestPasswordUpdateSchema } from "@/infra/http/controllers/request-password-update";
import { sendNotificationSchema } from "@/infra/http/controllers/send-notification";
import { updateCatalogSchema } from "@/infra/http/controllers/update-catalog";
import { updateFarmSchema } from "@/infra/http/controllers/update-farm";
import { updateProductSchema } from "@/infra/http/controllers/update-product";
import { updateUserSchema } from "@/infra/http/controllers/update-user";
import { verifyUserSchema } from "@/infra/http/controllers/verify-user";
import { fetchSalesReportSchema } from "@/infra/http/controllers/fetch-sales-report";

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
  categories: "Categorias",
  payments: "Pagamentos",
  pendings: "Pendências",
  stats: "Estatísticas",
  notifications: "Notificações",
};

const docs = createDocument({
  openapi: "3.0.0",
  info: {
    title: "eCOO API",
    version: "1.0.0",
    description: "Documentação de API - eCOO",
  },
  tags: Object.values(tags).map((tag) => ({ name: tag })),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // Usuários
    "/users": {
      post: {
        tags: [tags.users],
        responses: {
          "201": { description: "Usuário criado com sucesso." },
          "403": {
            description:
              "Já existe um usuário com o email informado: email-already-exists OU já exite um usuário com o telefone informado: phone-already-exists OU já existe um usuário com o cpf informado: cpf-already-exists",
          },
        },
        description: "Cria um usuário.",
        ...SwaggerMapper.toDocs(registerSchema),
      },
      patch: {
        tags: [tags.users],
        responses: {
          "204": { description: "Usuário atualizado com sucesso." },
          "404": { description: "Usuário não encontrado: user-not-found" },
        },
        description: "Atualiza o usuário.",
        ...SwaggerMapper.toDocs(updateUserSchema),
      },
    },
    "/me/verify": {
      get: {
        tags: [tags.users],
        responses: {
          "301": {
            description:
              "Usuário foi verificado com sucesso, será redirecionado",
          },
          "403": {
            description: "Usuário já está verificado: user-already-verified",
          },
          "404": { description: "Usuário não encontrado: user-not-found" },
        },
        description: "Verifica um usuário.",
        ...SwaggerMapper.toDocs(verifyUserSchema),
      },
    },
    "/me/password": {
      post: {
        tags: [tags.users],
        responses: {
          "200": {
            description:
              "Solicitação de recuperação de senha enviada com sucesso",
          },
          "404": { description: "Usuário não encontrado: user-not-found" },
        },
        description:
          "Solicita a recuperação de senha. Se o usuário existir, ele recebe um email com um link para essa atualização.",
        ...SwaggerMapper.toDocs(requestPasswordUpdateSchema),
      },
    },
    "/me": {
      get: {
        tags: [tags.users],
        responses: {
          "200": { description: "Informações encontradas com sucesso" },
          "404": { description: "Usuário não encontrado: user-not-found" },
        },
        description: "Busca as informações do próprio perfil.",
      },
    },

    // Autenticação
    "/auth": {
      post: {
        tags: [tags.auth],
        responses: {
          "201": { description: "Sessião criada com sucesso." },
          "400": { description: "Credenciais incorretas: wrong-credentials" },
          "403": {
            description:
              "O usuário não tem uma senha definida: empty-password OU o usuário não está verificado: user-not-verified",
          },
        },
        description: "Se autentica na plataforma.",
        ...SwaggerMapper.toDocs(authenticateSchema),
      },
    },
    "/auth/otp": {
      post: {
        tags: [tags.auth],
        responses: {
          "201": { description: "Soliciatação de OTP enviada com sucesso." },
          "404": { description: "Usuário não encontrado: user-not-found" },
        },
        description:
          "Solicita uma senha aleatória de uso único que é enviada para o email do usuário.",
        ...SwaggerMapper.toDocs(requestOtpSchema),
      },
    },

    // Fazendas
    "/farms": {
      post: {
        tags: [tags.farms],
        summary: "Cria uma fazenda.",
        description: "Cria uma fazenda com os dados fornecidos.",
        responses: {
          "201": {
            description: "Fazenda criada com sucesso.",
          },
          "403": {
            description:
              "Já existe uma fazenda com o Número do Talão informado: tally-already-exists OU já existe uma fazenda para o usuário informado: farm-already-exists",
          },
          "404": {
            description: "Usuário não encontrado: user-not-found",
          },
        },
        ...SwaggerMapper.toDocs(registerFarmSchema),
      },
      get: {
        tags: [tags.farms],
        responses: {
          "200": { description: "Fazendas encontradas com sucesso." },
        },
        description: "Lista fazendas.",
        ...SwaggerMapper.toDocs(listFarmsSchema),
      },
    },
    "/farms/{farm_id}": {
      get: {
        tags: [tags.farms],
        responses: {
          "200": { description: "Fazenda encontrada com sucesso." },
          "404": { description: "Fazenda não encontrada: farm-not-found" },
        },
        description: "Busca as informações de uma fazenda específica.",
      },
    },
    "/farms/{farm_id}/handle": {
      patch: {
        tags: [tags.farms],
        responses: {
          "204": { description: "Status da fazenda atualizado com sucesso." },
          "404": { description: "Fazenda não encontrada: farm-not-found" },
        },
        description:
          "Atualiza o status de uma fazenda. Por padrão, toda fazenda é criada com o status PENDING. Podendo ser alterado para ACTIVE ou INACTIVE.",
        ...SwaggerMapper.toDocs(handleFarmSchema),
      },
    },
    "/farms/own": {
      get: {
        tags: [tags.farms],
        responses: {
          "200": { description: "Fazenda encontrada com sucesso." },
        },
        description: "Busca a fazenda do usuário logado.",
      },
      patch: {
        tags: [tags.farms],
        responses: {
          "204": { description: "Fazenda atualizada com sucesso." },
          "404": { description: "Fazenda não encontrada: farm-not-found" },
        },
        description: "Atualiza a fazenda do usuário logado.",
        ...SwaggerMapper.toDocs(updateFarmSchema),
      },
    },
    // Caixas
    "/boxes": {
      get: {
        tags: [tags.boxes],
        responses: {
          "200": { description: "Caixas encontradas com sucesso." },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Lista caixas.",
        ...SwaggerMapper.toDocs(listBoxesSchema),
      },
    },
    "/boxes/{box_id}": {
      get: {
        tags: [tags.boxes],
        responses: {
          "200": { description: "Caixa encontrada com sucesso." },
          "404": { description: "Caixa não encontrada: box-not-found" },
        },
        description: "Busca as informações de uma caixa.",
        ...SwaggerMapper.toDocs(fetchBoxSchema),
      },
    },
    "/boxes/{box_id}/handle": {
      patch: {
        tags: [tags.boxes],
        responses: {
          "204": { description: "Status da caixa atualizado com sucesso." },
          "404": { description: "Caixa não encontrada: box-not-found" },
        },
        description: "Atualiza o status de uma caixa.",
        ...SwaggerMapper.toDocs(handleBoxSchema),
      },
    },
    "/boxes/current": {
      get: {
        tags: [tags.boxes],
        responses: {
          "200": { description: "Caixa atual encontrada com sucesso." },
          "404": {
            description:
              "Ciclo não encontrado: cycle-not-found OU Caixa da Fazenda não encontrada: box-not-found",
          },
        },
        description: "Busca pela caixa atual da fazenda em um ciclo.",
        ...SwaggerMapper.toDocs(fetchCurrentBoxSchema),
      },
    },

    // Catálogos
    "/catalogs": {
      get: {
        tags: [tags.catalogs],
        responses: {
          "200": { description: "Catatálogos encontrados com sucesso." },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Lista catálogos.",
        ...SwaggerMapper.toDocs(listCatalogsSchema),
      },
      post: {
        tags: [tags.offers],
        responses: {
          "201": { description: "Oferta criada com sucesso." },
          "400": {
            description:
              "Peso informado de um produto é inválido: invalid-weight",
          },
          "403": {
            description:
              "Fazenda não está ativo: farm-not-active OU não é possivel ofertar produtos hoje: resource-closed",
          },
          "404": {
            description:
              "Fazenda não encontrado: farm-not-found OU Produto não encontrado: product-not-found OU Ciclo não encontrado: cycle-not-found",
          },
        },
        description: "Cria uma oferta.",
        ...SwaggerMapper.toDocs(createOfferSchema),
      },
    },
    "/catalogs/{catalog_id}": {
      get: {
        tags: [tags.catalogs],
        responses: {
          "200": { description: "Catálogo encontrado com sucesso." },
          "404": { description: "Catálogo não encontrado: catalog-not-found" },
        },
        description: "Busca as informações de um catálogo.",
        ...SwaggerMapper.toDocs(fetchCatalogsSchema),
      },
    },
    "/catalogs/last": {
      get: {
        tags: [tags.catalogs],
        responses: {
          "200": { description: "Ultimo catálogo encontrado com sucesso." },
          "404": {
            description:
              "Ciclo não encontrado: cycle-not-found OU Fazenda não encontrada: farm-not-found OU Catálogo não encontrado: catalog-not-found",
          },
        },
        description: "Busca o ultimo catálogo do produtor em um ciclo.",
        ...SwaggerMapper.toDocs(fetchLastCatalogSchema),
      },
    },
    "/catalogs/current": {
      get: {
        tags: [tags.catalogs],
        responses: {
          "200": { description: "Catálogo atual encontrado com sucesso." },
          "404": {
            description:
              "Ciclo não encontrado: cycle-not-found OU Fazenda não encontrada: farm-not-found OU Catálogo não encontrado: catalog-not-found",
          },
        },
        description: "Busca o catálogo atual do produtor em um ciclo.",
        ...SwaggerMapper.toDocs(fetchCurrentCatalogSchema),
      },
      patch: {
        tags: [tags.catalogs],
        responses: {
          "200": { description: "Catálogo atual encontrado com sucesso." },
          "403": {
            description:
              "Não é possivel ofertar produtos hoje: resource-closed",
          },
          "404": {
            description:
              "Ciclo não encontrado: cycle-not-found OU Catálogo não encontrado: catalog-not-found OU Fazenda não encontrada: farm-not-found",
          },
        },
        description: "Atualiza o catálogo do produtor em um ciclo.",
        ...SwaggerMapper.toDocs(updateCatalogSchema),
      },
    },

    // Sacolas
    "/bags": {
      get: {
        tags: [tags.bags],
        responses: {
          "200": { description: "Sacolas encontradas com sucesso." },
        },
        description: "Lista sacolas do período atual de um ciclo.",
        ...SwaggerMapper.toDocs(listBagsSchema),
      },
      post: {
        tags: [tags.orders],
        responses: {
          "201": { description: "Pedido criado com sucesso." },
          "400": {
            description:
              "Peso informado de um produto é inválido: invalid-weight",
          },
          "404": {
            description:
              "Usuário não encontrado: user-not-found OU Ciclo não encontrado: cycle-not-found OU Oferta não encontrada: offer-not-found OU Catálogo não encontrado: catalog-not-found",
          },
          "409": {
            description:
              "Quantidade indisponível de uma oferta: unavailable-amount",
          },
        },
        description:
          "Cria um ou mais pedidos. Se for o primeiro pedido para o produtor no ciclo, cria uma nova caixa. Se for o primeiro pedido do usuário no ciclo, cria uma nova sacola. Pode ser passado o bag_id para adicionar os pedidos a uma sacola já existente. Sempre é buscado uma por uma sacola já existente para as configurações de entrega. Caso encontrado os pedidos são adicionados a essa sacola.",
        ...SwaggerMapper.toDocs(orderProductsSchema),
      },
    },
    "/bags/current": {
      get: {
        tags: [tags.bags],
        responses: {
          "200": { description: "Sacolas encontradas com sucesso." },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Lista sacolas do período atual de um ciclo.",
        ...SwaggerMapper.toDocs(listCurrentBagsSchema),
      },
    },
    "/bags/{bag_id}": {
      get: {
        tags: [tags.bags],
        responses: {
          "200": { description: "Sacola encontrada com sucesso." },
          "404": { description: "Sacola não encontrada: bag-not-found" },
        },
        description: "Busca as informações de uma sacola.",
        ...SwaggerMapper.toDocs(fetchBagSchema),
      },
      patch: {
        tags: [tags.bags],
        responses: {
          "204": { description: "Sacola atualizada com sucesso." },
          "404": { description: "Sacola não encontrada: bag-not-found" },
        },
        description: "Atualiza o status sacola.",
        ...SwaggerMapper.toDocs(handleBagSchema),
      },
    },
    "/reports": {
      get: {
        tags: [tags.bags],
        responses: {
          "200": {
            description: "Relatório de entrega de sacolas gerado com sucesso.",
          },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Gera o relatório de sacolas.",
        ...SwaggerMapper.toDocs(fetchSalesReportSchema),
      },
    },
    "/bags/own": {
      get: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Lista as sacolas do usuário a partir da data fornecida.",
        ...SwaggerMapper.toDocs(listOwnBagsSchema),
      },
    },
    "/bags/{bag_id}/pay": {
      post: {
        tags: [tags.payments],
        responses: {
          "200": { description: "Pagamento aberto com sucesso." },
          "404": { description: "Sacola não encontrada: bag-not-found" },
          "403": {
            description:
              "Pagamento para a sacola já foi realizado: payment-already-exists",
          },
        },
        ...SwaggerMapper.toDocs(openPaymentSchema),
        description: "Abre um pagamento para uma sacola.",
      },
    },
    "/bags/{bag_id}/handle": {
      patch: {
        tags: [tags.bags],
        responses: { "204": { description: "204 OK" } },
        description:
          "Atualiza o status de uma sacola ou pagamentos de uma sacola.",
        ...SwaggerMapper.toDocs(handleBagSchema),
      },
    },
    "/bags/{bag_id}/open": {
      post: {
        tags: [tags.payments],
        responses: {
          "200": { description: "Pagamento iniciado com sucesso." },
          "404": { description: "Sacola não encontrada: bag-not-found" },
        },
        description: "Inicia o processo de pagamento para uma sacola.",
      },
    },

    // Ciclos
    "/cycles": {
      get: {
        tags: [tags.cycles],
        responses: {
          "200": { description: "Ciclos encontrados com sucesso." },
        },
        description: "Lista ciclos.",
      },
    },

    // Produtos
    "/products": {
      get: {
        tags: [tags.products],
        responses: {
          "200": { description: "Produtos encontrados com sucesso." },
        },
        description: "Lista produtos.",
        ...SwaggerMapper.toDocs(listProductSchema),
      },
      post: {
        tags: [tags.products],
        responses: { "201": { description: "201 OK" } },
        description: "Registra um produto.",
        ...SwaggerMapper.toDocs(registerProductSchema),
      },
    },

    "/products/{product_id}": {
      patch: {
        tags: [tags.products],
        responses: { "204": { description: "204 OK" } },
        description: "Atualiza um produto.",
        ...SwaggerMapper.toDocs(updateProductSchema),
      },
    },

    // Categorias
    "/categories": {
      get: {
        tags: [tags.categories],
        responses: {
          "200": { description: "Categorias encontradas com sucesso." },
        },
        description: "Lista categorias.",
        ...SwaggerMapper.toDocs(listCategoriesSchema),
      },
    },

    // Pagamentos
    "/payments": {
      post: {
        tags: [tags.payments],
        responses: {
          "201": { description: "Pagamento registrado com sucesso" },
          "404": { description: "Sacola não encontrada: bag-not-found" },
          "403": {
            description:
              "Pagamento para a sacola já foi realizado: payment-already-exists",
          },
        },
        description: "Registra um pagamento.",
        ...SwaggerMapper.toDocs(registerPaymentSchema),
      },
    },

    // Pendências
    "/pendings": {
      get: {
        tags: [tags.pendings],
        responses: {
          "200": { description: "Pendências encontradas com sucesso." },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Busca as pendências de um ciclo.",
        ...SwaggerMapper.toDocs(fetchPendingsSchema),
      },
    },

    // Estatísticas
    "/stats": {
      get: {
        tags: [tags.stats],
        responses: { "200": { description: "200 OK" } },
        description: "Busca as estatísticas de vendas.",
      },
    },

    // Notificações
    "/notifications": {
      post: {
        tags: [tags.notifications],
        responses: { "204": { description: "204 OK" } },
        description: "Envia uma notificação para um usuário.",
        ...SwaggerMapper.toDocs(sendNotificationSchema),
      },
    },
  },
});

export { docs };
