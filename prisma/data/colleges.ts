// Central index that aggregates all college seed data
import { iitColleges } from "./iits";
import { nitColleges } from "./nits";
import { privateColleges, iiitColleges } from "./private-iiits";
import { medicalColleges, mbaColleges, lawColleges, designColleges } from "./other-streams";

export const colleges = [
  ...iitColleges,
  ...nitColleges,
  ...privateColleges,
  ...iiitColleges,
  ...medicalColleges,
  ...mbaColleges,
  ...lawColleges,
  ...designColleges,
];

console.log(`Total colleges in seed data: ${colleges.length}`);
