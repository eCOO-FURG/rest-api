// Libraries
import j2s, { SwaggerSchema } from "joi-to-swagger";

// Controllers
import { authenticateSchema } from "@/infra/http/controllers/authenticate";
import { deleteFarmImageParams } from "@/infra/http/controllers/delete-farm-image";
import { deleteOfferParams } from "@/infra/http/controllers/delete-offer";
import {
  fetchBagParams,
  fetchBagQuery,
} from "@/infra/http/controllers/fetch-bag";
import {
  fetchBoxParams,
  fetchBoxQuery,
} from "@/infra/http/controllers/fetch-box";
import {
  fetchCatalogParams,
  fetchCatalogQuery,
} from "@/infra/http/controllers/fetch-catalog";
import {
  fetchCategoryParams,
  fetchCategoryQuery,
} from "@/infra/http/controllers/fetch-category";
import { updateWarehouseSchema } from "@/infra/http/controllers/update-warehouse";
import { fetchCurrentBoxQuery } from "@/infra/http/controllers/fetch-current-box";
import {
  fetchCycleCatalogParams,
  fetchCycleCatalogQuery,
} from "@/infra/http/controllers/fetch-cycle-catalog";
import { fetchFarmParams } from "@/infra/http/controllers/fetch-farm";
import { fetchInboundReportQuery } from "@/infra/http/controllers/fetch-inbound-report";
import { fetchPendingsQuery } from "@/infra/http/controllers/fetch-pendings";
import { fetchSalesReportQuery } from "@/infra/http/controllers/fetch-sales-report";
import { fetchSalesStatsQuery } from "@/infra/http/controllers/fetch-sales-stats";
import { listBagsQuery } from "@/infra/http/controllers/list-bags";
import { listBoxesQuery } from "@/infra/http/controllers/list-boxes";
import { listCatalogsQuery } from "@/infra/http/controllers/list-catalogs";
import { listCategoriesQuery } from "@/infra/http/controllers/list-categories";
import { listCurrentBagsQuery } from "@/infra/http/controllers/list-current-bags";
import { listFarmsQuery } from "@/infra/http/controllers/list-farms";
import { listOffersQuery } from "@/infra/http/controllers/list-offers";
import { listProductsQuery } from "@/infra/http/controllers/list-products";
import { openPaymentSchema } from "@/infra/http/controllers/open-payment";
import { registerSchema } from "@/infra/http/controllers/register";
import { registerFarmSchema } from "@/infra/http/controllers/register-farm";
import { registerFarmImageSchema } from "@/infra/http/controllers/register-farm-image";
import { registerOfferSchema } from "@/infra/http/controllers/register-offer";
import { registerOrderSchema } from "@/infra/http/controllers/register-order";
import { registerPaymentSchema } from "@/infra/http/controllers/register-payment";
import { registerProductSchema } from "@/infra/http/controllers/register-product";
import { requestHelpSchema } from "@/infra/http/controllers/request-help";
import { requestOtpSchema } from "@/infra/http/controllers/request-otp";
import { resetPasswordSchema } from "@/infra/http/controllers/reset-password";
import { sendNotificationSchema } from "@/infra/http/controllers/send-notification";
import { updateBagSchema } from "@/infra/http/controllers/update-bag";
import {
  updateFarmParams,
  updateFarmSchema,
} from "@/infra/http/controllers/update-farm";
import {
  updateOfferParams,
  updateOfferSchema,
} from "@/infra/http/controllers/update-offer";
import {
  updateOrderParams,
  updateOrderSchema,
} from "@/infra/http/controllers/update-order";
import {
  updatePaymentParams,
  updatePaymentSchema,
} from "@/infra/http/controllers/update-payment";
import {
  updateProductParams,
  updateProductSchema,
} from "@/infra/http/controllers/update-product";
import { updateUserSchema } from "@/infra/http/controllers/update-user";
import { verifyUserSchema } from "@/infra/http/controllers/verify-user";
import { openPixSchema } from "@/infra/http/webhooks/open-pix";
import { fetchDescriptionSuggestionParams } from "@/infra/http/controllers/fetch-description-suggestion";
import { listUsersQuery } from "@/infra/http/controllers/list-users";

