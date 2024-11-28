export interface ApiResponse {
  message: string;
  status?: string;
  timestamp?: string;
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface RequestStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}