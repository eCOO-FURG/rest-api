// Types
import { File } from "@/core/types/file";

// Libraries
import { faker } from "@faker-js/faker";

export function makeFile(props: Partial<File> = {}): File {
  return {
    name: props.name ?? faker.system.fileName(),
    mimetype: props.mimetype ?? faker.system.mimeType(),
    size: props.size ?? faker.number.int({ min: 100, max: 1000 }),
    content: props.content ?? Buffer.from(faker.image.url()),
  };
}
