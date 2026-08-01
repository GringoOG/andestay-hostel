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
    phone: string;
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
    email: "hello@andestayhostel.com",
    phone: "+51 000 000 000",
    address: "Colpapampa, Peru",
  },
};
