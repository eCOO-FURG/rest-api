import cloudinary from "@/infra/image/cloudinary-service";

export async function uploadImage(
  image: Buffer,
  folder: string = "farms"
): Promise<string> {
  try {
    const result = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(
                new Error("Erro ao fazer upload da imagem para o Cloudinary")
              );
            } else {
              resolve(result?.secure_url || "");
            }
          }
        )
        .end(image);
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao fazer upload da imagem para o Cloudinary");
  }
}
