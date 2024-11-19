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
import { fetchBagSchema } from "@/infra/http/controllers/fetch-bag";
import { handleBagSchema } from "@/infra/http/controllers/handle-bag";
import { printDeliveriesReportSchema } from "@/infra/http/controllers/print-deliveries-report";
import { listProductSchema } from "@/infra/http/controllers/list-products";
import { fetchCurrentBoxSchema } from "@/infra/http/controllers/fetch-current-box";
import { requestPasswordUpdateSchema } from "@/infra/http/controllers/request-password-update";
import { fetchCurrentCatalogSchema } from "@/infra/http/controllers/fetch-current-catalog";
import { listCurrentBagsSchema } from "@/infra/http/controllers/list-current-bags";
import { listUserBagsSchema } from "@/infra/http/controllers/list-user-bags";
import { registerPaymentSchema } from "@/infra/http/controllers/register-payment";
import { updatePaymentSchema } from "@/infra/http/controllers/update-payment";
import { openPaymentSchema } from "@/infra/http/controllers/open-payment";
import { updateFarmSchema } from "@/infra/http/controllers/update-farm";

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
  payments: "Pagamentos",
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
    "/users/verify": {
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
    "/users/password": {
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
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome da fazenda.",
                  },
                  tally: {
                    type: "string",
                    description: "Número do Talão da fazenda.",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Imagem representativa da fazenda.",
                  },
                },
                required: ["name", "tally"],
              },
            },
          },
        },
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
      },
      patch: {
        tags: [tags.farms],
        responses: {
          "204": { description: "Fazenda atualizada com sucesso." },
          "404": { description: "Fazenda não encontrada: farm-not-found" },
        },
        description: "Atualiza a fazenda do usuário.",
        ...SwaggerMapper.toDocs(updateFarmSchema),
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
      patch: {
        tags: [tags.farms],
        responses: {
          "204": { description: "Status da fazenda atualizado com sucesso." },
          "404": { description: "Fazenda não encontrada: farm-not-found" },
        },
        description:
          "Atualiza o status de uma fazenda. Por padrão, toda fazenda é criada com o status PENDING. Podendo ser alterado para ACTIVE ou INACTIVE.",
        ...SwaggerMapper.toDocs(handleFarmStatusSchema),
      },
    },

    // Pedidos
    "/orders": {
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
      patch: {
        tags: [tags.boxes],
        responses: {
          "204": { description: "Caixa atualizada com sucesso." },
          "404": { description: "Caixa não encontrada: box-not-found" },
        },
        description: "Atualiza o status de uma caixa.",
        ...SwaggerMapper.toDocs(handleBoxStatusSchema),
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

    // Ofertas
    "/offers": {
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
              "Fazenda não está ativo: farm-not-active OU não é possivel ofertar produtos hoje: closed-action",
          },
          "404": {
            description:
              "Fazenda não encontrado: farm-not-found OU Produto não encontrado: product-not-found OU Ciclo não encontrado: cycle-not-found",
          },
        },
        description: "Cria uma oferta.",
        ...SwaggerMapper.toDocs(offerProductsSchema),
      },
    },
    "/offers/{offer_id}": {
      patch: {
        tags: [tags.offers],
        responses: {
          "204": { description: "Oferta atualizada com sucesso." },
          "403": {
            description: "Não é possivel ofertar produtos hoje: closed-action",
          },
          "404": {
            description:
              "Fazenda não encontrado: farm-not-found OU Oferta não encontrada: offer-not-found OU Catálogo não encontrado: catalog-not-found OU Ciclo não encontrado: cycle-not-found",
          },
        },
        description: "Atualiza uma oferta.",
        ...SwaggerMapper.toDocs(updateOfferSchema),
      },
      delete: {
        tags: [tags.offers],
        responses: {
          "204": { description: "Oferta deletada com sucesso." },
          "403": { description: "Não autorizado: unauthorized" },
          "404": {
            description:
              "Fazenda não encontrado: farm-not-found OU Oferta não encontrada: offer-not-found OU Catálogo não encontrado: catalog-not-found",
          },
        },
        description: "Deleta uma oferta.",
        ...SwaggerMapper.toDocs(deleteOfferSchema),
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
        ...SwaggerMapper.toDocs(searchCatalogsSchema),
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
    "/catalogs/last/{cycle_id}": {
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
    "/catalogs/current/{cycle_id}": {
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
    },

    // Sacolas
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
        description: "Atualiza o status de uma sacola.",
        ...SwaggerMapper.toDocs(handleBagSchema),
      },
    },
    "/bags/report/{cycle_id}": {
      get: {
        tags: [tags.bags],
        responses: {
          "200": {
            description: "Relatório de entrega de sacolas gerado com sucesso.",
          },
          "404": { description: "Ciclo não encontrado: cycle-not-found" },
        },
        description: "Gera o relatório de entrega de sacolas.",
        ...SwaggerMapper.toDocs(printDeliveriesReportSchema),
      },
    },
    "/me/bags": {
      get: {
        tags: [tags.bags],
        responses: { "200": { description: "200 OK" } },
        description: "Lista as sacolas do usuário a partir da data fornecida.",
        ...SwaggerMapper.toDocs(listUserBagsSchema),
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

    "/payments/{payment_id}": {
      patch: {
        tags: [tags.payments],
        responses: {
          "200": { description: "Pagamento atualizado com sucesso." },
          "404": { description: "Pagamento não encontrado: payment-not-found" },
        },
        ...SwaggerMapper.toDocs(updatePaymentSchema),
      },
    },

    "/payments/open": {
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
      },
    },
  },
});

export { docs };
