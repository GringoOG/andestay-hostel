/**
 * Hotel settings — property configuration (not booking orchestration).
 */

export type HotelSettings = {
  hotelId: string;
  name: string;
  timezone: string;
  localeDefault: string;
  currency: "PEN";
  /** Tax / VAT handling — placeholder until invoicing. */
  taxIncludedInRate: boolean;
  contact: {
    email: string;
    phones: string[];
    address: string;
  };
};

export const hotelSettings: HotelSettings = {
  hotelId: "andestay-colpapampa",
  name: "AndeStay Hostel",
  timezone: "America/Lima",
  localeDefault: "es",
  currency: "PEN",
  taxIncludedInRate: true,
  contact: {
    email: "andestayhostel@gmail.com",
    phones: ["+51 906 067 917", "+51 958 163 200"],
    address: "CU-109 Cabañas, Colpapampa, Peru",
  },
};
