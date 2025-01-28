import { url } from "@/lib/constants";
import fetchClient from "@/lib/request";

export class Program {
  static async GetAllProgram({ token }: any) {
    return await fetchClient.get(url.getPrograms, { token });
  }
}
