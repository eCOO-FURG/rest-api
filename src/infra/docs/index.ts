// Libraries
import j2s, { SwaggerSchema } from "joi-to-swagger";

// Controllers
import { authenticateSchema } from "@/infra/http/controllers/authenticate";
import { requestOtpSchema } from "@/infra/http/controllers/request-otp";
import { resetPasswordSchema } from "@/infra/http/controllers/reset-password";
import { verifyUserSchema } from "@/infra/http/controllers/verify-user";
import { registerSchema } from "@/infra/http/controllers/register";
import { updateUserSchema } from "@/infra/http/controllers/update-user";
import { requestHelpSchema } from "@/infra/http/controllers/request-help";
import { listFarmsQuery } from "@/infra/http/controllers/list-farms";
import { registerFarmSchema } from "@/infra/http/controllers/register-farm";
import { registerFarmImageSchema } from "@/infra/http/controllers/register-farm-image";
import { updateFarmSchema } from "@/infra/http/controllers/update-farm";
import { deleteFarmImageParams } from "@/infra/http/controllers/delete-farm-image";
import { fetchFarmParams } from "@/infra/http/controllers/fetch-farm";
import { updateFarmParams } from "@/infra/http/controllers/update-farm";
import { registerOrderSchema } from "@/infra/http/controllers/register-order";
import { listBoxesQuery } from "@/infra/http/controllers/list-boxes";
import { fetchCurrentBoxQuery } from "@/infra/http/controllers/fetch-current-box";
import {
  fetchBoxParams,
  fetchBoxQuery,
} from "@/infra/http/controllers/fetch-box";
import { registerOfferSchema } from "@/infra/http/controllers/register-offer";
import { listCatalogsQuery } from "@/infra/http/controllers/list-catalogs";
import { fetchCurrentCatalogQuery } from "@/infra/http/controllers/fetch-current-catalog";
import { fetchLastCatalogQuery } from "@/infra/http/controllers/fetch-last-catalog";
import { fetchCatalogParams } from "@/infra/http/controllers/fetch-catalog";
import { fetchCatalogQuery } from "@/infra/http/controllers/fetch-catalog";
import { listBagsQuery } from "@/infra/http/controllers/list-bags";
import { listCurrentBagsQuery } from "@/infra/http/controllers/list-current-bags";
import { fetchBagParams } from "@/infra/http/controllers/fetch-bag";
import { fetchBagQuery } from "@/infra/http/controllers/fetch-bag";
import { updateBagSchema } from "@/infra/http/controllers/update-bag";
import { registerPaymentSchema } from "@/infra/http/controllers/register-payment";
import { openPaymentSchema } from "@/infra/http/controllers/open-payment";
import { updatePaymentParams } from "@/infra/http/controllers/update-payment";
import { updatePaymentSchema } from "@/infra/http/controllers/update-payment";
import { listProductsQuery } from "@/infra/http/controllers/list-products";
import { registerProductSchema } from "@/infra/http/controllers/register-product";
import { updateProductParams } from "@/infra/http/controllers/update-product";
import { updateProductSchema } from "@/infra/http/controllers/update-product";
import { listCategoriesQuery } from "@/infra/http/controllers/list-categories";
import { fetchPendingsQuery } from "@/infra/http/controllers/fetch-pendings";
import { fetchSalesStatsQuery } from "@/infra/http/controllers/fetch-sales-stats";
import { fetchSalesReportQuery } from "@/infra/http/controllers/fetch-sales-report";
import { fetchInboundReportQuery } from "@/infra/http/controllers/fetch-inbound-report";
import { sendNotificationSchema } from "@/infra/http/controllers/send-notification";
import { openPixSchema } from "@/infra/http/webhooks/open-pix";

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
  registerFarmImageSchema
);
const { swagger: deleteFarmImageParamsSwagger } = j2s(deleteFarmImageParams);
const { swagger: fetchFarmParamsSwagger } = j2s(fetchFarmParams);
const { swagger: updateFarmParamsSwagger } = j2s(updateFarmParams);
const { swagger: registerOrderSchemaSwagger } = j2s(registerOrderSchema);
const { swagger: listBoxesQuerySwagger } = j2s(listBoxesQuery);
const { swagger: fetchCurrentBoxQuerySwagger } = j2s(fetchCurrentBoxQuery);
const { swagger: fetchBoxQuerySwagger } = j2s(fetchBoxQuery);
const { swagger: fetchBoxParamsSwagger } = j2s(fetchBoxParams);
const { swagger: registerOfferSchemaSwagger } = j2s(registerOfferSchema);
const { swagger: listCatalogsQuerySwagger } = j2s(listCatalogsQuery);
const { swagger: fetchCurrentCatalogQuerySwagger } = j2s(
  fetchCurrentCatalogQuery
);
const { swagger: fetchLastCatalogQuerySwagger } = j2s(fetchLastCatalogQuery);
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
  fetchInboundReportQuery
);
const { swagger: sendNotificationSchemaSwagger } = j2s(sendNotificationSchema);
const { swagger: openPixSchemaSwagger } = j2s(openPixSchema);

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
        parameters: toRouteParams(fetchFarmParamsSwagger),
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
    "/catalogs/current": {
      get: {
        tags: ["Catálogos"],
        summary: "Obter catálogo atual",
        parameters: toQueryParams(fetchCurrentCatalogQuerySwagger),
        responses: {
          200: {
            description: "Catálogo atual obtido com sucesso",
          },
        },
      },
    },
    "/catalogs/last": {
      get: {
        tags: ["Catálogos"],
        summary: "Obter último catálogo",
        parameters: toQueryParams(fetchLastCatalogQuerySwagger),
        responses: {
          200: {
            description: "Último catálogo obtido com sucesso",
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
};