// Schemas
const { swagger: authenticateSchemaSwagger } = j2s(authenticateSchema);
const { swagger: requestOtpSchemaSwagger } = j2s(requestOtpSchema);
const { swagger: resetPasswordSchemaSwagger } = j2s(resetPasswordSchema);
const { swagger: verifyUserSchemaSwagger } = j2s(verifyUserSchema);
const { swagger: registerSchemaSwagger } = j2s(registerSchema);
const { swagger: updateUserSchemaSwagger } = j2s(updateUserSchema);
const { swagger: requestHelpSchemaSwagger } = j2s(requestHelpSchema);
const { swagger: listFarmsQuerySwagger } = j2s(listFarmsQuery);
const { swagger: registerFarmSchemaSwagger } = j2s(registerFarmSchema);
const { swagger: updateFarmSchemaSwagger } = j2s(updateFarmSchema);
const { swagger: registerFarmImageSchemaSwagger } = j2s(
  registerFarmImageSchema,
);
const { swagger: deleteFarmImageParamsSwagger } = j2s(deleteFarmImageParams);
const { swagger: fetchFarmParamsSwagger } = j2s(fetchFarmParams);
const { swagger: updateFarmParamsSwagger } = j2s(updateFarmParams);
const { swagger: registerOrderSchemaSwagger } = j2s(registerOrderSchema);
const { swagger: updateOrderParamsSwagger } = j2s(updateOrderParams);
const { swagger: updateOrderSchemaSwagger } = j2s(updateOrderSchema);
const { swagger: listBoxesQuerySwagger } = j2s(listBoxesQuery);
const { swagger: fetchCurrentBoxQuerySwagger } = j2s(fetchCurrentBoxQuery);
const { swagger: fetchBoxQuerySwagger } = j2s(fetchBoxQuery);
const { swagger: fetchBoxParamsSwagger } = j2s(fetchBoxParams);
const { swagger: registerOfferSchemaSwagger } = j2s(registerOfferSchema);
const { swagger: updateOfferParamsSwagger } = j2s(updateOfferParams);
const { swagger: updateOfferSchemaSwagger } = j2s(updateOfferSchema);
const { swagger: deleteOfferParamsSwagger } = j2s(deleteOfferParams);
const { swagger: listCatalogsQuerySwagger } = j2s(listCatalogsQuery);
const { swagger: fetchCatalogParamsSwagger } = j2s(fetchCatalogParams);
const { swagger: fetchCatalogQuerySwagger } = j2s(fetchCatalogQuery);
const { swagger: listBagsQuerySwagger } = j2s(listBagsQuery);
const { swagger: listCurrentBagsQuerySwagger } = j2s(listCurrentBagsQuery);
const { swagger: fetchBagParamsSwagger } = j2s(fetchBagParams);
const { swagger: fetchBagQuerySwagger } = j2s(fetchBagQuery);
const { swagger: updateBagSchemaSwagger } = j2s(updateBagSchema);
const { swagger: registerPaymentSchemaSwagger } = j2s(registerPaymentSchema);
const { swagger: openPaymentSchemaSwagger } = j2s(openPaymentSchema);
const { swagger: updatePaymentParamsSwagger } = j2s(updatePaymentParams);
const { swagger: updatePaymentSchemaSwagger } = j2s(updatePaymentSchema);
const { swagger: listProductsQuerySwagger } = j2s(listProductsQuery);
const { swagger: registerProductSchemaSwagger } = j2s(registerProductSchema);
const { swagger: updateProductParamsSwagger } = j2s(updateProductParams);
const { swagger: updateProductSchemaSwagger } = j2s(updateProductSchema);
const { swagger: listCategoriesQuerySwagger } = j2s(listCategoriesQuery);
const { swagger: fetchPendingsQuerySwagger } = j2s(fetchPendingsQuery);
const { swagger: fetchSalesStatsQuerySwagger } = j2s(fetchSalesStatsQuery);
const { swagger: fetchSalesReportQuerySwagger } = j2s(fetchSalesReportQuery);
const { swagger: fetchInboundReportQuerySwagger } = j2s(
  fetchInboundReportQuery,
);
const { swagger: fetchCategoryParamsSwagger } = j2s(fetchCategoryParams);
const { swagger: fetchCategoryQuerySwagger } = j2s(fetchCategoryQuery);
const { swagger: sendNotificationSchemaSwagger } = j2s(sendNotificationSchema);
const { swagger: openPixSchemaSwagger } = j2s(openPixSchema);
const { swagger: fetchCycleCatalogQuerySwagger } = j2s(fetchCycleCatalogQuery);
const { swagger: fetchCycleCatalogParamsSwagger } = j2s(
  fetchCycleCatalogParams,
);
const { swagger: listOffersQuerySwagger } = j2s(listOffersQuery);
const { swagger: fetchDescriptionSuggestionParamsSwagger } = j2s(
  fetchDescriptionSuggestionParams,
);
const { swagger: listUsersQuerySwagger } = j2s(listUsersQuery);
const { swagger: updateWarehouseSchemaSwagger } = j2s(updateWarehouseSchema);

