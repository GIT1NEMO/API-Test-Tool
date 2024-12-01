export interface PingResponse {
  response: string;
}

export interface TourAvailabilityRequest {
  host_id: string;
  tour_code: string;
  basis_id: number;
  subbasis_id: number;
  tour_date: string;
  tour_time_id: number;
}

export interface TourAvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface TourExtra {
  group: number;
  name: string;
  extra_id: number;
  basis_id: number;
  time_id: number;
  code: string;
  offset: number;
  conditions: string;
  subbasis_id: number;
  allow_udef1: boolean;
  allow_foc: boolean;
  allow_adult: boolean;
  allow_infant: boolean;
  allow_child: boolean;
}

export interface TourExtrasResponse {
  extras: TourExtra[];
}

export interface PriceRange {
  child_tour_sell: number;
  infant_commission: number;
  non_per_pax_sell: number;
  non_per_pax_levy: number;
  tour_date: string;
  time_id: number;
  child_tour_levy: number;
  udef1_tour_levy: number;
  subbasis_id: number;
  adult_commission: number;
  udef1_assoc: boolean;
  adult_tour_levy: number;
  infant_tour_sell: number;
  tour_code: string;
  child_assoc: boolean;
  payment_option: string;
  foc_commission: number;
  child_commission: number;
  infant_assoc: boolean;
  infant_tour_levy: number;
  udef1_tour_sell: number;
  foc_tour_sell: number;
  foc_tour_levy: number;
  foc_assoc: boolean;
  basis_id: number;
  adult_assoc: boolean;
  currency_symbol: string;
  udef1_commission: number;
  currency_code: string;
  adult_tour_sell: number;
}

export interface PriceRangeRequest {
  host_id: string;
  tour_code: string;
  basis_id: number;
  subbasis_id: number;
  tour_date: string;
  tour_time_id: number;
}

export interface PriceRangeResponse {
  prices: PriceRange[];
}

export interface PaxType {
  id: number;
  long_description: string;
  web_association: number;
  description: string;
}

export interface PaxTypesResponse {
  pax_types: PaxType[];
}

export interface PaymentOption {
  is_default: boolean;
  code: string;
  description: string;
}

export interface PaymentOptionsResponse {
  payment_options: PaymentOption[];
}

export interface Transfer {
  pickup_id: number;
  pickup_time_id: number;
  route_code: string;
}

export interface Transfers {
  pickup?: Transfer;
  dropoff?: Transfer;
}

export interface Passenger {
  first_name: string;
  last_name: string;
  email?: string;
  mobile?: string;
  type: number;
  extras?: number[];
  country?: string;
  source?: number;
}

export interface Ticket {
  tour_code: string;
  basis_id: string;
  subbasis_id: string;
  tour_time_id: string;
  tour_date: string;
  promo_code?: string;
  passengers: Passenger[];
  transfers: Transfers;
}

export interface ReservationRequest {
  voucher_num?: string;
  payment_option: string;
  general_comment?: string;
  send_confirmation?: boolean;
  tickets: Ticket[];
  agent_reference?: string;
}

export interface ReservationResponse {
  ticket_ids: number[];
  root_id: number;
  error?: boolean;
  error_message?: string;
}