// import * as nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.zeptomail.com",
//   port: 587,
//   auth: {
//     user: "emailapikey",
//     pass: "wSsVR61w80GjBv96lGKsJOxqmQgBB1yjF0p/2Vum7yD/Hf3D/Mc4lBWaDAGiTvYbRTI/EmMQoLogzBYGhjQJitoqy18GCSiF9mqRe1U4J3x17qnvhDzMWmhfkxSBKo0Jwwpjn2dnFs0h+g==",
//   },
// });

// const users: string[] = [];

// for (let i = 0; i < 50; i++) {
//   users.push("timoteostifft@gmail.com");
// }

// const promises = users.map(async (email) => {
//   try {
//     await transporter.sendMail({
//       from: "suporte@ecoo.org.br",
//       to: email,
//       subject: "Testando envio em lote...",
//       html: "<h1> Olá </h1>",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// const run = async () => {
//   await Promise.all(promises);
// };

// run().then(() => console.log("done."));
