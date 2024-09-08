// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { OffersRepository } from '@/core/repositories/offers-repository';

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListProducerOffersProps {
    cycle_id: string;
    admin_id: string;
}

export class ListOffersUseCase {
    constructor(
        private cyclesRepository: CyclesRepository,
        private catalogsRepository: CatalogsRepository,
        private offersRepository: OffersRepository
    ) { }

    async execute({ cycle_id, admin_id }: ListProducerOffersProps) {

        const cycle = await this.cyclesRepository.findById(cycle_id);

        if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

        const catalog = await this.catalogsRepository.search(
            {
                cycle: { id: cycle_id },
                farm: { id: admin_id },
            },
            "entity"
        );

        if (!catalog) throw new ResourceNotFoundError("Catálogo", cycle_id);

        const offers = await this.offersRepository.searchMany(
            {
                catalog: { id: catalog.id.value },
            },
            "aggregate"
        )


        if (!offers) throw new ResourceNotFoundError("Ofertas", cycle_id);

        return { offers };
    }
}
