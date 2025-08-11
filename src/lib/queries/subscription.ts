import { useMutation, useQuery } from "@tanstack/react-query";

import axiosInstance from "../axios";
import { toast } from "sonner";

interface CreateOrderInput {
  plan: "Premium" | "Enterprise";
  currency: string;
}

interface OrderResponse {
  message: string;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
}

export function useCreateOrder() {
  return useMutation<OrderResponse, any, CreateOrderInput>({
    mutationFn: async (payload: CreateOrderInput) => {
      const response = await axiosInstance.post("/user/order", payload);
      return response.data;
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      toast.error(error?.response?.data?.message || "Failed to create order");
    },
  });
}

interface ActivatePlanInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: "Premium" | "Enterprise";
  currency: string;
}

interface ActivatePlanResponse {
  message: string;
}

export function useActivatePlan() {
  return useMutation<ActivatePlanResponse, any, ActivatePlanInput>({
    mutationFn: async (payload: ActivatePlanInput) => {
      const response = await axiosInstance.post("/user/activatePlan", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Subscription activated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to activate subscription");
    },
  });
}

export const useBillingUsage = () => {
  return useQuery({
    queryKey: ["currentPlan&Usage"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/billing/usage");
      return data;
    },
  });
};

export const useBillingHistory = () => {
  return useQuery({
    queryKey: ["billingHistory"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/billing/history");
      return data.history;
    },
  });
};
