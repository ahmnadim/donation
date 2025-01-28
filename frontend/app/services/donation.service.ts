import { url } from "@/lib/constants";
import fetchClient from "@/lib/request";

export class Donation {
  static async GetDonations({ token, page = 1, per_page = 10 }: any) {
    let queryString = new URLSearchParams();
    if (page) {
      queryString.append("page", page);
    }
    if (per_page) {
      queryString.append("per_page", per_page);
    }

    let _queryString = queryString.toString();

    return await fetchClient.get(url.getDonations + "?" + _queryString, {
      token,
    });
  }

  static async MakeDonation({ data, token }: any) {
    return await fetchClient.post(url.makeDonation, data, { token });
  }

  static async UpdateDonation({ data, token }: any) {
    return await fetchClient.put(url.updateDonation + `/${data.id}`, data, {
      token,
    });
  }

  static async DeleteDonation({ id, token }) {
    return await fetchClient.delete(url.deleteDonation + `/${id}`, { token });
  }

  static async GetDonation({ id, token }: any) {
    return await fetchClient.get(url.getDonation + `/${id}`, { token });
  }
}
