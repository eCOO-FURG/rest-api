// Libs
import _ from "lodash";
import { renderFile } from "ejs";

// Entities
import { User } from "../../entities/user";

// Repositories
import { CyclesRepository } from "../../repositories/cycles-repository";

// Services
import { PDFService } from "@/core/pdf/pdf-service";

// Errors
import { ResourceNotFoundError } from "../../errors/resource-not-found";

interface PrintDeliveriesReportUseCaseRequest {
  cycle_id: string;
}

export interface DeliveryBag {
  id: number;
  user: User;
  content: string[];
  payment_method: string;
  price: number | string;
  address: { complete: string; neighborhood: string; cep: string };
}

const FAKE_BAGS = [
  {
    id: 1,
    user: { id: { value: "Maria Silva" } },
    content: ["1kg de tomates", "500g de cebolas", "2kg de batatas"],
    payment_method: "CC Visa",
    price: 30.0,
    address: {
      complete: "Rua das Flores, 123",
      neighborhood: "Centro",
      cep: "96200-100",
    },
  },
  {
    id: 2,
    user: { id: { value: "João Pereira" } },
    content: [
      "1kg de cenouras",
      "1kg de beterrabas",
      "500g de alho",
      "1kg de abobrinha",
      "1kg de batata-doce",
      "1kg de cebolas",
      "1kg de mandioca",
    ],
    payment_method: "Dinheiro",
    price: 45.0,
    address: {
      complete: "Av. Central, 456",
      neighborhood: "Centro",
      cep: "96200-100",
    },
  },
  {
    id: 3,
    user: { id: { value: "Ana Costa" } },
    content: ["500g de espinafre", "500g de rúcula", "1kg de mandioca"],
    payment_method: "Pix",
    price: "Não",
    address: {
      complete: "Travessa Rio Branco, 789",
      neighborhood: "Centro",
      cep: "96200-100",
    },
  },
  {
    id: 4,
    user: { id: { value: "Pedro Santos" } },
    content: [
      "1kg de limões",
      "1kg de maçãs",
      "2kg de laranjas",
      "1kg de uvas",
    ],
    payment_method: "CC Visa",
    price: 55.0,
    address: {
      complete: "Rua das Palmeiras, 321 - Ap 605, Bloco F",
      neighborhood: "Cidade Nova",
      cep: "96200-100",
    },
  },
  {
    id: 5,
    user: { id: { value: "Carlos Neto" } },
    content: ["3kg de batatas", "2kg de cenouras"],
    payment_method: "CC Visa",
    price: "Não",
    address: {
      complete: "Rua Nova, 92",
      neighborhood: "Cidade Nova",
      cep: "96200-100",
    },
  },
  {
    id: 6,
    user: { id: { value: "Lúcia Gomes" } },
    content: [
      "1kg de tomates",
      "1kg de pepinos",
      "500g de pimentões",
      "1kg de alface",
    ],
    payment_method: "CC Master",
    price: 50.0,
    address: {
      complete: "Rua do Sol, 88",
      neighborhood: "Cassino",
      cep: "96200-100",
    },
  },
  {
    id: 7,
    user: { id: { value: "Rafael Dias" } },
    content: ["2kg de abóboras", "1kg de berinjelas", "500g de cebolinha"],
    payment_method: "CC Visa",
    price: 40.0,
    address: {
      complete: "Av. Boa Vista, 55 - Ap 201",
      neighborhood: "Cassino",
      cep: "96200-100",
    },
  },
  {
    id: 8,
    user: { id: { value: "Marta Oliveira da Rocha dos Santos Veiga" } },
    content: ["1kg de bananas", "1kg de peras", "1kg de maçãs", "1kg de uvas"],
    payment_method: "Pix",
    price: "Não",
    address: {
      complete: "Rua do Mar, 33",
      neighborhood: "Cassino",
      cep: "96200-100",
    },
  },
  {
    id: 9,
    user: { id: { value: "Luiz Souza" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Cassino",
      cep: "96200-100",
    },
  },
  {
    id: 10,
    user: { id: { value: "Fernanda Alves" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Bolaxa",
      cep: "96200-100",
    },
  },
  {
    id: 11,
    user: { id: { value: "Fernanda Alves" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Bolaxa",
      cep: "96200-100",
    },
  },
  {
    id: 12,
    user: { id: { value: "Fernanda Alves" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Bolaxa",
      cep: "96200-100",
    },
  },
  {
    id: 13,
    user: { id: { value: "Fernanda Alves" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Bolaxa",
      cep: "96200-100",
    },
  },
  {
    id: 14,
    user: { id: { value: "Fernanda Alves" } },
    content: [
      "1kg de tomates",
      "1kg de cebolas",
      "1kg de batatas",
      "1kg de cenouras",
    ],
    payment_method: "Dinheiro",
    price: 35.0,
    address: {
      complete: "Rua do Campo, 22",
      neighborhood: "Bolaxa",
      cep: "96200-100",
    },
  },
];

const BASE64_LOGO =
  "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FtYWRhXzIiIGRhdGEtbmFtZT0iQ2FtYWRhIDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDgyLjMzIDI2LjQ3Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjMWQxZTFkOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iQ29udGXDumRvIj4KICAgIDxnPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNC40NCw0Ljg5QzEyLjIyLDIuMTksMTAuMDQuNDMsOS45NC4zNmwtLjQ1LS4zNi0uNDUuMzZjLS4wOS4wNy0yLjI4LDEuODQtNC41LDQuNTMtMS4zMSwxLjU5LTIuMzYsMy4xOC0zLjExLDQuNzMtLjk2LDEuOTYtMS40NSwzLjg2LTEuNDUsNS42MywwLDIuNTIsMSw0LjgyLDIuOCw2LjQ4LDEuNTksMS40NiwzLjY5LDIuMzMsNS45OCwyLjQ4djIuMjdoMS40M3YtMi4yN2MyLjI5LS4xNSw0LjM5LTEuMDIsNS45OC0yLjQ4LDEuODEtMS42NiwyLjgtMy45NiwyLjgtNi40OCwwLTEuNzctLjQ5LTMuNjctMS40NS01LjYzLS43NS0xLjU0LTEuOC0zLjEzLTMuMTEtNC43M1pNOS41LDkuOTljLS4zLDAtLjU0LS4yNC0uNTQtLjU0cy4yNC0uNTQuNTQtLjU0LjU0LjI0LjU0LjU0LS4yNC41NC0uNTQuNTRaTTEwLjIxLDIyLjc3di0zLjRsMi43OC0yLjc4Yy4yNC4xMS41MS4xNy43OS4xNywxLjA4LDAsMS45Ni0uODgsMS45Ni0xLjk2cy0uODgtMS45Ni0xLjk2LTEuOTYtMS45Ni44OC0xLjk2LDEuOTZjMCwuMjguMDYuNTUuMTcuNzlsLTEuNzcsMS43N3YtNi4wN2MuNzMtLjI5LDEuMjUtMSwxLjI1LTEuODMsMC0xLjA4LS44OC0xLjk2LTEuOTYtMS45NnMtMS45Ni44OC0xLjk2LDEuOTZjMCwuODMuNTIsMS41NCwxLjI1LDEuODN2Ni4wN2wtMS43Ny0xLjc3Yy4xMS0uMjQuMTctLjUxLjE3LS43OSwwLTEuMDgtLjg4LTEuOTYtMS45Ni0xLjk2cy0xLjk2Ljg4LTEuOTYsMS45Ni44OCwxLjk2LDEuOTYsMS45NmMuMjgsMCwuNTUtLjA2Ljc5LS4xN2wyLjc4LDIuNzh2My40Yy00LjI0LS4zMi03LjM2LTMuNDQtNy4zNi03LjUyLDAtMy41NSwyLjI5LTcuMDksNC4yMS05LjQzLDEuNTUtMS44OSwzLjExLTMuMzIsMy44Ni0zLjk3Ljc0LjY1LDIuMzEsMi4wOCwzLjg2LDMuOTcsMS45MiwyLjM0LDQuMjEsNS44OCw0LjIxLDkuNDMsMCw0LjA4LTMuMTIsNy4yMS03LjM2LDcuNTJaTTEzLjI0LDE0LjhjMC0uMy4yNC0uNTQuNTQtLjU0cy41NC4yNC41NC41NC0uMjQuNTQtLjU0LjU0LS41NC0uMjQtLjU0LS41NFpNNS43NSwxNC44YzAsLjMtLjI0LjU0LS41NC41NHMtLjU0LS4yNC0uNTQtLjU0LjI0LS41NC41NC0uNTQuNTQuMjQuNTQuNTRaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI5LjE5LDEwLjk0Yy0xLjMzLDAtMi40My40NS0zLjMxLDEuMzUtLjg4LjktMS4zMiwyLjA0LTEuMzIsMy40cy40NCwyLjQ0LDEuMzIsMy4zMywyLjAzLDEuMzMsMy40MywxLjMzYy45LDAsMS42OS0uMTYsMi4zNC0uNDguNjYtLjMyLDEuMjItLjgyLDEuNjktMS40OGwtMS44OS0uODljLS42LjU5LTEuMzIuODgtMi4xNi44OC0uNywwLTEuMjgtLjE5LTEuNzMtLjU2LS40NS0uMzgtLjczLS44OC0uODMtMS41Mmg3LjIxdi0uNDNjMC0xLjQ4LS40My0yLjY3LTEuMzItMy41Ny0uODgtLjktMi4wMy0xLjM1LTMuNDQtMS4zNVpNMjYuODMsMTQuNTJjLjI1LS41NS41My0uOTQuODItMS4xNi40Ny0uMzUsMS4wMi0uNTMsMS42NS0uNTMuNTgsMCwxLjA4LjE2LDEuNTIuNDdzLjczLjcyLjg4LDEuMjJoLTQuODdaIi8+CiAgICAgIDxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMzYuMDgiIHk9IjE0LjYxIiB3aWR0aD0iNC4xOCIgaGVpZ2h0PSIyLjA5Ii8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ4Ljg5LDkuOTRjMS4zNywwLDIuNi41OCwzLjcsMS43NGwxLjYxLTEuNTRjLS42Ny0uNzgtMS40Ni0xLjM4LTIuMzktMS44LS45Mi0uNDItMS44OC0uNjMtMi44OC0uNjMtMS4xNywwLTIuMjcuMjktMy4yOS44Ni0xLjAyLjU3LTEuOCwxLjMyLTIuMzQsMi4yNi0uNTUuOTQtLjgyLDIuMDEtLjgyLDMuMjIsMCwxLjg2LjYsMy4zOSwxLjgsNC41OCwxLjIsMS4xOSwyLjc0LDEuNzksNC42MiwxLjc5LDEuMDIsMCwxLjkzLS4xNywyLjcyLS41MS43OS0uMzQsMS42NC0uOTQsMi41My0xLjgxbC0xLjU2LTEuNjNjLS42Ni42Ni0xLjI3LDEuMTEtMS44MiwxLjM2LS41NS4yNS0xLjE2LjM3LTEuODMuMzctLjc4LDAtMS41LS4xOC0yLjE0LS41M3MtMS4xNC0uODUtMS40OS0xLjQ3Yy0uMzUtLjYzLS41My0xLjM0LS41My0yLjE1LDAtMS4xNi40LTIuMTMsMS4xOS0yLjkyLjc5LS43OSwxLjc3LTEuMTksMi45Mi0xLjE5WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02MS45Myw3LjcxYy0xLjEzLDAtMi4xOC4yOC0zLjE2Ljg1cy0xLjc1LDEuMzQtMi4zMSwyLjMxYy0uNTYuOTctLjg0LDIuMDMtLjg0LDMuMTksMCwxLjczLjYsMy4yMiwxLjgsNC40NywxLjIsMS4yNiwyLjcxLDEuODgsNC41MywxLjg4czMuMjEtLjYxLDQuNDItMS44M2MxLjIyLTEuMjIsMS44Mi0yLjcyLDEuODItNC40OHMtLjYyLTMuMjktMS44NS00LjUzYy0xLjIzLTEuMjQtMi43LTEuODYtNC40MS0xLjg2Wk02NC43MywxNy4wMWMtLjc3Ljc5LTEuNywxLjE4LTIuNzksMS4xOC0uOTcsMC0xLjgyLS4zLTIuNTctLjkxLS45Ni0uNzgtMS40NC0xLjg0LTEuNDQtMy4xNywwLTEuMi4zOC0yLjE5LDEuMTQtMi45Ny43Ni0uNzgsMS43LTEuMTcsMi44Mi0xLjE3czIuMDUuNCwyLjgyLDEuMiwxLjE2LDEuNzcsMS4xNiwyLjkyLS4zOCwyLjEzLTEuMTUsMi45MloiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODAuNDgsOS41N2MtMS4yMy0xLjI0LTIuNy0xLjg2LTQuNDEtMS44Ni0xLjEzLDAtMi4xOC4yOC0zLjE2Ljg1cy0xLjc1LDEuMzQtMi4zMSwyLjMxYy0uNTYuOTctLjg0LDIuMDMtLjg0LDMuMTksMCwxLjczLjYsMy4yMiwxLjgsNC40NywxLjIsMS4yNiwyLjcxLDEuODgsNC41MywxLjg4czMuMjEtLjYxLDQuNDItMS44M2MxLjIyLTEuMjIsMS44Mi0yLjcyLDEuODItNC40OHMtLjYyLTMuMjktMS44NS00LjUzWk03OC44OCwxNy4wMWMtLjc3Ljc5LTEuNywxLjE4LTIuNzksMS4xOC0uOTcsMC0xLjgyLS4zLTIuNTctLjkxLS45Ni0uNzgtMS40NC0xLjg0LTEuNDQtMy4xNywwLTEuMi4zOC0yLjE5LDEuMTQtMi45Ny43Ni0uNzgsMS43LTEuMTcsMi44Mi0xLjE3czIuMDUuNCwyLjgyLDEuMiwxLjE2LDEuNzcsMS4xNiwyLjkyLS4zOCwyLjEzLTEuMTUsMi45MloiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==";

export class PrintDeliveriesReportUseCase {
  constructor(
    private cyclesRepository: CyclesRepository, // private bagsRepository: bagsRepository,
    private pdfService: PDFService
  ) {}

  async execute({
    cycle_id,
  }: PrintDeliveriesReportUseCaseRequest): Promise<Buffer> {
    const cycle = await this.cyclesRepository.findById(cycle_id);
    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    // const bags = await this.bagsRepository.getByCycleIdWithClients(cycle_id);
    const bags = FAKE_BAGS;

    const neighborhoodBags = _.groupBy(
      bags,
      (item) => item.address.neighborhood
    );

    const html = await renderFile(__dirname + `/report.ejs`, {
      props: { neighborhoodBags: neighborhoodBags, base64Logo: BASE64_LOGO },
    });

    await this.pdfService.init();
    return this.pdfService.generateFromHTML(html);
  }
}
