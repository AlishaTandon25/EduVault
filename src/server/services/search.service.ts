import { CollegesRepository } from "../db/colleges.repository";

export const SearchService = {
  async getSuggestions(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    return CollegesRepository.getSearchSuggestions(query.trim());
  },

  async getPopularSearches() {
    // Return statically predefined popular items for speed and visual excellence
    return [
      { name: "IIT Madras", slug: "iit-madras", stream: "ENGINEERING" },
      { name: "BITS Pilani", slug: "bits-pilani", stream: "ENGINEERING" },
      { name: "AIIMS Delhi", slug: "aiims-delhi", stream: "MEDICAL" },
      { name: "IIM Ahmedabad", slug: "iim-ahmedabad", stream: "MBA" },
      { name: "NLSIU Bangalore", slug: "nlsiu-bangalore", stream: "LAW" },
    ];
  },
};
