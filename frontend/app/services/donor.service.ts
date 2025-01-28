import { url } from "@/lib/constants";
import fetchClient from "@/lib/request";

export class Donor {
  static async GetAllDonors({ token, page = 1, per_page = 10 }: any) {
    let queryString = new URLSearchParams();
    if (page) {
      queryString.append("page", page);
    }
    if (per_page) {
      queryString.append("per_page", per_page);
    }

    let _queryString = queryString.toString();

    return await fetchClient.get(url.getDonors + "?" + _queryString, {
      token,
    });
  }

  static async GetDashboardStats({ token }: any) {
    return await fetchClient.get(url.getDashboardStats, { token });
  }
}