const toQueryParams = (query: SwaggerSchema) =>
  Object.entries(query.properties).map(([name, schema]) => ({
    in: "query",
    name,
    required: query.required?.includes(name),
    schema,
  }));

const toRouteParams = (params: SwaggerSchema) =>
  Object.entries(params.properties).map(([name, schema]) => ({
    in: "path",
    name,
    required: true,
    schema,
  }));

export const docs = {
  openapi: "3.0.0",
  info: {
    title: "eCOO",
    version: "2.0.0",
  },
  paths: {
    "/auth": {
      post: {
        tags: ["Autenticação"],
        summary: "Autenticar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: authenticateSchemaSwagger },
          },
        },
        responses: {
          201: {
            description: "Autenticação realizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify": {
      get: {
        tags: ["Autenticação"],
        summary: "Verificar usuário",
        parameters: [
          {
            in: "query",
            schema: verifyUserSchemaSwagger,
          },
        ],
        responses: {
          200: {
            description: "Usuário verificado com sucesso",
          },
        },
      },
    },
    "/auth/otp": {
      post: {
        tags: ["Autenticação"],
        summary: "Solicitar OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: requestOtpSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Senha enviada com sucesso",
          },
        },
      },
    },
    "/auth/password": {
      post: {
        tags: ["Autenticação"],
        summary: "Redefinir senha",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: resetPasswordSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Senha redefinida com sucesso",
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Usuários"],
        summary: "Listar usuários",
        parameters: toQueryParams(listUsersQuerySwagger),
        responses: {
          200: {
            description: "Lista de usuários obtida com sucesso",
          },
        },
      },
      post: {
        tags: ["Usuários"],
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Usuário registrado com sucesso",
          },
        },
      },
    },
    "/me": {
      get: {
        tags: ["Perfil"],
        summary: "Obter perfil do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Perfil obtido com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    first_name: { type: "string" },
                    last_name: { type: "string" },
                    email: { type: "string" },
                    cpf: { type: "string" },
                    phone: { type: "string" },
                    role: { type: "string" },
                    chat: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Perfil"],
        summary: "Atualizar perfil do usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: updateUserSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Perfil atualizado com sucesso",
          },
        },
      },
    },
    "/help": {
      post: {
        tags: ["Ajuda"],
        summary: "Solicitar ajuda",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: requestHelpSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Solicitação de ajuda enviada com sucesso",
          },
        },
      },
    },
    "/farms": {
      get: {
        tags: ["Fazendas"],
        summary: "Listar fazendas",
        parameters: toQueryParams(listFarmsQuerySwagger),
        responses: {
          200: {
            description: "Lista de fazendas obtida com sucesso",
          },
        },
      },
      post: {
        tags: ["Fazendas"],
        summary: "Registrar nova fazenda",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerFarmSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Fazenda registrada com sucesso",
          },
        },
      },
    },
    "/farms/own": {
      get: {
        tags: ["Fazendas"],
        summary: "Obter fazenda do usuário",
        responses: {
          200: {
            description: "Fazenda do usuário obtida com sucesso",
          },
        },
      },
    },
    "/farms/{farm_id}": {
      get: {
        tags: ["Fazendas"],
        summary: "Obter fazenda específica",
        parameters: toRouteParams(fetchFarmParamsSwagger),
        responses: {
          200: {
            description: "Fazenda obtida com sucesso",
          },
        },
      },
      patch: {
        tags: ["Fazendas"],
        summary: "Atualizar fazenda",
        parameters: toRouteParams(updateFarmParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: updateFarmSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Fazenda atualizada com sucesso",
          },
        },
      },
    },
    "/farms/{farm_id}/images": {
      post: {
        tags: ["Fazendas"],
        summary: "Adicionar imagem à fazenda",
        parameters: toRouteParams(fetchFarmParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: registerFarmImageSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Imagem adicionada com sucesso",
          },
        },
      },
    },
    "/farms/{farm_id}/images/{image_url}": {
      delete: {
        tags: ["Fazendas"],
        summary: "Remover imagem da fazenda",
        parameters: toRouteParams(deleteFarmImageParamsSwagger),
        responses: {
          204: {
            description: "Imagem removida com sucesso",
          },
        },
      },
    },
    "/orders": {
      post: {
        tags: ["Pedidos"],
        summary: "Registrar novo pedido",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerOrderSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Pedido registrado com sucesso",
          },
        },
      },
    },
    "/orders/{order_id}": {
      patch: {
        tags: ["Pedidos"],
        summary: "Atualizar pedido",
        parameters: [
          ...toRouteParams(updateOrderParamsSwagger),
          ...toQueryParams(updateOrderSchemaSwagger),
        ],
      },
    },
    "/boxes": {
      get: {
        tags: ["Caixas"],
        summary: "Listar caixas",
        parameters: toQueryParams(listBoxesQuerySwagger),
        responses: {
          200: {
            description: "Lista de caixas obtida com sucesso",
          },
        },
      },
    },
    "/boxes/current": {
      get: {
        tags: ["Caixas"],
        summary: "Obter caixa atual",
        parameters: toQueryParams(fetchCurrentBoxQuerySwagger),
        responses: {
          200: {
            description: "Caixa atual obtida com sucesso",
          },
        },
      },
    },
    "/boxes/{box_id}": {
      get: {
        tags: ["Caixas"],
        summary: "Obter caixa específica",
        parameters: [
          ...toRouteParams(fetchBoxParamsSwagger),
          ...toQueryParams(fetchBoxQuerySwagger),
        ],
        responses: {
          200: {
            description: "Caixa obtida com sucesso",
          },
        },
      },
    },
    "/offers": {
      get: {
        tags: ["Ofertas"],
        summary: "Listar ofertas disponíveis",
        parameters: toQueryParams(listOffersQuerySwagger),
        responses: {
          200: {
            description: "Lista de ofertas disponíveis obtida com sucesso",
          },
        },
      },
      post: {
        tags: ["Ofertas"],
        summary: "Registrar nova oferta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerOfferSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Oferta registrada com sucesso",
          },
        },
      },
    },

    "/offers/{offer_id}": {
      patch: {
        tags: ["Ofertas"],
        summary: "Atualizar oferta",
        parameters: toRouteParams(updateOfferParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: updateOfferSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Oferta atualizada com sucesso",
          },
        },
      },

      delete: {
        tags: ["Ofertas"],
        summary: "Remover oferta",
        parameters: toRouteParams(deleteOfferParamsSwagger),
        responses: {
          204: {
            description: "Oferta removida com sucesso",
          },
        },
      },
    },
    "/catalogs": {
      get: {
        tags: ["Catálogos"],
        summary: "Listar catálogos",
        parameters: toQueryParams(listCatalogsQuerySwagger),
        responses: {
          200: {
            description: "Lista de catálogos obtida com sucesso",
          },
        },
      },
    },
    "/catalogs/{catalog_id}": {
      get: {
        tags: ["Catálogos"],
        summary: "Obter catálogo específico",
        parameters: [
          ...toRouteParams(fetchCatalogParamsSwagger),
          ...toQueryParams(fetchCatalogQuerySwagger),
        ],
        responses: {
          200: {
            description: "Catálogo obtido com sucesso",
          },
        },
      },
    },
    "/bags": {
      get: {
        tags: ["Sacolas"],
        summary: "Listar sacolas",
        parameters: toQueryParams(listBagsQuerySwagger),
        responses: {
          200: {
            description: "Lista de sacolas obtida com sucesso",
          },
        },
      },
    },
    "/bags/current": {
      get: {
        tags: ["Sacolas"],
        summary: "Listar sacolas atuais",
        parameters: toQueryParams(listCurrentBagsQuerySwagger),
        responses: {
          200: {
            description: "Lista de sacolas atuais obtida com sucesso",
          },
        },
      },
    },
    "/bags/{bag_id}": {
      get: {
        tags: ["Sacolas"],
        summary: "Obter sacola específica",
        parameters: [
          ...toRouteParams(fetchBagParamsSwagger),
          ...toQueryParams(fetchBagQuerySwagger),
        ],
        responses: {
          200: {
            description: "Sacola obtida com sucesso",
          },
        },
      },
      patch: {
        tags: ["Sacolas"],
        summary: "Atualizar sacola",
        parameters: toRouteParams(fetchBagParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: updateBagSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Sacola atualizada com sucesso",
          },
        },
      },
    },
    "/payments": {
      post: {
        tags: ["Pagamentos"],
        summary: "Registrar pagamento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerPaymentSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Pagamento registrado com sucesso",
          },
        },
      },
    },
    "/payments/open": {
      post: {
        tags: ["Pagamentos"],
        summary: "Abrir pagamento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: openPaymentSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Pagamento aberto com sucesso",
          },
        },
      },
    },
    "/payments/{payment_id}": {
      patch: {
        tags: ["Pagamentos"],
        summary: "Atualizar pagamento",
        parameters: toRouteParams(updatePaymentParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: updatePaymentSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Pagamento atualizado com sucesso",
          },
        },
      },
    },
    "/cycles": {
      get: {
        tags: ["Ciclos"],
        summary: "Listar ciclos",
        responses: {
          200: {
            description: "Lista de ciclos obtida com sucesso",
          },
        },
      },
    },
    "/cycles/{cycle_id}/catalog": {
      get: {
        tags: ["Ciclos"],
        summary: "Obter catálogo do ciclo",
        parameters: [
          ...toRouteParams(fetchCycleCatalogParamsSwagger),
          ...toQueryParams(fetchCycleCatalogQuerySwagger),
        ],
      },
    },
    "/products": {
      get: {
        tags: ["Produtos"],
        summary: "Listar produtos",
        parameters: toQueryParams(listProductsQuerySwagger),
        responses: {
          200: {
            description: "Lista de produtos obtida com sucesso",
          },
        },
      },
      post: {
        tags: ["Produtos"],
        summary: "Registrar produto",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: registerProductSchemaSwagger,
            },
          },
        },
        responses: {
          201: {
            description: "Produto registrado com sucesso",
          },
        },
      },
    },
    "/products/{product_id}": {
      get: {
        tags: ["Produtos"],
        summary: "Gera a descrição de um produto",
        parameters: toRouteParams(fetchDescriptionSuggestionParamsSwagger),
      },
      patch: {
        tags: ["Produtos"],
        summary: "Atualizar produto",
        parameters: toRouteParams(updateProductParamsSwagger),
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: updateProductSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado com sucesso",
          },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categorias"],
        summary: "Listar categorias",
        parameters: toQueryParams(listCategoriesQuerySwagger),
        responses: {
          200: {
            description: "Lista de categorias obtida com sucesso",
          },
        },
      },
    },
    "/categories/{category_id}": {
      get: {
        tags: ["Categorias"],
        summary: "Obter categoria específica",
        parameters: [
          ...toRouteParams(fetchCategoryParamsSwagger),
          ...toQueryParams(fetchCategoryQuerySwagger),
        ],
        responses: {
          200: {
            description: "Categoria obtida com sucesso",
          },
        },
      },
    },
    "/pendings": {
      get: {
        tags: ["Pendências"],
        summary: "Obter pendências",
        parameters: toQueryParams(fetchPendingsQuerySwagger),
        responses: {
          200: {
            description: "Lista de pendências obtida com sucesso",
          },
        },
      },
    },
    "/stats": {
      get: {
        tags: ["Estatísticas"],
        summary: "Obter estatísticas de vendas",
        parameters: toQueryParams(fetchSalesStatsQuerySwagger),
        responses: {
          200: {
            description: "Estatísticas obtidas com sucesso",
          },
        },
      },
    },
    "/notifications": {
      post: {
        tags: ["Notificações"],
        summary: "Enviar notificação",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: sendNotificationSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Notificação enviada com sucesso",
          },
        },
      },
    },
    "/webhooks/open-pix": {
      post: {
        tags: ["Webhooks"],
        summary: "Webhook do OpenPix",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: openPixSchemaSwagger,
            },
          },
        },
        responses: {
          200: {
            description: "Webhook processado com sucesso",
          },
        },
      },
    },

    "/reports/sales": {
      get: {
        tags: ["Relatórios"],
        summary: "Obter relatório de vendas",
        parameters: toQueryParams(fetchSalesReportQuerySwagger),
        responses: {
          200: {
            description: "Relatório de vendas gerado com sucesso",
            content: {
              "application/pdf": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                {
                  schema: {
                    type: "string",
                    format: "binary",
                  },
                },
            },
          },
        },
      },
    },
    "/reports/inbound": {
      get: {
        tags: ["Relatórios"],
        summary: "Obter relatório de entrada",
        parameters: toQueryParams(fetchInboundReportQuerySwagger),
        responses: {
          200: {
            description: "Relatório de entrada gerado com sucesso",
            content: {
              "application/pdf": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
    },
    "/warehouse": {
      get: {
        tags: ["Armazém"],
        summary: "Obter informações do armazém",
        responses: {
          200: {
            description: "Informações do armazém obtidas com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    CNPJ: { type: "string" },
                    manager: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    socials: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          platform: { type: "string" },
                          value: { type: "string" },
                        },
                      },
                    },
                    address: {
                      type: "object",
                      properties: {
                        CEP: { type: "string" },
                        street: { type: "string" },
                        number: { type: "string" },
                        neighborhood: { type: "string" },
                        complement: { type: "string" },
                        city: { type: "string" },
                        state: { type: "string" },
                        link: { type: "string" },
                      },
                    },
                    coverage: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Armazém"],
        summary: "Atualizar informações do armazém",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: updateWarehouseSchemaSwagger,
            },
          },
        },
        responses: {
          204: {
            description: "Informações do armazém atualizadas com sucesso",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-KEY",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
    {
      apiKey: [],
    },
  ],
};
