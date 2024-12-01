import axios from 'axios';
import { 
  PingResponse,
  TourAvailabilityRequest, 
  TourAvailabilityResponse, 
  TourExtrasResponse,
  PriceRangeRequest,
  PriceRangeResponse,
  PaxTypesResponse,
  PaymentOptionsResponse,
  ReservationRequest,
  ReservationResponse
} from '../types/respax';

const BASE_URL = 'https://ron2-sandbox.respax.com';

const api = axios.create({
  baseURL: BASE_URL,
  auth: {
    username: 'sales_test',
    password: 'sales_test'
  }
});

export const pingServer = async (): Promise<PingResponse> => {
  try {
    const response = await api.post('/ping.json');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to ping server');
  }
};

export const checkTourAvailability = async (
  request: TourAvailabilityRequest
): Promise<TourAvailabilityResponse> => {
  try {
    const response = await api.post('/read-availability-range.json?config=live', [request]);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to check tour availability');
  }
};

export const getTourExtras = async (
  hostId: string,
  tourCode: string,
  basisId: number,
  subbasisId: number,
  timeId: number
): Promise<TourExtrasResponse> => {
  try {
    const response = await api.post(
      `/read-extras-${hostId}-${tourCode}-${basisId}-${subbasisId}-${timeId}.json?mode=live`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to fetch tour extras');
  }
};

export const getTourPriceRange = async (
  request: PriceRangeRequest
): Promise<PriceRangeResponse> => {
  try {
    const response = await api.post('/read-price-range.json?mode=live', [request]);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to get tour price range');
  }
};

export const getPaxTypes = async (hostId: string): Promise<PaxTypesResponse> => {
  try {
    const response = await api.post(`/read-pax-types-${hostId}.json?mode=live`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to get PAX types');
  }
};

export const getPaymentOptions = async (hostId: string): Promise<PaymentOptionsResponse> => {
  try {
    const response = await api.post(`/read-payment-options-${hostId}.json?mode=live`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to get payment options');
  }
};

export const writeReservation = async (
  hostId: string,
  request: ReservationRequest
): Promise<ReservationResponse> => {
  try {
    const response = await api.post(
      `/write-reservation-${hostId}.json?mode=live`,
      request
    );
    if (response.data.error) {
      throw new Error(response.data.error_message || 'Failed to write reservation');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to write reservation');
  }
};